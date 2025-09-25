import os
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import db, bcrypt, User, Property, Unit, Tenant, Lease, Payment, Expense
from datetime import datetime, date, timedelta
from collections import defaultdict

# --- App Configuration ---
app = Flask(__name__)
db_url = os.environ.get('DATABASE_URL')
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
else:
    db_url = 'sqlite:///app.db'

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.environ.get('SECRET_KEY', 'a_super_secret_key_for_dev')
app.json.compact = False

# --- Initializations ---
migrate = Migrate(app, db)
db.init_app(app)
bcrypt.init_app(app)
api = Api(app, prefix='/api')
CORS(app, supports_credentials=True, origins=[os.environ.get('CLIENT_URL', 'http://localhost:5173')])

# --- Hook to check for user session ---
@app.before_request
def check_user_logged_in():
    open_paths = ['/api/register', '/api/login', '/api/check_session']
    if request.method == 'OPTIONS' or request.path in open_paths:
        return
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

# --- Authentication Resources ---
class Register(Resource):
    def post(self):
        data = request.get_json()
        username, password = data.get('username'), data.get('password')
        if not username or not password: return jsonify({"error": "Username and password are required"}), 400
        if User.query.filter_by(username=username).first(): return jsonify({"error": "Username already exists"}), 409
        new_user = User(username=username, currency='Ksh')
        new_user.password_hash = password
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return new_user.to_dict(), 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.authenticate(data.get('password')):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {'error': 'Invalid username or password'}, 401

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = db.session.get(User, user_id)
            if user: return user.to_dict(), 200
        return {}, 204

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {'message': 'Logged out successfully'}, 200

class Profile(Resource):
    def patch(self):
        user_id = session.get('user_id')
        if not user_id: return jsonify({'error': 'Unauthorized'}), 401
        user, data = db.session.get(User, user_id), request.get_json()
        if 'username' in data: user.username = data['username']
        if 'currency' in data: user.currency = data['currency']
        if 'new_password' in data and data.get('new_password') and 'current_password' in data:
            if user.authenticate(data['current_password']):
                user.password_hash = data['new_password']
            else: return {'error': 'Invalid current password'}, 401
        db.session.commit()
        return user.to_dict(), 200

# --- Report Resources ---
class DashboardSummary(Resource):
    def get(self):
        leases = Lease.query.all()
        today = date.today()
        expiring_limit = today + timedelta(days=60)
        summary = {
            "total_properties": Property.query.count(),
            "occupied_units": Unit.query.filter_by(status='occupied').count(),
            "vacant_units": Unit.query.filter_by(status='vacant').count(),
            "total_monthly_rent": sum(l.rent_amount for l in leases),
            "total_collected": sum(l.total_paid for l in leases),
            "total_pending": sum(l.balance for l in leases if l.balance > 0),
            "expiring_leases_count": Lease.query.filter(Lease.end_date <= expiring_limit, Lease.end_date >= today).count(),
            "overdue_leases": [{"lease_id": l.id, "tenant_name": l.tenant.name, "unit_number": l.unit.unit_number, "balance": l.balance} for l in leases if l.balance > 0]
        }
        return jsonify(summary)

class PropertyFinancials(Resource):
    def get(self):
        property_id = request.args.get('property_id')
        year = int(request.args.get('year'))
        payments_query = Payment.query.filter(db.extract('year', Payment.date) == year)
        expenses_query = Expense.query.filter(db.extract('year', Expense.date) == year)

        if property_id and property_id != 'all':
            property_id = int(property_id)
            payments_query = payments_query.join(Lease).join(Unit).filter(Unit.property_id == property_id)
            expenses_query = expenses_query.filter(Expense.property_id == property_id)

        monthly_data = defaultdict(lambda: {'income': 0, 'expense': 0})
        for p in payments_query.all(): monthly_data[p.date.month]['income'] += p.amount
        for e in expenses_query.all(): monthly_data[e.date.month]['expense'] += e.amount

        chart_data = []
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        for i in range(1, 13):
            income = monthly_data[i]['income']
            expense = monthly_data[i]['expense']
            chart_data.append({"name": month_names[i-1], "Income": income, "Expense": expense, "Net Profit": income - expense})
        
        expenses = expenses_query.all()
        category_data = defaultdict(float)
        for e in expenses: category_data[e.category] += e.amount
        expense_breakdown = [{"name": cat, "value": val} for cat, val in category_data.items()]
        total_income = sum(p.amount for p in payments_query.all())
        total_expense = sum(e.amount for e in expenses)
        occupancy_rate = 0
        
        if property_id and property_id != 'all':
            prop = db.session.get(Property, property_id)
            total_units = len(prop.units) if prop and prop.units else 0
            if total_units > 0:
                occupied_units = Unit.query.filter_by(property_id=property_id, status='occupied').count()
                occupancy_rate = (occupied_units / total_units) * 100 if total_units > 0 else 0
        else:
            total_units = Unit.query.count()
            if total_units > 0:
                occupied_units = Unit.query.filter_by(status='occupied').count()
                occupancy_rate = (occupied_units / total_units) * 100 if total_units > 0 else 0

        return jsonify({
            "total_income": total_income, "total_expense": total_expense, "net_profit": total_income - total_expense,
            "occupancy_rate": round(occupancy_rate, 2), "monthly_breakdown": chart_data, "expense_breakdown": expense_breakdown
        })

# --- Generic CRUD Resources ---
class ResourceList(Resource):
    model = None
    def get(self):
        return [item.to_dict() for item in self.model.query.all()], 200
    def post(self):
        data = request.get_json()
        try:
            for key in ['start_date', 'end_date', 'date']:
                if key in data and data.get(key): data[key] = datetime.strptime(data[key], '%Y-%m-%d').date()
            new_item = self.model(**data)
            db.session.add(new_item)
            db.session.commit()
            return new_item.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

class ResourceById(Resource):
    model = None
    def get(self, id):
        item = db.session.get(self.model, id)
        if not item: return {"error": f"{self.model.__name__} not found"}, 404
        return item.to_dict(), 200
    def patch(self, id):
        item = db.session.get(self.model, id)
        if not item: return {"error": f"{self.model.__name__} not found"}, 404
        data = request.get_json()
        try:
            for attr, value in data.items():
                if attr in ['start_date', 'end_date', 'date'] and value: value = datetime.strptime(value, '%Y-%m-%d').date()
                setattr(item, attr, value)
            db.session.commit()
            return item.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    def delete(self, id):
        item = db.session.get(self.model, id)
        if not item: return {"error": f"{self.model.__name__} not found"}, 404
        db.session.delete(item)
        db.session.commit()
        return {}, 204

# --- API Resource Mapping ---
class Properties(ResourceList): model = Property
class PropertyById(ResourceById): model = Property
class Units(ResourceList): model = Unit
class UnitById(ResourceById): model = Unit
class Tenants(ResourceList): model = Tenant
class TenantById(ResourceById): model = Tenant
class Leases(ResourceList): model = Lease
class LeaseById(ResourceById): model = Lease
class Payments(ResourceList): model = Payment
class PaymentById(ResourceById): model = Payment
class Expenses(ResourceList): model = Expense
class ExpenseById(ResourceById): model = Expense

api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')
api.add_resource(Profile, '/profile')
api.add_resource(DashboardSummary, '/dashboard_summary')
api.add_resource(PropertyFinancials, '/reports/property_financials')
api.add_resource(Properties, "/properties")
api.add_resource(PropertyById, "/properties/<int:id>")
api.add_resource(Units, "/units")
api.add_resource(UnitById, "/units/<int:id>")
api.add_resource(Tenants, "/tenants") # THIS IS THE CORRECTED LINE
api.add_resource(TenantById, "/tenants/<int:id>")
api.add_resource(Leases, "/leases")
api.add_resource(LeaseById, "/leases/<int:id>")
api.add_resource(Payments, "/payments")
api.add_resource(PaymentById, "/payments/<int:id>")
api.add_resource(Expenses, "/expenses")
api.add_resource(ExpenseById, "/expenses/<int:id>")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
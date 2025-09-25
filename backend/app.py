import os
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import db, bcrypt, User, Property, Unit, Tenant, Lease, Payment, Expense
from datetime import datetime, date, timedelta
from collections import defaultdict

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)
bcrypt.init_app(app)
api = Api(app)
CORS(app, supports_credentials=True)

# --- Auth Routes ---


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409
    new_user = User(username=username)
    new_user.password_hash = password
    db.session.add(new_user)
    db.session.commit()
    session['user_id'] = new_user.id
    return jsonify(new_user.to_dict()), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.authenticate(data.get('password')):
        session['user_id'] = user.id
        return jsonify(user.to_dict()), 200
    return jsonify({'error': 'Invalid username or password'}), 401


@app.route("/check_session", methods=["GET"])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = db.session.get(User, user_id)
        if user:
            return jsonify(user.to_dict()), 200
    return {}, 204


@app.route("/logout", methods=["DELETE"])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200


@app.route("/profile", methods=["PATCH"])
def update_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    user, data = db.session.get(User, user_id), request.get_json()
    if 'username' in data:
        user.username = data['username']
    if 'currency' in data:
        user.currency = data['currency']
    if 'new_password' in data and 'current_password' in data:
        if user.authenticate(data['current_password']):
            user.password_hash = data['new_password']
        else:
            return jsonify({'error': 'Invalid current password'}), 401
    db.session.commit()
    return jsonify(user.to_dict()), 200


@app.before_request
def check_user_logged_in():
    open_endpoints = ['register', 'login', 'check_session']
    if request.method == 'OPTIONS' or request.endpoint in open_endpoints:
        return
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

# --- Reports API Endpoints ---


@app.route("/dashboard_summary")
def get_dashboard_summary():
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


@app.route("/reports/property_financials")
def get_property_financials():
    property_id = request.args.get('property_id')
    year = int(request.args.get('year'))
    payments_query = Payment.query.filter(
        db.extract('year', Payment.date) == year)
    expenses_query = Expense.query.filter(
        db.extract('year', Expense.date) == year)

    if property_id and property_id != 'all':
        property_id = int(property_id)
        payments_query = payments_query.join(Lease).join(
            Unit).filter(Unit.property_id == property_id)
        expenses_query = expenses_query.filter(
            Expense.property_id == property_id)

    monthly_data = defaultdict(lambda: {'income': 0, 'expense': 0})
    for p in payments_query.all():
        monthly_data[p.date.month]['income'] += p.amount
    for e in expenses_query.all():
        monthly_data[e.date.month]['expense'] += e.amount

    chart_data = []
    month_names = ["Jan", "Feb", "Mar", "Apr", "May",
                   "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for i in range(1, 13):
        income = monthly_data[i]['income']
        expense = monthly_data[i]['expense']
        chart_data.append(
            {"name": month_names[i-1], "Income": income, "Expense": expense, "Net Profit": income - expense})

    expenses = expenses_query.all()
    category_data = defaultdict(float)
    for e in expenses:
        category_data[e.category] += e.amount
    expense_breakdown = [{"name": cat, "value": val}
                         for cat, val in category_data.items()]

    total_income = sum(p.amount for p in payments_query.all())
    total_expense = sum(e.amount for e in expenses)
    occupancy_rate = 0

    if property_id and property_id != 'all':
        prop = db.session.get(Property, property_id)
        total_units = len(prop.units) if prop and prop.units else 0
        if total_units > 0:
            occupied_units = Unit.query.filter_by(
                property_id=property_id, status='occupied').count()
            occupancy_rate = (occupied_units / total_units) * \
                100 if total_units > 0 else 0
    else:
        total_units = Unit.query.count()
        if total_units > 0:
            occupied_units = Unit.query.filter_by(status='occupied').count()
            occupancy_rate = (occupied_units / total_units) * \
                100 if total_units > 0 else 0

    return jsonify({
        "total_income": total_income, "total_expense": total_expense, "net_profit": total_income - total_expense,
        "occupancy_rate": round(occupancy_rate, 2), "monthly_breakdown": chart_data, "expense_breakdown": expense_breakdown
    })

# --- Generic Resources ---


class ResourceList(Resource):
    model = None

    def get(self): return [item.to_dict()
                           for item in self.model.query.all()], 200

    def post(self):
        data = request.get_json()
        try:
            for key in ['start_date', 'end_date', 'date']:
                if key in data and data.get(key):
                    data[key] = datetime.strptime(data[key], '%Y-%m-%d').date()
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
        if not item:
            return {"error": f"{self.model.__name__} not found"}, 404
        return item.to_dict(), 200

    def patch(self, id):
        item = db.session.get(self.model, id)
        if not item:
            return {"error": f"{self.model.__name__} not found"}, 404
        data = request.get_json()
        try:
            for attr, value in data.items():
                if attr in ['start_date', 'end_date', 'date'] and value:
                    value = datetime.strptime(value, '%Y-%m-%d').date()
                setattr(item, attr, value)
            db.session.commit()
            return item.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    def delete(self, id):
        item = db.session.get(self.model, id)
        if not item:
            return {"error": f"{self.model.__name__} not found"}, 404
        db.session.delete(item)
        db.session.commit()
        return {}, 204


class Properties(ResourceList):
    model = Property


class PropertyById(ResourceById):
    model = Property


class Units(ResourceList):
    model = Unit


class UnitById(ResourceById):
    model = Unit


class Tenants(ResourceList):
    model = Tenant


class TenantById(ResourceById):
    model = Tenant


class Leases(ResourceList):
    model = Lease


class LeaseById(ResourceById):
    model = Lease


class Payments(ResourceList):
    model = Payment


class PaymentById(ResourceById):
    model = Payment


class Expenses(ResourceList):
    model = Expense


class ExpenseById(ResourceById):
    model = Expense


api.add_resource(Properties, "/properties")
api.add_resource(PropertyById, "/properties/<int:id>")
api.add_resource(Units, "/units")
api.add_resource(UnitById, "/units/<int:id>")
api.add_resource(Tenants, "/tenants")
api.add_resource(TenantById, "/tenants/<int:id>")
api.add_resource(Leases, "/leases")
api.add_resource(LeaseById, "/leases/<int:id>")
api.add_resource(Payments, "/payments")
api.add_resource(PaymentById, "/payments/<int:id>")
api.add_resource(Expenses, "/expenses")
api.add_resource(ExpenseById, "/expenses/<int:id>")

if __name__ == "__main__":
    app.run(port=5555, debug=True)

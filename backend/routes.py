from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Property, Tenant, Lease, Payment
from schemas import (
    UserSchema, PropertySchema, TenantSchema,
    LeaseSchema, PaymentSchema
)
from auth import authenticate_user, create_user_token, admin_required
from datetime import datetime, date
from sqlalchemy import func, extract

api = Blueprint('api', __name__)

# Schemas
user_schema = UserSchema()
property_schema = PropertySchema()
tenant_schema = TenantSchema()
lease_schema = LeaseSchema()
payment_schema = PaymentSchema()

# Authentication Routes


@api.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = authenticate_user(username, password)
        if user:
            token = create_user_token(user)
            return jsonify({
                'token': token,
                'user': user_schema.dump(user),
                'message': 'Login successful'
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@api.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Check if user exists
        if User.query.filter_by(username=data.get('username')).first():
            return jsonify({'message': 'Username already exists'}), 400
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'message': 'Email already exists'}), 400

        # Create new user
        user = User(
            username=data.get('username'),
            email=data.get('email'),
            role=data.get('role', 'admin')
        )
        user.set_password(data.get('password'))

        db.session.add(user)
        db.session.commit()

        token = create_user_token(user)
        return jsonify({
            'token': token,
            'user': user_schema.dump(user),
            'message': 'Registration successful'
        }), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Dashboard Routes


@api.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def dashboard_stats():
    try:
        # Calculate key metrics
        total_properties = Property.query.count()
        total_tenants = Tenant.query.filter_by(status='active').count()
        active_leases = Lease.query.filter_by(status='active').count()

        # Monthly revenue
        current_month = datetime.now().month
        current_year = datetime.now().year
        monthly_revenue = db.session.query(func.sum(Payment.amount)).filter(
            extract('month', Payment.payment_date) == current_month,
            extract('year', Payment.payment_date) == current_year,
            Payment.status == 'completed'
        ).scalar() or 0

        # Occupancy rate
        occupied_properties = Property.query.filter_by(
            status='occupied').count()
        occupancy_rate = (occupied_properties /
                          total_properties * 100) if total_properties > 0 else 0

        # Recent payments
        recent_payments = Payment.query.order_by(
            Payment.created_at.desc()).limit(5).all()

        return jsonify({
            'total_properties': total_properties,
            'total_tenants': total_tenants,
            'active_leases': active_leases,
            'monthly_revenue': float(monthly_revenue),
            'occupancy_rate': round(occupancy_rate, 1),
            'recent_payments': [payment_schema.dump(p) for p in recent_payments]
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Property Routes


@api.route('/properties', methods=['GET'])
@jwt_required()
def get_properties():
    try:
        properties = Property.query.all()
        return jsonify([property_schema.dump(p) for p in properties]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@api.route('/properties', methods=['POST'])
@jwt_required()
def create_property():
    try:
        data = request.get_json()
        property_obj = Property(**data)
        db.session.add(property_obj)
        db.session.commit()
        return jsonify(property_schema.dump(property_obj)), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@api.route('/properties/<int:property_id>', methods=['PUT'])
@jwt_required()
def update_property(property_id):
    try:
        property_obj = Property.query.get_or_404(property_id)
        data = request.get_json()

        for key, value in data.items():
            setattr(property_obj, key, value)

        db.session.commit()
        return jsonify(property_schema.dump(property_obj)), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@api.route('/properties/<int:property_id>', methods=['DELETE'])
@jwt_required()
def delete_property(property_id):
    try:
        property_obj = Property.query.get_or_404(property_id)
        db.session.delete(property_obj)
        db.session.commit()
        return jsonify({'message': 'Property deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Tenant Routes


@api.route('/tenants', methods=['GET'])
@jwt_required()
def get_tenants():
    try:
        tenants = Tenant.query.all()
        return jsonify([tenant_schema.dump(t) for t in tenants]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@api.route('/tenants', methods=['POST'])
@jwt_required()
def create_tenant():
    try:
        data = request.get_json()
        tenant = Tenant(**data)
        db.session.add(tenant)
        db.session.commit()
        return jsonify(tenant_schema.dump(tenant)), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@api.route('/tenants/<int:tenant_id>', methods=['PUT'])
@jwt_required()
def update_tenant(tenant_id):
    try:
        tenant = Tenant.query.get_or_404(tenant_id)
        data = request.get_json()

        for key, value in data.items():
            setattr(tenant, key, value)

        db.session.commit()
        return jsonify(tenant_schema.dump(tenant)), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Lease Routes


@api.route('/leases', methods=['GET'])
@jwt_required()
def get_leases():
    try:
        leases = Lease.query.all()
        return jsonify([lease_schema.dump(l) for l in leases]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@api.route('/leases', methods=['POST'])
@jwt_required()
def create_lease():
    try:
        data = request.get_json()
        # Convert date strings to date objects
        if 'start_date' in data:
            data['start_date'] = datetime.strptime(
                data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data:
            data['end_date'] = datetime.strptime(
                data['end_date'], '%Y-%m-%d').date()

        lease = Lease(**data)
        db.session.add(lease)
        db.session.commit()
        return jsonify(lease_schema.dump(lease)), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Payment Routes


@api.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    try:
        payments = Payment.query.order_by(Payment.payment_date.desc()).all()
        return jsonify([payment_schema.dump(p) for p in payments]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@api.route('/payments', methods=['POST'])
@jwt_required()
def create_payment():
    try:
        data = request.get_json()
        # Convert date string to date object
        if 'payment_date' in data:
            data['payment_date'] = datetime.strptime(
                data['payment_date'], '%Y-%m-%d').date()

        payment = Payment(**data)
        db.session.add(payment)
        db.session.commit()
        return jsonify(payment_schema.dump(payment)), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Reports Routes


@api.route('/reports/revenue', methods=['GET'])
@jwt_required()
def revenue_report():
    try:
        year = request.args.get('year', datetime.now().year, type=int)

        monthly_revenue = []
        for month in range(1, 13):
            revenue = db.session.query(func.sum(Payment.amount)).filter(
                extract('month', Payment.payment_date) == month,
                extract('year', Payment.payment_date) == year,
                Payment.status == 'completed'
            ).scalar() or 0
            monthly_revenue.append({
                'month': month,
                'revenue': float(revenue)
            })

        return jsonify(monthly_revenue), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

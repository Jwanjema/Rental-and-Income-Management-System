from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from functools import wraps
from models import User, db


def authenticate_user(username, password):
    """Authenticate user credentials"""
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return user
    return None


def create_user_token(user):
    """Create JWT token for user"""
    additional_claims = {
        "user_id": user.id,
        "username": user.username,
        "role": user.role
    }
    return create_access_token(
        identity=user.id,
        additional_claims=additional_claims
    )


def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


def get_current_user():
    """Get current authenticated user"""
    try:
        current_user_id = get_jwt_identity()
        return User.query.get(current_user_id)
    except:
        return None

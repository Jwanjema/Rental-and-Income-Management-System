from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from datetime import date, timedelta
from flask_bcrypt import Bcrypt

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    currency = db.Column(db.String, default='Ksh')
    serialize_rules = ('-_password_hash',)

    @property
    def password_hash(self):
        raise AttributeError('password_hash is not a readable attribute')
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

class Property(db.Model, SerializerMixin):
    __tablename__ = "properties"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    units = db.relationship("Unit", back_populates="property", cascade="all, delete-orphan")
    expenses = db.relationship('Expense', back_populates='property', cascade="all, delete-orphan")
    serialize_rules = ("-units.property", "-expenses.property",)

class Unit(db.Model, SerializerMixin):
    __tablename__ = "units"
    id = db.Column(db.Integer, primary_key=True)
    unit_number = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default="vacant")
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    property = db.relationship("Property", back_populates="units")
    leases = db.relationship("Lease", back_populates="unit", cascade="all, delete-orphan")
    serialize_rules = ("-leases.unit", "-property.units", "-property.expenses")

class Tenant(db.Model, SerializerMixin):
    __tablename__ = "tenants"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    contact = db.Column(db.String, nullable=False)
    leases = db.relationship("Lease", back_populates="tenant", cascade="all, delete-orphan")
    serialize_rules = ("-leases",)

class Lease(db.Model, SerializerMixin):
    __tablename__ = "leases"
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey("units.id", ondelete="CASCADE"), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    rent_amount = db.Column(db.Float, nullable=False)
    tenant = db.relationship("Tenant", back_populates="leases")
    unit = db.relationship("Unit", back_populates="leases")
    payments = db.relationship("Payment", back_populates="lease", cascade="all, delete-orphan")
    serialize_rules = ("-tenant.leases", "-unit.leases", "-payments.lease", "balance", "status")

    @property
    def total_paid(self): return sum(p.amount for p in self.payments)
    @property
    def balance(self): return self.rent_amount - self.total_paid
    @property
    def status(self):
        today = date.today()
        if self.end_date and self.end_date < today: return "Expired"
        if self.balance > 0: return "Overdue"
        if self.end_date and (self.end_date - today) <= timedelta(days=60): return "Expiring Soon"
        return "Active"
    @validates("rent_amount")
    def validate_rent(self, key, value):
        if not isinstance(value, (int, float)) or value <= 0: raise ValueError("Rent must be a positive number")
        return value

class Payment(db.Model, SerializerMixin):
    __tablename__ = "payments"
    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey("leases.id", ondelete="CASCADE"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    method = db.Column(db.String, default="cash")
    lease = db.relationship("Lease", back_populates="payments")
    serialize_rules = ("-lease.payments",)

    @validates("amount")
    def validate_amount(self, key, value):
        if not isinstance(value, (int, float)) or value <= 0: raise ValueError("Payment amount must be a positive number")
        return value

class Expense(db.Model, SerializerMixin):
    __tablename__ = 'expenses'
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete="CASCADE"), nullable=False)
    category = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    property = db.relationship('Property', back_populates='expenses')
    serialize_rules = ('-property.units','-property.expenses')
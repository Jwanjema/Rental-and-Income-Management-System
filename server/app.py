from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from passlib.hash import bcrypt

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)

class Property(db.Model, SerializerMixin):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)

    units = db.relationship("Unit", back_populates="property", cascade="all, delete-orphan")

    serialize_rules = ("-units.property",)

    def __repr__(self):
        return f"<Property {self.name}>"


class Unit(db.Model, SerializerMixin):
    __tablename__ = "units"

    id = db.Column(db.Integer, primary_key=True)
    unit_number = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default="vacant")
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)

    property = db.relationship("Property", back_populates="units")
    leases = db.relationship("Lease", back_populates="unit", cascade="all, delete-orphan")

    serialize_rules = ("-leases.unit", "-property.units")

    def __repr__(self):
        return f"<Unit {self.unit_number}>"


class Tenant(db.Model, SerializerMixin):
    __tablename__ = "tenants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    contact = db.Column(db.String, nullable=False)

    leases = db.relationship("Lease", back_populates="tenant", cascade="all, delete-orphan")

    serialize_rules = ("-leases.tenant",)

    def __repr__(self):
        return f"<Tenant {self.name}>"


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

    serialize_rules = ("-tenant.leases", "-unit.leases", "-payments.lease")

    @validates("rent_amount")
    def validate_rent(self, key, value):
        if value is None or value <= 0:
            raise ValueError("Rent must be positive")
        return value

    def __repr__(self):
        return f"<Lease {self.id}>"


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
        if value is None or value <= 0:
            raise ValueError("Payment must be positive")
        return value

    def __repr__(self):
        return f"<Payment {self.amount}>"

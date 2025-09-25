import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import db, Property, Unit, Tenant, Lease, Payment

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
app.url_map.strict_slashes = False

migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)
CORS(app)


@app.route("/")
def index():
    return "<h1>Rental & Income Management System</h1>"


# --- Property Resources ---
class Properties(Resource):
    def get(self):
        properties = Property.query.all()
        return [p.to_dict() for p in properties], 200

    def post(self):
        data = request.get_json()
        try:
            new_property = Property(
                name=data.get("name"),
                address=data.get("address")
            )
            db.session.add(new_property)
            db.session.commit()
            return new_property.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400


class PropertyById(Resource):
    def get(self, id):
        property = Property.query.filter_by(id=id).first()
        if not property:
            return {"error": "Property not found"}, 404
        return property.to_dict(), 200

    def patch(self, id):
        property = Property.query.filter_by(id=id).first()
        if not property:
            return {"error": "Property not found"}, 404
        
        data = request.get_json()
        try:
            for attr, value in data.items():
                setattr(property, attr, value)
            db.session.add(property)
            db.session.commit()
            return property.to_dict(), 200
        except Exception as e:
            return {"error": str(e)}, 400

    def delete(self, id):
        property = Property.query.filter_by(id=id).first()
        if not property:
            return {"error": "Property not found"}, 404
        
        db.session.delete(property)
        db.session.commit()
        return {}, 204


# --- Unit Resources ---
class Units(Resource):
    def get(self):
        units = Unit.query.all()
        return [u.to_dict() for u in units], 200

    def post(self):
        data = request.get_json()
        try:
            new_unit = Unit(
                unit_number=data.get("unit_number"),
                status=data.get("status"),
                property_id=data.get("property_id")
            )
            db.session.add(new_unit)
            db.session.commit()
            return new_unit.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400


class UnitById(Resource):
    def get(self, id):
        unit = Unit.query.filter_by(id=id).first()
        if not unit:
            return {"error": "Unit not found"}, 404
        return unit.to_dict(), 200

    def patch(self, id):
        unit = Unit.query.filter_by(id=id).first()
        if not unit:
            return {"error": "Unit not found"}, 404
        
        data = request.get_json()
        try:
            for attr, value in data.items():
                setattr(unit, attr, value)
            db.session.add(unit)
            db.session.commit()
            return unit.to_dict(), 200
        except Exception as e:
            return {"error": str(e)}, 400

    def delete(self, id):
        unit = Unit.query.filter_by(id=id).first()
        if not unit:
            return {"error": "Unit not found"}, 404
        
        db.session.delete(unit)
        db.session.commit()
        return {}, 204


# --- Other Resources (read-only for now) ---
class Tenants(Resource):
    def get(self):
        return [t.to_dict(only=("id", "name", "contact")) for t in Tenant.query.all()], 200

class Leases(Resource):
    def get(self):
        return [l.to_dict() for l in Lease.query.all()], 200

class Payments(Resource):
    def get(self):
        return [p.to_dict() for p in Payment.query.all()], 200


# --- Dashboard Summary Endpoint ---
@app.route("/dashboard_summary", methods=["GET"])
def get_dashboard_summary():
    total_properties = Property.query.count()
    occupied_units = Unit.query.filter_by(status='occupied').count()
    vacant_units = Unit.query.filter_by(status='vacant').count()
    total_monthly_rent = db.session.query(db.func.sum(Lease.rent_amount)).scalar() or 0

    summary = {
        "total_properties": total_properties,
        "occupied_units": occupied_units,
        "vacant_units": vacant_units,
        "total_monthly_rent": total_monthly_rent,
    }
    return jsonify(summary)


# --- API Resource Mapping ---
api.add_resource(Properties, "/properties")
api.add_resource(PropertyById, "/properties/<int:id>")
api.add_resource(Units, "/units")
api.add_resource(UnitById, "/units/<int:id>")
api.add_resource(Tenants, "/tenants")
api.add_resource(Leases, "/leases")
api.add_resource(Payments, "/payments")


if __name__ == "__main__":
    app.run(port=5555, debug=True)
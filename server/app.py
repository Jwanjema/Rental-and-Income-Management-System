from models import db, Property, Unit, Tenant, Lease, Payment
from flask_migrate import Migrate
from flask import Flask, request
from flask_restful import Api, Resource
import os

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


@app.route("/")
def index():
    return "<h1>Rental & Income Management System</h1>"


class Properties(Resource):
    def get(self):
        return [p.to_dict(only=("id", "name", "address")) for p in Property.query.all()], 200

class Units(Resource):
    def get(self):
        return [u.to_dict(only=("id", "unit_number", "status", "property_id")) for u in Unit.query.all()], 200

class Tenants(Resource):
    def get(self):
        return [t.to_dict(only=("id", "name", "contact")) for t in Tenant.query.all()], 200

class Leases(Resource):
    def get(self):
        return [l.to_dict() for l in Lease.query.all()], 200

class Payments(Resource):
    def get(self):
        return [p.to_dict() for p in Payment.query.all()], 200

api.add_resource(Properties, "/properties")
api.add_resource(Units, "/units")
api.add_resource(Tenants, "/tenants")
api.add_resource(Leases, "/leases")
api.add_resource(Payments, "/payments")

if __name__ == "__main__":
    app.run(port=5555, debug=True)
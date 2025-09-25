from app import app
from models import db, User, Property, Unit, Tenant, Lease, Payment, Expense
from datetime import date, timedelta


def seed_database():
    with app.app_context():
        print("Starting database seed...")
        Expense.query.delete()
        Payment.query.delete()
        Lease.query.delete()
        Tenant.query.delete()
        Unit.query.delete()
        Property.query.delete()
        User.query.delete()
        print("Cleared existing data.")

        user1 = User(username='admin')
        user1.password_hash = 'admin'
        db.session.add(user1)
        db.session.commit()
        print("Default user 'admin' created.")

        p1 = Property(name="Kanari Apartments", address="Ongata Rongai")
        p2 = Property(name="Meadows Residences", address="Maasai Road")
        db.session.add_all([p1, p2])
        db.session.commit()

        u1 = Unit(unit_number="1A", property_id=p1.id, status="occupied")
        u2 = Unit(unit_number="1B", property_id=p1.id, status="occupied")
        u3 = Unit(unit_number="2A", property_id=p2.id, status="vacant")
        u4 = Unit(unit_number="2B", property_id=p2.id, status="occupied")
        db.session.add_all([u1, u2, u3, u4])
        db.session.commit()

        t1 = Tenant(name="Khalif Mwende", contact="khalif@example.com")
        t2 = Tenant(name="Jane Wangui", contact="jane@example.com")
        t3 = Tenant(name="Peter Obi", contact="peter.o@example.com")
        db.session.add_all([t1, t2, t3])
        db.session.commit()

        today = date.today()
        lease1 = Lease(tenant_id=t1.id, unit_id=u1.id, start_date=today - timedelta(
            days=100), end_date=today + timedelta(days=265), rent_amount=12000)
        lease2 = Lease(tenant_id=t2.id, unit_id=u2.id, start_date=today -
                       timedelta(days=300), end_date=today + timedelta(days=45), rent_amount=15000)
        lease3 = Lease(tenant_id=t3.id, unit_id=u4.id, start_date=today -
                       timedelta(days=50), end_date=today + timedelta(days=315), rent_amount=13500)
        db.session.add_all([lease1, lease2, lease3])
        db.session.commit()

        payment1 = Payment(lease_id=lease1.id, amount=8000,
                           date=today - timedelta(days=30), method="bank_transfer")
        payment2 = Payment(lease_id=lease2.id, amount=15000,
                           date=today - timedelta(days=25), method="mpesa")
        db.session.add_all([payment1, payment2])
        db.session.commit()

        exp1 = Expense(property_id=p1.id, category="Repairs",
                       description="Fix leaking sink in 1A", amount=2500, date=today - timedelta(days=10))
        exp2 = Expense(property_id=p2.id, category="Utilities",
                       description="Water bill for Q3", amount=8000, date=today - timedelta(days=22))
        db.session.add_all([exp1, exp2])
        db.session.commit()
        print("Database seeded successfully!")


if __name__ == '__main__':
    seed_database()

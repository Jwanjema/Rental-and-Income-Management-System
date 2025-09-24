from app import app
from models import db, Property, Unit, Tenant, Lease, Payment
from datetime import date

with app.app_context():
    Payment.query.delete()
    Lease.query.delete()
    Tenant.query.delete()
    Unit.query.delete()
    Property.query.delete()

    p1 = Property(name="Kanari Apartments", address="Ongata Rongai")
    p2 = Property(name="Meadows Residences", address="Maasai Road")
    db.session.add_all([p1, p2])
    db.session.commit()

    u1 = Unit(unit_number="1A", property_id=p1.id)
    u2 = Unit(unit_number="1B", property_id=p1.id)
    u3 = Unit(unit_number="2A", property_id=p2.id)
    db.session.add_all([u1, u2, u3])
    db.session.commit()

    t1 = Tenant(name="Khalif Mwende", contact="khalif@example.com")
    t2 = Tenant(name="Jane Wangui", contact="jane@example.com")
    db.session.add_all([t1, t2])
    db.session.commit()

    lease1 = Lease(tenant_id=t1.id, unit_id=u1.id, start_date=date(2025, 1, 1), end_date=date(2025, 12, 31), rent_amount=1200)
    db.session.add(lease1)
    db.session.commit()

    payment1 = Payment(lease_id=lease1.id, amount=12000, date=date.today(), method="bank_transfer")
    db.session.add(payment1)
    db.session.commit()

    print("Database seeded successfully.")

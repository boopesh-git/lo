from database import SessionLocal
from models import Hospital

db = SessionLocal()
users = db.query(Hospital).all()

print("--- Current Database Users ---")
for user in users:
    print(f"Email: {user.email} | Reset Code: {user.reset_code}")
print("------------------------------")

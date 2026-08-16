from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models, schemas, utils
from database import engine, get_db

# We don't automatically create tables here anymore, to avoid conflicts.
# We will use a script to drop and recreate.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospital User System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_user = db.query(models.Hospital).filter(models.Hospital.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate user ID
    user_id = utils.generate_user_id()
    
    # Hash password
    hashed_password = utils.get_password_hash(user.password)
    
    # Create new user record
    new_user = models.Hospital(
        user_id=user_id,
        user_name=user.user_name,
        hospital_name=user.hospital_name,
        email=user.email,
        role=user.role,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send email with User ID
    utils.send_registration_email(new_user.email, new_user.user_id)
    
    return new_user

@app.post("/login")
def login_user(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.Hospital).filter(models.Hospital.user_id == credentials.user_id).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid User ID or password")
        
    if not utils.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid User ID or password")
        
    return {
        "message": "Login successful",
        "user": {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "hospital_name": user.hospital_name,
            "role": user.role
        }
    }

@app.post("/forgot-password")
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.Hospital).filter(models.Hospital.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
        
    code = utils.generate_reset_code()
    user.reset_code = code
    db.commit()
    
    utils.send_reset_code_email(req.email, code)
    return {"message": "Reset code sent"}

@app.post("/verify-code")
def verify_code(req: schemas.VerifyCodeRequest, db: Session = Depends(get_db)):
    user = db.query(models.Hospital).filter(models.Hospital.email == req.email).first()
    if not user or user.reset_code != req.code:
        raise HTTPException(status_code=400, detail="Invalid code")
        
    return {"message": "Code verified"}

@app.post("/reset-password")
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.Hospital).filter(models.Hospital.email == req.email).first()
    if not user or user.reset_code != req.code:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
        
    user.hashed_password = utils.get_password_hash(req.new_password)
    user.reset_code = None
    db.commit()
    
    return {"message": "Password updated successfully"}

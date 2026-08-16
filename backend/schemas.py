from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    user_name: str
    hospital_name: str
    email: EmailStr
    role: str
    password: str

class UserLogin(BaseModel):
    user_id: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

class UserOut(BaseModel):
    user_id: str
    user_name: str
    hospital_name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

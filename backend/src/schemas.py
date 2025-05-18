from pydantic import BaseModel
import datetime

class LoginRequest(BaseModel):
    username:str
    password:str

class SignupRequest(BaseModel):
    username:str
    password:str
    email:str

class VerifyEmailRequest(BaseModel):
    username:str
    email:str

class VerifyCodeRequest(BaseModel):
    code:int
    email:str

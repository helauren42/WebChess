from pydantic import BaseModel
import datetime

class LoginRequest(BaseModel):
    username:str
    password:str

class SignupRequest(BaseModel):
    username:str
    password:str
    email:str

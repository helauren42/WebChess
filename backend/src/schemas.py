from pydantic import BaseModel
import datetime

class LoginRequest(BaseModel):
    username:str
    password:str
    stayLoggedIn:bool

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

class SessionToken(BaseModel):
    sessionToken:str
class BothTokens(BaseModel):
    sessionToken:str
    persistentToken:str

class Token(BaseModel):
    token:str

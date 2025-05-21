import uuid
from pydantic import BaseModel
import uvicorn
import fastapi
import logging
from uuid import uuid4

from utils import HOST, PORT, ORIGIN
from fastapi.middleware.cors import CORSMiddleware
from database import Database
from schemas import LoginRequest, SignupRequest, VerifyCodeRequest, VerifyEmailRequest, SessionToken, Token
from emailManager import EmailManager

logging.basicConfig(filename="logs.log", encoding='utf-8', level=logging.DEBUG)

app = fastapi.FastAPI()
db = Database()
emailManager = EmailManager()

origins = [ORIGIN]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

''' ------------------------------------------------------- ACCOUNT ------------------------------------------------------- '''

@app.post("/getPersistentToken")
async def getPersistentToken(req:SessionToken):
  try:
    username = db.fetchUsername(req.sessionToken)
    db.addPersistenceToken()
  except Exception as e:
    return fastapi.responses.JSONResponse(status_code=500, content={"message": e.__str__()})
  if username == None:
      return fastapi.responses.JSONResponse(status_code=401, content={})
  persistentToken = str(uuid4())
  return fastapi.responses.JSONResponse(status_code=200, content={"persistentToken":persistentToken})

@app.post("/fetchUsername")
async def fetchUsername(req:Token):
    print(req)
    token = req.token
    print("fetchUsername request: ", token)
    username = db.fetchUsername(token)
    print("found username: ", username)
    if username == None:
        return fastapi.responses.JSONResponse(status_code=401, content={})
    return fastapi.responses.JSONResponse(status_code=200, content={"username":username})

@app.post("/validateForm")
async def validateForm(req: SignupRequest):
    print("validateForm request received")
    print(req)
    try:
        db.validateSignupForm(req)
    except Exception as e:
        status_code = e.args[0]
        message= e.args[1]
        return fastapi.responses.JSONResponse(status_code=status_code, content={"message":message})
    return fastapi.responses.JSONResponse(content={"message":"form is valid"})

@app.post("/sendVerificationEmail")
async def sendVerificationEmail(req: VerifyEmailRequest):
    print("sendVerificationEmail request received")
    code = emailManager.sendVerificationEmail(req.username, req.email)
    db.insertValidationCode(req.email, code)

@app.post("/validateCode")
async def validateCode(req: VerifyCodeRequest):
    print("validateCode request received")
    if db.validateCode(req.email, req.code):
      return fastapi.responses.JSONResponse(status_code=200, content={"message":"code is valid"})
    return fastapi.responses.JSONResponse(status_code=401, content={"message":"code is invalid"})

@app.post("/createAccount")
async def createAccount(req: SignupRequest):
    print("createAccount request received")
    try:
        db.createAccount(req)
        sessionToken = str(uuid4())
        db.addSessionToken(req.username, sessionToken)
    except Exception as e:
        if len(e.args) >= 2:
            status_code = e.args[0]
            message = e.args[1]
            return fastapi.responses.JSONResponse(status_code=status_code, content={"message":message})
        else:
            return fastapi.responses.JSONResponse(status_code=500, content={"message":e.__str__()})
    return fastapi.responses.JSONResponse(status_code=200, content={"message": "added user to db", "sessionToken": sessionToken})

@app.post("/login")
async def login(req: LoginRequest):
    print("login request received: ")
    try:
        db.loginUser(req)
        sessionToken = str(uuid4())
        db.addSessionToken(req.username, sessionToken)
        persistentToken = ""
        if req.stayLoggedIn:
          persistentToken = str(uuid4())
          db.addPersistenceToken(req.username, persistentToken)
        return fastapi.responses.JSONResponse(status_code=200, content={"message":"login success", "sessionToken":sessionToken, "stayLoggedIn":req.stayLoggedIn, "persistentToken": persistentToken})
    except:
        return fastapi.responses.JSONResponse(status_code=401, content={"message":"wrong credentials"})

if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)

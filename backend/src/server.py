import uvicorn
import fastapi
import logging

from utils import HOST, PORT, ORIGIN
from fastapi.middleware.cors import CORSMiddleware
from database import Database
from schemas import LoginRequest, SignupRequest, VerifyCodeRequest, VerifyEmailRequest
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

@app.get("/validateForm")
async def validateForm(req: SignupRequest):
    print("validateForm request received")
    print(req)
    try:
        db.validateSignupForm()
    except Exception as e:
        status_code = e.args[0]
        message= e.args[1]
        return fastapi.responses.JSONResponse(status_code=status_code, content={"message":message})
    return fastapi.responses.JSONResponse(content={"message":"form is valid"})

@app.post("/sendVerificationEmail")
async def sendVerificationEmail(req: VerifyEmailRequest):
    print("sendVerificationEmail request received")
    emailManager.sendVerificationEmail(req.username, req.email)

@app.post("/verifyEmailCode")
async def verifyEmailCode(req: VerifyCodeRequest):
    print("verifyEmailCode request received")

@app.post("/createAccount")
async def createAccount(req: SignupRequest):
    print("createAccount request received")
    try:
        db.createAccount(req)
    except Exception as e:
        status_code = e.args[0]
        message = e.args[1]
        return fastapi.responses.JSONResponse(status_code=status_code, content={"message":message})
    return fastapi.responses.JSONResponse(status_code=200, content={"message": "added user to db"})

@app.post("/login")
async def login(req: LoginRequest):
    print("login request received")
    print(req)
    return "login"

if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)

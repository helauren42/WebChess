import uvicorn
import fastapi
import logging

from utils import HOST, PORT, ORIGIN
from fastapi.middleware.cors import CORSMiddleware
from database import Database
from schemas import LoginRequest, SignupRequest

logging.basicConfig(filename="logs.log", encoding='utf-8', level=logging.DEBUG)

app = fastapi.FastAPI()
db = Database()

origins = [ORIGIN]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return "hello world"

@app.post("/signup")
async def signup(req: SignupRequest):
    print("signup request received")
    print(req)
    try:
        db.signupUser(req)
    except Exception as e:
        status_code = e.args[0]
        message= e.args[1]
        return fastapi.responses.JSONResponse(status_code=status_code, content={"message":message})
    return fastapi.responses.JSONResponse(status_code=200, content={})

@app.post("/login")
async def login(req: LoginRequest):
    print("login request received")
    print(req)
    return "login"

if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)

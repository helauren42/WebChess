import uvicorn
import fastapi

from utils import HOST, PORT, ORIGIN
from fastapi.middleware.cors import CORSMiddleware
from database import Database
from schemas import LoginRequest, SignupRequest

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
    print("login request received")
    print(req)
    return "signup"

@app.post("/login")
async def login(req: LoginRequest):
    print("login request received")
    print(req)
    return "login"

if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)

from pydantic import BaseModel
import uvicorn
import fastapi
from fastapi import WebSocket
import logging
from uuid import uuid4
from websocket import WebsocketManager

from utils import HOST, PORT, ORIGIN
from fastapi.middleware.cors import CORSMiddleware
from database import db
from schemas import BothTokens, LoginRequest, SignupRequest, VerifyCodeRequest, VerifyEmailRequest, SessionToken, Token
from emailManager import EmailManager
from board import Pos

logging.basicConfig(filename="logs.log", encoding='utf-8', level=logging.DEBUG)

app = fastapi.FastAPI()
emailManager = EmailManager()
websocketManager = WebsocketManager()

origins = [ORIGIN]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

''' ------------------------------------------------------- ACCOUNT ------------------------------------------------------- '''

@app.post("/addSessionToken")
async def addSessionToken(req:BothTokens):
    try:
        print("req sessionToken: ", req.sessionToken)
        username = db.fetchUsername(req.persistentToken)
        db.addSessionToken(username, req.sessionToken)
    except Exception as e:
        print("add session token error: ", e.__str__())
        return fastapi.responses.JSONResponse(status_code=500, content={"message": e.__str__()})
    return fastapi.responses.JSONResponse(content={})

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
    print(f"login request received username: {req.username}")
    try:
        db.loginUser(req)
        sessionToken = str(uuid4())
        print("sessionToken: ", sessionToken)
        db.addSessionToken(req.username, sessionToken)
        persistentToken = ""
        if req.stayLoggedIn:
            persistentToken = str(uuid4())
            db.addPersistenceToken(req.username, persistentToken)
        return fastapi.responses.JSONResponse(status_code=200, content={"message":"login success", "sessionToken":sessionToken, "stayLoggedIn":req.stayLoggedIn, "persistentToken": persistentToken})
    except:
        return fastapi.responses.JSONResponse(status_code=401, content={"message":"wrong credentials"})

''' ------------------------------------------------------ CHAT ------------------------------------------------------ '''

@app.get("/getGlobalChatHistory")
async def getGlobalChatHistory(req: fastapi.Request):
    try:
        print("request to getGlobalChatHistory")
        return fastapi.responses.JSONResponse(content={"history":db.getGlobalChatHistory()})
    except Exception as e:
        return fastapi.responses.JSONResponse(status_code=500, content={"message":e.__str__()})

''' ------------------------------------------------------ WEBSOCKET ------------------------------------------------------ '''

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    username = ""
    sessionToken = ""
    # try:
    await websocket.accept()
    print("accepted new websocket connection")
    while True:
        # User logging in, new active connection
        recv = await websocket.receive_json()
        print('websocket recv: ', recv)
        if recv == "":
            continue
        # make sure session token is valid
        sessionToken = recv["sessionToken"]
        username = db.fetchUsername(sessionToken)
        if username is None:
            print("invalid sessionToken")
            await websocket.close()
            raise Exception("entered wrong session token")
        # handling different websocket requests
        recvType = recv["type"]
        print("websocket message type: ", recvType)
        data = recv["data"]
        print("data: ", data)
        match recvType:
            case "newConnection":
                await websocketManager.newConnection(username, websocket, sessionToken)
                await websocketManager.msgUpdateActiveUsers()
            case "globalChat":
                message = data["message"]
                await websocketManager.msgGlobalChat(message, username)
            # todo case "disconnect"
            case "disconnect":
                await websocketManager.disconnect(username)
            case "challengeUser":
                challenger = data["challenger"]
                challenged = data["challenged"]
                if await websocketManager.userIsPlaying(challenged):
                    await websocketManager.sendAlreadyPlaying(challenger, challenged)
                    continue
                await websocketManager.challengeUser(challenger, challenged)
            case "acceptChallenge":
                challenger = data["challenger"]
                challenged = data["challenged"]
                if await websocketManager.userIsPlaying(challenger):
                    await websocketManager.sendAlreadyPlaying(challenged, challenger)
                    continue
                await websocketManager.acceptChallenge(challenger, challenged)
            # ''' active game '''
            case "makeMove":
                gameId = data["gameId"]
                fromPos = Pos(data["fromPos"])
                toPos = Pos(data["toPos"])
                await websocketManager.makeMove(gameId, fromPos, toPos)

    # except Exception as e:
    #     await websocketManager.removeClosedSockets()
    #     print(f"Closed websocket {username} {sessionToken}: ", e.__str__())

if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)


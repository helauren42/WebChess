from uuid import uuid4

import fastapi
import uvicorn
from cell import Pos
from database import db
from emailManager import EmailManager
from fastapi import WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from schemas import (
    BothTokens,
    LoginRequest,
    SessionToken,
    SignupRequest,
    Token,
    VerifyCodeRequest,
    VerifyEmailRequest,
)

from const import HOST, ORIGIN, PORT
from utils import logger
from websocket import Matchmaker, MatchmakerConnection, WebsocketManager


app = fastapi.FastAPI()
emailManager = EmailManager()
websocketManager = WebsocketManager()
matchMaker = Matchmaker()

origins = [ORIGIN]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

""" ------------------------------------------------------- ACCOUNT ------------------------------------------------------- """


@app.get("/validatePersistentToken")
async def validatePersistentToken(persistentToken: str):
    username = db.fetchUsername(persistentToken)
    if username == None:
        return fastapi.Response(status_code=401)
    return fastapi.Response()


@app.post("/addSessionToken")
async def addSessionToken(req: BothTokens):
    try:
        logger.info(f"req sessionToken: {req.sessionToken}")
        username = db.fetchUsername(req.persistentToken)
        db.addSessionToken(username, req.sessionToken)
    except Exception as e:
        logger.error(f"add session token error: {e}")
        return fastapi.responses.JSONResponse(
            status_code=500, content={"message": str(e)}
        )
    return fastapi.responses.JSONResponse(content={})


@app.post("/getPersistentToken")
async def getPersistentToken(req: SessionToken):
    try:
        username = db.fetchUsername(req.sessionToken)
        db.addPersistenceToken()
    except Exception as e:
        logger.error(f"get persistent token error: {e}")
        return fastapi.responses.JSONResponse(
            status_code=500, content={"message": str(e)}
        )
    if username == None:
        return fastapi.responses.JSONResponse(status_code=401, content={})
    persistentToken = str(uuid4())
    return fastapi.responses.JSONResponse(
        status_code=200, content={"persistentToken": persistentToken}
    )


@app.post("/fetchUsername")
async def fetchUsername(req: Token):
    logger.info(f"fetchUsername request: {req.token}")
    username = db.fetchUsername(req.token)
    logger.info(f"found username: {username}")
    if username == None:
        return fastapi.responses.JSONResponse(status_code=401, content={})
    return fastapi.responses.JSONResponse(
        status_code=200, content={"username": username}
    )


@app.post("/validateForm")
async def validateForm(req: SignupRequest):
    logger.info("validateForm request received")
    logger.debug(f"validateForm request: {req}")
    try:
        db.validateSignupForm(req)
    except Exception as e:
        status_code = e.args[0]
        message = e.args[1]
        logger.error(f"validateForm error: {message}")
        return fastapi.responses.JSONResponse(
            status_code=status_code, content={"message": message}
        )
    return fastapi.responses.JSONResponse(content={"message": "form is valid"})


@app.post("/sendVerificationEmail")
async def sendVerificationEmail(req: VerifyEmailRequest):
    logger.info("sendVerificationEmail request received")
    code = emailManager.sendVerificationEmail(req.username, req.email)
    db.insertValidationCode(req.email, code)


@app.post("/validateCode")
async def validateCode(req: VerifyCodeRequest):
    logger.info("validateCode request received")
    if db.validateCode(req.email, req.code):
        return fastapi.responses.JSONResponse(
            status_code=200, content={"message": "code is valid"}
        )
    return fastapi.responses.JSONResponse(
        status_code=401, content={"message": "code is invalid"}
    )


@app.post("/createAccount")
async def createAccount(req: SignupRequest):
    logger.info("createAccount request received")
    try:
        db.createAccount(req)
        sessionToken = str(uuid4())
        db.addSessionToken(req.username, sessionToken)
    except Exception as e:
        logger.error(f"createAccount error: {e}")
        if len(e.args) >= 2:
            status_code = e.args[0]
            message = e.args[1]
            return fastapi.responses.JSONResponse(
                status_code=status_code, content={"message": message}
            )
        else:
            return fastapi.responses.JSONResponse(
                status_code=500, content={"message": str(e)}
            )
    return fastapi.responses.JSONResponse(
        status_code=200,
        content={"message": "added user to db", "sessionToken": sessionToken},
    )


@app.post("/login")
async def login(req: LoginRequest):
    logger.info(f"login request received username: {req.username}")
    try:
        db.loginUser(req)
        sessionToken = str(uuid4())
        logger.info(f"sessionToken: {sessionToken}")
        db.addSessionToken(req.username, sessionToken)
        persistentToken = ""
        if req.stayLoggedIn:
            persistentToken = str(uuid4())
            db.addPersistenceToken(req.username, persistentToken)
        return fastapi.responses.JSONResponse(
            status_code=200,
            content={
                "message": "login success",
                "sessionToken": sessionToken,
                "stayLoggedIn": req.stayLoggedIn,
                "persistentToken": persistentToken,
            },
        )
    except Exception as e:
        logger.error(f"login error: {e}")
        return fastapi.responses.JSONResponse(
            status_code=401, content={"message": "wrong credentials"}
        )


""" ------------------------------------------------------ CHAT ------------------------------------------------------ """


@app.get("/getGlobalChatHistory")
async def getGlobalChatHistory(req: fastapi.Request):
    try:
        logger.info("request to getGlobalChatHistory")
        return fastapi.responses.JSONResponse(
            content={"history": db.getGlobalChatHistory()}
        )
    except Exception as e:
        logger.error(f"getGlobalChatHistory error: {e}")
        return fastapi.responses.JSONResponse(
            status_code=500, content={"message": str(e)}
        )


""" ------------------------------------------------------ WEBSOCKET ------------------------------------------------------ """


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    username = ""
    sessionToken = ""
    try:
        await websocket.accept()
        logger.info("accepted new websocket connection")
        while True:
            # User logger.in, new active connection
            if len(websocketManager.activeGames) == 0:
                await websocketManager.fetchActiveGames()
                logger.info(
                    f"fetched active games amount: {len(websocketManager.activeGames)}"
                )
                await websocketManager.printActiveGames()
            recv = await websocket.receive_json()
            logger.debug(f"websocket recv: {recv}")
            if recv == "":
                continue
            # make sure session token is valid
            sessionToken = recv["sessionToken"]
            username = db.fetchUsername(sessionToken)
            if username is None:
                logger.error("invalid sessionToken")
                await websocket.close()
                raise Exception("entered wrong session token")
            # handling different websocket requests
            recvType = recv["type"]
            logger.info(f"websocket message type: {recvType}")
            data = recv["data"]
            logger.debug(f"data: {data}")
            match recvType:
                case "newConnection":
                    await websocketManager.newConnection(
                        username, websocket, sessionToken
                    )
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
                        await websocketManager.sendAlreadyPlaying(
                            challenger, challenged
                        )
                        continue
                    await websocketManager.challengeUser(challenger, challenged)
                case "acceptChallenge":
                    challenger = data["challenger"]
                    challenged = data["challenged"]
                    if await websocketManager.userIsPlaying(challenger):
                        await websocketManager.sendAlreadyPlaying(
                            challenged, challenger
                        )
                        continue
                    await websocketManager.startOnlineGame(challenger, challenged)
                # ''' active game '''
                case "makeMove":
                    gameId = data["gameId"]
                    fromPos = Pos(data["fromPos"])
                    toPos = Pos(data["toPos"])
                    await websocketManager.makeMove(gameId, fromPos, toPos)
                case "userResign":
                    gameId = data["gameId"]
                    username = data["username"]
                    await websocketManager.userResign(gameId, username)
                case "getGameData":
                    await websocketManager.getGameData(username)

    except Exception as e:
        await websocketManager.removeClosedSockets()
        logger.error(f"Closed websocket {username} {sessionToken}: {e}")


@app.websocket("/matchmaking")
async def matchmaking(websocket: WebSocket):
    sessionToken = ""
    try:
        await websocket.accept()
        logger.info("accepted new matchmaking websocket connection")
        while True:
            sessionToken = await websocket.receive_text()
            logger.debug(f"websocket recv: {sessionToken}")
            if sessionToken == "":
                continue
            username = db.fetchUsername(sessionToken)
            if username is None:
                logger.error("invalid sessionToken")
                await websocket.close()
                raise Exception("entered wrong session token")
            logger.info(f"current connection matchmaking: {len(matchMaker.connections)}")
            if len(matchMaker.connections) > 0:
                opponent = matchMaker.connections[0].username
                await websocketManager.startOnlineGame(username, opponent)
            connection = MatchmakerConnection(sessionToken, websocket, username)
            matchMaker.connections.append(connection)

    except Exception as e:
        logger.error(f"Matchmaking websocket closed: {e}")
        if sessionToken != "":
            matchMaker.removeConnection(sessionToken)

if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)

from fastapi import WebSocket
from abc import ABC
import json
import time
import random

from fastapi.websockets import WebSocketState
from database import db
from board import Board

GLOBAL_CHAT_HISTORY_SIZE = 50

WHITE = "white"
BLACK = "black"

class OnlineGame():
    def __init__(self, _challenger, _challenged, _gameId) -> None:
        self.gameId = _gameId
        self.challenged:str = _challenged
        self.challenger:str = _challenger
        self.challenger_color:str = random.choice([WHITE, BLACK])
        self.challenged_color:str =  BLACK if self.challenger_color == WHITE else WHITE
        self.board:Board = Board()
        self.playerTurn:str = WHITE

    async def getData(self, player) -> str:
        data = json.dumps({
            "challenged":self.challenged,
            "challenger":self.challenger,
            "playerColor": self.challenged_color if player == "challenged" else self.challenger_color,
            "playerTurn":self.playerTurn,
            "gameId":self.gameId,
            "board":self.board.sendFormat()
        })
        return data

class Connection():
    def __init__(self, _sessionToken, _websocket, _status=0 ) -> None:
        self.sessionToken:str = _sessionToken
        self.websocket:WebSocket = _websocket
        self.gameId:int = _status

class AbstractWebsocketManager(ABC):
    def __init__(self):
        # username to connection object
        self.connections: dict[str, Connection] = {}
        # gameId to access game
        self.games:dict[int, OnlineGame] = {}

    async def userIsPlaying(self, username) -> bool:
        for game in self.games.values():
            if game.challenged == username or game.challenger == username:
                print("is playing")
                return True
        return False

    async def newGameId(self):
        gameId = None 
        while gameId == None or self.games.get(gameId) != None:
            gameId = random.randint(1,5000)
        return gameId

    async def setStatusInGame(self, username, gameId):
        self.connections[username].gameId = gameId

    async def setStatusFree(self, username):
        self.connections[username].gameId = 0

    async def getActiveUsers(self):
        return self.connections.keys()

    async def sendMessage(self, type: str, data:str, websocket: WebSocket):
        await websocket.send_json(data={"type": type, "data": data})

class WebsocketManager(AbstractWebsocketManager):
    def __init__(self):
        super().__init__()
    async def msgUpdateActiveUsers(self):
        activeUsers:tuple = tuple(await self.getActiveUsers())
        for username in self.connections:
            usernames:list = list(activeUsers)
            usernames.remove(username)
            data = json.dumps(usernames)
            await self.sendMessage("activeUsers", data, self.connections[username].websocket)

    async def msgGlobalChat(self, message, sender):
        print("!!!msg msgGlobalChat")
        # time in minutes
        time_minutes = int(time.time() / 60)
        db.addGlobalChatMessage(time_minutes, sender, message)
        data = json.dumps({"time":time_minutes, "sender": sender, "message":message, })
        for username in self.connections:
            await self.sendMessage("globalChat", data, self.connections[username].websocket)

    async def disconnect(self, username: str):
        print("websocket disconnecting: ", username)
        if self.connections[username].websocket.client_state != WebSocketState.DISCONNECTED:
            await self.connections[username].websocket.close()
        self.connections.pop(username)
        await self.msgUpdateActiveUsers()
        print("currently online: ", self.connections)

    async def removeClosedSockets(self):
        toRemove = []
        for username in self.connections.keys():
            websocket = self.connections[username].websocket
            print("client: ", websocket.client)
            print("client state: ", websocket.client_state)
            if(websocket.client_state == WebSocketState.DISCONNECTED):
                toRemove.append(username)
        for username in toRemove:
            await self.disconnect(username)
        await self.msgUpdateActiveUsers()

    async def newConnection(self, username: str, websocket: WebSocket, sessionToken:str):
        print("accepted new connection: ", username)
        if self.connections.get(username) != None and self.connections[username].sessionToken != sessionToken:
            print(f"{username} is already connected disconnecting previous session")
            await self.disconnect(username)
        new_connection:Connection = Connection(sessionToken, websocket)
        self.connections[username] = new_connection
        print("currently online: ", await self.getActiveUsers())

    async def acceptChallenge(self, challenger:str, challenged:str):
        print(f"{challenged} accepted challenge from {challenger}")
        await self.startOnlineGame(challenger, challenged)

    async def challengeUser(self, challenger: str, challenged: str):
        print(f"received challenge challenger: {challenger}, challenged: {challenged} ")
        data = json.dumps({"challenger":challenger})
        websocket = self.connections[challenged].websocket
        await self.sendMessage("challengeUser", data, websocket)

    async def startOnlineGame(self, challenger:str, challenged:str):
        print(f"Starting online game {challenger} vs {challenged}")
        gameId = await self.newGameId()
        self.games[gameId] = OnlineGame(challenger, challenged, gameId)
        await self.setStatusInGame(challenger, gameId)
        await self.setStatusInGame(challenged, gameId)
        data_challenger = await self.games[gameId].getData("challenger")
        data_challenged = await self.games[gameId].getData("challenged")
        await self.sendMessage("startOnlineGame", data_challenger, self.connections[challenger].websocket)
        await self.sendMessage("startOnlineGame", data_challenged, self.connections[challenged].websocket)
        print("TOTAL GAMES RUNNING: ", len(self.games))

    async def sendAlreadyPlaying(self, receptionnist:str, alreadyPlayingPlayer:str):
        data = json.dumps({"alreadyPlayingPlayer":alreadyPlayingPlayer})
        await self.sendMessage("alreadyPlaying", data, self.connections[receptionnist].websocket)


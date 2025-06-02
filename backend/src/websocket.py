from fastapi import WebSocket
from abc import ABC
import json
import time
import random
from typing import Optional

from fastapi.websockets import WebSocketState
from database import db
from board import Board, Pos
from game import OnlineGame

GLOBAL_CHAT_HISTORY_SIZE = 50


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
        self.activeGames:dict[int, OnlineGame] = {}

    async def fetchActiveGames(self):
        self.activeGames = db.getAllActiveGames()

    async def userIsPlaying(self, username) -> bool:
        if self.connections[username].gameId:
            print("is in game")
            return True
        print("is not in game")
        return False

    async def newGameId(self):
        gameId = None 
        while gameId == None or self.activeGames.get(gameId) != None:
            gameId = random.randint(1,5000)
        return gameId

    async def getGameId(self, username) -> Optional[int]:
        for game in self.activeGames.values():
            if game.challenged == username or game.challenger == username:
                return game.gameId
        return None

    async def setStatusInGame(self, username, gameId):
        self.connections[username].gameId = gameId

    async def setStatusFree(self, username):
        self.connections[username].gameId = 0

    async def getActiveUsers(self):
        return self.connections.keys()

    async def sendMessage(self, type: str, data:str, websocket: WebSocket):
        print(f"sending message type: {type}\ndata: {data}")
        await websocket.send_json(data={"type": type, "data": data})

    async def sendGameUpdate(self, gameId, first=False):
        print("sendGameUpdate()")
        msgType = "startOnlineGame" if first else "gameUpdate"
        challenger = self.activeGames[gameId].challenger
        challenged = self.activeGames[gameId].challenged
        data_challenger = await self.activeGames[gameId].getData(challenger)
        data_challenged = await self.activeGames[gameId].getData(challenged)
        await self.sendMessage(msgType, data_challenger, self.connections[challenger].websocket)
        await self.sendMessage(msgType, data_challenged, self.connections[challenged].websocket)

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
        self.activeGames[gameId] = OnlineGame()
        self.activeGames[gameId].newGame(challenger, challenged, gameId)
        game = self.activeGames[gameId]
        await self.setStatusInGame(challenger, gameId)
        await self.setStatusInGame(challenged, gameId)
        await self.sendGameUpdate(gameId, True)
        db.addActiveGame(game)

    async def getGameData(self, player:str):
        print("getGameData: ", player)
        gameId = await self.getGameId(player)
        if gameId == None:
            return
        data = await self.activeGames[gameId].getData(player)
        await self.sendMessage("getGameData", data, self.connections[player].websocket)

    async def sendAlreadyPlaying(self, receptionnist:str, alreadyPlayingPlayer:str):
        print("sending alreadyPlaying")
        data = json.dumps({"alreadyPlayingPlayer":alreadyPlayingPlayer})
        await self.sendMessage("alreadyPlaying", data, self.connections[receptionnist].websocket)

    async def makeMove(self, gameId:int, fromPos:Pos, toPos:Pos):
        game = self.activeGames[gameId]
        print("makeMove(): ", await game.getData(game.challenged))
        if await game.board.makeMove(fromPos, toPos):
            print("move done: ", await game.getData(game.challenged))
            await self.sendGameUpdate(gameId)

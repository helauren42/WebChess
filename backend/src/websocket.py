import json
import random
import time
from abc import ABC
from typing import Optional

from cell import Cell, Pos
from database import db
from fastapi import WebSocket
from fastapi.websockets import WebSocketState
from game import OnlineGame
from validMove import ValidateMove

VALIDATE_MOVE = ValidateMove()

GLOBAL_CHAT_HISTORY_SIZE = 50


class Connection:
    def __init__(self, _sessionToken, _websocket, _status=0) -> None:
        self.sessionToken: str = _sessionToken
        self.websocket: WebSocket = _websocket
        self.gameId: int = _status

class MatchmakerConnection:
    def __init__(self, _sessionToken:str, _websocket:WebSocket, _username:str)-> None:
        self.sessionToken: str = _sessionToken
        self.username:str = _username
        self.websocket: WebSocket = _websocket

class Matchmaker:
    def __init__(self) -> None:
        self.connections:list[MatchmakerConnection] = []
    def removeConnection(self, sessionToken:str):
        for connection in self.connections:
            if connection.sessionToken == sessionToken:
                self.connections.remove(connection)
                return
    def removeConnectionUsername(self, username:str):
        for connection in self.connections:
            if connection.sessionToken == username:
                self.connections.remove(connection)
                return

class AbstractWebsocketManager(ABC):
    def __init__(self):
        # username to connection object
        self.connections: dict[str, Connection] = {}
        # gameId to access game
        self.activeGames: dict[int, OnlineGame] = {}

    async def fetchActiveGames(self):
        self.activeGames = db.getAllActiveGames()

    async def printActiveGames(self):
        ret = []
        for game in self.activeGames.values():
            print(str(game))

    async def newGameId(self):
        gameId = None
        while gameId == None or self.activeGames.get(gameId) != None:
            gameId = random.randint(1, 5000)
        return gameId

    async def getGameId(self, username) -> Optional[int]:
        for game in self.activeGames.values():
            if game.challenged == username or game.challenger == username:
                return game.gameId
        return None

    async def userIsPlaying(self, username) -> bool:
        if self.connections[username].gameId:
            print("is in game")
            return True
        print("is not in game")
        return False

    async def getActiveUsers(self):
        return self.connections.keys()

    async def sendMessage(self, type: str, data: str, websocket: WebSocket):
        print(f"sending message type: {type}\ndata: {data}")
        await websocket.send_json(data={"type": type, "data": data})

    async def sendGameUpdate(self, gameId, first=False):
        print("sendGameUpdate()")
        msgType = "startOnlineGame" if first else "gameUpdate"
        challenger = self.activeGames[gameId].challenger
        challenged = self.activeGames[gameId].challenged
        data_challenger = await self.activeGames[gameId].getData(challenger)
        data_challenged = await self.activeGames[gameId].getData(challenged)
        await self.sendMessage(
            msgType, data_challenger, self.connections[challenger].websocket
        )
        await self.sendMessage(
            msgType, data_challenged, self.connections[challenged].websocket
        )
    async def userResign(self, gameId, username):
        game = self.activeGames.pop(gameId)
        # todo
        winner = game.challenger if game.challenger != username else game.challenged
        loser = game.challenger if game.challenger == username else game.challenged
        db.storeGameResult(gameId, winner, loser)
        db.removeActiveGame(gameId)

    async def resignOtherGames(self, player: str):
            toResign = []
            for game in self.activeGames.values():
                print("active gameId: ", game.gameId)
                print("player: ", player)
                print("challenger: ", game.challenger)
                print("challenged: ", game.challenged)
                if game.challenger == player or game.challenged == player:
                    print("removing it!")
                    toResign.append(game.gameId)
                else:
                    print("not removing this game")
            for gameId in toResign:
                await self.userResign(gameId=gameId, username=player)

    async def startOnlineGame(self, challenger: str, challenged: str):
        print(f"Starting online game {challenger} vs {challenged}")
        await self.resignOtherGames(challenger)
        await self.resignOtherGames(challenged)
        gameId = await self.newGameId()
        self.activeGames[gameId] = OnlineGame()
        self.activeGames[gameId].newGame(challenger, challenged, gameId)
        game = self.activeGames[gameId]
        await self.sendGameUpdate(gameId, True)
        db.addActiveGame(game)

class WebsocketManager(AbstractWebsocketManager):
    def __init__(self):
        super().__init__()

    async def msgUpdateActiveUsers(self):
        activeUsers: tuple = tuple(await self.getActiveUsers())
        for username in self.connections:
            usernames: list = list(activeUsers)
            usernames.remove(username)
            data = json.dumps(usernames)
            await self.sendMessage(
                "activeUsers", data, self.connections[username].websocket
            )

    async def msgGlobalChat(self, message, sender):
        # time in minutes
        time_minutes = int(time.time() / 60)
        db.addGlobalChatMessage(time_minutes, sender, message)
        data = json.dumps(
            {
                "time": time_minutes,
                "sender": sender,
                "message": message,
            }
        )
        for username in self.connections:
            await self.sendMessage(
                "globalChat", data, self.connections[username].websocket
            )

    async def disconnect(self, username: str):
        print("websocket disconnecting: ", username)
        if (
            self.connections[username].websocket.client_state
            != WebSocketState.DISCONNECTED
        ):
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
            if websocket.client_state == WebSocketState.DISCONNECTED:
                toRemove.append(username)
        for username in toRemove:
            await self.disconnect(username)
        await self.msgUpdateActiveUsers()

    async def newConnection(
        self, username: str, websocket: WebSocket, sessionToken: str
    ):
        print("accepted new connection: ", username)
        if (
            self.connections.get(username) != None
            and self.connections[username].sessionToken != sessionToken
        ):
            print(f"{username} is already connected disconnecting previous session")
            await self.disconnect(username)
        new_connection: Connection = Connection(sessionToken, websocket)
        self.connections[username] = new_connection
        print("currently online: ", await self.getActiveUsers())

    async def challengeUser(self, challenger: str, challenged: str):
        print(f"received challenge challenger: {challenger}, challenged: {challenged} ")
        data = json.dumps({"challenger": challenger})
        websocket = self.connections[challenged].websocket
        await self.sendMessage("challengeUser", data, websocket)

    async def getGameData(self, player: str):
        print("getGameData: ", player)
        gameId = await self.getGameId(player)
        print("gameId: ", gameId)
        if gameId == None:
            return
        data = await self.activeGames[gameId].getData(player)
        await self.sendMessage("getGameData", data, self.connections[player].websocket)

    async def sendAlreadyPlaying(self, receptionnist: str, alreadyPlayingPlayer: str):
        print("sending alreadyPlaying")
        data = json.dumps({"alreadyPlayingPlayer": alreadyPlayingPlayer})
        await self.sendMessage(
            "alreadyPlaying", data, self.connections[receptionnist].websocket
        )

    async def makeMove(self, gameId: int, fromPos: Pos, toPos: Pos):
        game = self.activeGames[gameId]
        print("makeMove()")
        # validate move
        oldBoard: list[list[Cell]] = game.board.board
        pieceNum = await game.board.getPiece(fromPos.x, fromPos.y)
        destPiece = await game.board.getPiece(toPos.x, toPos.y)
        print("!!!!!!!!!!")
        if await game.board.canMove(fromPos, toPos, pieceNum, destPiece, oldBoard) == False:
            print("move is not valid for piece")
            return
        await game.board.makeMove(fromPos, toPos, pieceNum) 
        newBoard: list[list[Cell]] = game.board.board
        await VALIDATE_MOVE.test(oldBoard, newBoard, game.playerTurn)
        if not VALIDATE_MOVE.valid:
            print("move not valid, new board state invalid")
            return
        print("move done: ", await game.getData(game.challenged))
        nextTurn = "black" if game.playerTurn == "white" else "white"
        game.playerTurn = nextTurn
        db.updateActiveGame(gameId, nextTurn, json.dumps(game.board.sendFormat()))
        await self.sendGameUpdate(gameId)

    


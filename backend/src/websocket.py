import json
import random
import time
from utils import logger
from abc import ABC
from typing import Optional
import copy

from cell import Cell, Pos
from fastapi import WebSocket
from fastapi.websockets import WebSocketState
from game import OnlineGame
from validMove import ValidateMove
from databaseObject import db
from pieces import createPiece, AbstractPiece
from const import CHECKMATE, DRAW, UNFINISHED

VALIDATE_MOVE = ValidateMove()

GLOBAL_CHAT_HISTORY_SIZE = 50


class Connection:
    def __init__(self, _sessionToken, _websocket, _status=0) -> None:
        self.sessionToken: str = _sessionToken
        self.websocket: WebSocket = _websocket
        self.gameId: int = _status


class MatchmakerConnection:
    def __init__(
        self, _sessionToken: str, _websocket: WebSocket, _username: str
    ) -> None:
        self.sessionToken: str = _sessionToken
        self.username: str = _username
        self.websocket: WebSocket = _websocket


class Matchmaker:
    def __init__(self) -> None:
        self.connections: list[MatchmakerConnection] = []

    def removeConnection(self, sessionToken: str):
        for connection in self.connections:
            if connection.sessionToken == sessionToken:
                self.connections.remove(connection)
                return

    def removeConnectionUsername(self, username: str):
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
        for game in self.activeGames.values():
            logger.info(f"{str(game)}")

    async def newGameId(self):
        gameId = None
        while gameId is None or self.activeGames.get(gameId) is not None:
            gameId = random.randint(1, 5000)
        return gameId

    async def getGameId(self, username) -> Optional[int]:
        for game in self.activeGames.values():
            if game.challenged == username or game.challenger == username:
                return game.gameId
        return None

    async def userIsPlaying(self, username) -> bool:
        if self.connections[username].gameId:
            logger.info("is in game")
            return True
        logger.info("is not in game")
        return False

    async def getActiveUsers(self):
        return self.connections.keys()

    async def sendMessage(self, type: str, data: str, websocket: WebSocket):
        logger.info(f"sending message type: {type}\ndata: {data}")
        await websocket.send_json(data={"type": type, "data": data})

    async def sendGameUpdate(self, gameId, first=False):
        logger.info("sendGameUpdate()")
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


class WebsocketManager(AbstractWebsocketManager):
    def __init__(self):
        super().__init__()

    # connection
    async def disconnect(self, username: str):
        logger.info(f"websocket disconnecting: {username}")
        if (
            self.connections[username].websocket.client_state
            != WebSocketState.DISCONNECTED
        ):
            await self.connections[username].websocket.close()
        self.connections.pop(username)
        await self.msgUpdateActiveUsers()
        logger.info(f"currently online: {self.connections}")

    async def removeClosedSockets(self):
        toRemove = []
        for username in self.connections.keys():
            websocket = self.connections[username].websocket
            logger.info(f"client: {websocket.client}")
            logger.info(f"client state: {websocket.client_state}")
            if websocket.client_state == WebSocketState.DISCONNECTED:
                toRemove.append(username)
        for username in toRemove:
            await self.disconnect(username)
        await self.msgUpdateActiveUsers()

    async def newConnection(
        self, username: str, websocket: WebSocket, sessionToken: str
    ):
        logger.info(f"accepted new connection: {username}")
        if (
            self.connections.get(username) is not None
            and self.connections[username].sessionToken != sessionToken
        ):
            logger.info(
                f"{username} is already connected disconnecting previous session"
            )
            await self.disconnect(username)
        new_connection: Connection = Connection(sessionToken, websocket)
        self.connections[username] = new_connection
        logger.info(f"currently online: {await self.getActiveUsers()}")

    # messages
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

    # game invitation
    async def sendAlreadyPlaying(self, receptionnist: str, alreadyPlayingPlayer: str):
        logger.info("sending alreadyPlaying")
        data = json.dumps({"alreadyPlayingPlayer": alreadyPlayingPlayer})
        await self.sendMessage(
            "alreadyPlaying", data, self.connections[receptionnist].websocket
        )

    async def challengeUser(self, challenger: str, challenged: str):
        logger.info(
            f"received challenge challenger: {challenger}, challenged: {challenged}"
        )
        data = json.dumps({"challenger": challenger})
        websocket = self.connections[challenged].websocket
        await self.sendMessage("challengeUser", data, websocket)

    # game
    async def getGameData(self, player: str):
        logger.info(f"getGameData: {player}")
        gameId = await self.getGameId(player)
        logger.info(f"gameId: {gameId}")
        if gameId is None:
            return
        data = await self.activeGames[gameId].getData(player)
        await self.sendMessage("getGameData", data, self.connections[player].websocket)

    async def makeMove(self, gameId: int, fromPos: Pos, toPos: Pos):
        game = self.activeGames[gameId]
        logger.info("makeMove()")
        # validate move
        oldBoard: list[list[Cell]] = copy.deepcopy(game.board.board)
        pieceNum = await game.board.getPiece(fromPos.x, fromPos.y)
        destPiece = await game.board.getPiece(toPos.x, toPos.y)
        logger.info("pre can move")
        if (
            await game.board.canMove(fromPos, toPos, pieceNum, destPiece, oldBoard)
            is False
        ):
            logger.info("move is not valid for piece")
            game.board.board = oldBoard
            return
        await game.board.makeMove(fromPos, toPos, pieceNum)
        newBoard: list[list[Cell]] = game.board.board
        if not await VALIDATE_MOVE.isValidMove(oldBoard, newBoard, game.playerTurn):
            logger.info("move not valid, new board state invalid")
            game.board.board = oldBoard
            return
        # note if king or rook has moved in case of future castling
        game.board.updateHasMoved(pieceNum.value, fromPos)
        logger.info("pre update capture")
        if destPiece.name != "EMPTY":
            game.updateCaptured(destPiece.value)
        logger.info(f"move done: {await game.getData(game.challenged)}")
        game.playerTurn = "black" if game.playerTurn == "white" else "white"
        await self.sendGameUpdate(gameId)
        state = await VALIDATE_MOVE.isFinished(
            game.board.board, game.board.board, game.playerTurn, game
        )
        if state == CHECKMATE:
            (winner, loser) = game.findWinnerLoserNamesForOpponentWin()
            await self.finishGame(game.gameId, winner, loser, False)
        elif state == DRAW:
            (winner, loser) = game.findWinnerLoserNamesForOpponentWin()
            await self.finishGame(game.gameId, winner, loser, True)
        else:
            db.updateActiveGame(
                gameId, game.playerTurn, json.dumps(game.board.sendFormat())
            )

    async def makeCastling(self, gameId: int, kingPos: Pos, rookPos: Pos):
        game = self.activeGames[gameId]
        if game.board.checkHasMoved(
            "wk" if game.playerTurn == "white" else "bk", kingPos
        ):
            logger.info("King has moved")
            return
        if game.board.checkHasMoved(
            "wr" if game.playerTurn == "white" else "br", rookPos
        ):
            logger.info("Rook has moved")
            return
        logger.info("king and rook have not moved")
        logger.info("makeCastling()")
        oldBoard: list[list[Cell]] = copy.deepcopy(game.board.board)
        kingPieceNum = await game.board.getPiece(kingPos.x, kingPos.y)
        rookPieceNum = await game.board.getPiece(rookPos.x, rookPos.y)
        king: AbstractPiece = await createPiece(
            kingPieceNum, Cell(kingPos.x, kingPos.y, kingPieceNum)
        )
        rook: AbstractPiece = await createPiece(
            rookPieceNum, Cell(rookPos.x, rookPos.y, rookPieceNum)
        )
        logger.info("pre can castle")
        if not await VALIDATE_MOVE.testCastle(king, rook, oldBoard, game):
            logger.info("move not valid, new board state invalid")
            game.board.board = oldBoard
            return
        game.board.board = oldBoard
        await game.board.makeCastle(kingPos, rookPos, king, rook)
        logger.info(f"move done: {await game.getData(game.challenged)}")
        game.playerTurn = "black" if game.playerTurn == "white" else "white"
        state = await VALIDATE_MOVE.isFinished(
            game.board.board, game.board.board, game.playerTurn, game
        )
        await self.sendGameUpdate(gameId)
        if state == CHECKMATE:
            (winner, loser) = game.findWinnerLoserNamesForOpponentWin()
            await self.finishGame(game.gameId, winner, loser, False)
        elif state == DRAW:
            (winner, loser) = game.findWinnerLoserNamesForOpponentWin()
            await self.finishGame(game.gameId, winner, loser, True)
        else:
            db.updateActiveGame(
                gameId, game.playerTurn, json.dumps(game.board.sendFormat())
            )

    async def finishGame(self, gameId, winner, loser, draw=False):
        logger.info(f"finishing game, winner: {winner}, loser: {loser}, draw: {draw}")
        db.storeGameResult(gameId, winner, loser, draw)
        db.removeActiveGame(gameId)
        self.activeGames[gameId].setGameFinished(winner, draw)
        await self.sendGameUpdate(gameId)
        self.activeGames.pop(gameId)

    async def userResign(self, gameId, username):
        game = self.activeGames[gameId]
        winner = game.challenger if game.challenger != username else game.challenged
        loser = game.challenger if game.challenger == username else game.challenged
        await self.finishGame(gameId, winner, loser)

    async def resignOtherGames(self, player: str):
        toResign = []
        for game in self.activeGames.values():
            logger.info(
                f"active gameId: {game.gameId}, challenger: {game.challenger}, challenged: {game.challenged}"
            )
            if game.challenger == player or game.challenged == player:
                logger.info("removing it!")
                toResign.append(game.gameId)
            else:
                logger.info("not removing this game")
        for gameId in toResign:
            await self.userResign(gameId=gameId, username=player)

    async def startOnlineGame(self, challenger: str, challenged: str):
        logger.info(f"Starting online game {challenger} vs {challenged}")
        await self.resignOtherGames(challenger)
        await self.resignOtherGames(challenged)
        gameId = await self.newGameId()
        self.activeGames[gameId] = OnlineGame()
        self.activeGames[gameId].newGame(challenger, challenged, gameId)
        game = self.activeGames[gameId]
        await self.sendGameUpdate(gameId, True)
        db.addActiveGame(game)


websocketManager = WebsocketManager()

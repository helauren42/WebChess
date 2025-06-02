import json
import random
from board import Board

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
        self.capturedWhitePieces:list[str] = []
        self.capturedBlackPieces:list[str] = []
        self.finished:bool = False

    async def getData(self, player) -> str:
        data = json.dumps({
            "gameId": self.gameId,
            "challenger":self.challenger,
            "challenged":self.challenged,
            "playerColor": self.challenged_color if player == self.challenged else self.challenger_color,
            "playerTurn":self.playerTurn,
            "capturedWhitePieces": self.capturedWhitePieces,
            "capturedBlackPieces": self.capturedBlackPieces,
            "board":self.board.sendFormat()
        })
        return data
    def getSqlValue(self) -> tuple:
        return (
            self.gameId,
            self.challenger,
            self.challenged,
            self.challenger_color,
            self.challenged_color,
            self.playerTurn,
            json.dumps(self.capturedWhitePieces),
            json.dumps(self.capturedBlackPieces),
            json.dumps(self.board.sendFormat()),
        )


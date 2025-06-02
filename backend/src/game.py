import json
import random
from board import Board

WHITE = "white"
BLACK = "black"

class OnlineGame():
    def parseGame(self, game:tuple):
        _gameId, _challenger, _challenged, _challengerColor, _challengedColor, _playerTurn, _capturedWhitePieces, _capturedBlackPieces, _boardStr = game
        board = Board(_boardStr)
        self.gameId = _gameId
        self.challenger = _challenger
        self.challenged = _challenged
        self.challengerColor = _challengerColor
        self.challengedColor = _challengedColor
        self.playerTurn = _playerTurn
        self.capturedWhitePieces = _capturedWhitePieces
        self.capturedBlackPieces = _capturedBlackPieces
        self.boardStr = _boardStr
    def newGame(self, _challenger, _challenged, _gameId) -> None:
        self.gameId = _gameId
        self.challenger:str = _challenger
        self.challenged:str = _challenged
        self.challengerColor:str = random.choice([WHITE, BLACK])
        self.challengedColor:str =  BLACK if self.challengerColor == WHITE else WHITE
        self.playerTurn:str = WHITE
        self.capturedWhitePieces:list[str] = []
        self.capturedBlackPieces:list[str] = []
        self.board:Board = Board()
        self.finished:bool = False

    async def getData(self, player) -> str:
        data = json.dumps({
            "gameId": self.gameId,
            "challenger":self.challenger,
            "challenged":self.challenged,
            "playerColor": self.challengedColor if player == self.challenged else self.challengerColor,
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
            self.challengerColor,
            self.challengedColor,
            self.playerTurn,
            json.dumps(self.capturedWhitePieces),
            json.dumps(self.capturedBlackPieces),
            json.dumps(self.board.sendFormat()),
        )


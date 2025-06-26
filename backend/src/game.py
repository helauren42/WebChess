import json
from utils import logger
import random

from board import Board
from const import BLACK, WHITE


class OnlineGame:
    def __str__(self) -> str:
        return (
            f"{self.gameId}: {self.challenger} vs {self.challenged}\n"
            + f"playerTurn: {self.playerTurn}\n"
            + f"board:\n{self.board}"
        )

    def updateCaptured(self, captured: str):
        if self.playerTurn == WHITE:
            self.capturedBlackPieces.append(captured)
        elif self.playerTurn == BLACK:
            self.capturedWhitePieces.append(captured)

    def parseGame(self, game: tuple):
        (
            mscId,
            _gameId,
            _challenger,
            _challenged,
            _challengerColor,
            _challengedColor,
            _playerTurn,
            _capturedWhitePieces,
            _capturedBlackPieces,
            _boardStr,
        ) = game
        self.gameId: int = _gameId
        self.challenger: str = _challenger
        self.challenged: str = _challenged
        self.challengerColor: str = _challengerColor
        self.challengedColor: str = _challengedColor
        self.playerTurn: str = _playerTurn
        self.capturedWhitePieces: list[str] = json.loads(_capturedWhitePieces)
        self.capturedBlackPieces: list[str] = json.loads(_capturedBlackPieces)
        logger.info(f"ParseGame captured: {_boardStr}")
        self.board: Board = Board(_boardStr)
        self.finished: bool = False
        # winner is empty string in case of draw
        self.winner: str = ""

    def newGame(self, _challenger, _challenged, _gameId) -> None:
        self.gameId: int = _gameId
        self.challenger: str = _challenger
        self.challenged: str = _challenged
        self.challengerColor: str = random.choice([WHITE, BLACK])
        self.challengedColor: str = BLACK if self.challengerColor == WHITE else WHITE
        self.playerTurn: str = WHITE
        self.capturedWhitePieces: list[str] = []
        self.capturedBlackPieces: list[str] = []
        self.board: Board = Board()
        self.finished: bool = False
        self.winner: str = ""

    async def getData(self, player) -> str:
        data = json.dumps(
            {
                "gameId": self.gameId,
                "challenger": self.challenger,
                "challenged": self.challenged,
                "playerColor": (
                    self.challengedColor
                    if player == self.challenged
                    else self.challengerColor
                ),
                "playerTurn": self.playerTurn,
                "capturedWhitePieces": self.capturedWhitePieces,
                "capturedBlackPieces": self.capturedBlackPieces,
                "board": self.board.sendFormat(),
                "finished": self.finished,
                "winner": self.winner,
            }
        )
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

    def setGameFinished(self, winner):
        self.finished = True
        self.winner = winner

import json
from utils import logger
import random

from board import Board
from const import BLACK, EMPTY, WHITE


class OnlineGame:
    def __str__(self) -> str:
        return (
            f"{self.gameId}: {self.challenger} vs {self.challenged}\n"
            + f"playerTurn: {self.playerTurn}\n"
            + f"board:\n{self.board}"
        )

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
        self.capturedWhitePieces: list[str] = _capturedWhitePieces
        self.capturedBlackPieces: list[str] = _capturedBlackPieces
        logger.info(f"ParseGame board_str: {_boardStr}")
        self.board: Board = Board(_boardStr)
        self.finished: bool = False

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

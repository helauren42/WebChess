from utils import logger
from abc import ABC
from enum import Enum
from typing import Optional

from cell import Cell, Pos
from const import BLACK, EMPTY, STR_TO_PIECES, WHITE, Piecenum
from pieces import AbstractPiece, createPiece


class ValidateMove:
    def __init__(self) -> None:
        pass

    async def test(
        self,
        _oldBoard: list[list[Cell]],
        _newBoard: list[list[Cell]],
        _playerColor: str,
    ) -> None:
        # opponent is analyzed for immobility and checkmate after current player makes move as those two would signal end of game
        # for player we only look at conditions that could invalidate his move like if after move he still in check
        # so before make move we look at conditions invalidating move and after make move we check for end game
        self.oldBoard: list[list[Cell]] = _oldBoard
        self.newBoard: list[list[Cell]] = _newBoard
        self.playerColor: str = _playerColor
        self.opponentColor: str = BLACK if _playerColor == WHITE else WHITE
        self.kingPos: Pos = await self.getKingPos()
        self.playerInCheck: bool = await self.isPlayerInCheck()
        self.opponentIsCheckMate: bool = False
        self.opponentIsImmobilized: bool = False
        self.valid: bool = True if not self.playerInCheck else False

    async def getKingPos(self) -> Pos:
        kingPiecenum = (
            Piecenum.WHITE_KING if self.playerColor == WHITE else Piecenum.BLACK_KING
        )
        for y in range(8):
            for x in range(8):
                if kingPiecenum == self.newBoard[y][x].piece:
                    return Pos({"x": x, "y": y})
        return Pos({"x": 0, "y": 0})

    async def isPlayerInCheck(self):
        logger.info("isPlayerInCheck()")
        for y in range(8):
            for x in range(8):
                cell: Cell = self.newBoard[y][x]
                if cell.color == self.opponentColor:
                    piece: AbstractPiece = await createPiece(cell.piece, cell)
                    logger.info(f"kingPos: {self.kingPos}")
                    logger.info(f"type(kingPos): {type(self.kingPos)}")
                    if await piece.canMove(self.kingPos, STR_TO_PIECES["wk"], self.oldBoard):
                        logger.info(f"player is being checked by {piece.type} {piece.cell}")
                        return True
        logger.info("player is not checked, player is free to move")
        return False

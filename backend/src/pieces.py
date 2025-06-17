from abc import ABC
from typing import Any
from cell import Cell, Pos
from const import BLACK, EMPTY, WHITE, Piecenum
from typing import Optional

class AbstractPiece(ABC):
    def __init__(self, _cell: Cell) -> None:
        super().__init__()
        self.cell = _cell
        self.type = self.cell.piece.value
        self.validNormalAbsolutVectors: list[tuple] = []
        self.validDirectionVectors: list[tuple] = []

    async def canMove(self, destPos:Pos) -> bool:
        print("can move received destPos: ", destPos)
        currPos = self.cell.getPos()
        moveVector = currPos.getMove(destPos)
        print("moveVector: ", moveVector)
        print("validDirectionVectors", self.validDirectionVectors)
        print("validNormalAbsoluteVectors", self.validNormalAbsolutVectors)
        for vector in self.validDirectionVectors:
            if moveVector.isEqual(vector[0], vector[1]):
                return True
        if len(self.validNormalAbsolutVectors) == 0 or not (
            moveVector.x == moveVector.y
            or moveVector.x == - moveVector.y
            or (moveVector.x == 0 and moveVector.y)
            or (moveVector.x and moveVector.y == 0)
        ):
            return False
        moveVector.normalizeAndAbs()
        print("moveVectorNormAbs: ", moveVector)
        for vector in self.validNormalAbsolutVectors:
            if moveVector.isEqual(vector[0], vector[1]):
                return True
        print("no vector match found")
        return False


class Empty(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)


class Pawn(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        if self.cell.color == WHITE and self.cell.y == 1:
            self.validDirectionVectors = [(0, 1), (0, 2)]
        elif self.cell.color == WHITE:
            self.validDirectionVectors = [(0, 1)]
        elif self.cell.color == BLACK and self.cell.y == 6:
            self.validDirectionVectors = [(0, -1), (0, -2)]
        elif self.cell.color == BLACK:
            self.validDirectionVectors = [(0, -1)]


class Rook(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validNormalAbsolutVectors = [(0, 1), (1, 0)]


class Bishop(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validNormalAbsolutVectors = [(1, 1)]


class Queen(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validNormalAbsolutVectors = [(1, 1), (0, 1), (1, 0)]


class Knight(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validDirectionVectors = [
            (2, 1),
            (1, 2),
            (-1, 2),
            (-2, 1),
            (-2, -1),
            (-1, -2),
            (1, -2),
            (2, -1),
        ]


class King(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validDirectionVectors = [
            (0, 1),
            (1, 0),
            (0, -1),
            (-1, 0),
            (1, 1),
            (-1, -1),
            (1, -1),
            (-1, 1),
        ]

async def createPiece(pieceNum:Piecenum, cell: Cell) -> AbstractPiece:
    if Piecenum.EMPTY == pieceNum:
        return Empty(cell)
    if Piecenum.WHITE_PAWN == pieceNum:
        return Pawn(cell)
    if Piecenum.WHITE_KNIGHT == pieceNum:
        return Knight(cell)
    if Piecenum.WHITE_BISHOP == pieceNum:
        return Bishop(cell)
    if Piecenum.WHITE_ROOK == pieceNum:
        return Rook(cell)
    if Piecenum.WHITE_QUEEN == pieceNum:
        return Queen(cell)
    if Piecenum.WHITE_KING == pieceNum:
        return King(cell)
    if Piecenum.BLACK_PAWN == pieceNum:
        return Pawn(cell)
    if Piecenum.BLACK_KNIGHT == pieceNum:
        return Knight(cell)
    if Piecenum.BLACK_BISHOP == pieceNum:
        return Bishop(cell)
    if Piecenum.BLACK_ROOK == pieceNum:
        return Rook(cell)
    if Piecenum.BLACK_QUEEN == pieceNum:
        return Queen(cell)
    if Piecenum.BLACK_KING == pieceNum:
        return King(cell)
    return Empty(cell)

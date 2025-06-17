from abc import ABC, abstractmethod
from typing import Any
from cell import Cell, Pos
from const import BLACK, EMPTY, WHITE, Piecenum
from typing import Optional

class AbstractPiece(ABC):
    def __init__(self, _cell: Cell) -> None:
        super().__init__()
        self.cell = _cell
        self.currPos = self.cell.getPos()
        self.type = self.cell.piece.value
        self.validNormalAbsolutVectors: list[tuple] = []
        self.validDirectionVectors: list[tuple] = []
        self.vectorMove: Optional[Pos] = None
        self.utilizedVector: Optional[Pos] = None

    async def validVectorMove(self, destPos:Pos) -> bool:
        moveVector = self.currPos.getMove(destPos)
        self.vectorMove = moveVector
        print("moveVector: ", moveVector)
        print("validDirectionVectors", self.validDirectionVectors)
        print("validNormalAbsoluteVectors", self.validNormalAbsolutVectors)
        for vector in self.validDirectionVectors:
            if moveVector.isEqual(vector[0], vector[1]):
                self.utilizedVector = Pos({"x": vector[0], "y": vector[1]})
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
                self.utilizedVector = Pos({"x": vector[0], "y": vector[1]})
                return True
        print("no vector match found")
        return False

    async def canTravel(self, destPos:Pos, destPiece:Piecenum, board:list[list[Cell]]) -> bool:
        if self.utilizedVector == None:
            return False
        pos:Pos = self.currPos
        while True:
            pos = pos + self.utilizedVector
            if pos.isEqual(destPos.x, destPos.y):
                break
            if board[destPos.y][destPos.x].piece.name != "EMPTY":
                return False
        return True

    async def canMove(self, destPos:Pos, destPiece:Piecenum, board:list[list[Cell]]) -> bool:
        print("can move received destPos: ", destPos)
        if await self.validVectorMove(destPos) == False:
            print("move is not a valid vector")
            return False
        if await self.canTravel(destPos, destPiece, board) == False:
            print("can not travel")
            return False
        return True

class Empty(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)

    async def canTravel(self,destPos:Pos, destPiece:Piecenum, board:list[list[Cell]]) -> bool:
        return False

class Pawn(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        if self.cell.color == WHITE and self.cell.y == 1:
            self.validDirectionVectors = [(0, 1), (0, 2), (-1,1), (1,1)]
        elif self.cell.color == WHITE:
            self.validDirectionVectors = [(0, 1), (-1,1), (1,1)]
        elif self.cell.color == BLACK and self.cell.y == 6:
            self.validDirectionVectors = [(0, -1), (0, -2), (-1,-1), (1,-1)]
        elif self.cell.color == BLACK:
            self.validDirectionVectors = [(0, -1), (-1,-1), (1,-1)]

    async def canTravel(self, destPos:Pos, destPiece:Piecenum, board:list[list[Cell]]) -> bool:
        print("dest piece name: ", destPiece.name)
        if self.vectorMove != None and self.vectorMove.x and self.vectorMove.y and destPiece.name != "EMPTY":
            return True
        elif self.vectorMove != None and self.vectorMove.x == 0 and destPiece.name == "EMPTY":
            return True
        return False

class Rook(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validNormalAbsolutVectors = [(0, 1), (1, 0)]
        self.canJump = False

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
            (1, 2),
            (2, 1),
            (-1, 2),
            (-2, 1),
            (1, -2),
            (2, -1),
            (-1, -2),
            (-2, -1)
        ]

    async def canTravel(self, destPos:Pos, destPiece:Piecenum, board:list[list[Cell]]) -> bool:
        return True

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

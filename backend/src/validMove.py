from enum import Enum
from const import WHITE, BLACK, EMPTY, Piecenum
from abc import ABC
from cell import Cell, Pos

class AbstractPiece(ABC):
    def __init__(self, _cell:Cell) -> None:
        super().__init__()
        self.cell = _cell
        self.validNormalVectors:list[tuple] = []
        self.validDirectionVectors:list[tuple] = []
    def canMove(self, destPos: Pos) -> bool:
        currPos = self.cell.getPos()
        moveVector = currPos.getMove(destPos)
        for vector in self.validDirectionVectors:
            if moveVector.isEqual(vector[0], vector[1]):
                return True
        if len(self.validNormalVectors) == 0 or not (moveVector.x == moveVector.y or moveVector.x == 0 and moveVector.y or moveVector.x and moveVector.y == 0):
            return False
        moveVector.normalize()
        for vector in self.validNormalVectors:
            if moveVector.isEqual(vector[0], vector[1]):
                return True
        return False

class Empty(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
class Pawn(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        if self.cell.color == WHITE and self.cell.y == 1:
            self.validDirectionVectors = [(0,1), (0,2)]
        elif self.cell.color == WHITE:
            self.validDirectionVectors = [(0,1)]
        elif self.cell.color == BLACK and self.cell.y == 6:
            self.validDirectionVectors = [(0,-1), (0,-2)]
        elif self.cell.color == BLACK:
            self.validDirectionVectors = [(0,-1)]

class Rook(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validNormalVectors = [(0, 1), (1, 0)]
class Bishop(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validNormalVectors = [(1, 1)]
class Queen(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validNormalVectors = [(1, 1), (0, 1), (1, 0)]
class Knight(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validDirectionVectors = [
            (2, 1), (1, 2), (-1, 2), (-2, 1),
            (-2, -1), (-1, -2), (1, -2), (2, -1)
        ]
class King(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validDirectionVectors = [
            (0, 1), (1, 0), (0, -1), (-1, 0),
            (1, 1), (-1, -1), (1, -1), (-1, 1)
        ]

class ValidateMove():
    def __init__(self, _oldBoard:list[list[Cell]], _newBoard:list[list[Cell]], _playerColor:str) -> None:
        # opponent is analyzed for immobility and checkmate after current player makes move as those two would signal end of game
        # for player we only look at conditions that could invalidate his move like if after move he still in check
        # so before make move we look at conditions invalidating move and after make move we check for end game
        self.oldBoard:list[list[Cell]] = _oldBoard
        self.newBoard:list[list[Cell]] = _newBoard
        self.playerColor:str = _playerColor
        self.opponentColor:str = BLACK if _playerColor == WHITE else WHITE
        self.kingPos = self.getKingPos()
        self.playerInCheck:bool = self.isPlayerInCheck()
        self.opponentIsCheckMate:bool = False
        self.opponentIsImmobilized:bool = False
    def createPiece(self, piece_type: Piecenum, cell: Cell) -> AbstractPiece:
        piece_map = {
            Piecenum.EMPTY: Empty,
            Piecenum.WHITE_PAWN: Pawn,
            Piecenum.WHITE_KNIGHT: Knight,
            Piecenum.WHITE_BISHOP: Bishop,
            Piecenum.WHITE_ROOK: Rook,
            Piecenum.WHITE_QUEEN: Queen,
            Piecenum.WHITE_KING: King,
            Piecenum.BLACK_PAWN: Pawn,
            Piecenum.BLACK_KNIGHT: Knight,
            Piecenum.BLACK_BISHOP: Bishop,
            Piecenum.BLACK_ROOK: Rook,
            Piecenum.BLACK_QUEEN: Queen,
            Piecenum.BLACK_KING: King
        }
        return piece_map[piece_type](cell)
    def getKingPos(self)->Pos:
        kingPiecenum = Piecenum.WHITE_KING if self.playerColor == WHITE else Piecenum.BLACK_KING
        for y in range(8):
            for x in range(8):
                if kingPiecenum == self.newBoard[y][x].piece:
                    return Pos({"x": x, "y":y})
        return Pos({"x": 0, "y": 0})

    def isPlayerInCheck(self):
        for y in range(8):
            for x in range(8):
                cell:Cell = self.newBoard[y][x]
                print(cell)
                print(cell.color)
                print(self.opponentColor)
                if cell.color == self.opponentColor:
                    piece:AbstractPiece = self.createPiece(cell.piece, cell)
                    if piece.canMove(self.kingPos):
                        return True
        return False


import pydantic
from enum import Enum
from abc import ABC
from typing import Optional
import json

class Pieces(Enum):
    EMPTY = ""
    WHITE_PAWN = "wp"
    WHITE_KNIGHT = "wn"
    WHITE_BISHOP = "wb"
    WHITE_ROOK = "wr"
    WHITE_QUEEN = "wq"
    WHITE_KING = "wk"
    BLACK_PAWN = "bp"
    BLACK_KNIGHT = "bn"
    BLACK_BISHOP = "bb"
    BLACK_ROOK = "br"
    BLACK_QUEEN = "bq"
    BLACK_KING = "bk"

STR_TO_PIECES = {
    "" : Pieces.EMPTY,
    "wp" : Pieces.WHITE_PAWN,
    "wn" : Pieces.WHITE_KNIGHT,
    "wb" : Pieces.WHITE_BISHOP,
    "wr" : Pieces.WHITE_ROOK,
    "wq" : Pieces.WHITE_QUEEN,
    "wk" : Pieces.WHITE_KING,
    "bp" : Pieces.BLACK_PAWN,
    "bn" : Pieces.BLACK_KNIGHT,
    "bb" : Pieces.BLACK_BISHOP,
    "br" : Pieces.BLACK_ROOK,
    "bq" : Pieces.BLACK_QUEEN,
    "bk" : Pieces.BLACK_KING
}

class Pos():
    def __init__(self, _pos:dict[str,int]) -> None:
        self.x: int = int(_pos["x"])
        self.y: int = int(_pos["y"])

    def __add__(self, rhs:"Pos") -> "Pos":
        return Pos({"x": self.x + rhs.x, "y": self.y + rhs.y })

    def __sub__(self, rhs:"Pos") -> "Pos":
        return Pos({"x": self.x - rhs.x, "y": self.y - rhs.y })

    def getMove(self, rhs:"Pos") -> "Pos":
        return Pos({"x": rhs.x - self.x, "y": rhs.y - self.y })

    def __str__(self) -> str:
        return f"x: {self.x}, y: {self.y}"

class Cell():
    def __init__(self, posX:int, posY:int, _piece: Pieces) -> None:
        self.x: int = posX
        self.y: int = posY
        self.piece: Pieces = _piece
    def __str__(self) -> str:
        return str(self.piece.value)

class AbstractBoard(ABC):
    def __init__(self)->None:
        self.board:list[list[Cell]] = self.initialize_board()

    def initialize_board(self)->list[list[Cell]]:
        board = []
        white_pieces = [
            Pieces.WHITE_ROOK, Pieces.WHITE_KNIGHT, Pieces.WHITE_BISHOP,
            Pieces.WHITE_QUEEN, Pieces.WHITE_KING,
            Pieces.WHITE_BISHOP, Pieces.WHITE_KNIGHT, Pieces.WHITE_ROOK
        ]
        black_pieces = [
            Pieces.BLACK_ROOK, Pieces.BLACK_KNIGHT, Pieces.BLACK_BISHOP,
            Pieces.BLACK_QUEEN, Pieces.BLACK_KING,
            Pieces.BLACK_BISHOP, Pieces.BLACK_KNIGHT, Pieces.BLACK_ROOK
        ]
        for y in range(8):
            row = []
            for x in range(8):
                piece = Pieces.EMPTY
                # Pawns
                if y == 1:
                    piece = Pieces.WHITE_PAWN
                elif y == 6:
                    piece = Pieces.BLACK_PAWN
                # Major pieces
                elif y == 0:
                    piece = white_pieces[x]
                elif y == 7:
                    piece = black_pieces[x]
                row.append(Cell(x, y, piece))
            board.append(row)
        return board

    async def getPiece(self, x:int, y:int)->Pieces:
        print("get piece x: ", x)
        print("get piece y: ", y)
        piece = self.board[y][x].piece
        print("got piece: ", piece)
        return piece

    async def emptyPos(self, pos:Pos):
        self.board[pos.y][pos.x].piece = Pieces.EMPTY

    async def assignPos(self, pos:Pos, piece:Pieces):
        print(f"pre assign pos x: {pos.x}, y: {pos.y}: ", self.board[pos.y][pos.x].piece)
        self.board[pos.y][pos.x].piece = piece
        print(f"post assign pos x: {pos.x}, y: {pos.y}: ", self.board[pos.y][pos.x].piece)

class Board(AbstractBoard):
    def __init__(self, boardStr:Optional[str]=None) -> None:
        self.board:list[list[Cell]] = []
        super().__init__()
        if boardStr != None:
            print("boardStr: ", boardStr)
            list_board = json.loads(boardStr)
            for y in range(8):
                row:list[Pieces] = []
                for x in range(8):
                    row.append(STR_TO_PIECES[list_board[y][x]])
                list_board.append(row)

    def sendFormat(self)->list[list[str]]:
        ret = []
        print("self.board: ", self.board)
        for y in range(8):
            row = []
            for x in range(8):
                row.append(self.board[y][x].piece.value)
            ret.append(row)
        return ret
        
    async def makeMove(self, fromPos:Pos, toPos:Pos)-> bool:
        print(fromPos)
        print(toPos)
        fromPiece = await self.getPiece(fromPos.x, fromPos.y)
        print("from piece: ", fromPiece.value)
        await self.emptyPos(fromPos)
        await self.assignPos(toPos, fromPiece)
        return True

if __name__ == "__main__":
    board = Board()
    print(board)

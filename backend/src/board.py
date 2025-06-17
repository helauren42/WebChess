import pydantic
from enum import Enum
from abc import ABC
from typing import Optional
import json

from const import Piecenum, STR_TO_PIECES, PIECES_TO_STR
from cell import Cell, Pos
from pieces import createPiece, AbstractPiece

class AbstractBoard(ABC):
    def __init__(self)->None:
        self.board:list[list[Cell]] = self.initialize_board()

    def initialize_board(self)->list[list[Cell]]:
        board = []
        white_pieces = [
            Piecenum.WHITE_ROOK, Piecenum.WHITE_KNIGHT, Piecenum.WHITE_BISHOP,
            Piecenum.WHITE_QUEEN, Piecenum.WHITE_KING,
            Piecenum.WHITE_BISHOP, Piecenum.WHITE_KNIGHT, Piecenum.WHITE_ROOK
        ]
        black_pieces = [
            Piecenum.BLACK_ROOK, Piecenum.BLACK_KNIGHT, Piecenum.BLACK_BISHOP,
            Piecenum.BLACK_QUEEN, Piecenum.BLACK_KING,
            Piecenum.BLACK_BISHOP, Piecenum.BLACK_KNIGHT, Piecenum.BLACK_ROOK
        ]
        for y in range(8):
            row = []
            for x in range(8):
                piece = Piecenum.EMPTY
                # Pawns
                if y == 1:
                    piece = Piecenum.WHITE_PAWN
                elif y == 6:
                    piece = Piecenum.BLACK_PAWN
                # Major pieces
                elif y == 0:
                    piece = white_pieces[x]
                elif y == 7:
                    piece = black_pieces[x]
                row.append(Cell(x, y, piece))
            board.append(row)
        return board

    async def getPiece(self, x:int, y:int)->Piecenum:
        print("get piece x: ", x)
        print("get piece y: ", y)
        piece = self.board[y][x].piece
        print("got piece: ", piece)
        return piece

    async def emptyPos(self, pos:Pos):
        self.board[pos.y][pos.x].piece = Piecenum.EMPTY

    async def assignPos(self, pos:Pos, piece:Piecenum):
        print(f"pre assign pos x: {pos.x}, y: {pos.y}: ", self.board[pos.y][pos.x].piece)
        self.board[pos.y][pos.x].changePiece(piece)
        print(f"post assign pos x: {pos.x}, y: {pos.y}: ", self.board[pos.y][pos.x].piece)

class Board(AbstractBoard):
    def __init__(self, boardStr:Optional[str]=None) -> None:
        super().__init__()
        if boardStr != None:
            self.board:list[list[Cell]] = []
            list_board = json.loads(boardStr)
            for y in range(8):
                row:list[Cell] = []
                for x in range(8):
                    piece:Piecenum = STR_TO_PIECES[list_board[y][x]]
                    row.append(Cell(x, y, piece))
                self.board.append(row)
    def __str__(self) -> str:
        ret = ""
        for y in range(8):
            line = ""
            for x in range(8):
                piece = self.board[y][x].piece
                elem = f"'{PIECES_TO_STR[piece]}' "
                line += elem
                if x == 7:
                    line += "\n"
            ret += line
        return ret

    def sendFormat(self)->list[list[str]]:
        ret = []
        for y in range(8):
            row = []
            for x in range(8):
                row.append(self.board[y][x].piece.value)
            ret.append(row)
        return ret

    async def canMove(self, fromPos:Pos, toPos:Pos, pieceNum:Piecenum, destPiece:Piecenum, board:list[list[Cell]]):
        cell = Cell(fromPos.x, fromPos.y, pieceNum)
        print("making move with piece: ", pieceNum.value)
        objectPiece:AbstractPiece = await createPiece(pieceNum, cell)
        return await objectPiece.canMove(toPos, destPiece, board)
    async def makeMove(self, fromPos:Pos, toPos:Pos, pieceNum):
        await self.emptyPos(fromPos)
        await self.assignPos(toPos, pieceNum)

if __name__ == "__main__":
    board = Board()
    print(board)

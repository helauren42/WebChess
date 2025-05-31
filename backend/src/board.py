import pydantic
from enum import Enum

class Pieces(Enum):
    EMPTY = 0
    WHITE_PAWN = 1
    WHITE_KNIGHT = 2
    WHITE_BISHOP = 3
    WHITE_ROOK = 4
    WHITE_QUEEN = 5
    WHITE_KING = 6
    BLACK_PAWN = 7
    BLACK_KNIGHT = 8
    BLACK_BISHOP = 9
    BLACK_ROOK = 10
    BLACK_QUEEN = 11
    BLACK_KING = 12

class Cell():
    def __init__(self, posX:int, posY:int, _piece: Pieces) -> None:
        self.x: int = posX
        self.y: int = posY
        self.piece: Pieces = _piece
    def __str__(self) -> str:
        return str(self.piece)

class Board():
    def __init__(self)->None:
        self.board = self.initialize_board()
    def initialize_board(self):
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

    def __str__(self) -> str:
        ret = ""
        for row in self.board:
            for x in range(8):
                cell:Cell = row[x]
                ret += cell.__str__() + ';'
            ret += '\n'
        return ret

if __name__ == "__main__":
    board = Board()
    print(board)

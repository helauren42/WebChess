import pydantic
from enum import Enum

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

class Cell():
    def __init__(self, posX:int, posY:int, _piece: Pieces) -> None:
        self.x: int = posX
        self.y: int = posY
        self.piece: Pieces = _piece
    def __str__(self) -> str:
        return str(self.piece.value)

class Board():
    def __init__(self)->None:
        self.board = self.initialize_board()
    def __str__(self) -> str:
        ret = ""
        for row in self.board:
            for x in range(8):
                cell:Cell = row[x]
                ret += cell.__str__() + ';'
            ret += '\n'
        return ret

    def sendFormat(self)->list[list[str]]:
      ret = []
      for y in range(8):
        row = []
        for x in range(8):
          row.append(self.board[y][x].piece.value)
        ret.append(row)
      return ret
        
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

if __name__ == "__main__":
    board = Board()
    print(board)

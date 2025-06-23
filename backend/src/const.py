from enum import Enum
import os

DB_PORT = 3306

HOST = "0.0.0.0"
PORT = 6453
ORG_NPMSTART = "http://localhost:3000"
ORG_LOCAL = "http://localhost:6453"

CWD = os.getcwd()
ENV_PATH = os.path.abspath(os.path.join(CWD, "../../.env"))
DB_DIR =  os.path.join(os.path.dirname(CWD), "database/")

WHITE = "white"
BLACK = "black"
EMPTY = "empty"

class Piecenum(Enum):
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
    "" : Piecenum.EMPTY,
    "wp" : Piecenum.WHITE_PAWN,
    "wn" : Piecenum.WHITE_KNIGHT,
    "wb" : Piecenum.WHITE_BISHOP,
    "wr" : Piecenum.WHITE_ROOK,
    "wq" : Piecenum.WHITE_QUEEN,
    "wk" : Piecenum.WHITE_KING,
    "bp" : Piecenum.BLACK_PAWN,
    "bn" : Piecenum.BLACK_KNIGHT,
    "bb" : Piecenum.BLACK_BISHOP,
    "br" : Piecenum.BLACK_ROOK,
    "bq" : Piecenum.BLACK_QUEEN,
    "bk" : Piecenum.BLACK_KING
}

PIECES_TO_STR = {
    Piecenum.EMPTY : "  ",
    Piecenum.WHITE_PAWN : "wp",
    Piecenum.WHITE_KNIGHT : "wn",
    Piecenum.WHITE_BISHOP : "wb",
    Piecenum.WHITE_ROOK : "wr",
    Piecenum.WHITE_QUEEN : "wq",
    Piecenum.WHITE_KING : "wk",
    Piecenum.BLACK_PAWN : "bp",
    Piecenum.BLACK_KNIGHT : "bn",
    Piecenum.BLACK_BISHOP : "bb",
    Piecenum.BLACK_ROOK : "br",
    Piecenum.BLACK_QUEEN : "bq",
    Piecenum.BLACK_KING : "bk"
}


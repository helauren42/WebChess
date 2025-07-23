from enum import Enum
import os

CHECKMATE = "chechmate"
DRAW = "draw"
UNFINISHED = "undone"

CWD = os.getcwd()
ENV_PATH = os.path.abspath(os.path.join(CWD, "../../.env"))
DB_DIR = os.path.join(os.path.dirname(CWD), "database/")
DOCKER_MYSQL_DIR = (
    os.path.abspath(os.path.join(os.path.dirname(CWD), "../docker/mysql/")) + "/"
)

def getEnv(variable: str) -> str:
    with open(ENV_PATH, "r") as file:
        lines = file.readlines()
        for line in lines:
            split = line.split("=")
            if len(split) == 2:
                key = split[0].strip()
                value = split[1].strip()
                if key == variable:
                    return value
    raise Exception(f"Variable {variable} not found in .env")


DB_PORT = getEnv("DB_PORT")
PORT = 6453
ORG_NPMSTART = "http://localhost:3000"
ORG_LOCAL = "http://localhost:6453"
ORG_SERVER = "http://188.68.57.140:6453"

HOST = getEnv("SERVER_HOST")
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
    "": Piecenum.EMPTY,
    "wp": Piecenum.WHITE_PAWN,
    "wn": Piecenum.WHITE_KNIGHT,
    "wb": Piecenum.WHITE_BISHOP,
    "wr": Piecenum.WHITE_ROOK,
    "wq": Piecenum.WHITE_QUEEN,
    "wk": Piecenum.WHITE_KING,
    "bp": Piecenum.BLACK_PAWN,
    "bn": Piecenum.BLACK_KNIGHT,
    "bb": Piecenum.BLACK_BISHOP,
    "br": Piecenum.BLACK_ROOK,
    "bq": Piecenum.BLACK_QUEEN,
    "bk": Piecenum.BLACK_KING,
}

PIECES_TO_STR = {
    Piecenum.EMPTY: "  ",
    Piecenum.WHITE_PAWN: "wp",
    Piecenum.WHITE_KNIGHT: "wn",
    Piecenum.WHITE_BISHOP: "wb",
    Piecenum.WHITE_ROOK: "wr",
    Piecenum.WHITE_QUEEN: "wq",
    Piecenum.WHITE_KING: "wk",
    Piecenum.BLACK_PAWN: "bp",
    Piecenum.BLACK_KNIGHT: "bn",
    Piecenum.BLACK_BISHOP: "bb",
    Piecenum.BLACK_ROOK: "br",
    Piecenum.BLACK_QUEEN: "bq",
    Piecenum.BLACK_KING: "bk",
}

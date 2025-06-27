from abc import ABC
from typing import Optional
import json
from utils import logger

from const import Piecenum, STR_TO_PIECES, PIECES_TO_STR
from cell import Cell, Pos
from pieces import createPiece, AbstractPiece


class AbstractBoard(ABC):
    def __init__(self) -> None:
        self.castlingHasMoved = {
            (0, 0): False,
            (7, 0): False,
            "wk": False,
            (0, 7): False,
            (7, 7): False,
            "bk": False,
        }
        self.board: list[list[Cell]] = self.initializeCastlingBoard()

    def updateHasMoved(self, name: str, pos: Pos) -> None:
        logger.info(f"!!! UPDATE HAS MOVED() {name}")
        if not (name == "wr" or name == "wk" or name == "br" or name == "bk"):
            return
        if name == "bk" or name == "wk":
            self.castlingHasMoved[name] = True
        elif (pos.x == 0 or pos.x == 7) and (pos.y == 0 or pos.y == 7):
            self.castlingHasMoved[(pos.x, pos.y)] = True
        logger.info("UPDATING")
        logger.info(self.castlingHasMoved)

    def checkHasMoved(self, name: str, pos: Pos):
        logger.info("!!! CHECK HAS MOVED()")
        if name == "wk" or name == "bk":
            return self.castlingHasMoved[name]
        elif name == "wr":
            if pos.y != 0 or (pos.x != 0 and pos.x != 7):
                return True
            return self.castlingHasMoved[(pos.x, pos.y)]
        elif name == "br":
            if pos.y != 7 or (pos.x != 0 and pos.x != 7):
                return True
            return self.castlingHasMoved[(pos.x, pos.y)]

    def initializeBoard(self) -> list[list[Cell]]:
        board = []
        white_pieces = [
            Piecenum.WHITE_ROOK,
            Piecenum.WHITE_KNIGHT,
            Piecenum.WHITE_BISHOP,
            Piecenum.WHITE_QUEEN,
            Piecenum.WHITE_KING,
            Piecenum.WHITE_BISHOP,
            Piecenum.WHITE_KNIGHT,
            Piecenum.WHITE_ROOK,
        ]
        black_pieces = [
            Piecenum.BLACK_ROOK,
            Piecenum.BLACK_KNIGHT,
            Piecenum.BLACK_BISHOP,
            Piecenum.BLACK_QUEEN,
            Piecenum.BLACK_KING,
            Piecenum.BLACK_BISHOP,
            Piecenum.BLACK_KNIGHT,
            Piecenum.BLACK_ROOK,
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

    def initializeCastlingBoard(self) -> list[list[Cell]]:
        return [
            [
                Cell(0, 0, Piecenum.WHITE_ROOK),
                Cell(1, 0, Piecenum.EMPTY),
                Cell(2, 0, Piecenum.EMPTY),
                Cell(3, 0, Piecenum.EMPTY),
                Cell(4, 0, Piecenum.WHITE_KING),
                Cell(5, 0, Piecenum.EMPTY),
                Cell(6, 0, Piecenum.EMPTY),
                Cell(7, 0, Piecenum.WHITE_ROOK),
            ],
            [
                Cell(0, 1, Piecenum.WHITE_PAWN),
                Cell(1, 1, Piecenum.EMPTY),
                Cell(2, 1, Piecenum.EMPTY),
                Cell(3, 1, Piecenum.EMPTY),
                Cell(4, 1, Piecenum.EMPTY),
                Cell(5, 1, Piecenum.EMPTY),
                Cell(6, 1, Piecenum.EMPTY),
                Cell(7, 1, Piecenum.EMPTY),
            ],
            [
                Cell(0, 2, Piecenum.EMPTY),
                Cell(1, 2, Piecenum.EMPTY),
                Cell(2, 2, Piecenum.EMPTY),
                Cell(3, 2, Piecenum.EMPTY),
                Cell(4, 2, Piecenum.EMPTY),
                Cell(5, 2, Piecenum.EMPTY),
                Cell(6, 2, Piecenum.EMPTY),
                Cell(7, 2, Piecenum.EMPTY),
            ],
            [
                Cell(0, 3, Piecenum.EMPTY),
                Cell(1, 3, Piecenum.EMPTY),
                Cell(2, 3, Piecenum.EMPTY),
                Cell(3, 3, Piecenum.EMPTY),
                Cell(4, 3, Piecenum.EMPTY),
                Cell(5, 3, Piecenum.EMPTY),
                Cell(6, 3, Piecenum.EMPTY),
                Cell(7, 3, Piecenum.EMPTY),
            ],
            [
                Cell(0, 4, Piecenum.EMPTY),
                Cell(1, 4, Piecenum.EMPTY),
                Cell(2, 4, Piecenum.EMPTY),
                Cell(3, 4, Piecenum.EMPTY),
                Cell(4, 4, Piecenum.EMPTY),
                Cell(5, 4, Piecenum.EMPTY),
                Cell(6, 4, Piecenum.EMPTY),
                Cell(7, 4, Piecenum.EMPTY),
            ],
            [
                Cell(0, 5, Piecenum.EMPTY),
                Cell(1, 5, Piecenum.EMPTY),
                Cell(2, 5, Piecenum.EMPTY),
                Cell(3, 5, Piecenum.EMPTY),
                Cell(4, 5, Piecenum.EMPTY),
                Cell(5, 5, Piecenum.EMPTY),
                Cell(6, 5, Piecenum.EMPTY),
                Cell(7, 5, Piecenum.EMPTY),
            ],
            [
                Cell(0, 6, Piecenum.BLACK_PAWN),
                Cell(1, 6, Piecenum.EMPTY),
                Cell(2, 6, Piecenum.EMPTY),
                Cell(3, 6, Piecenum.EMPTY),
                Cell(4, 6, Piecenum.EMPTY),
                Cell(5, 6, Piecenum.EMPTY),
                Cell(6, 6, Piecenum.EMPTY),
                Cell(7, 6, Piecenum.EMPTY),
            ],
            [
                Cell(0, 7, Piecenum.BLACK_ROOK),
                Cell(1, 7, Piecenum.EMPTY),
                Cell(2, 7, Piecenum.EMPTY),
                Cell(3, 7, Piecenum.EMPTY),
                Cell(4, 7, Piecenum.BLACK_KING),
                Cell(5, 7, Piecenum.EMPTY),
                Cell(6, 7, Piecenum.EMPTY),
                Cell(7, 7, Piecenum.BLACK_ROOK),
            ],
        ]

    async def getPiece(self, x: int, y: int) -> Piecenum:
        piece = self.board[y][x].piece
        logger.info(f"got piece: {piece}")
        return piece

    async def emptyPos(self, pos: Pos):
        self.board[pos.y][pos.x].changePiece(Piecenum.EMPTY)

    async def assignPos(self, pos: Pos, piece: Piecenum):
        previousPiece = self.board[pos.y][pos.x]
        logger.info(f"pre assign pos x: {pos.x}, y: {pos.y}: {previousPiece}")
        self.board[pos.y][pos.x].changePiece(piece)
        logger.info(
            f"post assign pos x: {pos.x}, y: {pos.y}: {self.board[pos.y][pos.x]}"
        )


class Board(AbstractBoard):
    def __init__(self, boardStr: Optional[str] = None) -> None:
        super().__init__()
        if boardStr is not None:
            self.board: list[list[Cell]] = []
            list_board = json.loads(boardStr)
            for y in range(8):
                row: list[Cell] = []
                for x in range(8):
                    piece: Piecenum = STR_TO_PIECES[list_board[y][x]]
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

    def sendFormat(self) -> list[list[str]]:
        ret = []
        for y in range(8):
            row = []
            for x in range(8):
                row.append(self.board[y][x].piece.value)
            ret.append(row)
        return ret

    async def canMove(
        self,
        fromPos: Pos,
        toPos: Pos,
        pieceNum: Piecenum,
        destPiece: Piecenum,
        board: list[list[Cell]],
    ):
        cellFrom = Cell(fromPos.x, fromPos.y, pieceNum)
        logger.info(f"making move with piece: {pieceNum.value}")
        logger.info(f"to dest piece: {destPiece.name}")
        pieceFrom: AbstractPiece = await createPiece(pieceNum, cellFrom)
        logger.info(f"created piece from: {pieceFrom.type}")
        return await pieceFrom.canMove(toPos, destPiece, board)

    async def makeMove(self, fromPos: Pos, toPos: Pos, pieceNum):
        logger.info("pre make move")
        logger.info(self.__str__())
        await self.emptyPos(fromPos)
        await self.assignPos(toPos, pieceNum)

    async def makeCastle(
        self, kingPos: Pos, rookPos: Pos, king: AbstractPiece, rook: AbstractPiece
    ):
        if king.castleDest is None or rook.castleDest is None:
            logger.info("Not making castle() is None")
            return
        logger.info("Making castle()")
        await self.makeMove(kingPos, king.castleDest, king.cell.piece)
        await self.makeMove(rookPos, rook.castleDest, rook.cell.piece)


if __name__ == "__main__":
    board = Board()
    logger.info(f"{board}")

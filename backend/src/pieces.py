from utils import logger, debugLogger
from abc import ABC
from cell import Cell, Pos
from const import BLACK, STR_TO_PIECES, WHITE, Piecenum
from typing import Optional


class AbstractPiece(ABC):
    def __init__(self, _cell: Cell) -> None:
        super().__init__()
        self.cell = _cell
        self.currPos = self.cell.getPos()
        self.color = self.cell.color
        self.type = self.cell.piece.value
        self.validNormalAbsolutVectors: list[tuple] = []
        self.validDirectionVectors: list[tuple] = []
        self.vectorMove: Optional[Pos] = None
        self.utilizedVector: Optional[Pos] = None
        self.castleDest: Optional[Pos] = None

    async def findMoves(self, board:list[list[Cell]]) -> list[tuple[int,int]]:
        moves: list[tuple[int,int]] = []
        for direction in self.validDirectionVectors:
            (x, y) = direction
            moveVector = Pos({"x": x, "y": y})
            pos = self.cell.getPos()
            newPos =  pos + moveVector
            debugLogger.log(f"pos: {pos} + moveVector: {moveVector} = {newPos}")
            if newPos.x < 0 or newPos.y < 0 or newPos.x > 7 or newPos.y > 7:
                continue
            if self.color != board[newPos.y][newPos.x].color:
                moves.append((newPos.x, newPos.y))
        for absolute in self.validNormalAbsolutVectors:
            newPos = self.cell.getPos()
            (x, y) = absolute
            moveVector = Pos({"x": x, "y": y})
            while True:
                newPos += moveVector
                if newPos.x < 0 or newPos.y < 0 or newPos.x > 7 or newPos.y > 7:
                    break
                if self.color != board[newPos.y][newPos.x].color:
                    moves.append((newPos.x, newPos.y))
        return moves

    async def validVectorMove(self, destPos: Pos) -> bool:
        moveVector = self.currPos.getMove(destPos)
        xSign = 1 if moveVector.x >= 0 else -1
        ySign = 1 if moveVector.y >= 0 else -1
        self.vectorMove = moveVector
        logger.info(f"moveVector: {moveVector}")
        logger.info(f"validDirectionVectors: {self.validDirectionVectors}")
        logger.info(f"validNormalAbsoluteVectors: {self.validNormalAbsolutVectors}")
        for vector in self.validDirectionVectors:
            if moveVector.isEqual(vector[0], vector[1]):
                self.utilizedVector = Pos({"x": vector[0], "y": vector[1]})
                return True
        if len(self.validNormalAbsolutVectors) == 0 or not (
            moveVector.x == moveVector.y
            or moveVector.x == -moveVector.y
            or (moveVector.x == 0 and moveVector.y)
            or (moveVector.x and moveVector.y == 0)
        ):
            return False
        moveVector.normalizeAndAbs()
        logger.info(f"moveVectorNormAbs: {moveVector}")
        for vector in self.validNormalAbsolutVectors:
            if moveVector.isEqual(vector[0], vector[1]):
                self.utilizedVector = Pos(
                    {"x": xSign * vector[0], "y": ySign * vector[1]}
                )
                return True
        logger.info("no vector match found")
        return False

    async def canTravel(
        self, destPos: Pos, destPiece: Piecenum, board: list[list[Cell]]
    ) -> bool:
        logger.info(f"can travel() from: {self.currPos}")
        logger.info(f"dest pos: {destPos}")
        if self.utilizedVector is None:
            logger.critical("utilizedVector not set")
            return False
        logger.info(f"utilizedVector: {self.utilizedVector}")
        pos: Pos = self.currPos
        while True:
            pos = pos + self.utilizedVector
            if pos.isEqual(destPos.x, destPos.y):
                break
            if board[pos.y][pos.x].piece.name != "EMPTY":
                logger.info(
                    f"obstacle at {pos.x}:{pos.y} : {board[pos.y][pos.x].piece.name}"
                )
                return False
        return True

    async def canCastleTravel(
        self, kingPos: Optional[Pos], rookPos: Optional[Pos], board: list[list[Cell]]
    ) -> bool:
        return False

    async def validDestPiece(self, destCell: Cell) -> bool:
        logger.info(f"destination cell color: {destCell.color}")
        logger.info(f"self cell color: {self.color}")
        logger.info(f"{self.color == 'white'}")
        logger.info(f"{destCell.color == 'white'}")
        if self.color == destCell.color:
            return False
        return True

    async def canMove(
        self, destPos: Pos, destPiece: Piecenum, board: list[list[Cell]]
    ) -> bool:
        logger.info(f"can move received destPos: {destPos}")
        destCell = board[destPos.y][destPos.x]
        logger.info(f"destCell: {destCell}")
        if await self.validDestPiece(destCell) is False:
            logger.info("Dest piece is incompatible color issue")
            return False
        if await self.validVectorMove(destPos) is False:
            logger.info("move is not a valid vector")
            return False
        if await self.canTravel(destPos, destPiece, board) is False:
            logger.info("can not travel")
            return False
        return True


class Empty(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)

    async def canTravel(
        self, destPos: Pos, destPiece: Piecenum, board: list[list[Cell]]
    ) -> bool:
        return False


class Pawn(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        if self.cell.color == WHITE and self.cell.y == 1:
            self.validDirectionVectors = [(0, 1), (0, 2), (-1, 1), (1, 1)]
        elif self.cell.color == WHITE:
            self.validDirectionVectors = [(0, 1), (-1, 1), (1, 1)]
        elif self.cell.color == BLACK and self.cell.y == 6:
            self.validDirectionVectors = [(0, -1), (0, -2), (-1, -1), (1, -1)]
        elif self.cell.color == BLACK:
            self.validDirectionVectors = [(0, -1), (-1, -1), (1, -1)]

    async def canTravel(
        self, destPos: Pos, destPiece: Piecenum, board: list[list[Cell]]
    ) -> bool:
        logger.info(f"dest piece name: {destPiece.name}")
        if (
            self.vectorMove is not None
            and self.vectorMove.x
            and self.vectorMove.y
            and destPiece.name != "EMPTY"
        ):
            return True
        elif (
            self.vectorMove is not None
            and self.vectorMove.x == 0
            and destPiece.name == "EMPTY"
        ):
            return True
        return False


class Rook(AbstractPiece):
    def __init__(self, _cell: Cell) -> None:
        super().__init__(_cell)
        self.validNormalAbsolutVectors = [(0, 1), (1, 0)]
        self.canJump = False

    async def canCastleTravel(
        self, kingPos: Optional[Pos], rookPos: Optional[Pos], board: list[list[Cell]]
    ) -> bool:
        if kingPos is None:
            return False
        destX = kingPos.x - 1 if self.currPos.x < kingPos.x else kingPos.x + 1
        self.utilizedVector = Pos({"x": 1 if destX > self.currPos.x else -1, "y": 0})
        self.castleDest = Pos({"x": destX, "y": self.currPos.y})
        return await self.canTravel(self.castleDest, STR_TO_PIECES[""], board)


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
            (-2, -1),
        ]

    # todo
    async def validDestPiece(self, destCell: Cell) -> bool:
        if self.color == "white" and destCell.piece.name == "WHITE_ROOK":
            return True
        if self.color == destCell.color:
            return False
        return True

    async def canTravel(
        self, destPos: Pos, destPiece: Piecenum, board: list[list[Cell]]
    ) -> bool:
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


async def createPiece(pieceNum: Piecenum, cell: Cell) -> AbstractPiece:
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

from utils import logger
from cell import Cell, Pos
from const import BLACK, STR_TO_PIECES, WHITE, Piecenum
from pieces import AbstractPiece, createPiece
from game import OnlineGame


class ValidateMove:
    def __init__(self) -> None:
        pass

    async def test(
        self,
        _oldBoard: list[list[Cell]],
        _newBoard: list[list[Cell]],
        _playerColor: str,
    ) -> bool:
        # opponent is analyzed for immobility and checkmate after current player makes move as those two would signal end of game
        # for player we only look at conditions that could invalidate his move like if after move he still in check
        # so before make move we look at conditions invalidating move and after make move we check for end game
        self.oldBoard: list[list[Cell]] = _oldBoard
        self.newBoard: list[list[Cell]] = _newBoard
        self.playerColor: str = _playerColor
        self.opponentColor: str = BLACK if _playerColor == WHITE else WHITE
        self.kingPos: Pos = await self.getKingPos()
        self.playerInCheck: bool = await self.isPlayerInCheck()
        self.opponentIsCheckMate: bool = False
        self.opponentIsImmobilized: bool = False
        self.isGameOver: bool = (
            True if self.opponentIsImmobilized or self.opponentIsCheckMate else False
        )
        return True if not self.playerInCheck else False

    async def getKingPos(self) -> Pos:
        kingPiecenum = (
            Piecenum.WHITE_KING if self.playerColor == WHITE else Piecenum.BLACK_KING
        )
        for y in range(8):
            for x in range(8):
                if kingPiecenum == self.newBoard[y][x].piece:
                    return Pos({"x": x, "y": y})
        return Pos({"x": 0, "y": 0})

    async def isPlayerInCheck(self):
        logger.info("isPlayerInCheck()")
        for y in range(8):
            for x in range(8):
                cell: Cell = self.newBoard[y][x]
                if cell.color == self.opponentColor:
                    piece: AbstractPiece = await createPiece(cell.piece, cell)
                    logger.info(f"kingPos: {self.kingPos}")
                    logger.info(f"type(kingPos): {type(self.kingPos)}")
                    if await piece.canMove(
                        self.kingPos, STR_TO_PIECES["wk"], self.oldBoard
                    ):
                        logger.info(
                            f"player is being checked by {piece.type} {piece.cell}"
                        )
                        return True
        logger.info("player is not checked, player is free to move")
        return False

    async def kingCanCastleTravel(
        self,
        king: AbstractPiece,
        rookPos: Pos,
        board: list[list[Cell]],
        game: OnlineGame,
    ) -> bool:
        logger.info("kingCanCastleTravel()")
        destX = king.currPos.x + 2 if king.currPos.x < rookPos.x else king.currPos.x - 2
        destPos = Pos({"x": destX, "y": king.currPos.y})
        king.castleDest = destPos
        self.utilizedVector = Pos({"x": 1 if destX > king.currPos.x else -1, "y": 0})
        pos: Pos = king.currPos
        self.newBoard = game.board.board
        while True:
            self.kingPos: Pos = await self.getKingPos()
            if await self.isPlayerInCheck():
                game.board.board = self.oldBoard
                return False
            if pos.isEqual(destPos.x, destPos.y):
                break
            pos = pos + self.utilizedVector
            if board[pos.y][pos.x].piece.name != "EMPTY":
                return False
            await game.board.makeMove(king.currPos, pos, STR_TO_PIECES[king.type])
            self.newBoard = game.board.board
        game.board.board = self.oldBoard
        return True

    async def testCastle(
        self,
        king: AbstractPiece,
        rook: AbstractPiece,
        board: list[list[Cell]],
        game: OnlineGame,
    ):
        logger.info("testCastle()")
        self.oldBoard = game.board.board
        self.playerColor: str = game.playerTurn
        self.opponentColor: str = BLACK if self.playerColor == WHITE else WHITE
        if not await rook.canCastleTravel(king.currPos, rook.currPos, board):
            logger.info("rook can not castle")
            return False
        if not await self.kingCanCastleTravel(king, rook.currPos, board, game):
            logger.info("castle traveling for rook and king not possible")
            return False
        return True

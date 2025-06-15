from const import BLACK, EMPTY, WHITE, Piecenum


class Pos:
    def __init__(self, _pos: dict[str, int]) -> None:
        self.x: int = int(_pos["x"])
        self.y: int = int(_pos["y"])

    def __str__(self) -> str:
        return f"x: {self.x}, y: {self.y}"

    def __add__(self, rhs: "Pos") -> "Pos":
        return Pos({"x": self.x + rhs.x, "y": self.y + rhs.y})

    def __sub__(self, rhs: "Pos") -> "Pos":
        return Pos({"x": self.x - rhs.x, "y": self.y - rhs.y})

    def isEqual(self, _x: int, _y: int) -> bool:
        return self.x == _x and self.y == _y

    def getMove(self, rhs: "Pos") -> "Pos":
        return Pos({"x": rhs.x - self.x, "y": rhs.y - self.y})

    def normalize(self) -> None:
        if not (self.x == self.y or self.x == 0 and self.y or self.x and self.y == 0):
            return
        absX = abs(self.x)
        absY = abs(self.y)
        divide = absX if absX > absY else absY
        self.x //= divide
        self.y //= divide


class Cell:
    def __init__(self, posX: int, posY: int, _piece: Piecenum) -> None:
        self.x: int = posX
        self.y: int = posY
        self.piece: Piecenum = _piece
        self.color = (
            EMPTY
            if self.piece.value == ""
            else WHITE if self.piece.value[0] == "w" else BLACK
        )

    def __str__(self) -> str:
        return f"Cell {self.x}:{self.y} Piece: {str(self.piece.value)}, color: {self.color}"

    def changePiece(self, _piece: Piecenum):
        self.piece: Piecenum = _piece
        self.color = (
            EMPTY
            if self.piece.value == ""
            else WHITE if self.piece.value[0] == "w" else BLACK
        )

    def getPos(self) -> Pos:
        return Pos({"x": self.x, "y": self.y})

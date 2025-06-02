import { WS } from '../WebSocket.js'
import { SOCKET_ADDRESS } from '../Const';
import { PIECE_IMAGES } from './Images.js';
import { displayDialogServerConnectionError } from '../Dialogs'

export const changeSquareColor = (square) => {
  console.log("changing square color")
  const color = square.className.search("white") >= 0 ? "white" : "black"
  if (color == "white")
    square.style.backgroundColor = "#745555"
  else
    square.style.backgroundColor = "#745555"
}

export const resetSquareColor = (square) => {
  const color = square.className.search("white") >= 0 ? "white" : "black"
  if (color == "white")
    square.style.backgroundColor = "white"
  else
    square.style.backgroundColor = "black"
}
export const getPos = (square) => {
  console.log("clicked ID: ", square.id)
  const elems = square.id.split("-")
  const ret = { "x": elems[1], "y": elems[3] }
  return ret
}

export const positionPieceImages = (board) => {
  if (!board)
    return
  console.log("positionPieceImages()")
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x]
      const idName = `img-row-${y}-col-${x}`
      const elem = document.getElementById(idName)
      if (piece == "" && elem.title != "") {
        elem.style.display = "none"
        elem.removeAttribute("src")
        elem.title = ""
      }
      else if (elem.title != piece) {
        elem.style.display = "inline"
        elem.src = PIECE_IMAGES[piece]
        elem.title = piece
      }
    }
  }
}


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
  console.log("elems: ", elems)
  const ret = [elems[1], elems[3]]
  console.log(ret)
  return ret
}

export const makeMove = async (from, to) => {
  const failure = { "status": "failure" }
  console.log("from: ", from)
  console.log("to: ", to)
  const body = JSON.stringify({ from, to })
  const resp = await fetch(`${SOCKET_ADDRESS}/makeMove`, {
    method: "POST",
    headers: "Content-Type: application/json",
    body: body
  }).then((resp) => {
    return resp
  }).catch((e) => {
    displayDialogServerConnectionError()
    console.log("Could not connect to server: ", e)
    return null
  })
  console.log(resp)
  if (resp == null || resp.status != 200)
    return failure
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


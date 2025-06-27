import { WS } from '../WebSocket.jsx'
import { SOCKET_ADDRESS } from '../Const.jsx';
import { PIECE_IMAGES } from './Images.jsx';
import { displayDialogServerConnectionError } from '../Dialogs.jsx'
import '../../CSS/App.css'

export const changeSquareColor = (square, setSelectedSquare) => {
	setSelectedSquare(square)
	console.log("changing square color: ", square.id)
	const elem = square.id.length <= 11 ? square : square.parentElement
	const color = elem.className.search("white") >= 0 ? "white" : "black"
	if (color == "white")
		elem.style.backgroundColor = "var(--selected-square)"
	else
		elem.style.backgroundColor = "var(--selected-square)"
}

export const resetSquareColor = (square) => {
	if (!square)
		return
	const elem = square.id.length <= 11 ? square : square.parentElement
	const color = elem.className.search("white") >= 0 ? "white" : "black"
	console.log("resetSquareColor id: ", elem)
	if (color == "white")
		elem.style.backgroundColor = "var(--white-square)"
	else
		elem.style.backgroundColor = "var(--black-square)"
}
export const getPos = (square) => {
	console.log("clicked ID: ", square.id)
	const elems = square.id.split("-")
	const ret = elems.length == 4 ? { "y": elems[1], "x": elems[3] } : { "y": elems[2], "x": elems[4] }
	console.log("clicked square: ", ret)
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


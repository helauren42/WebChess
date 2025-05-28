import { useState, useEffect, useContext } from 'react';
import { WS } from './WebSocket.js'
import { AppContext } from './App';
import { SOCKET_ADDRESS } from './Const';
import { displayDialogServerConnectionError } from './Dialogs'
import '../CSS/Game.css'

const changeSquareColor = (square) => {
  console.log("changing square color")
  const color = square.className.search("white") >= 0 ? "white" : "black"
  if (color == "white")
    square.style.backgroundColor = "#DBDCDC"
  else
    square.style.backgroundColor = "#353535"
}

const resetSquareColor = (square) => {
  const color = square.className.search("white") >= 0 ? "white" : "black"
  if (color == "white")
    square.style.backgroundColor = "white"
  else
    square.style.backgroundColor = "black"
}
const getPos = (square) => {
  console.log("clicked ID: ", square.id)
  const elems = square.id.split("-")
  console.log("elems: ", elems)
  const ret = [elems[1], elems[3]]
  console.log(ret)
  return ret
}

const makeMove = async (from, to) => {
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

const Board = ({ playerColor, setPlayerColor, isOnline, setIsOnline }) => {
  console.log("playerColor: ", playerColor)
  const [playerTurn, setPlayerTurn] = useState("white")
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [countSelectedPieces, setCountSelectedPieces] = useState(0)
  const [boardLayout, setBoardLayout] = useState([
    ["rw", "nw", "bw", "qw", "kw", "bw", "nw", "rw"],
    ["pw", "pw", "pw", "pw", "pw", "pw", "pw", "pw"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb"],
    ["rb", "nb", "bb", "qb", "kb", "bb", "nb", "rb"],
  ]);
  const WHITE_PIECES = ["rw", "nw", "bw", "qw", "kw", "pw"]
  const BLACK_PIECES = ["rb", "nb", "bb", "qb", "kb", "pb"]
  const isPlayerColor = (squarePos) => {
    const piece = boardLayout[squarePos[0]][squarePos[1]]
    console.log("clicked piece: ", piece)
    if (playerColor == "white" && WHITE_PIECES.includes(piece))
      return true
    if (playerColor == "black" && BLACK_PIECES.includes(piece))
      return true
    return false
  }

  const onSelectedPieceChange = (() => {
    console.log("selectedPiece: ", selectedSquare)
  }, [selectedSquare])

  const resetSelection = (square) => {
    console.log("resetting selection")
    setSelectedSquare(null)
    resetSquareColor(square)
  }
  const updateBoard = (newBoard) => {
    console.log("updating board")
    setBoardLayout(newBoard)
  }
  const onClickSquare = async (event) => {
    const square = event.target
    const squarePos = getPos(square)
    console.log(squarePos)
    const isSamePiece = selectedSquare == square.id
    console.log("PRE resetting selection")
    if (isSamePiece || (selectedSquare == "" && !isPlayerColor(squarePos)))
      return resetSelection(square)
    if (selectedSquare == null)
      return setSelectedSquare(square), changeSquareColor(square)
    const move = await makeMove(getPos(selectedSquare), squarePos)
    if (move["status"] == "success")
      updateBoard(move["newBoard"])
  }
  return (
    <div id="board-block">
      <div id="board">
        <button className="square white-square" id="row-7-col-0" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-7-col-1" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-7-col-2" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-7-col-3" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-7-col-4" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-7-col-5" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-7-col-6" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-7-col-7" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-6-col-0" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-6-col-1" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-6-col-2" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-6-col-3" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-6-col-4" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-6-col-5" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-6-col-6" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-6-col-7" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-5-col-0" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-5-col-1" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-5-col-2" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-5-col-3" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-5-col-4" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-5-col-5" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-5-col-6" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-5-col-7" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-4-col-0" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-4-col-1" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-4-col-2" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-4-col-3" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-4-col-4" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-4-col-5" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-4-col-6" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-4-col-7" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-3-col-0" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-3-col-1" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-3-col-2" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-3-col-3" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-3-col-4" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-3-col-5" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-3-col-6" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-3-col-7" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-2-col-0" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-2-col-1" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-2-col-2" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-2-col-3" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-2-col-4" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-2-col-5" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-2-col-6" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-2-col-7" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-1-col-0" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-1-col-1" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-1-col-2" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-1-col-3" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-1-col-4" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-1-col-5" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-1-col-6" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-1-col-7" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-0-col-0" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-0-col-1" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-0-col-2" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-0-col-3" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-0-col-4" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-0-col-5" onClick={(event) => onClickSquare(event)}></button>
        <button className="square black-square" id="row-0-col-6" onClick={(event) => onClickSquare(event)}></button>
        <button className="square white-square" id="row-0-col-7" onClick={(event) => onClickSquare(event)}></button>
      </div>
    </div>
  );
};

const startGame = () => {
  // change colors
}

const SelectMode = () => {
  return (
    <div id="select-mode">
      <div id="select-mode-title-background">
        <h1 id="select-mode-title">Select Mode</h1>
      </div>
      <div className="select-mode-mode-background">
        <h1 className="select-mode-mode">HotSeat</h1>
      </div>
      <div className="select-mode-mode-background">
        <h1 className="select-mode-mode">Online</h1>
      </div>
      <div className='ghost'></div>
    </div>
  )
}

export const GamePage = () => {
  const [playerColor, setPlayerColor] = useState("white")
  const [isOnline, setIsOnline] = useState(false)
  return (
    <div id="game-page-container">
      <Board playerColor={playerColor} setPlayerColor={setPlayerColor} isOnline={isOnline} setIsOnline={setIsOnline} />
      <SelectMode />
    </div>
  )
}


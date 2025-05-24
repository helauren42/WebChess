import { useState, useEffect, useContext } from 'react';
import { AppContext } from './App';
import { WS } from './WebSocket.js'
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

const Board = ({ playerColor, setPlayerColor, isOnline, setIsOnline }) => {
  console.log("playerColor: ", playerColor)
  const [playerTurn, setPlayerTurn] = useState("white")
  const [selectedPiece, setSelectedPiece] = useState("")
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
    console.log("selectedPiece: ", selectedPiece)
  }, [selectedPiece])

  const resetSelection = (square) => {
    setSelectedPiece("")
    resetSquareColor(square)
  }
  const onClickSquare = (event) => {
    const square = event.target
    const squarePos = getPos(square)
    console.log(squarePos)
    const isSamePiece = selectedPiece == square.id
    console.log("PRE resetting selection")
    if (isSamePiece || (selectedPiece == "" && !isPlayerColor(squarePos))) {
      console.log("resetting selection")
      resetSelection(square)
      return
    }
    changeSquareColor(square)
    console.log("TYPE: ", square)
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

export const GamePage = () => {
  const [playerColor, setPlayerColor] = useState("white")
  const [isOnline, setIsOnline] = useState(false)
  return (
    <div id="game-page-container">
      <Board playerColor={playerColor} setPlayerColor={setPlayerColor} isOnline={isOnline} setIsOnline={setIsOnline} />
    </div>
  )
}


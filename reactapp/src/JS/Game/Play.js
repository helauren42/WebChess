import { useState, useEffect, useContext } from 'react';
import { WS } from '../WebSocket.js'
import { AppContext } from '../App';
import { SOCKET_ADDRESS } from '../Const';
import { displayDialogServerConnectionError } from '../Dialogs'
import '../../CSS/Play.css'
import { BoardWhite } from './BoardWhite.js'
import { BoardBlack } from './BoardBlack.js'
import { resetSquareColor, getPos, changeSquareColor, makeMove } from './BoardActions.js';

const Board = ({ playerColor, setPlayerColor }) => {
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
    <div id="board-container">
      <BoardWhite onClickSquare={onClickSquare} />
    </div>
  );
};

export const PlayPage = () => {
  const [playerColor, setPlayerColor] = useState("white")
  return (
    <div id="game-page-container">
      <Board playerColor={playerColor} setPlayerColor={setPlayerColor} />
      <div id="right-side">
        <div id="select-mode">
          <div id="select-mode-title-container">
            <p className="select-mode-title">Play chess online on</p>
            <p className="select-mode-title">the best website ever!</p>
          </div>
          <div className="ghost"><p></p></div>
          <div id="play-buttons-container">
            <button className="play-buttons" id="button-play-hotseat">Play Hotseat</button>
            <button className="play-buttons" id="button-play-online" onSubmit={(e) => { }}>Play Online</button>
          </div>
          <div className="ghost"><p></p></div>
        </div>
      </div>
    </div>
  )
}


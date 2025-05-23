import { useState, useEffect, useContext } from 'react';
import { AppContext } from './App';
import { WS } from './WebSocket.js'
import '../CSS/Game.css'

const colorSquare = (square) => {
  const color = square.className.search("white") >= 0 ? "white" : "black"
  if (color == "white")
    square.style.backgroundColor = "grey"
  else
    square.style.backgroundColor = "blue"
}

const Board = () => {
  const [selectedPiece, setSelectedPiece] = useState("")
  const onSelectedPieceChange = (() => {
    console.log("selectedPiece: ", selectedPiece)
  }, [selectedPiece])
  const onClickSquare = (event) => {
    setSelectedPiece(event.target.class)
    colorSquare(event.target)
    console.log("TYPE: ", event.target)
    console.log("")
  }
  return (
    <div id="board-block">
      <div id="board" >
        <div className="board-row" id="row-7">
          <button className="square white-square" id="row-7-col-0" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-7-col-1" onClick={(event) => onClickSquare(event)} ></button>
          <button className="square white-square" id="row-7-col-2" onClick={(event) => onClickSquare(event)} ></button>
          <button className="square black-square" id="row-7-col-3" onClick={(event) => onClickSquare(event)} ></button>
          <button className="square white-square" id="row-7-col-4" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-7-col-5" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-7-col-6" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-7-col-7" onClick={(event) => onClickSquare(event)}></button>
        </div>
        <div className="board-row" id="row-6">
          <button className="square black-square" id="row-6-col-0" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-6-col-1" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-6-col-2" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-6-col-3" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-6-col-4" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-6-col-5" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-6-col-6" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-6-col-7" onClick={(event) => onClickSquare(event)}></button>
        </div>
        <div className="board-row" id="row-5">
          <button className="square white-square" id="row-5-col-0" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-5-col-1" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-5-col-2" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-5-col-3" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-5-col-4" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-5-col-5" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-5-col-6" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-5-col-7" onClick={(event) => onClickSquare(event)}></button>
        </div>
        <div className="board-row" id="row-4">
          <button className="square black-square" id="row-4-col-0" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-4-col-1" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-4-col-2" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-4-col-3" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-4-col-4" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-4-col-5" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-4-col-6" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-4-col-7" onClick={(event) => onClickSquare(event)}></button>
        </div>
        <div className="board-row" id="row-3">
          <button className="square white-square" id="row-3-col-0" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-3-col-1" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-3-col-2" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-3-col-3" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-3-col-4" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-3-col-5" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-3-col-6" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-3-col-7" onClick={(event) => onClickSquare(event)}></button>
        </div>
        <div className="board-row" id="row-2">
          <button className="square black-square" id="row-2-col-0" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-2-col-1" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-2-col-2" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-2-col-3" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-2-col-4" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-2-col-5" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-2-col-6" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-2-col-7" onClick={(event) => onClickSquare(event)}></button>
        </div>
        <div className="board-row" id="row-1">
          <button className="square white-square" id="row-1-col-0" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-1-col-1" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-1-col-2" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-1-col-3" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-1-col-4" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-1-col-5" onClick={(event) => onClickSquare(event)}></button>
          <button className="square white-square" id="row-1-col-6" onClick={(event) => onClickSquare(event)}></button>
          <button className="square black-square" id="row-1-col-7" onClick={(event) => onClickSquare(event)}></button>
        </div>
        <div className="board-row" id="row-0">
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
      <div id="right-side">

      </div>
    </div>
  );
};

export default Board;

export const GamePage = () => {
  return (
    <div id="game-page-container">
      <Board />
    </div>
  )
}


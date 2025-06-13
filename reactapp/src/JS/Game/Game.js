import { useEffect, useState } from 'react'
import { BoardWhite } from './BoardWhite'
import { BoardBlack } from './BoardBlack'
import { resetSquareColor, getPos, changeSquareColor } from './BoardActions.js';
import { WS } from '../App';

export const GAME_MODE_ONLINE = 0
export const GAME_MODE_HOTSEAT = 1
const WHITE_PIECES = ["rw", "nw", "bw", "qw", "kw", "pw"]
const BLACK_PIECES = ["rb", "nb", "bb", "qb", "kb", "pb"]

export const OnlineGame = ({ gameMode, gameData }) => {
  console.log("OnlineGame")
  const [playerColor, setPlayerColor] = useState("")
  const [selectedSquare, setSelectedSquare] = useState(null)
  const onSelectedSquareChange = (() => {
    console.log("selectedPiece: ", selectedSquare)
  }, [selectedSquare])
  const isPlayerColor = (squarePos) => {
    const piece = gameData["board"][squarePos[0]][squarePos[1]]
    console.log("clicked piece: ", piece)
    if (playerColor == "white" && WHITE_PIECES.includes(piece))
      return true
    if (playerColor == "black" && BLACK_PIECES.includes(piece))
      return true
    return false
  }
  const resetSelection = () => {
    console.log("resetting selection")
    resetSquareColor(selectedSquare)
    setSelectedSquare(null)
  }
  const onClickSquare = async (event) => {
    const clickedSquare = event.target
    console.log("clicked square: ", clickedSquare)
    console.log("curr selected square: ", selectedSquare)
    const squarePos = getPos(clickedSquare)
    console.log(squarePos)
    const isSamePiece = selectedSquare == clickedSquare.id
    console.log("PRE resetting selection")
    if (isSamePiece || (selectedSquare == "" && !isPlayerColor(squarePos)))
      return resetSelection()
    if (selectedSquare == null)
      return setSelectedSquare(clickedSquare), changeSquareColor(clickedSquare)
    console.log("playerTurn: ", gameData["playerTurn"])
    console.log("playerColor: ", playerColor)
    if (gameData["playerTurn"] == playerColor)
      WS.makeMove(getPos(selectedSquare), squarePos)
    resetSelection()
  }
  useEffect(() => {
    console.log(gameData)
    setPlayerColor(gameData["playerColor"])
  }, [gameData])
  return (
    <div id="game-page-container">
      {playerColor == "white" ? <BoardWhite gameData={gameData} onClickSquare={onClickSquare} /> : <BoardBlack gameData={gameData} onClickSquare={onClickSquare} />}
      <div id="right-side">
      </div>
    </div >
  )
}

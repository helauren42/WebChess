import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BoardWhite } from './BoardWhite.jsx'
import { BoardBlack } from './BoardBlack.jsx'
import { resetSquareColor, getPos, changeSquareColor } from './BoardActions.jsx';
import { AccountContext, WS } from '../App.jsx';

import { SOCKET_ADDRESS } from '../Const.jsx';
import { WebSocketManager } from '../WebSocket.jsx';

export const GAME_MODE_ONLINE = 0
export const GAME_MODE_HOTSEAT = 1
const WHITE_PIECES = ["rw", "nw", "bw", "qw", "kw", "pw"]
const BLACK_PIECES = ["rb", "nb", "bb", "qb", "kb", "pb"]

export const OnlineGame = ({ accountUsername, gameMode, gameData }) => {
  console.log("OnlineGame")
  const [playerColor, setPlayerColor] = useState("")
  const [opponentName, setOpponentName] = useState("")
  const [opponentColor, setOpponentColor] = useState("")
  const [selectedSquare, setSelectedSquare] = useState(null)
  const navigate = useNavigate()
  const onSelectedSquareChange = (() => {
    console.log("!!! selection change")
    console.log("selectedPiece: ", selectedSquare)
  }, [selectedSquare])
  const isPlayerColor = (squarePos) => {
    const board = gameData["board"]
    const piece = board[squarePos.y][squarePos.x]
    console.log("clicked piece: ", piece)
    if (piece == "")
      return false
    if ((piece[0] == "w" && playerColor == "white") || (piece[0] == "b" && playerColor == "black"))
      return console.log("selected square is player color"), true
    return console.log("selected square is not player color"), false
  }
  const resetSelection = () => {
    resetSquareColor(selectedSquare)
    setSelectedSquare(null)
    console.log("POST resetting selection")
  }
  const onClickSquare = async (event) => {
    const clickedSquare = event.target
    console.log("clicked square: ", clickedSquare)
    console.log("curr selected square: ", selectedSquare)
    const squarePos = getPos(clickedSquare)
    console.log(squarePos)
    console.log("squarePos: ", squarePos)

    const isSamePiece = selectedSquare == clickedSquare.id
    console.log("PRE resetting selection")
    console.log("first condition: ", isSamePiece)
    console.log(!selectedSquare && !isPlayerColor(squarePos))
    if (isSamePiece || (!selectedSquare && !isPlayerColor(squarePos)))
      return resetSelection()
    console.log("PRE setting selection")
    if (selectedSquare == null)
      return changeSquareColor(clickedSquare, setSelectedSquare)
    console.log("playerTurn: ", gameData["playerTurn"])
    console.log("playerColor: ", playerColor)
    if (gameData["playerTurn"] == playerColor)
      WS.makeMove(getPos(selectedSquare), squarePos)
    resetSelection()
  }
  const userResign = async () => {
    WS.sendUserResign()
    // handle redirection setting game state to finished game etc..
  }
  useEffect(() => {
    console.log(gameData)
    setPlayerColor(gameData["playerColor"])
    const challenger = gameData["challenger"]
    const challenged = gameData["challenged"]
    setOpponentName(accountUsername == challenger ? challenged : challenger)
    console.log(gameData["playerColor"])
    console.log("!!! opponent color turns out to be: ", gameData["playerColor"] == "white" ? "black" : "white")
    setOpponentColor(gameData["playerColor"] == "white" ? "black" : "white")
  }, [gameData])
  return (
    <div id="game-page-container">
      {playerColor == "white" ? <BoardWhite gameData={gameData} onClickSquare={onClickSquare} /> : <BoardBlack gameData={gameData} onClickSquare={onClickSquare} />}
      <div className="navbar-pseudo players-right" id="right-side">
        <div id="players-container">
          <div className='player-data' id="user-data">
            <h2 className='player-name'>{accountUsername}</h2>
            <p className='player-color'>{playerColor}</p>
          </div>
          <div className='player-data' id="opponent-data">
            <h2 className='player-name'>{opponentName}</h2>
            <p className='player-color'>{opponentColor}</p>
          </div>
        </div>
        <button className='rs-buttons' id="resign" onClick={() => userResign()}>resign</button>
      </div>
    </div >
  )
}

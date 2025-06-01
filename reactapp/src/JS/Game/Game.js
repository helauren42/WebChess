import { useEffect, useState } from 'react'
import { BoardWhite } from './BoardWhite'
import { BoardBlack } from './BoardBlack'
import { PIECE_IMAGES } from './Images.js'

export const GAME_MODE_ONLINE = 0
export const GAME_MODE_HOTSEAT = 1

export const positionPieceImages = (board) => {
  if (!board)
    return
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x]
      const idName = `img-row-${y}-col-${x}`
      console.log("id name: ", idName)
      const elem = document.getElementById(idName)
      if (piece == "") {
        elem.style.display = "none"
        elem.removeAttribute("src")
      }
      else {
        elem.style.display = "inline"
        elem.src = PIECE_IMAGES[piece]
      }
      console.log(elem.src)
    }
  }
}

export const OnlineGame = ({ gameMode, gameData }) => {
  console.log("OnlineGame")
  const [playerColor, setPlayerColor] = useState("")
  useEffect(() => {
    setPlayerColor(gameData["playerColor"])
  }, [])
  console.log(gameData)
  return (
    <div id="game-page-container">
      {playerColor == "white" ? <BoardWhite playerColor={playerColor} gameData={gameData} /> : <BoardBlack playerColor={playerColor} gameData={gameData} />}
      <div id="right-side">
      </div>
    </div >
  )
}

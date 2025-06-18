import { useState, useEffect, useContext } from 'react';
import { WS } from '../WebSocket.jsx'
import { displayDialogServerConnectionError } from '../Dialogs.jsx'
import '../../CSS/Play.css'
import { BoardWhite } from './BoardWhite.jsx'

export const PlayPage = () => {
  const [playerColor, setPlayerColor] = useState("white")
  const onClickSquare = () => {
    console.log("empty on click square")
    return
  }
  return (
    <div id="game-page-container">
      <BoardWhite gameData={null} onClickSquare={onClickSquare} />
      <div className="navbar-pseudo" id="right-side">
        <div id="select-mode">
          <div id="select-mode-title-container">
            <p className="select-mode-title">Play chess online on</p>
            <p className="select-mode-title">the best website ever!</p>
          </div>
          <div className="ghost"><p></p></div>
          <div id="play-buttons-container">
            <button className="rs-buttons" id="button-play-hotseat">Play Hotseat</button>
            <button className="rs-buttons" id="button-play-online" onSubmit={(e) => { }}>Play Online</button>
          </div>
          <div className="ghost"><p></p></div>
        </div>
      </div>
    </div>
  )
}


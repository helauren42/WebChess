import "../CSS/MatchMaking.css"

import { useNavigate } from "react-router-dom"
import { SOCKET_ADDRESS } from "./Const";
import { useEffect } from "react";

export const MatchMaking = () => {
  const navigate = useNavigate()
  const ws = new WebSocket(`${SOCKET_ADDRESS}/matchmaking`)
  useEffect(() => {
    return () => {
      ws.close()
    }
  }, [])
  return (
    <div className="matchmaking-main">
      <div id="dialog">
        <h2 id="dialog-text">Looking for an opponent</h2>
        <div className="loader"></div>
        <button id="dialog-btn" onClick={(e) => { navigate("/play") }}>Stop</button>
      </div>
    </div>
  )
}


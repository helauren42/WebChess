import "../CSS/MatchMaking.css"

import { useNavigate } from "react-router-dom"

export const MatchMaking = () => {
  const navigate = useNavigate()
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


import "../CSS/MatchMaking.css"

import { useNavigate } from "react-router-dom"
import { SOCKET_ADDRESS } from "./Const";
import { useEffect } from "react";

export const MatchMaking = ({ sessionToken, gameData }) => {
	const navigate = useNavigate()
	const ws = new WebSocket(`${SOCKET_ADDRESS}/matchmaking`)
	useEffect(() => {
		if (gameData && gameData.finished == false) {
			console.log("game apparently not finished!!!!: ", gameData.finished)
			navigate("/play/online")
		}
	}, [gameData])
	useEffect(() => {
		ws.addEventListener("open", () => {
			ws.send(sessionToken)
		})
		return () => {
			console.log("closed matchmaking WebSocket")
			ws.close(1000, "matchmaking page closed by client")
		}
	}, [])
	return (
		<div className="matchmaking-main">
			<div id="dialog">
				<h2 id="dialog-text">Looking for an opponent</h2>
				<div className="loader"></div>
				<button className="classic-btn" id="dialog-btn" onClick={(e) => { navigate("/play") }}>Stop</button>
			</div>
		</div>
	)
}


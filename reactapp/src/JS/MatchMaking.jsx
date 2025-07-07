import "../CSS/MatchMaking.css"

import { useNavigate } from "react-router-dom"
import { SOCKET_ADDRESS } from "./Const";
import { useEffect } from "react";

export const MatchMaking = ({ sessionToken, gameData, signedIn }) => {
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
			{signedIn ?
				<div id="dialog">
					<h1 id="dialog-text">Looking for an opponent</h1>
					<div className="loader"></div>
					<button className="classic-btn" id="dialog-btn" onClick={(e) => { navigate("/play") }}>Stop</button>
				</div>
				:
				<div id="dialog">
					<h1 id="dialog-text">You need to log in to play online</h1>
				</div>
			}
		</div>
	)
}


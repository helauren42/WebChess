import { useState, useEffect, useContext } from 'react';

import { displayDialogServerConnectionError } from '../Dialogs.jsx'
import { useNavigate } from 'react-router-dom'
import '../../CSS/Play.css'
import { BoardWhite } from './BoardWhite.jsx'
import { WS } from '../Const.jsx';

export const PlayPage = () => {
	const [playerColor, setPlayerColor] = useState("white")
	const navigate = useNavigate()
	const onClickSquare = () => {
		console.log("empty on click square")
		return
	}
	useEffect(() => {
		if (WS.gameData && WS.gameData.finished == false) {
			console.log("game apparently not finished!!!!: ", WS.gameData.finished)
			navigate("/play/online")
		}
	}, [])
	return (
		<div id="game-page-container">
			<BoardWhite gameData={null} onClickSquare={onClickSquare} />
			<div className="navbar-pseudo" id="right-side">
				<div id="select-mode">
					<div id="select-mode-title-container">
						<h2 className="select-mode-title">Select your game mode</h2>
					</div>
					<div className="ghost"><p></p></div>
					<div id="play-buttons-container">
						{/* <button className="rs-buttons" id="button-play-hotseat">Play Hotseat</button> */}
						<button className="rs-buttons classic-btn" id="button-play-online" onClick={(e) => {
							console.log("clicked play online");
							navigate("/play/matchmaking")
						}}>Online</button>
						<button className="rs-buttons classic-btn" id="button-play-online" onClick={(e) => {
							console.log("clicked play hotseat");
							navigate("/play/matchmaking")
						}}>Hotseat</button>
					</div>
					<div className="ghost"><p></p></div>
				</div>
			</div>
		</div >
	)
}


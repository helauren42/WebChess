import { useState, useEffect, useContext } from 'react';

import { displayDialogServerConnectionError } from '../Dialogs.jsx'
import { useNavigate } from 'react-router-dom'
import '../../CSS/Play.css'
import { BoardWhite } from './BoardWhite.jsx'

export const PlayPage = ({ gameData }) => {
	const [playerColor, setPlayerColor] = useState("white")
	const navigate = useNavigate()
	const onClickSquare = () => {
		console.log("empty on click square")
		return
	}
	useEffect(() => {
		if (gameData && gameData.finished == false) {
			console.log("game apparently not finished!!!!: ", gameData.finished)
			navigate("/play/online")
		}
	}, [gameData])
	return (
		<div id="game-page-container">
			<div className="board-container">
				<BoardWhite gameData={null} onClickSquare={onClickSquare}>
				</BoardWhite>
				<div className="navbar-pseudo" id="on-top">
					<div className="select-mode">
						<div className="select-mode-title-container">
							<h2 className="select-mode-title">Select your game mode</h2>
						</div>
						<div className="ghost"><p></p></div>
						<div className="play-buttons-container">
							<button className="rs-buttons classic-btn button-play-online" onClick={(e) => {
								console.log("clicked play online");
								navigate("/play/matchmaking")
							}}><h3 className='subtitle'>Online</h3></button>
							<button className="rs-buttons classic-btn button-play-online" onClick={(e) => {
								console.log("clicked play hotseat");
								navigate("/play/matchmaking")
							}}><h3 className='subtitle'>Hotseat</h3></button>
						</div>
						<div className="ghost"><p></p></div>
					</div>
				</div>
			</div>
			<div className=" navbar-pseudo" id="right-side">
				<div className="select-mode">
					<div className="select-mode-title-container">
						<h2 className="select-mode-title">Select your game mode</h2>
					</div>
					<div className="ghost"><p></p></div>
					<div className="play-buttons-container">
						{/* <button className="rs-buttons" className="button-play-hotseat">Play Hotseat</button> */}
						<button className="rs-buttons classic-btn button-play-online" onClick={(e) => {
							console.log("clicked play online");
							navigate("/play/matchmaking")
						}}><h3 className='subtitle'>Online</h3></button>
						<button className="rs-buttons classic-btn button-play-online" onClick={(e) => {
							console.log("clicked play hotseat");
							navigate("/play/matchmaking")
						}}><h3 className='subtitle'>Hotseat</h3></button>
					</div>
					<div className="ghost"><p></p></div>
				</div>
			</div>
		</div>
	)
}


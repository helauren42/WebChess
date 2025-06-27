import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BoardWhite } from './BoardWhite.jsx'
import { BoardBlack } from './BoardBlack.jsx'
import { resetSquareColor, getPos, changeSquareColor } from './BoardActions.jsx';
import { WS } from '../App.jsx';
import { PIECE_IMAGES } from './Images.jsx';

export const GAME_MODE_ONLINE = 0
export const GAME_MODE_HOTSEAT = 1

const GameBoard = ({ accountUsername, playerColor, opponentName, opponentColor, gameData }) => {
	const makePawnNumber = (num) => {
		console.log("making pawn number")
		const elem = document.createElement('p')
		elem.className = "captured-num"
		elem.innerText = num
		return elem
	}
	const makeImage = (pieceName) => {
		console.log("making image: ", pieceName)
		const img = document.createElement('img')
		img.className = "captured-img"
		img.src = PIECE_IMAGES[pieceName]
		return img
	}
	useEffect(() => {
		console.log(gameData.length)
		if (!gameData || Object.keys(gameData) <= 0)
			return
		const opponentCaptures = document.getElementById("opponent-captures")
		const userCaptures = document.getElementById("user-captures")
		while (opponentCaptures.lastChild) {
			opponentCaptures.removeChild(opponentCaptures.lastChild)
		}
		while (userCaptures.lastChild) {
			userCaptures.removeChild(userCaptures.lastChild)
		}
		const blackPieces = gameData["capturedBlackPieces"]
		const whitePieces = gameData["capturedWhitePieces"]
		console.log("black pieces: ", blackPieces)
		console.log("white pieces: ", whitePieces)
		let countBlackPawn = 0
		let countWhitePawn = 0
		console.log(blackPieces)
		for (let i = 0; i < blackPieces.length; i++) {
			const pieceName = blackPieces[i]
			if (pieceName == "bp")
				countBlackPawn++
			else {
				const img = makeImage(pieceName)
				if (playerColor == "white")
					userCaptures.append(img)
				else if (playerColor == "black")
					opponentCaptures.append(img)
			}
		}
		if (countBlackPawn) {
			const num = makePawnNumber(countBlackPawn)
			const img = makeImage("bp")
			if (playerColor == "white") {
				userCaptures.append(img)
				userCaptures.append(num)
			}
			else {
				opponentCaptures.append(img)
				opponentCaptures.append(num)
			}
		}
		for (let i = 0; i < whitePieces.length; i++) {
			const pieceName = whitePieces[i]
			console.log("white piece name: ", pieceName)
			if (pieceName == "wp")
				countWhitePawn++
			else {
				const img = makeImage(pieceName)
				if (playerColor == "black")
					userCaptures.append(img)
				else
					opponentCaptures.append(img)
			}
		}
		console.log("countWhitePawn: ", countWhitePawn)
		if (countWhitePawn) {
			const num = makePawnNumber(countWhitePawn)
			const img = makeImage("wp")
			if (playerColor == "black") {
				userCaptures.append(img)
				userCaptures.append(num)
			}
			else {
				opponentCaptures.append(img)
				opponentCaptures.append(num)
			}
		}
	}, [gameData, playerColor])
	return (
		<div id="players-container">
			<div className='player-data' id="opponent-data">
				<h2 className='player-name'>{opponentName}</h2>
				<p className='player-color'>{opponentColor}</p>
			</div>
			<div className='captured-pieces' id="opponent-captures"></div>
			<div className='player-data' id="user-data">
				<h2 className='player-name'>{accountUsername}</h2>
				<p className='player-color'>{playerColor}</p>
			</div>
			<div className='captured-pieces' id="user-captures"></div>
		</div>
	)
}
const GameOver = ({ gameWinner }) => {
	return (
		<div id="results-container">
			{gameWinner !== "" ? (
				<h2 className="winner-name">Winner: {gameWinner}</h2>
			) : (
				<h2 id="draw-results">Draw</h2>
			)}
		</div>
	);
}


export const OnlineGame = ({ accountUsername, gameMode, gameData }) => {
	console.log("OnlineGame")
	const [playerColor, setPlayerColor] = useState("")
	const [opponentName, setOpponentName] = useState("")
	const [opponentColor, setOpponentColor] = useState("")
	const [gameFinished, setGameFinished] = useState(false)
	const [gameWinner, setGameWinner] = useState(false)
	const [selectedSquare, setSelectedSquare] = useState(null)
	const navigate = useNavigate()
	const userResign = async () => {
		WS.sendUserResign()
	}
	const playAgain = () => {
		navigate("/play/matchmaking")
	}
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
	const isCastlingAttempt = async (squarePos) => {
		console.log("isCastlingAttempt()")
		const selectedPos = getPos(selectedSquare)
		console.log(selectedPos)
		console.log(squarePos)
		if (!isPlayerColor(squarePos)) {
			console.log("is not same player color")
			return false
		}
		const playerRow = gameData["playerColor"] == "white" ? 0 : 7
		const isKing = gameData["board"][selectedPos.y][selectedPos.x];
		const playerColor = gameData["playerColor"]
		console.log(playerColor)
		console.log(isKing)
		if ((playerColor == "white" && isKing == "wk") || (playerColor == "black" && isKing == "bk"))
			console.log("king selected")
		else {
			console.log("not king selected")
			return false
		}
		const isRook = gameData["board"][selectedPos.y][selectedPos.x];
		if ((playerColor == "white" && isRook == "wk") || (playerColor == "black" && isRook == "bk"))
			console.log("king selected")
		else {
			console.log("not rook selected")
			return false
		}
		console.log("!!! IS CASTLING ATTEMPT")
		return true
	}
	const onClickSquare = async (event) => {
		const clickedSquare = event.target
		console.log("clicked square: ", clickedSquare)
		console.log("curr selected square: ", selectedSquare)
		const squarePos = getPos(clickedSquare)
		console.log(squarePos)
		console.log("squarePos: ", squarePos)

		const isSamePiece = selectedSquare == clickedSquare.id
		if (selectedSquare && gameData["playerTurn"] == playerColor && await isCastlingAttempt(squarePos))
			return resetSelection(), WS.makeCastling(getPos(selectedSquare), squarePos)
		console.log("PRE resetting selection")
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
	useEffect(() => {
		console.log(gameData)
		setPlayerColor(gameData["playerColor"])
		const challenger = gameData["challenger"]
		const challenged = gameData["challenged"]
		setOpponentName(accountUsername == challenger ? challenged : challenger)
		setOpponentColor(gameData["playerColor"] == "white" ? "black" : "white")
		setGameFinished(gameData["finished"])
		setGameWinner(gameData["winner"])

	}, [gameData])
	return (
		<div id="game-page-container">
			{playerColor == "white" ? <BoardWhite gameData={gameData} onClickSquare={onClickSquare} /> : <BoardBlack gameData={gameData} onClickSquare={onClickSquare} />}
			<div className="navbar-pseudo" id="right-side">
				<div id="active-game">
					<GameBoard accountUsername={accountUsername} playerColor={playerColor} opponentName={opponentName} opponentColor={opponentColor} gameData={gameData} />
					{gameFinished == false ? null : <GameOver gameWinner={gameWinner} />}
					{gameFinished == false ? <button className='rs-buttons' onClick={() => userResign()}>resign</button>
						:
						<button className='rs-buttons' onClick={() => playAgain()}>Play again</button>
					}

				</div>
			</div>
		</div >
	)
}

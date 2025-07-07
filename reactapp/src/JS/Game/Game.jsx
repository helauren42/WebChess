import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BoardWhite } from './BoardWhite.jsx'
import { BoardBlack } from './BoardBlack.jsx'
import { resetSquareColor, getPos, changeSquareColor } from './BoardActions.jsx';
import { WS } from '../Const.jsx';
import { PIECE_IMAGES } from './Images.jsx';

export const GAME_MODE_ONLINE = 0
export const GAME_MODE_HOTSEAT = 1

const GameBoard = ({ accountUsername, playerColor, opponentName, opponentColor, gameData, instanceId }) => {
	const makePawnNumber = (num) => {
		const elem = document.createElement('p');
		elem.className = "captured-num";
		elem.innerText = num;
		return elem;
	};

	const makeImage = (pieceName) => {
		const img = document.createElement('img');
		img.className = "captured-img";
		img.src = PIECE_IMAGES[pieceName];
		return img;
	};

	useEffect(() => {
		if (!gameData || Object.keys(gameData).length <= 0) return;

		// Fetch only this instance's elements using unique names
		const opponentCaptures = document.getElementsByName(`opponent-captures-${instanceId}`);
		const userCaptures = document.getElementsByName(`user-captures-${instanceId}`);

		// Clear only this instance's elements
		opponentCaptures.forEach(el => {
			while (el.lastChild) {
				el.removeChild(el.lastChild);
			}
		});
		userCaptures.forEach(el => {
			while (el.lastChild) {
				el.removeChild(el.lastChild);
			}
		});

		const blackPieces = gameData["capturedBlackPieces"] || [];
		const whitePieces = gameData["capturedWhitePieces"] || [];

		let countBlackPawn = 0;
		let countWhitePawn = 0;

		for (let i = 0; i < blackPieces.length; i++) {
			const pieceName = blackPieces[i];
			if (pieceName === "bp") {
				countBlackPawn++;
			} else {
				const img = makeImage(pieceName);
				const target = playerColor === "white" ? userCaptures : opponentCaptures;
				target.forEach(el => el.appendChild(img));
			}
		}

		if (countBlackPawn > 0) {
			const img = makeImage("bp");
			const num = makePawnNumber(countBlackPawn);
			const target = playerColor === "white" ? userCaptures : opponentCaptures;
			target.forEach(el => el.appendChild(img));
			if (countBlackPawn > 1) {
				target.forEach(el => el.appendChild(num));
			}
		}

		for (let i = 0; i < whitePieces.length; i++) {
			const pieceName = whitePieces[i];
			if (pieceName === "wp") {
				countWhitePawn++;
			} else {
				const img = makeImage(pieceName);
				const target = playerColor === "black" ? userCaptures : opponentCaptures;
				target.forEach(el => el.appendChild(img));
			}
		}

		if (countWhitePawn > 0) {
			const img = makeImage("wp");
			const num = makePawnNumber(countWhitePawn);
			const target = playerColor === "black" ? userCaptures : opponentCaptures;
			target.forEach(el => el.appendChild(img));
			if (countWhitePawn > 1) {
				target.forEach(el => el.appendChild(num));
			}
		}
	}, [gameData, playerColor, instanceId]);

	return (
		<div className="players-container">
			<div className="player-data" id="opponent-data">
				<h2 className="player-name">{opponentName}</h2>
				<p className="player-color">{opponentColor}</p>
			</div>
			<div className="captured-pieces" name={`opponent-captures-${instanceId}`}></div>
			<div className="player-data" id="user-data">
				<h2 className="player-name">{accountUsername}</h2>
				<p className="player-color">{playerColor}</p>
			</div>
			<div className="captured-pieces" name={`user-captures-${instanceId}`}></div>
		</div>
	);
}

const GameOver = ({ gameWinner }) => {
	return (
		<div id="results-container">
			{gameWinner !== "" ? (
				<h2 className="game-result">Winner: {gameWinner}</h2>
			) : (
				<h2 className="game-result" id="draw-results">Draw</h2>
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

	useEffect(() => {
		console.log("game state: ", gameData.finished)
		if (!gameData || gameData.finished == undefined || gameData.finished == true) {
			console.log("game apparently finished!!!!: ", gameData.finished)
			navigate("/play")
		}
	}, [])
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
		<div id="game-page-container-wrapper">
			<div id="game-page-container">
				{playerColor == "white" ? <BoardWhite gameData={gameData} onClickSquare={onClickSquare} /> : <BoardBlack gameData={gameData} onClickSquare={onClickSquare} />}
				<div className="navbar-pseudo" id="right-side">
					<div id="active-game">
						<GameBoard accountUsername={accountUsername} playerColor={playerColor} opponentName={opponentName} opponentColor={opponentColor} gameData={gameData} />
						{gameFinished == false ? null : <GameOver gameWinner={gameWinner} instanceId="right" />}
						{gameFinished == false ? <button className='rs-buttons classic-btn' onClick={() => userResign()}>resign</button>
							:
							<button className='rs-buttons classic-btn' onClick={() => playAgain()}>Play again</button>
						}
					</div>
				</div>
			</div>
			<div id="bottom-game-board">
				<div className="navbar-pseudo" id="bottom-side">
					<div id="active-game">
						<GameBoard accountUsername={accountUsername} playerColor={playerColor} opponentName={opponentName} opponentColor={opponentColor} gameData={gameData} instanceId="bottom" />
						{gameFinished == false ? null : <GameOver gameWinner={gameWinner} />}
						{gameFinished == false ? <button className='rs-buttons classic-btn' onClick={() => userResign()}>resign</button>
							:
							<button className='rs-buttons classic-btn' onClick={() => playAgain()}>Play again</button>
						}
					</div>
				</div>
			</div>
		</div >
	)
}

import { WEBSOCKET_URL } from "./Const"
import { displayAlertBox, displayDialogGameInvitation, displayDialogWebsocketDisconnectionError, hideDialogWebsocketDisconnectionError } from "./Dialogs"

export class MainWebSocketManager {
	constructor() {
		this.WS = null
		this.sessionToken = ""
		this.setActiveUsers = null
		this.onlineGame = null
		this.gameData = {}
	}
	baseInit(_sessionToken, _setActiveUsers, _globalChatHistory, _setGlobalChatHistory, _navigate, _setGameData) {
		this.sessionToken = _sessionToken
		console.log("BASE INIT: ", this.sessionToken)
		this.setActiveUsers = _setActiveUsers
		this.globalChatHistory = _globalChatHistory
		this.setGlobalChatHistory = _setGlobalChatHistory
		console.log("globalChatHistory: ", this.globalChatHistory)
		console.log("setGlobalChatHistory: ", this.setGlobalChatHistory)
		this.navigate = _navigate
		this.setGameData = _setGameData
		this.WS = new WebSocket(`${WEBSOCKET_URL}`)
		console.log("websocket created:")
		console.log(this.WS.readyState)
		this.WS.addEventListener('open', () => {
			console.log("Websocket opened")
			console.log(this.WS.readyState)
			hideDialogWebsocketDisconnectionError()
			this.websocketSendMessage("newConnection", {})
			this.websocketSendMessage("getGameData", {})
		})
	}
	websocketSendMessage(type, data) {
		const message = JSON.stringify({ "sessionToken": this.sessionToken, type, data })
		console.log("websocket sending message: ", message)
		if (!this.WS || !this.WS.send) {
			console.log("could not send message")
			return
		}
		this.WS.send(message)
	}
	disconnect() {
		if (this.WS) {
			console.log("disconnection websocket")
			this.WS.close()
			this.WS = null
		}
	}
	updateGlobalChat(newChat) {
		this.globalChatHistory = newChat
	}
}

export class WebSocketManager extends MainWebSocketManager {
	init(_sessionToken, _setActiveUsers, _globalChatHistory, _setGlobalChatHistory, _navigate, _setGameData) {
		this.baseInit(_sessionToken, _setActiveUsers, _globalChatHistory, _setGlobalChatHistory, _navigate, _setGameData)
		this.WS.addEventListener("close", () => {
			console.log("!!! main websocket closed")
			console.log(this.WS.readyState)
			if (this.WS.readyState != 1)
				displayDialogWebsocketDisconnectionError()
		})
		this.WS.onmessage = (event) => {
			console.log("WS on message:", event.data)
			const recv = JSON.parse(event.data)
			const type = recv["type"]
			console.log("received type: ", type)
			const data = JSON.parse(recv["data"])
			console.log("data: ", data)
			switch (type) {
				case "activeUsers":
					this.setActiveUsers(data)
					break
				case "globalChat":
					this.appendToChatHistory(data)
					break
				case "challengeUser":
					displayDialogGameInvitation(data["challenger"])
					break
				case "startOnlineGame":
					this.gameData = data
					this.setGameData(data)
					this.startOnlineGame()
					break
				case "getGameData":
					this.gameData = data
					this.setGameData(data)
					break
				case "gameUpdate":
					this.gameData = data
					this.setGameData(data)
					console.log("updated game")
					break
				case "alreadyPlaying":
					displayAlertBox("Unavailable", `${data["alreadyPlayingPlayer"]} is already in a game`)
					break
				default:
					break
			}
		}
	}
	// ----------------------------------------------------- RECEIVE -----------------------------------------------------
	startOnlineGame() {
		this.navigate("/play/online")
	}
	appendToChatHistory(data) {
		let array = this.globalChatHistory.slice()
		console.log("starting array: ", array)
		let id = 1;
		if (array.length > 0) {
			id = array[array.length - 1][0] + 1
		}
		array.unshift([id, data["time"], data["sender"], data["message"]]);
		if (array.length > 50)
			array.pop()
		console.log("messages array: ", array)
		console.log("set globalChatHistory")
		this.setGlobalChatHistory(array)
	}
	// ----------------------------------------------------- SEND-MESSAGE -----------------------------------------------------
	sendGlobalChat(message) {
		const data = { "message": message }
		this.websocketSendMessage("globalChat", data)
	}
	sendChallenge(challenger, challenged) {
		const data = { challenger, challenged }
		this.websocketSendMessage("challengeUser", data)
	}
	acceptChallenger(challenger, challenged) {
		const data = { challenger, challenged }
		this.websocketSendMessage("acceptChallenge", data)
	}
	makeMove(fromPos, toPos) {
		console.log("Make move: ", fromPos, ", ", toPos)
		const data = { "gameId": this.gameData["gameId"], fromPos, toPos }
		this.websocketSendMessage("makeMove", data)
	}
	makeCastling(fromPos, toPos) {
		console.log("Make castling: ", fromPos, ", ", toPos)
		const data = { "gameId": this.gameData["gameId"], fromPos, toPos }
		this.websocketSendMessage("makeCastling", data)
	}
	sendUserResign() {
		const data = { "gameId": this.gameData["gameId"] }
		this.websocketSendMessage("userResign", data)
	}
}


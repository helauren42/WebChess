import { WEBSOCKET_URL } from "./Const"
import { displayAlertBox, displayDialogGameInvitation, displayDialogWebsocketDisconnectionError } from "./Dialogs"

export class MainWebSocketManager {
  constructor() {
    this.WS = null
    this.activeUsers = []
    this.sessionToken = ""
    this.activeUsers = []
    this.setActiveUsers = null
    this.onlineGame = null
    this.gameData = {}
  }
  baseInit(_sessionToken, _activeUsers, _setActiveUsers, _username, _globalChatHistory, _setGlobalChatHistory, _navigate, _setGameData) {
    this.sessionToken = _sessionToken
    this.activeUsers = _activeUsers
    this.setActiveUsers = _setActiveUsers
    this.username = _username
    this.globalChatHistory = _globalChatHistory
    this.setGlobalChatHistory = _setGlobalChatHistory
    this.navigate = _navigate
    this.setGameData = _setGameData
    this.WS = new WebSocket(`${WEBSOCKET_URL}`)
    this.WS.addEventListener('open', () => {
      this.websocketSendMessage("newConnection", {})
      this.websocketSendMessage("getGameData", {})
    })
  }
  websocketSendMessage(type, data) {
    const message = JSON.stringify({ "sessionToken": this.sessionToken, type, data })
    console.log("websocket sending message: ", message)
    this.WS.send(message)
  }
  disconnect() {
    if (this.WS) {
      this.WS.close()
      this.WS = null
    }
  }
}

export class WebSocketManager extends MainWebSocketManager {
  constructor() {
    super()
  }
  init(_sessionToken, _activeUsers, _setActiveUsers, _username, _globalChatHistory, _setGlobalChatHistory, _navigate, _setGameData) {
    this.baseInit(_sessionToken, _activeUsers, _setActiveUsers, _username, _globalChatHistory, _setGlobalChatHistory, _navigate, _setGameData)
    this.WS.addEventListener("close", () => {
      console.log("websocket closed")
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
          this.setGameData(data)
          this.gameData = data
          this.startOnlineGame()
          break
        case "getGameData":
          this.setGameData(data)
          this.gameData = data
        case "gameUpdate":
          this.setGameData(data)
          this.gameData = data
          console.log("updated game")
          break
        case "alreadyPlaying":
          displayAlertBox("Unavailable", `${data["alreadyPlayingPlayer"]} is already in a game`)
          break
      }
    }
  }
  // ----------------------------------------------------- RECEIVE -----------------------------------------------------
  startOnlineGame() {
    this.navigate("/play/online")
  }
  appendToChatHistory(data) {
    let array = [...this.globalChatHistory.current]
    let id = 1;
    if (array.length > 0) {
      id = array[array.length - 1][0] + 1
    }
    array.unshift([id, data["time"], data["sender"], data["message"]]);
    if (array.length > 50)
      array.pop()
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
    console.log("!!!! MAKEMOVE: ", fromPos, ", ", toPos)
    const data = { "gameId": this.gameData["gameId"], fromPos, toPos }
    this.websocketSendMessage("makeMove", data)
  }
}


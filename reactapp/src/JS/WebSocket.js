import { WEBSOCKET_URL } from "./Const"
import { displayDialogGameInvitation, displayDialogWebsocketDisconnectionError } from "./Dialogs"

export class MainWebSocketManager {
  constructor() {
    this.WS = null
    this.activeUsers = []
    this.sessionToken = ""
    this.activeUsers = []
    this.setActiveUsers = null
  }
  baseInit(_sessionToken, _activeUsers, _setActiveUsers, _username, _globalChatHistory, _setGlobalChatHistory, _navigate) {
    this.sessionToken = _sessionToken
    this.activeUsers = _activeUsers
    this.setActiveUsers = _setActiveUsers
    this.username = _username
    this.globalChatHistory = _globalChatHistory
    this.setGlobalChatHistory = _setGlobalChatHistory
    this.navigate = _navigate
    this.WS = new WebSocket(`${WEBSOCKET_URL}`)
    this.WS.addEventListener('open', () => {
      this.websocketSendMessage("newConnection", {})
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
  init(_sessionToken, _activeUsers, _setActiveUsers, _username, _globalChatHistory, _setGlobalChatHistory, _navigate) {
    this.baseInit(_sessionToken, _activeUsers, _setActiveUsers, _username, _globalChatHistory, _setGlobalChatHistory, _navigate)
    this.WS.addEventListener("close", () => {
      displayDialogWebsocketDisconnectionError()
    })
    this.WS.onmessage = (event) => {
      console.log("WS on message:", event.data)
      const recv = JSON.parse(event.data)
      const type = recv["type"]
      console.log("received type: ", type)
      const data = JSON.parse(recv["data"])
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
          this.startOnlineGame()
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
}


import { WEBSOCKET_URL } from "./Const"
import { displayDialogWebsocketDisconnectionError } from "./Dialogs"

export class MainWebSocketManager {
  constructor() {
    this.WS = null
    this.activeUsers = []
    this.sessionToken = ""
    this.activeUsers = []
    this.setActiveUsers = null
  }
  baseInit(_sessionToken, _activeUsers, _setActiveUsers, _recvGlobalChatMsg, _setRecvGlobalChatMessage, _username) {
    this.sessionToken = _sessionToken
    this.activeUsers = _activeUsers
    this.setActiveUsers = _setActiveUsers
    this.recvGlobalChatMsg = _recvGlobalChatMsg
    this.username = _username
    this.setRecvGlobalChatMessage = _setRecvGlobalChatMessage
    this.WS = new WebSocket(`${WEBSOCKET_URL}`)
    this.WS.addEventListener('open', () => {
      console.log("on open websocket")
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
  init(_sessionToken, _activeUsers, _setActiveUsers, _recvGlobalChatMsg, _setRecvGlobalChatMessage, _username) {
    this.baseInit(_sessionToken, _activeUsers, _setActiveUsers, _recvGlobalChatMsg, _setRecvGlobalChatMessage, _username)
    this.WS.addEventListener("close", () => {
      displayDialogWebsocketDisconnectionError()
    })
    this.WS.onmessage = (event) => {
      console.log("WS on message:", event.data)
      const recv = JSON.parse(event.data)
      console.log("Websocket Recv: ", recv)
      const type = recv["type"]
      console.log("received type: ", type)
      const data = JSON.parse(recv["data"])
      switch (type) {
        case "activeUsers":
          console.log("received active users: ", data)
          this.setActiveUsers(data)
          break
        case "globalChat":
          console.log("received global chat message: ", data)
          this.setRecvGlobalChatMessage(data)
      }
    }
  }
  sendGlobalChat(message) {
    const data = { "message": message }
    this.websocketSendMessage("globalChat", data)
  }
}



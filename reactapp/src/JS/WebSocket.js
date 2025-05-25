import { WEBSOCKET_URL } from "./Const"
import { displayDialogWebsocketDisconnectionError } from "./Dialogs"

export class WebSocketManager {
  constructor() {
    this.WS = null
    this.activeUsers = []
  }
  init(_sessionToken, _activeUsers, _setActiveUsers) {
    this.sessionToken = _sessionToken
    this.activeUsers = _activeUsers
    this.setActiveUsers = _setActiveUsers
    console.log("WS init")
    this.WS = new WebSocket(`${WEBSOCKET_URL}`)
    this.WS.addEventListener('open', () => {
      console.log("on open websocket")
      this.websocketSendMessage(this.sessionToken, "newConnection", {})
    })
    this.WS.addEventListener("close", () => {
      displayDialogWebsocketDisconnectionError()
    })
    this.WS.onmessage = (event) => {
      console.log("WS on message:", event.data)
      const recv = JSON.parse(event.data)
      console.log("Websocket Recv: ", recv)
      const type = recv["type"]
      const data = JSON.parse(recv["data"])
      switch (type) {
        case "activeUsers":
          console.log("received active users: ", data)
          this.setActiveUsers(data)
          break
      }
    }
  }
  websocketSendMessage(sessionToken, type, data) {
    const message = JSON.stringify({ sessionToken, type, data })
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



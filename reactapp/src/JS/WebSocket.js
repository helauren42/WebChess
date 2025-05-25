import { WEBSOCKET_URL } from "./Const"
import { displayDialogWebsocketDisconnectionError } from "./Dialogs"

export class WebSocketManager {
  constructor() {
    this.WS = null
    this.activeUsers = []
  }
  init(sessionToken, _activeUsers, _setActiveUsers) {
    this.activeUsers = _activeUsers
    this.setActiveUsers = _setActiveUsers
    console.log("WS init")
    this.WS = new WebSocket(`${WEBSOCKET_URL}`)
    this.WS.addEventListener('open', () => {
      this.websocketSendMessage(JSON.stringify({
        "type": "newConnection",
        "sessionToken": sessionToken
      }))
    })
    this.WS.addEventListener("close", () => {
      displayDialogWebsocketDisconnectionError()
    })
    this.WS.onmessage = (event) => {
      console.log("WS on message:", event.data)
      const recv = JSON.parse(event.data)
      console.log("Websocket Recv: ", recv)
      const msg = recv["message"]
      const data = JSON.parse(recv["data"])
      switch (msg) {
        case "activeUsers":
          console.log("received active users: ", data)
          this.setActiveUsers(data)
          break
      }
    }
  }
  websocketSendMessage(msg) {
    console.log("websocket sending message: ", msg)
    this.WS.send(msg)
  }
  disconnect() {
    if (this.WS) {
      this.WS.close()
      this.WS = null
    }
  }
}



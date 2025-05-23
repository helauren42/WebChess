import { WEBSOCKET_URL } from "./Const"

class WebSocketManager {
  constructor() {
    this.WS = null
  }
  init(sessionToken) {
    console.log("WS init")
    this.WS = new WebSocket(`${WEBSOCKET_URL}`)
    this.WS.addEventListener('open', () => {
      this.websocketSendMessage(JSON.stringify({
        "type": "newConnection",
        "sessionToken": sessionToken
      }));
    });
    this.WS.onmessage = function(event) {
      console.log("WS on message:")
      console.log(event.data)
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

export const WS = new WebSocketManager()


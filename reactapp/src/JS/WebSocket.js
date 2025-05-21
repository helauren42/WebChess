import { WEBSOCKET_URL } from "./Const"

export let WS = new WebSocket(`${WEBSOCKET_URL}`)
console.log("WS init")

WS.onmessage = function(event) {
  console.log("WS on message:")
  console.log(event.data)
}

const websocketSendMessage = (msg) => {
  console.log("websocket sending message: ", msg)
  WS.send()
}


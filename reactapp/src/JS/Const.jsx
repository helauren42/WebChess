import { WebSocketManager } from "./WebSocket"

const DEPLOY = process.env.REACT_APP_DEPLOY
const DOMAIN = "henrichess.online"
export const PORT = 6453
export const IP_ADDRESS = process.env.REACT_APP_FRONT_IP_ADDRESS
export const SOCKET_ADDRESS = DEPLOY ? "https://www." + DOMAIN : "http://" + IP_ADDRESS + ":" + PORT
export const WEBSOCKET_URL = DEPLOY ? "wss://" + DOMAIN : "ws://" + IP_ADDRESS + ":" + PORT
export const WS = new WebSocketManager()

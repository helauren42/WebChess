export const IP_ADDRESS = process.env.REACT_APP_FRONT_IP_ADDRESS
console.log("IP_ADDRESS: ", IP_ADDRESS)
export const PORT = 6453
export const SOCKET_ADDRESS = "http://" + IP_ADDRESS + ":" + PORT
console.log("SOCKET_ADDRESS: ", SOCKET_ADDRESS)
export const WEBSOCKET_URL = "ws://" + IP_ADDRESS + ":" + PORT + "/ws"

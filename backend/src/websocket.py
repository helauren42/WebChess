from fastapi import WebSocket

class WebsocketManager:
    def __init__(self):
        self.active_connections: dict[str,WebSocket] = {}

    async def newConnection(self, username: str, websocket: WebSocket):
        print("accepted new connection: ", username)
        self.active_connections[username] = websocket

    async def disconnect(self, username: str, websocket: WebSocket):
        self.active_connections.pop(username)

    async def sendMessage(self, message: str, websocket: WebSocket):
        await websocket.send_json(data={"message": message})

    async def removeCloseSockets(self):
        for username, websocket in self.active_connections.items():
            print("client: ", websocket.client)
            print("client state: ", websocket.client_state)

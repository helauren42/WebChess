from fastapi import WebSocket
from abc import ABC
import json

from fastapi.websockets import WebSocketState

class AbstractWebsocketManager(ABC):
    def __init__(self):
        self.active_connections: dict[str,WebSocket] = {}
        self.active_connections_usernames: list[str] = []

    async def newConnection(self, username: str, websocket: WebSocket):
        print("accepted new connection: ", username)
        if self.active_connections_usernames.count(username) > 0:
            await self.disconnect(username)
        self.active_connections[username] = websocket
        self.active_connections_usernames.append(username)

    async def disconnect(self, username: str):
        print("websocket disconnecting: ", username)
        if self.active_connections[username].client_state != WebSocketState.DISCONNECTED:
            await self.active_connections[username].close()
        self.active_connections.pop(username)
        self.active_connections_usernames.remove(username)

    async def sendMessage(self, message: str, data:str, websocket: WebSocket):
        await websocket.send_json(data={"message": message, "data": data})

    async def removeClosedSockets(self):
        toRemove = []
        for username, websocket in self.active_connections.items():
            print("client: ", websocket.client)
            print("client state: ", websocket.client_state)
            if(websocket.client_state == WebSocketState.DISCONNECTED):
                toRemove.append(username)
        for username in toRemove:
            await self.disconnect(username)

class WebsocketManager(AbstractWebsocketManager):
    def __init__(self):
        super().__init__()
    async def msgUpdateActiveUsers(self):
        print("!!!: ", self.active_connections_usernames)
        data = json.dumps(self.active_connections_usernames)
        for username in self.active_connections:
            await self.sendMessage("activeUsers", data, self.active_connections[username])


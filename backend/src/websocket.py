from fastapi import WebSocket
from abc import ABC
import json
import time

from fastapi.websockets import WebSocketState
from database import db

GLOBAL_CHAT_HISTORY_SIZE = 50

class AbstractWebsocketManager(ABC):
    def __init__(self):
        self.active_connections: dict[str,WebSocket] = {}
        self.active_connections_usernames: list[str] = []
        self.session_tokens: dict[str,str] = {}

    async def newConnection(self, username: str, websocket: WebSocket, sessionToken:str):
        print("accepted new connection: ", username)
        if self.active_connections_usernames.count(username) > 0:
            if self.session_tokens[username] != sessionToken:
                print(f"{username} is already connected disconnecting previous session")
                await self.disconnect(username)
        self.active_connections[username] = websocket
        self.active_connections_usernames.append(username)
        self.session_tokens[username] = sessionToken
        print("currently online: ", self.active_connections_usernames)

    async def disconnect(self, username: str):
        print("websocket disconnecting: ", username)
        if self.active_connections[username].client_state != WebSocketState.DISCONNECTED:
            await self.active_connections[username].close()
        self.active_connections.pop(username)
        self.active_connections_usernames.remove(username)
        self.session_tokens.pop(username)
        print("currently online: ", self.active_connections_usernames)

    async def sendMessage(self, type: str, data:str, websocket: WebSocket):
        await websocket.send_json(data={"type": type, "data": data})

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
        activeUsers:tuple = tuple(self.active_connections_usernames)
        for username in self.active_connections:
            usernames:list = list(activeUsers)
            usernames.remove(username)
            data = json.dumps(usernames)
            await self.sendMessage("activeUsers", data, self.active_connections[username])

    async def msgGlobalChat(self, message, sender):
        print("!!!msg msgGlobalChat")
        # time in minutes
        time_minutes = int(time.time() / 60)
        db.addGlobalChatMessage(time_minutes, sender, message)
        data = json.dumps({"message":message, "sender": sender, "time":time_minutes})
        for username in self.active_connections:
            await self.sendMessage("globalChat", data, self.active_connections[username])


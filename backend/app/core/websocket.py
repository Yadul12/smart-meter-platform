from typing import Dict, Set
from fastapi import WebSocket
import json
import asyncio

class ConnectionManager:
    def __init__(self):
        self.channels: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel: str = "events"):
        await websocket.accept()
        if channel not in self.channels:
            self.channels[channel] = set()
        self.channels[channel].add(websocket)

    def disconnect(self, websocket: WebSocket, channel: str = "events"):
        if channel in self.channels:
            self.channels[channel].discard(websocket)

    async def broadcast(self, channel: str, message: dict):
        if channel in self.channels:
            payload = json.dumps(message)
            stale = set()
            for connection in self.channels[channel]:
                try:
                    await connection.send_text(payload)
                except Exception:
                    stale.add(connection)
            for s in stale:
                self.channels[channel].discard(s)

    async def broadcast_all(self, message: dict):
        for ch in list(self.channels.keys()):
            await self.broadcast(ch, message)

ws_manager = ConnectionManager()

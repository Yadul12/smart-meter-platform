from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.core.websocket import ws_manager

from app.api.auth import router as auth_router
from app.api.meters import router as meters_router
from app.api.dcus import router as dcus_router
from app.api.consumers import router as consumers_router
from app.api.hes import router as hes_router
from app.api.mdms import router as mdms_router
from app.api.readings import router as readings_router
from app.api.events import router as events_router
from app.api.alarms import router as alarms_router
from app.api.outages import router as outages_router
from app.api.commands import router as commands_router
from app.api.firmware import router as firmware_router
from app.api.tariffs import router as tariffs_router
from app.api.billing import router as billing_router
from app.api.gis import router as gis_router
from app.api.reports import router as reports_router
from app.api.compliance import router as compliance_router
from app.api.network_tests import router as network_tests_router
from app.api.audit import router as audit_router
from app.api.system import router as system_router
from app.api.simulator import router as simulator_router
from app.api.search import router as search_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    try:
        from app.seed.__main__ import seed_all
        seed_all()
    except Exception as e:
        print("Seed error (ignored if already seeded):", e)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(meters_router, prefix="/api/meters", tags=["meters"])
app.include_router(dcus_router, prefix="/api/dcus", tags=["dcus"])
app.include_router(consumers_router, prefix="/api/consumers", tags=["consumers"])
app.include_router(hes_router, prefix="/api/hes", tags=["hes"])
app.include_router(mdms_router, prefix="/api/mdms", tags=["mdms"])
app.include_router(readings_router, prefix="/api/readings", tags=["readings"])
app.include_router(events_router, prefix="/api/events", tags=["events"])
app.include_router(alarms_router, prefix="/api/alarms", tags=["alarms"])
app.include_router(outages_router, prefix="/api/outages", tags=["outages"])
app.include_router(commands_router, prefix="/api/commands", tags=["commands"])
app.include_router(firmware_router, prefix="/api/firmware", tags=["firmware"])
app.include_router(tariffs_router, prefix="/api/tariffs", tags=["tariffs"])
app.include_router(billing_router, prefix="/api/billing", tags=["billing"])
app.include_router(gis_router, prefix="/api/gis", tags=["gis"])
app.include_router(reports_router, prefix="/api/reports", tags=["reports"])
app.include_router(compliance_router, prefix="/api/compliance", tags=["compliance"])
app.include_router(network_tests_router, prefix="/api/network-tests", tags=["network-tests"])
app.include_router(audit_router, prefix="/api/audit", tags=["audit"])
app.include_router(system_router, prefix="/api/system", tags=["system"])
app.include_router(simulator_router, prefix="/api/simulator", tags=["simulator"])
app.include_router(search_router, prefix="/api/search", tags=["search"])

@app.websocket("/ws/{channel}")
async def websocket_endpoint(websocket: WebSocket, channel: str = "events"):
    await ws_manager.connect(websocket, channel)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, channel)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": settings.VERSION}

import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        candidate = FRONTEND_DIST / full_path
        if full_path and candidate.is_file():
            return FileResponse(str(candidate))
        return FileResponse(str(FRONTEND_DIST / "index.html"))


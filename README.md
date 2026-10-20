# Vardhman Airport Solutions Ltd. — IS 16444 (Part 2) : 2017 Smart Meter Platform

Enterprise **Advanced Metering Infrastructure (AMI)**, **Head-End System (HES)**, **Meter Data Management System (MDMS)**, **Network Operation Center (NOC) Portal**, and **Interactive 15-Slide Specification Deck** compliant with **BIS IS 16444 (Part 2) : 2017** (*AC Static Transformer Operated Watthour & Var-hour Smart Meters — Class 0.2S, 0.5S & 1.0S*) and **IS 15959 (Part 2 & 3) DLMS/COSEM**.

---

## Key Modules & Specification Coverage

1. **NOC & Adatum Energy Live Monitoring Dashboard (`/`)**
   - Real-time KPI telemetry across **104 Smart Meters** (`Class 0.2S`, `0.5S`, `1.0S`, including `SM0123456789`) and **10 Data Concentrator Units (DCUs)**.
   - Interactive **Adatum Energy Smart Meter Monitoring** control center with remote **Activate**, **Deactivate**, and **Reconnect** DLMS/COSEM device commands.
   - 24-Hour Grid Demand Curve & live WebSocket/polling Event Stream.
2. **Interactive 15-Slide IS 16444 (Part 2) Presentation Deck (`/presentation`)**
   - Built-in fullscreen executive presentation covering Scope, Field Engineering, Hardware Anatomy (`Kimbal Kushal U1-CAA1`), Topology Variants 1 & 2 (`C1`, `C2`, `C3`), End-to-End Architecture (`HAN → NAN → WAN → NOC`), Software Development Roadmap (`DCU`, `HES`, `Cloud/Security`, `MDMS`, `Web Dashboard`), Functional Zones (`A–D`), Operating Frequencies, Glossary, Adatum Dashboard, and BIS Table 1 Mandatory Tests.
3. **Clause 9 (Table 1) BIS Mandatory Testing Schedule & Clause 10 Events (`/compliance`)**
   - Complete verification matrix for all **11 BIS Mandatory Acceptance & Type Tests** (`IS 16444 Pt 2`, `IS 14697`, `IS 15884`, `IS 13779`, `IS 14700`).
   - Clause 1 Scope & Explicit Exclusions, Clause 3–4 Glossary, and Clause 10 **"Last Gasp" (Power OFF)** & **"First Breath" (Power ON)** event reporting.
4. **Clause 1 Cellular Certification (4m / 6m / 10m Network Testing) & Field Engineering (`/network-tests`)**
   - Interactive **4-6-10-meter cellular certification test bench** checking power parameters, billing updates, negative-charge disconnection, and consumer email alerts.
   - Interactive **6-Step Field Engineering Workflow** (Old meter removal $\rightarrow$ Smart meter installation $\rightarrow$ Consumer Indexing App $\rightarrow$ Jio GPS & UI IP assignment $\rightarrow$ IP-wise pull into HES $\rightarrow$ HES to MDMS sync).
5. **Clause 5.1 Functional Zones, Clause 5.2 Topology Variants & Software Architecture (`/dataflow`)**
   - Interactive toggle between **Variant 1 (NAN via DCU — C1/C2)** and **Variant 2 (Direct WAN to HES — C3)**, operating frequency bands (`RF Sub-GHz 865–868 MHz`, `PLC 3–148.5 kHz`, `Cellular 2G/3G/4G/NB-IoT 700–2100 MHz & IPv6 OFC`), and software engineering roadmap.

---

## Production Deployment

### 1. Docker (Single Unified Container — Recommended for Cloud)
The root `Dockerfile` builds the React production bundle (`frontend/dist`) and serves both the SPA and FastAPI REST/WebSocket APIs on port `8000`:

```bash
docker build -t vardhman-smart-meter-platform .
docker run -d -p 8000:8000 --name smart-meter-platform vardhman-smart-meter-platform
```

### 2. Render.com / Railway.app (1-Click Cloud Deploy)
Push this repository to GitHub and connect it to Render or Railway. Render automatically detects `render.yaml` and `Dockerfile` and deploys the unified production service with health check `/api/health`.

### 3. Local Production Server (Windows)
Double-click `SHARE_LIVE_LINK.bat` or run:
```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Then open `http://localhost:8000` (Swagger API docs at `http://localhost:8000/docs`).

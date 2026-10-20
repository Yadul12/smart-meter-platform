@echo off
title Vardhman Airport Solutions — Smart Meter Platform (Production Launcher)
echo ============================================================================
echo   Vardhman Airport Solutions Ltd. — IS 16444 (Part 2) Smart Meter Platform
echo ============================================================================
echo.
echo [1/2] Starting Unified Production Server on http://localhost:8000 ...
start "Smart Meter Production Server" cmd /k "cd /d C:\Users\jainy\.gemini\antigravity\scratch\smart-meter-platform\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul

echo [2/2] Creating Public HTTPS Shareable Link (Cloudflare Tunnel)...
echo Copy the "https://....trycloudflare.com" link below to share with anyone!
echo.
npx --yes cloudflared tunnel --url http://127.0.0.1:8000
pause

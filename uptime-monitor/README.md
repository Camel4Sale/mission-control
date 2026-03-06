# 🔍 Uptime Monitor — ALL PROJECTS

**Stand:** 2026-03-06  
**Zweck:** Überwachung ALLER Projekte und Services

---

## 📊 Überwachte Projekte

### Web-Apps (HTTP Checks)

#### Mission Control (Port 3001)
- `/` — Main Dashboard
- `/tasks` — Task-Manager
- `/calendar` — Kalender
- `/projects` — Projekt-Manager
- `/openclaw` — OpenClaw Status

#### Life OS (Port 3002)
- `/` — Main Dashboard
- `/studium` — KIT Study Tools
- `/unternehmen` — Business Apps
- `/docs` — Dokumentation

#### Polymarket Bots (Port 3010)
- `/` — Trading Dashboard
- `/analytics` — Analytics
- `/settings` — Konfiguration

### Prozesse (Process Checks)

#### Node.js Services
- OpenClaw Gateway
- Mission Control
- Life OS
- Polymarket Dashboard

#### Python Services
- RSS-Monitor (`monitor.py`)
- Summarize-Tool (`summarize.py`)
- Blogwatcher

### System-Metriken
- CPU-Auslastung
- Memory-Usage
- Disk-Usage
- System-Uptime

### Docker Container
- OpenClaw Container
- Database Container
- Redis Container
- Andere Services

---

## 🔧 Commands

### Full Uptime Check
```bash
cd /data/.openclaw/workspace
./scripts/uptime-check-all.sh
```

### Quick Port Check
```bash
# Alle Ports prüfen
for port in 3001 3002 3010; do
  nc -z localhost $port && echo "Port $port: OK" || echo "Port $port: DOWN"
done
```

### Process Check
```bash
# Node.js Prozesse
ps aux | grep node

# Python Prozesse
ps aux | grep python
```

### Docker Container
```bash
# Alle Container
docker ps -a

# Nur laufende
docker ps

# Logs
docker logs openclaw-yede-openclaw-1
```

---

## ⏰ Cron-Jobs

### Uptime-Check (alle 15 Min)
```json
{
  "name": "uptime-check-all",
  "schedule": "*/15 * * * *",
  "task": "/data/.openclaw/workspace/scripts/uptime-check-all.sh > /data/.openclaw/workspace/memory/uptime-logs/uptime-$(date +%Y-%m-%d-%H%M).md"
}
```

### Daily Summary (täglich 23:59)
```json
{
  "name": "uptime-daily-summary",
  "schedule": "59 23 * * *",
  "task": "cd /data/.openclaw/workspace/memory/uptime-logs && cat uptime-*.md | grep -E '✅|❌' | sort | uniq -c > daily-summary-$(date +%Y-%m-%d).md"
}
```

### Weekly Report (Sonntag 23:00)
```json
{
  "name": "uptime-weekly-report",
  "schedule": "0 23 * * SUN",
  "task": "cd /data/.openclaw/workspace && ./scripts/uptime-weekly-report.sh > memory/uptime-weekly-$(date +%Y-W%V).md"
}
```

---

## 📈 Output-Struktur

```
/data/.openclaw/workspace/memory/uptime-logs/
├── uptime-2026-03-06-1300.md
├── uptime-2026-03-06-1315.md
├── uptime-2026-03-06-1330.md
├── uptime-2026-03-06-1345.md
├── ...
├── daily-summary-2026-03-06.md
└── weekly-report-2026-W10.md
```

---

## 🚨 Alert-Thresholds

### Kritisch (sofortige Benachrichtigung)
- **Mission Control** DOWN > 5 Min
- **Life OS** DOWN > 5 Min
- **Gateway** DOWN > 1 Min
- **CPU** > 90% > 10 Min
- **Memory** > 95% > 10 Min
- **Disk** > 90%

### Warning (Benachrichtigung bei nächstem Check)
- **Mission Control** DOWN > 1 Min
- **Life OS** DOWN > 1 Min
- **Polymarket** DOWN > 5 Min
- **CPU** > 80% > 5 Min
- **Memory** > 85% > 5 Min
- **Disk** > 80%

### Info (nur im Daily/Weekly Report)
- Einzelne Endpoints DOWN
- Kurze Spikes (< 1 Min)
- Geplante Wartung

---

## 📊 Dashboard Integration

### OpenClaw Status Screen
Der Uptime-Check integriert sich in das OpenClaw-Dashboard:

```
/uptime
├── Current Status (alle Services)
├── 24h History
├── 7d History
├── Incidents
└── Performance Metrics
```

### Mission Control Integration
```
/monitoring
├── Live Status
├── Alerts
├── History
└── Reports
```

---

## 🔔 Notification-Channels

### Telegram
- Kritische Alerts → Sofort
- Warning Alerts → Batch (stündlich)
- Daily Summary → 23:59

### Discord
- Alle Alerts → #monitoring-alerts
- Daily Summary → #monitoring-daily
- Weekly Report → #monitoring-weekly

### Email (AgentMail)
- Kritische Alerts → Sofort
- Weekly Report → Sonntag 23:00

---

## 🛠️ Troubleshooting

### Service DOWN
```bash
# Logs prüfen
docker logs <container-name>

# Neustarten
docker restart <container-name>

# Ressourcen prüfen
docker stats
```

### Hohe CPU
```bash
# Top Prozesse
top -bn1 | head -20

# Node.js spezifisch
node --inspect <script>
```

### Hoher Memory
```bash
# Memory-Hogs
ps aux --sort=-%mem | head -10

# GC erzwingen (Node.js)
kill -SIGUSR1 <pid>
```

### Volle Disk
```bash
# Größte Dateien
du -ah / | sort -rh | head -20

# Docker Cleanup
docker system prune -a

# Logs rotieren
logrotate -f /etc/logrotate.conf
```

---

**Uptime-Monitoring für ALLE Projekte aktiv!** 🔍✅

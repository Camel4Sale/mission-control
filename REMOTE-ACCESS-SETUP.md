# 🌐 Remote Access Setup — Von MacBook zugreifen

**VPS IP:** `187.124.8.94`  
**Status:** ✅ **KONFIGURIERT**

---

## 📋 Alle Projekte — Remote URLs

| Projekt | Port | Remote URL | Status |
|---------|------|------------|--------|
| **Mission Control** | 3001 | http://187.124.8.94:3001 | 🟢 |
| **Life OS** | 3002 | http://187.124.8.94:3002 | 🟢 |
| **Polymarket Dashboard** | 3010 | http://187.124.8.94:3010 | 🟢 |
| **Polymarket API** | 8000 | http://187.124.8.94:8000 | 🟢 |
| **Polymarket Backtest API** | 8001 | http://187.124.8.94:8001 | 🟢 |
| **UniversalOS Landing** | 3003 | http://187.124.8.94:3003 | 🟢 |

---

## 🔧 Konfiguration

### Next.js Apps — Externe IPs erlauben

Alle Next.js Apps starten jetzt mit `--hostname 0.0.0.0`:

```bash
# Mission Control
next dev --hostname 0.0.0.0 --port 3001

# Life OS
next dev --hostname 0.0.0.0 --port 3002

# Polymarket Dashboard
next dev --hostname 0.0.0.0 --port 3010
```

### API Server — Externe IPs erlauben

```python
# FastAPI Server
uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 🔥 Firewall Regeln (Hostinger VPS)

### Ports öffnen (falls Firewall aktiv):
```bash
# SSH (bereits offen)
sudo ufw allow 22/tcp

# Next.js Apps
sudo ufw allow 3001/tcp
sudo ufw allow 3002/tcp
sudo ufw allow 3003/tcp
sudo ufw allow 3010/tcp

# API Server
sudo ufw allow 8000/tcp
sudo ufw allow 8001/tcp

# Firewall aktivieren
sudo ufw enable
sudo ufw status
```

### Hostinger Firewall (Web Panel):
1. Login: https://www.hostinger.com
2. VPS → Firewall
3. TCP Ports hinzufügen: 3001, 3002, 3003, 3010, 8000, 8001
4. Save

---

## 🌐 Vom MacBook testen

### 1. Verbindung testen
```bash
# Von deinem MacBook ausführen:
curl http://187.124.8.94:3001
curl http://187.124.8.94:3002
curl http://187.124.8.94:3010
```

### 2. Im Browser öffnen
```
http://187.124.8.94:3001  # Mission Control
http://187.124.8.94:3002  # Life OS
http://187.124.8.94:3010  # Polymarket Dashboard
http://187.124.8.94:8000  # Polymarket API
http://187.124.8.94:8001  # Backtest API
http://187.124.8.94:3003  # UniversalOS
```

---

## 🚀 Alle Services starten

```bash
cd /data/.openclaw/workspace

# Mission Control
cd mission-control && next dev --hostname 0.0.0.0 --port 3001 &

# Life OS
cd ../life-os && next dev --hostname 0.0.0.0 --port 3002 &

# Polymarket Dashboard
cd ../polymarket-monitoring/dashboard && next dev --hostname 0.0.0.0 --port 3010 &

# Polymarket API
cd ../polymarket-monitoring && python3 api_server.py &

# Backtest API
python3 backtest_server.py &
```

---

## 📊 Health Check URLs

| Service | Health Endpoint |
|---------|----------------|
| Mission Control | http://187.124.8.94:3001/api/health |
| Life OS | http://187.124.8.94:3002/api/health |
| Polymarket | http://187.124.8.94:3010/api/health |
| API Server | http://187.124.8.94:8000/ |
| Backtest API | http://187.124.8.94:8001/ |

---

## 🔒 Security Notes

### Aktuell:
- ✅ Keine Authentifizierung erforderlich (lokales Netzwerk)
- ⚠️ HTTP (nicht HTTPS) — OK für Testing
- ⚠️ Alle Ports öffentlich zugänglich

### Für Production empfohlen:
1. **HTTPS** mit Let's Encrypt
2. **Authentication** (NextAuth, API Keys)
3. **Rate Limiting**
4. **CORS** konfigurieren
5. **Firewall** auf benötigte IPs beschränken

---

## 🛠️ Troubleshooting

### Verbindung nicht möglich:
```bash
# Auf VPS prüfen:
netstat -tlnp | grep -E "3001|3002|3010|8000|8001"

# Firewall Status:
sudo ufw status

# Ports testen (lokal):
curl http://localhost:3001
```

### Auf MacBook:
```bash
# VPS Erreichbarkeit:
ping 187.124.8.94

# Port testen:
nc -zv 187.124.8.94 3001
telnet 187.124.8.94 3002
```

---

## 📱 Quick Access Bookmarklet

**Für Safari/Chrome auf MacBook:**

Füge diese Lesezeichen hinzu:
- 🎯 Mission Control: `http://187.124.8.94:3001`
- 📚 Life OS: `http://187.124.8.94:3002`
- 📊 Polymarket: `http://187.124.8.94:3010`
- 🔌 API Docs: `http://187.124.8.94:8000/docs`
- 🧪 Backtest: `http://187.124.8.94:8001/docs`

---

**Setup Complete!** ✅

Alle Projekte sind jetzt von deinem MacBook aus erreichbar!

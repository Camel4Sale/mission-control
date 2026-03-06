#!/bin/bash
# Uptime Check ALL — Überprüft ALLE Projekte

TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
OUTPUT_DIR="/data/.openclaw/workspace/memory/uptime-logs"
mkdir -p "$OUTPUT_DIR"

echo "# 🔍 Uptime Check — $TIMESTAMP"
echo ""

# Farbdefinitionen
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check URL
check_url() {
    local name=$1
    local url=$2
    local expected=${3:-200}
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$url" 2>/dev/null)
    
    if [ "$response" == "$expected" ]; then
        echo -e "✅ **$name** — $response"
        return 0
    elif [ "$response" == "000" ]; then
        echo -e "❌ **$name** — Nicht erreichbar"
        return 1
    else
        echo -e "⚠️  **$name** — $response (expected: $expected)"
        return 1
    fi
}

# Function to check process
check_process() {
    local name=$1
    local pattern=$2
    
    if pgrep -f "$pattern" > /dev/null 2>&1; then
        echo -e "✅ **$name** — Running"
        return 0
    else
        echo -e "❌ **$name** — Not running"
        return 1
    fi
}

# Function to check port
check_port() {
    local name=$1
    local port=$2
    
    if nc -z localhost "$port" 2>/dev/null; then
        echo -e "✅ **$name** (:$port) — Open"
        return 0
    else
        echo -e "❌ **$name** (:$port) — Closed"
        return 1
    fi
}

echo "## 🌐 Web-Apps (HTTP Check)"
echo ""

# Mission Control
check_url "Mission Control" "http://localhost:3001"
check_url "Mission Control /tasks" "http://localhost:3001/tasks"
check_url "Mission Control /calendar" "http://localhost:3001/calendar"
check_url "Mission Control /projects" "http://localhost:3001/projects"
check_url "Mission Control /openclaw" "http://localhost:3001/openclaw"
echo ""

# Life OS
check_url "Life OS" "http://localhost:3002"
check_url "Life OS /studium" "http://localhost:3002/studium"
check_url "Life OS /unternehmen" "http://localhost:3002/unternehmen"
check_url "Life OS /docs" "http://localhost:3002/docs"
echo ""

# Polymarket Bots
check_url "Polymarket Dashboard" "http://localhost:3010"
echo ""

echo "## ⚙️ Prozesse (Process Check)"
echo ""

# Node.js Prozesse
check_process "Node.js" "node"
check_process "OpenClaw Gateway" "openclaw"
echo ""

# Python Prozesse
check_process "RSS-Monitor" "monitor.py"
check_process "Summarize" "summarize.py"
echo ""

echo "## 📊 System-Status"
echo ""

# CPU
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "N/A")
echo "- **CPU:** ${CPU}%"

# Memory
MEM=$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}' 2>/dev/null || echo "N/A")
echo "- **Memory:** ${MEM}"

# Disk
DISK=$(df -h / | awk 'NR==2{print $5}' 2>/dev/null || echo "N/A")
echo "- **Disk:** ${DISK}"

# Uptime
UPTIME=$(uptime -p 2>/dev/null || uptime | awk -F, '{print $1}' | awk -F'up ' '{print $2}')
echo "- **Uptime:** ${UPTIME}"

echo ""
echo "## 🐳 Docker Container"
echo ""

# Docker Container Status
if command -v docker &> /dev/null; then
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Keine Container"
else
    echo "Docker nicht verfügbar"
fi

echo ""
echo "## 📈 Zusammenfassung"
echo ""

# Count successes and failures
TOTAL=0
SUCCESS=0

# Re-run checks silently for counting
for port in 3001 3002 3010; do
    TOTAL=$((TOTAL + 1))
    if nc -z localhost "$port" 2>/dev/null; then
        SUCCESS=$((SUCCESS + 1))
    fi
done

echo "- **Services geprüft:** $TOTAL"
echo "- **Online:** $SUCCESS"
echo "- **Offline:** $((TOTAL - SUCCESS))"
echo "- **Verfügbarkeit:** $(echo "scale=1; $SUCCESS * 100 / $TOTAL" | bc)%"

echo ""
echo "---"
echo "**Check abgeschlossen:** $(date)"

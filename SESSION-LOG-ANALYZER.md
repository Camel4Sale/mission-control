# 📜 Session-Log Analyzer

**Stand:** 2026-03-06  
**Zweck:** Historische Sessions analysieren für Self-Improvement

---

## 🎯 Use-Cases

### 1. **Self-Improvement**
- Eigene Fehler analysieren
- Learning-Patterns erkennen
- Wiederkehrende Probleme identifizieren
- Fortschritt tracken über Zeit

### 2. **Project-Reviews**
- Welche Projekte waren erfolgreich?
- Welche Strategien haben funktioniert?
- Time-Tracking pro Projekt
- Success Metrics analysieren

### 3. **Model-Performance**
- Welche Models wurden genutzt?
- Token-Usage pro Model
- Cost-Analyse
- Performance-Vergleich

### 4. **User-Feedback**
- User-Requests tracken
- Feature-Wünsche sammeln
- Pain-Points identifizieren
- Satisfaction-Tracking

---

## 🔧 jq Commands für Log-Analyse

### Session-Logs durchsuchen

```bash
# Alle Sessions von heute
cat /data/.openclaw/logs/sessions-2026-03-06.jsonl | jq 'select(.timestamp | startswith("2026-03-06"))'

# Nach Tool-Calls filtern
cat /data/.openclaw/logs/*.jsonl | jq 'select(.type == "tool_call")'

# Nach Fehler filtern
cat /data/.openclaw/logs/*.jsonl | jq 'select(.error != null)'

# Sessions nach Agent filtern
cat /data/.openclaw/logs/*.jsonl | jq 'select(.agentId == "main")'
```

### Statistiken erstellen

```bash
# Token-Usage pro Session
cat /data/.openclaw/logs/*.jsonl | jq -s 'group_by(.sessionId) | map({sessionId: .[0].sessionId, totalTokens: (map(.tokens.in + .tokens.out) | add)})'

# Tool-Calls zählen
cat /data/.openclaw/logs/*.jsonl | jq -s '[.[] | select(.type == "tool_call") | .tool] | group_by(.) | map({tool: .[0], count: length})'

# Sessions pro Tag
cat /data/.openclaw/logs/*.jsonl | jq -s 'group_by(.timestamp[:10]) | map({date: .[0].timestamp[:10], sessions: length})'
```

### Fehler-Analyse

```bash
# Alle Errors der letzten 7 Tage
cat /data/.openclaw/logs/*.jsonl | jq 'select(.error != null and (.timestamp | strptime("%Y-%m-%d") | mktime) > (now - 604800))'

# Error-Rate pro Tool
cat /data/.openclaw/logs/*.jsonl | jq -s '[.[] | select(.type == "tool_call")] | group_by(.tool) | map({tool: .[0].tool, errors: [.[] | select(.error != null)] | length, total: length, rate: (([.[] | select(.error != null)] | length) / length * 100)})'

# Häufigste Error-Messages
cat /data/.openclaw/logs/*.jsonl | jq -s '[.[] | select(.error != null) | .error.message] | group_by(.) | map({message: .[0], count: length}) | sort_by(-.count)'
```

### Projekt-Analyse

```bash
# Sessions nach Projekt-Label
cat /data/.openclaw/logs/*.jsonl | jq -s '[.[] | select(.label != null)] | group_by(.label) | map({project: .[0].label, sessions: length, tokens: (map(.tokens.in + .tokens.out) | add)})'

# Duration pro Session
cat /data/.openclaw/logs/*.jsonl | jq -s 'group_by(.sessionId) | map({sessionId: .[0].sessionId, duration: ((.[].timestamp | strptime("%Y-%m-%dT%H:%M:%S") | mktime) | max - min)})'

# Success-Rate pro Projekt
cat /data/.openclaw/logs/*.jsonl | jq -s '[.[] | select(.label != null)] | group_by(.label) | map({project: .[0].label, success: [.[] | select(.status == "completed")] | length, total: length, rate: (([.[] | select(.status == "completed")] | length) / length * 100)})'
```

---

## 📊 Weekly Report Generator

### Script: `weekly-report.sh`

```bash
#!/bin/bash

# Letzte 7 Tage analysieren
WEEK_AGO=$(date -d "7 days ago" +%Y-%m-%d)
TODAY=$(date +%Y-%m-%d)

echo "# 📊 Weekly Report: $WEEK_AGO - $TODAY"
echo ""

## Sessions Overview
echo "## 🔄 Sessions"
cat /data/.openclaw/logs/*.jsonl | \
  jq -r --arg start "$WEEK_AGO" --arg end "$TODAY" \
  'select(.timestamp >= $start and .timestamp <= $end) | .sessionId' | \
  sort -u | wc -l | \
  xargs echo "Total Sessions:"

## Token Usage
echo ""
echo "## 💰 Token Usage"
cat /data/.openclaw/logs/*.jsonl | \
  jq -r --arg start "$WEEK_AGO" --arg end "$TODAY" \
  'select(.timestamp >= $start and .timestamp <= $end) | (.tokens.in + .tokens.out)' | \
  awk '{sum+=$1} END {print "Total Tokens:", sum}'

## Top Projects
echo ""
echo "## 🚀 Top Projects"
cat /data/.openclaw/logs/*.jsonl | \
  jq -r --arg start "$WEEK_AGO" --arg end "$TODAY" \
  'select(.timestamp >= $start and .timestamp <= $end and .label != null) | .label' | \
  sort | uniq -c | sort -rn | head -5

## Errors
echo ""
echo "## ⚠️ Errors"
cat /data/.openclaw/logs/*.jsonl | \
  jq -r --arg start "$WEEK_AGO" --arg end "$TODAY" \
  'select(.timestamp >= $start and .timestamp <= $end and .error != null) | .error.message' | \
  sort | uniq -c | sort -rn | head -5
```

---

## 🔄 Integration in Auto-Optimization

### Cron-Job: Weekly Report (Sonntag 17:00)

```json
{
  "name": "weekly-session-report",
  "schedule": "0 17 * * SUN",
  "task": "cd /data/.openclaw/workspace && ./scripts/weekly-report.sh > memory/weekly-report-$(date +%Y-%W).md"
}
```

### Cron-Job: Daily Error-Check (täglich 23:00)

```json
{
  "name": "daily-error-check",
  "schedule": "0 23 * * *",
  "task": "cat /data/.openclaw/logs/*.jsonl | jq 'select(.error != null)' | tail -20 >> memory/error-log-$(date +%Y-%m-%d).md"
}
```

---

## 📈 Success Metrics

### Pro Woche tracken:
- **Sessions:** Anzahl
- **Token-Usage:** Total, pro Session, pro Model
- **Success-Rate:** % completed
- **Error-Rate:** % failed
- **Top Projects:** Meiste Sessions
- **Top Tools:** Meiste Calls

### Pro Monat:
- **Trend-Analyse:** Sessions ↑↓
- **Cost-Development:** Token-Kosten
- **Improvement:** Error-Rate ↓
- **Learning:** Neue Patterns

---

## 🚀 Quick Commands

```bash
# Heutige Sessions zählen
sessions_list --today

# Letzte Session anzeigen
sessions_history --limit 1

# Nach Projekt suchen
sessions_list --label "polymarket"

# Token-Usage heute
sessions_list --today | jq '.tokens | .in + .out'

# Errors heute
sessions_list --today --errors
```

---

**Session-Log-Analyse ready für Self-Improvement!** 📜🧠

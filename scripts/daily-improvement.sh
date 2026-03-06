#!/bin/bash
# Daily Self-Improvement Script — 23:00 täglich

TODAY=$(date +%Y-%m-%d)
OUTPUT="/data/.openclaw/workspace/memory/daily-improvement-$TODAY.md"

echo "# 🧠 Daily Improvement — $TODAY" > $OUTPUT
echo "" >> $OUTPUT

## Alle Sessions heute analysieren
echo "## 📊 Session-Übersicht" >> $OUTPUT
SESSION_COUNT=$(ls /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | wc -l)
echo "**Sessions:** $SESSION_COUNT" >> $OUTPUT
echo "" >> $OUTPUT

## Token-Usage heute
echo "## 💰 Token-Usage" >> $OUTPUT
cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | \
  jq -r '.tokens.in + .tokens.out' | awk '{sum+=$1} END {print "**Total Tokens:**", sum}' >> $OUTPUT
echo "" >> $OUTPUT

## Tool-Calls heute
echo "## 🔧 Tool-Calls" >> $OUTPUT
TOTAL=$(cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | jq -r 'select(.type == "tool_call")' | wc -l)
ERRORS=$(cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | jq -r 'select(.type == "tool_call" and .error != null)' | wc -l)
echo "- Total: $TOTAL" >> $OUTPUT
echo "- Errors: $ERRORS" >> $OUTPUT
if [ $TOTAL -gt 0 ]; then
  RATE=$(echo "scale=2; ($TOTAL - $ERRORS) * 100 / $TOTAL" | bc)
  echo "- Success-Rate: $RATE%" >> $OUTPUT
fi
echo "" >> $OUTPUT

## Top Tools
echo "## 🛠️ Top Tools" >> $OUTPUT
cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | \
  jq -r 'select(.type == "tool_call") | .name' | \
  sort | uniq -c | sort -rn | head -5 | \
  awk '{print "- " $2 ": " $1}' >> $OUTPUT
echo "" >> $OUTPUT

## Errors heute
echo "## ⚠️ Errors" >> $OUTPUT
cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | \
  jq -r 'select(.error != null) | .error.message' | \
  sort | uniq -c | sort -rn | head -5 | \
  awk '{print "- " $0}' >> $OUTPUT
echo "" >> $OUTPUT

## Learnings (Platzhalter)
echo "## 🧠 Learnings" >> $OUTPUT
echo "_(_Manuell zu ergänzen nach Review)_ " >> $OUTPUT
echo "" >> $OUTPUT

## Optimierungen (Platzhalter)
echo "## 🔄 Optimierungen" >> $OUTPUT
echo "_(_Manuell zu ergänzen nach Review)_ " >> $OUTPUT
echo "" >> $OUTPUT

## Nächste Schritte
echo "## 📋 Nächste Schritte" >> $OUTPUT
echo "- [ ] Learnings in MEMORY.md übernehmen" >> $OUTPUT
echo "- [ ] Optimierungen anwenden" >> $OUTPUT
echo "- [ ] Prompt-Templates updaten" >> $OUTPUT
echo "- [ ] Cron-Jobs optimieren" >> $OUTPUT
echo "" >> $OUTPUT

echo "**Generated:** $(date)" >> $OUTPUT

echo "✅ Daily Improvement erstellt: $OUTPUT"

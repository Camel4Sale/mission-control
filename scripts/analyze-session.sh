#!/bin/bash
# Session-Analyse Script — Self-Improvement

SESSION_ID="${1:-latest}"
OUTPUT_DIR="/data/.openclaw/workspace/memory/session-analysis"

mkdir -p "$OUTPUT_DIR"

echo "# 📊 Session-Analyse: $SESSION_ID"
echo "**Datum:** $(date)"
echo ""

# Session-Log finden
if [ "$SESSION_ID" == "latest" ]; then
  SESSION_FILE=$(ls -t /data/.openclaw/agents/main/sessions/*.jsonl | head -1)
else
  SESSION_FILE=$(find /data/.openclaw/agents/main/sessions/ -name "*$SESSION_ID*.jsonl" | head -1)
fi

if [ -z "$SESSION_FILE" ]; then
  echo "❌ Session nicht gefunden: $SESSION_ID"
  exit 1
fi

echo "**Session:** $SESSION_FILE"
echo ""

## Duration
echo "## ⏱️ Duration"
FIRST_TS=$(cat "$SESSION_FILE" | jq -r '.timestamp' | head -1)
LAST_TS=$(cat "$SESSION_FILE" | jq -r '.timestamp' | tail -1)
echo "- Start: $FIRST_TS"
echo "- End: $LAST_TS"
echo ""

## Tool-Calls
echo "## 🔧 Tool-Calls"
TOTAL_CALLS=$(cat "$SESSION_FILE" | jq -r 'select(.type == "tool_call")' | wc -l)
SUCCESS_CALLS=$(cat "$SESSION_FILE" | jq -r 'select(.type == "tool_call" and .error == null)' | wc -l)
ERROR_CALLS=$(cat "$SESSION_FILE" | jq -r 'select(.type == "tool_call" and .error != null)' | wc -l)
echo "- Total: $TOTAL_CALLS"
echo "- Success: $SUCCESS_CALLS"
echo "- Errors: $ERROR_CALLS"
echo "- Success-Rate: $(echo "scale=2; $SUCCESS_CALLS * 100 / $TOTAL_CALLS" | bc)%"
echo ""

## Tokens
echo "## 💰 Tokens"
TOKENS_IN=$(cat "$SESSION_FILE" | jq -r '.tokens.in // 0' | awk '{sum+=$1} END {print sum}')
TOKENS_OUT=$(cat "$SESSION_FILE" | jq -r '.tokens.out // 0' | awk '{sum+=$1} END {print sum}')
TOTAL_TOKENS=$((TOKENS_IN + TOKENS_OUT))
echo "- In: $TOKENS_IN"
echo "- Out: $TOKENS_OUT"
echo "- Total: $TOTAL_TOKENS"
echo ""

## Models
echo "## 🤖 Models"
cat "$SESSION_FILE" | jq -r '.model' | sort | uniq -c | sort -rn
echo ""

## Errors
echo "## ⚠️ Errors"
cat "$SESSION_FILE" | jq -r 'select(.error != null) | .error.message' | sort | uniq -c | sort -rn | head -10
echo ""

## Learnings extrahieren
echo "## 🧠 Learnings"
echo "_(Manuell zu ergänzen nach Review)_ "
echo ""

## Optimierungen
echo "## 🔄 Optimierungen"
echo "_(Manuell zu ergänzen nach Review)_ "
echo ""

echo "---"
echo "**Analyse abgeschlossen:** $(date)"

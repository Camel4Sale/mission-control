#!/bin/bash
# Weekly Session Report — Automatische Analyse

WEEK_AGO=$(date -d "7 days ago" +%Y-%m-%d)
TODAY=$(date +%Y-%m-%d)
OUTPUT="/data/.openclaw/workspace/memory/weekly-report-$WEEK_AGO-$TODAY.md"

echo "# 📊 Weekly Session Report" > $OUTPUT
echo "**Period:** $WEEK_AGO - $TODAY" >> $OUTPUT
echo "" >> $OUTPUT

## Sessions Overview
echo "## 🔄 Sessions" >> $OUTPUT
cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | \
  jq -r '.sessionId' | sort -u | wc -l | \
  xargs echo "**Total Sessions:**" >> $OUTPUT
echo "" >> $OUTPUT

## Token Usage
echo "## 💰 Token Usage" >> $OUTPUT
cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | \
  jq -r '.tokens.in + .tokens.out' | awk '{sum+=$1} END {print "**Total Tokens:**", sum}' >> $OUTPUT
echo "" >> $OUTPUT

## Top Projects
echo "## 🚀 Top Projects" >> $OUTPUT
cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | \
  jq -r 'select(.label != null) | .label' | \
  sort | uniq -c | sort -rn | head -5 | \
  awk '{print "- " $2 ": " $1 " sessions"}' >> $OUTPUT
echo "" >> $OUTPUT

## Errors
echo "## ⚠️ Errors" >> $OUTPUT
cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | \
  jq -r 'select(.error != null) | .error.message' | \
  sort | uniq -c | sort -rn | head -5 | \
  awk '{print "- " $0}' >> $OUTPUT
echo "" >> $OUTPUT

## Models
echo "## 🤖 Models Used" >> $OUTPUT
cat /data/.openclaw/agents/main/sessions/*.jsonl 2>/dev/null | \
  jq -r '.model' | sort | uniq -c | sort -rn | \
  awk '{print "- " $2 ": " $1 " calls"}' >> $OUTPUT
echo "" >> $OUTPUT

echo "**Generated:** $(date)" >> $OUTPUT

echo "✅ Weekly Report erstellt: $OUTPUT"

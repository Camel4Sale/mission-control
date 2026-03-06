#!/bin/bash
# Install Cron Jobs for Summarize Tool
# Run this script to set up automated daily/weekly summaries

echo "🕐 Setting up cron jobs for summarize tool..."

# Check if crontab is available
if ! command -v crontab &> /dev/null; then
    echo "❌ crontab not found. Please install cron:"
    echo "   Debian/Ubuntu: sudo apt install cron"
    echo "   macOS: brew install cron"
    echo ""
    echo "Manual setup - add these lines to your crontab (crontab -e):"
    cat << 'CRON'
# Daily Tech Summary at 8:30 AM
30 8 * * * cd /data/.openclaw/workspace/summarize && python3 monitor.py daily >> /data/.openclaw/workspace/summarize/cron.log 2>&1

# Weekly Podcast Review on Friday at 4:00 PM
0 16 * * 5 cd /data/.openclaw/workspace/summarize && python3 monitor.py weekly >> /data/.openclaw/workspace/summarize/cron.log 2>&1
CRON
    exit 1
fi

# Backup existing crontab
crontab -l > /tmp/cron_backup_$(date +%Y%m%d_%H%M%S).txt 2>/dev/null || true

# Add summarize jobs (avoid duplicates)
(crontab -l 2>/dev/null | grep -v "summarize" || true; cat << 'CRON'
# Daily Tech Summary at 8:30 AM
30 8 * * * cd /data/.openclaw/workspace/summarize && python3 monitor.py daily >> /data/.openclaw/workspace/summarize/cron.log 2>&1

# Weekly Podcast Review on Friday at 4:00 PM
0 16 * * 5 cd /data/.openclaw/workspace/summarize && python3 monitor.py weekly >> /data/.openclaw/workspace/summarize/cron.log 2>&1
CRON
) | crontab -

echo "✅ Cron jobs installed!"
echo ""
echo "Current crontab:"
crontab -l
echo ""
echo "Logs will be written to: /data/.openclaw/workspace/summarize/cron.log"

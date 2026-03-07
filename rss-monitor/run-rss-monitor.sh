#!/bin/bash
# RSS Monitor - Persistent Runner Script
# Usage: ./run-rss-monitor.sh

cd /data/.openclaw/workspace/rss-monitor

# Activate virtualenv if exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run monitor
echo "🚀 Starting RSS Monitor..."
python3 monitor.py

# Exit with same code as python script
exit $?

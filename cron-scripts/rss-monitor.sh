#!/bin/bash
# RSS Monitor - Cron Script (every 30 min)
cd /data/.openclaw/workspace/rss-monitor && python3 monitor.py >> /tmp/rss-monitor.log 2>&1

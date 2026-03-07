#!/bin/bash
# Daily Summarize - Cron Script (18:00 daily)
cd /data/.openclaw/workspace/summarize && ./run-summarize-daily.sh >> /tmp/summarize.log 2>&1

#!/bin/bash
# Blogwatcher Daily Check - 9:00 AM
# Wird von OpenClaw Cron/Scheduler aufgerufen

cd /data/.openclaw/workspace
/data/.npm-global/bin/blogwatcher check >> /data/.openclaw/workspace/trending/blogwatcher.log 2>&1

echo "[$(date)] Blogwatcher daily check completed"

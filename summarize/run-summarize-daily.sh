#!/bin/bash
# Daily Summarize Script
# Fetches top trending videos/news and creates summaries

cd /data/.openclaw/workspace/summarize

# Activate virtualenv if exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "🧠 Starting Daily Summarize..."
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
LOGFILE="/data/.openclaw/workspace/summaries/summarize-$TIMESTAMP.log"

# Get trending URLs from RSS feeds
TRENDING_FILE="/data/.openclaw/workspace/trending/feeds-$(date +%Y-%m-%d).json"

if [ -f "$TRENDING_FILE" ]; then
    echo "📰 Reading trending from $TRENDING_FILE"
    
    # Extract top 3 video URLs (adjust based on your feed structure)
    # This is a placeholder - customize based on actual JSON structure
    python3 -c "
import json
with open('$TRENDING_FILE') as f:
    data = json.load(f)
    # Extract video URLs from feeds
    videos = [item.get('url') for feed in data.get('feeds', []) for item in feed.get('items', []) if 'youtube' in item.get('url', '').lower()]
    for url in videos[:3]:  # Top 3 videos
        print(url)
" | while read URL; do
        if [ -n "$URL" ]; then
            echo "🎬 Summarizing: $URL"
            python3 summarize.py "$URL" 2>&1 | tee -a "$LOGFILE"
        fi
    done
else
    echo "⚠️ No trending file found for today"
fi

echo "✅ Daily Summarize complete!"
echo "📝 Log: $LOGFILE"

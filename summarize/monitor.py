#!/usr/bin/env python3
"""
Monitor Tool - Automated Content Summarization
Scheduled tasks for daily tech summaries and weekly podcast reviews
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

# Configuration
SUMMARIES_DIR = Path("/data/.openclaw/workspace/summaries")
CONFIG_FILE = Path("/data/.openclaw/workspace/summarize/monitor.json")
LOG_FILE = Path("/data/.openclaw/workspace/summarize/monitor.log")

# Default sources to monitor
DEFAULT_SOURCES = {
    "daily_tech": [
        # Add tech news RSS feeds or URLs here
        # "https://example.com/tech-rss"
    ],
    "weekly_podcast": [
        # Add podcast URLs here
        # "https://youtube.com/watch?v=example"
    ]
}

def log(message: str):
    """Print timestamped log message"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_msg = f"[{timestamp}] {message}"
    print(log_msg)
    
    # Append to log file
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(log_msg + "\n")

def load_config() -> dict:
    """Load or create configuration"""
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    else:
        config = {"sources": DEFAULT_SOURCES, "last_run": None}
        save_config(config)
        return config

def save_config(config: dict):
    """Save configuration"""
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2)

def run_daily_tech_summary():
    """Run daily tech summary collection"""
    log("=== Daily Tech Summary ===")
    
    config = load_config()
    sources = config.get("sources", {}).get("daily_tech", [])
    
    if not sources:
        log("No tech sources configured. Edit monitor.json to add URLs.")
        return
    
    from summarize import summarize_url
    
    for url in sources:
        try:
            log(f"Processing: {url}")
            result = summarize_url(url)
            if result:
                log(f"✓ Saved: {result}")
        except Exception as e:
            log(f"✗ Error: {e}")
    
    log("=== Daily Tech Summary Complete ===")

def run_weekly_podcast_review():
    """Run weekly podcast review"""
    log("=== Weekly Podcast Review ===")
    
    config = load_config()
    sources = config.get("sources", {}).get("weekly_podcast", [])
    
    if not sources:
        log("No podcast sources configured. Edit monitor.json to add URLs.")
        return
    
    from summarize import summarize_youtube
    
    for url in sources:
        try:
            log(f"Processing: {url}")
            result = summarize_youtube(url)
            if result:
                log(f"✓ Saved: {result}")
        except Exception as e:
            log(f"✗ Error: {e}")
    
    log("=== Weekly Podcast Review Complete ===")

def list_summaries():
    """List all generated summaries"""
    log("=== Generated Summaries ===")
    
    if not SUMMARIES_DIR.exists():
        log("No summaries directory found.")
        return
    
    summaries = sorted(SUMMARIES_DIR.glob("*.md"), reverse=True)
    
    if not summaries:
        log("No summaries found.")
        return
    
    for i, summary in enumerate(summaries[:20], 1):  # Show last 20
        stat = summary.stat()
        size = stat.st_size
        date = datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M")
        log(f"{i:2}. [{date}] {summary.name} ({size:,} bytes)")
    
    if len(summaries) > 20:
        log(f"... and {len(summaries) - 20} more")

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Monitor and automate content summarization")
    parser.add_argument("command", choices=["daily", "weekly", "list", "init"], 
                       help="Command to run")
    parser.add_argument("--config", "-c", help="Path to config file (default: monitor.json)")
    
    args = parser.parse_args()
    
    if args.command == "init":
        log("Initializing monitor configuration...")
        config = load_config()
        log(f"Config file: {CONFIG_FILE}")
        log(f"Sources configured:")
        for category, sources in config.get("sources", {}).items():
            log(f"  - {category}: {len(sources)} sources")
        log("Edit monitor.json to add your sources.")
        
    elif args.command == "daily":
        run_daily_tech_summary()
        
    elif args.command == "weekly":
        run_weekly_podcast_review()
        
    elif args.command == "list":
        list_summaries()

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
RSS Monitor — Eigenes Tool für Feed-Monitoring
Erstellt: 2026-03-06
"""

import feedparser
import json
from datetime import datetime
from pathlib import Path
import hashlib

# Feed-Konfiguration
FEEDS = [
    # Trends (für Project Generator)
    {
        "name": "Product Hunt",
        "url": "https://www.producthunt.com/feed",
        "category": "trends"
    },
    {
        "name": "HackerNews",
        "url": "https://news.ycombinator.com/rss",
        "category": "tech"
    },
    {
        "name": "GitHub Trending",
        "url": "https://github-trends.com/rss",
        "category": "tech"
    },
    
    # AI (für Model-Updates)
    {
        "name": "OpenAI Blog",
        "url": "https://openai.com/blog/rss",
        "category": "ai"
    },
    {
        "name": "Anthropic",
        "url": "https://www.anthropic.com/news/rss",
        "category": "ai"
    },
    {
        "name": "HuggingFace",
        "url": "https://huggingface.co/blog/feed.xml",
        "category": "ai"
    },
    
    # Crypto/Polymarket
    {
        "name": "Polymarket Blog",
        "url": "https://polymarket.com/blog/rss",
        "category": "crypto"
    },
    {
        "name": "CryptoPanic",
        "url": "https://cryptopanic.com/feed/",
        "category": "crypto"
    },
    {
        "name": "CoinDesk",
        "url": "https://www.coindesk.com/arc/outboundfeeds/rss",
        "category": "crypto"
    },
    
    # Tech (für Auto-Optimization)
    {
        "name": "CSS-Tricks",
        "url": "https://css-tricks.com/feed/",
        "category": "tech"
    },
    {
        "name": "Dev.to",
        "url": "https://dev.to/feed",
        "category": "tech"
    },
    
    # KIT/Student
    {
        "name": "KIT News",
        "url": "https://www.kit.edu/kit/newsliste.php?feed=rss2",
        "category": "student"
    }
]

OUTPUT_DIR = Path("/data/.openclaw/workspace/trending")
CACHE_DIR = Path("/data/.openclaw/workspace/.rss-cache")

def load_cache():
    """Lade gecachte Feed-IDs um Duplikate zu vermeiden"""
    cache_file = CACHE_DIR / "seen_ids.json"
    if cache_file.exists():
        with open(cache_file) as f:
            return set(json.load(f))
    return set()

def save_cache(seen_ids):
    """Speichere gesehene Feed-IDs"""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_file = CACHE_DIR / "seen_ids.json"
    with open(cache_file, 'w') as f:
        json.dump(list(seen_ids), f)

def fetch_feed(feed_config, seen_ids):
    """Fetch单个 Feed und extrahiere neue Einträge"""
    print(f"📰 Checking: {feed_config['name']} ({feed_config['category']})")
    
    feed = feedparser.parse(feed_config['url'])
    new_entries = []
    
    for entry in feed.entries[:10]:  # Max 10 pro Feed
        # Unique ID generieren
        entry_id = hashlib.md5(entry.link.encode()).hexdigest()[:12]
        
        if entry_id not in seen_ids:
            new_entries.append({
                "id": entry_id,
                "title": entry.title,
                "link": entry.link,
                "published": entry.get('published', datetime.now().isoformat()),
                "source": feed_config['name'],
                "category": feed_config['category'],
                "summary": entry.get('summary', '')[:200]
            })
            seen_ids.add(entry_id)
    
    return new_entries

def check_all_feeds():
    """Alle Feeds checken und neue Einträge speichern"""
    print(f"🚀 RSS Monitor Start: {datetime.now().isoformat()}")
    
    seen_ids = load_cache()
    all_new_entries = []
    
    for feed_config in FEEDS:
        try:
            new_entries = fetch_feed(feed_config, seen_ids)
            all_new_entries.extend(new_entries)
            print(f"  ✅ {feed_config['name']}: {len(new_entries)} neue Einträge")
        except Exception as e:
            print(f"  ❌ {feed_config['name']}: {str(e)}")
    
    # Cache speichern
    save_cache(seen_ids)
    
    # Output speichern
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    today = datetime.now().strftime('%Y-%m-%d')
    output_file = OUTPUT_DIR / f"feeds-{today}.json"
    
    with open(output_file, 'w') as f:
        json.dump({
            "date": today,
            "total_new": len(all_new_entries),
            "entries": all_new_entries
        }, f, indent=2)
    
    print(f"\n💾 Gespeichert: {output_file}")
    print(f"📊 Total neue Einträge: {len(all_new_entries)}")
    
    return all_new_entries

def list_by_category(category=None):
    """Einträge nach Kategorie auflisten"""
    today = datetime.now().strftime('%Y-%m-%d')
    output_file = OUTPUT_DIR / f"feeds-{today}.json"
    
    if not output_file.exists():
        print("Keine Daten für heute. Erst 'check' ausführen.")
        return
    
    with open(output_file) as f:
        data = json.load(f)
    
    entries = data['entries']
    if category:
        entries = [e for e in entries if e['category'] == category]
    
    print(f"\n📰 {'='*50}")
    print(f"Neue Einträge ({len(entries)} entries)")
    if category:
        print(f"Kategorie: {category}")
    print(f"{'='*50}\n")
    
    for entry in entries:
        print(f"📌 [{entry['category'].upper()}] {entry['title']}")
        print(f"   Source: {entry['source']}")
        print(f"   Link: {entry['link']}")
        print(f"   Summary: {entry['summary']}...")
        print()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "check":
            check_all_feeds()
        elif sys.argv[1] == "list":
            category = sys.argv[2] if len(sys.argv) > 2 else None
            list_by_category(category)
        else:
            print("Usage: python monitor.py [check|list] [category]")
    else:
        check_all_feeds()

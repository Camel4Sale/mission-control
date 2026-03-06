# 🧾 Summarize Tool — Content-Extraktion

**Stand:** 2026-03-06  
**Zweck:** Texte/Transkripte von URLs, Videos, Podcasts, lokalen Dateien

---

## 🎯 Use-Cases

### 1. **YouTube-Videos transkribieren**
- Tutorial-Videos für KIT-Studium
- Tech-Talks (AI, Crypto, Development)
- Polymarket Updates/Announcements
- Product Launches

### 2. **Podcast-Episoden**
- Tech-Podcasts (Lex Fridman, a16z, etc.)
- Crypto-Podcasts
- AI-Research Discussions
- Startup-Stories

### 3. **URLs extrahieren**
- Blog-Artikel zusammenfassen
- News-Artikel extrahieren
- Documentation lesen
- Research-Papers

### 4. **Lokale Dateien**
- PDFs extrahieren
- Audio-Dateien transkribieren
- Video-Dateien transkribieren

---

## 🔧 Tools & Integration

### Option 1: YouTube-Transcript Skill (bereits installiert)

```bash
# Skill nutzen
/skills/youtube-transcript <URL>
```

**Features:**
- ✅ YouTube-Transkripte
- ✅ Residential Proxy (umgeht Blocks)
- ✅ Auto-Summary mit AI

---

### Option 2: Eigenes summarize-Tool bauen

**Tech-Stack:**
```python
# packages: yt-dlp, whisper, openai, feedparser
import yt_dlp
import whisper
from openai import OpenAI
```

**Features:**
- ✅ YouTube (yt-dlp)
- ✅ Podcasts (RSS + Audio-Download)
- ✅ URLs (web_fetch API)
- ✅ Lokale Dateien (Whisper AI)
- ✅ Auto-Summary (GPT/Qwen)

---

## 🚀 Implementation

### Script: `summarize.py`

```python
#!/usr/bin/env python3
"""
Summarize Tool — Extrahiert & fasst Content zusammen
"""

import yt_dlp
import whisper
import sys
from pathlib import Path
from openai import OpenAI

def download_youtube(url, output_dir="~/Downloads"):
    """Lädt YouTube-Video herunter"""
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{output_dir}/%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }]
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return info['title'], f"{output_dir}/{info['title']}.mp3"

def transcribe_audio(audio_path):
    """Transkribiert Audio mit Whisper"""
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result['text']

def summarize_text(text, max_length=500):
    """Fasst Text mit AI zusammen"""
    client = OpenAI()
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Fasse den folgenden Text prägnant zusammen."},
            {"role": "user", "content": text[:15000]}  # Token-Limit
        ]
    )
    
    return response.choices[0].message.content

def summarize_url(url):
    """Extrahiert & fasst URL-Inhalt zusammen"""
    # web_fetch API nutzen
    import requests
    response = requests.get(f"https://api.openclaw.ai/web_fetch?url={url}&extractMode=markdown")
    content = response.json()['content']
    return summarize_text(content)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: summarize.py <URL|Audio-File>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    
    if input_path.startswith("http"):
        if "youtube.com" in input_path or "youtu.be" in input_path:
            print(f"📺 YouTube-Video: {input_path}")
            title, audio_path = download_youtube(input_path)
            print(f"✅ Heruntergeladen: {title}")
            
            print("🎤 Transkribiere...")
            transcript = transcribe_audio(audio_path)
            
            print("📝 Zusammenfassung...")
            summary = summarize_text(transcript)
            
            print(f"\n## {title}\n")
            print(summary)
        else:
            print(f"🌐 URL: {input_path}")
            summary = summarize_url(input_path)
            print(summary)
    else:
        print(f"🎵 Audio-File: {input_path}")
        transcript = transcribe_audio(input_path)
        summary = summarize_text(transcript)
        print(summary)
```

---

## 📁 Output-Struktur

```
/data/.openclaw/workspace/summaries/
├── youtube/
│   ├── 2026-03-06_video-title.md
│   └── transcripts/
├── podcasts/
│   ├── 2026-03-06_episode-title.md
│   └── audio/
├── urls/
│   ├── 2026-03-06_article-title.md
│   └── 
└── local/
    └── transcriptions/
```

---

## 🔄 Integration in Auto-Optimization

### Cron-Job: Daily Tech-Summary (täglich 8:30)

**Task:** Top 3 YouTube-Videos von heute transkribieren

```bash
# Product Hunt Top Videos
summarize.py "https://youtube.com/watch?v=..." > summaries/youtube/$(date +%Y-%m-%d).md
```

### Cron-Job: Weekly Podcast-Review (Freitag 16:00)

**Task:** Tech-Podcast-Episoden der Woche zusammenfassen

```bash
# Lex Fridman, a16z, etc.
summarize.py "https://youtube.com/..." >> summaries/weekly-podcasts.md
```

---

## 🎯 Use-Case: Website-Optimierung

### Content-Analyse

1. **Competitor-Websites analysieren**
   ```bash
   summarize.py "https://competitor.com/features" > analysis/competitor-features.md
   ```

2. **Best-Practice-Guides extrahieren**
   ```bash
   summarize.py "https://smashingmagazine.com/ux-best-practices" > analysis/ux-guide.md
   ```

3. **User-Feedback von Reddit/HN**
   ```bash
   summarize.py "https://news.ycombinator.com/item?id=..." > analysis/user-feedback.md
   ```

### Website-Optimierung

**Basierend auf Analysen:**
- UI/UX verbessern
- Content strukturieren
- Features priorisieren
- Copy optimieren

---

## 🚀 Quick Commands

```bash
# YouTube transkribieren
summarize.py "https://youtube.com/watch?v=VIDEO_ID"

# URL zusammenfassen
summarize.py "https://example.com/article"

# Lokale Audio transkribieren
summarize.py "~/Downloads/podcast.mp3"

# Batch-Verarbeitung
for url in $(cat urls.txt); do
  summarize.py "$url" >> summaries/batch-$(date +%Y-%m-%d).md
done
```

---

**Summarize-Tool ready für Content-Extraktion!** 🧾🚀

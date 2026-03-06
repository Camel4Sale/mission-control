#!/usr/bin/env python3
"""
Summarize Tool - Content Extraction & Summarization
Supports: YouTube videos, URLs, and local audio files
"""

import os
import sys
import json
import subprocess
import tempfile
from pathlib import Path
from datetime import datetime

# Output directory
OUTPUT_DIR = Path("/data/.openclaw/workspace/summaries")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def log(message: str):
    """Print timestamped log message"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def download_youtube_audio(url: str, output_path: str) -> str:
    """Download audio from YouTube using yt-dlp"""
    log(f"Downloading audio from YouTube: {url}")
    
    cmd = [
        "yt-dlp",
        "-x",  # Extract audio
        "--audio-format", "mp3",
        "--audio-quality", "128K",
        "-o", output_path,
        url
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"yt-dlp failed: {result.stderr}")
    
    # Find the actual output file (yt-dlp adds extension)
    audio_file = output_path if os.path.exists(output_path) else f"{output_path}.mp3"
    log(f"Audio downloaded: {audio_file}")
    return audio_file

def transcribe_audio(audio_path: str, model: str = "base") -> str:
    """Transcribe audio using Whisper"""
    log(f"Transcribing audio with Whisper ({model}): {audio_path}")
    
    import whisper
    
    audio = whisper.load_audio(audio_path)
    model = whisper.load_model(model)
    result = model.transcribe(audio)
    
    transcript = result["text"]
    log(f"Transcription complete ({len(transcript)} chars)")
    return transcript

def fetch_url_content(url: str) -> str:
    """Fetch and extract content from URL using web_fetch API"""
    log(f"Fetching URL content: {url}")
    
    # Use web_fetch via subprocess call to openclaw
    # For now, we'll use a simple HTTP fetch
    import urllib.request
    from html.parser import HTMLParser
    
    class TextExtractor(HTMLParser):
        def __init__(self):
            super().__init__()
            self.text = []
            self.skip = False
            
        def handle_starttag(self, tag, attrs):
            if tag in ['script', 'style', 'nav', 'header', 'footer']:
                self.skip = True
                
        def handle_endtag(self, tag):
            if tag in ['script', 'style', 'nav', 'header', 'footer']:
                self.skip = False
                
        def handle_data(self, data):
            if not self.skip and data.strip():
                self.text.append(data.strip())
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            html = response.read().decode('utf-8', errors='ignore')
        
        extractor = TextExtractor()
        extractor.feed(html)
        content = '\n'.join(extractor.text)
        
        # Limit content size
        content = content[:50000] if len(content) > 50000 else content
        
        log(f"URL content fetched ({len(content)} chars)")
        return content
    except Exception as e:
        log(f"Error fetching URL: {e}")
        return ""

def generate_summary(text: str, prompt: str = "Fasse den folgenden Inhalt auf Deutsch zusammen. Erstelle eine prägnante Zusammenfassung mit den wichtigsten Punkten:") -> str:
    """Generate AI summary using OpenAI/Qwen"""
    log(f"Generating AI summary ({len(text)} chars input)")
    
    try:
        from openai import OpenAI
        
        # Try to get API key from environment or config
        api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("OPENROUTER_API_KEY")
        
        if not api_key:
            log("No API key found. Using local model fallback.")
            return f"[Summary not available - no API key configured]\n\n{text[:2000]}"
        
        # Use OpenRouter or OpenAI
        base_url = os.environ.get("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        
        client = OpenAI(api_key=api_key, base_url=base_url)
        
        response = client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "qwen/qwen-2.5-72b-instruct"),
            messages=[
                {"role": "system", "content": "Du bist ein hilfreicher Assistent, der Inhalte auf Deutsch zusammenfasst."},
                {"role": "user", "content": f"{prompt}\n\n{text}"}
            ],
            max_tokens=2000
        )
        
        summary = response.choices[0].message.content
        log(f"Summary generated ({len(summary)} chars)")
        return summary
        
    except ImportError:
        log("OpenAI package not available")
        return text[:2000]
    except Exception as e:
        log(f"Error generating summary: {e}")
        return f"[Error: {e}]\n\n{text[:2000]}"

def save_summary(content: str, source: str, source_type: str) -> str:
    """Save summary to output directory"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{source_type}_{timestamp}.md"
    filepath = OUTPUT_DIR / filename
    
    # Create markdown content
    markdown = f"""# Summary

**Quelle:** {source}
**Typ:** {source_type}
**Datum:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

---

## Zusammenfassung

{content}

---

**Generiert von:** summarize.py
"""
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(markdown)
    
    log(f"Summary saved: {filepath}")
    return str(filepath)

def summarize_youtube(url: str, whisper_model: str = "base") -> str:
    """Full pipeline: YouTube → Audio → Transcription → Summary"""
    log(f"=== YouTube Summary ===")
    log(f"URL: {url}")
    
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        audio_path = tmp.name
    
    try:
        # Download
        audio_path = download_youtube_audio(url, audio_path)
        
        # Transcribe
        transcript = transcribe_audio(audio_path, whisper_model)
        
        # Summarize
        summary = generate_summary(transcript, "Fasse dieses YouTube-Video auf Deutsch zusammen. Erstelle eine prägnante Zusammenfassung mit den wichtigsten Punkten und Erkenntnissen:")
        
        # Save
        filepath = save_summary(summary, url, "youtube")
        
        log(f"=== Complete ===")
        return filepath
        
    finally:
        # Cleanup
        if os.path.exists(audio_path):
            os.unlink(audio_path)

def summarize_url(url: str) -> str:
    """Full pipeline: URL → Content → Summary"""
    log(f"=== URL Summary ===")
    log(f"URL: {url}")
    
    # Fetch content
    content = fetch_url_content(url)
    
    if not content:
        log("No content to summarize")
        return ""
    
    # Summarize
    summary = generate_summary(content, "Fasse diesen Artikel auf Deutsch zusammen. Erstelle eine prägnante Zusammenfassung mit den wichtigsten Punkten:")
    
    # Save
    filepath = save_summary(summary, url, "url")
    
    log(f"=== Complete ===")
    return filepath

def summarize_audio(audio_path: str, whisper_model: str = "base") -> str:
    """Full pipeline: Audio File → Transcription → Summary"""
    log(f"=== Audio Summary ===")
    log(f"File: {audio_path}")
    
    if not os.path.exists(audio_path):
        log(f"Audio file not found: {audio_path}")
        return ""
    
    # Transcribe
    transcript = transcribe_audio(audio_path, whisper_model)
    
    # Summarize
    summary = generate_summary(transcript, "Fasse diese Audio-Aufnahme auf Deutsch zusammen. Erstelle eine prägnante Zusammenfassung mit den wichtigsten Punkten:")
    
    # Save
    filepath = save_summary(summary, audio_path, "audio")
    
    log(f"=== Complete ===")
    return filepath

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Summarize content from YouTube, URLs, or audio files")
    parser.add_argument("source", help="YouTube URL, website URL, or local audio file path")
    parser.add_argument("--type", "-t", choices=["youtube", "url", "audio"], help="Force source type (auto-detected if not specified)")
    parser.add_argument("--whisper-model", "-w", default="base", choices=["tiny", "base", "small", "medium", "large"], help="Whisper model size")
    parser.add_argument("--output", "-o", help="Output file path (default: auto-generated in summaries/)")
    
    args = parser.parse_args()
    
    source = args.source
    source_type = args.type
    
    # Auto-detect source type
    if not source_type:
        if source.startswith("http://") or source.startswith("https://"):
            if "youtube.com" in source or "youtu.be" in source:
                source_type = "youtube"
            else:
                source_type = "url"
        elif os.path.isfile(source):
            source_type = "audio"
        else:
            print(f"Error: Cannot determine source type for: {source}")
            sys.exit(1)
    
    # Process based on type
    try:
        if source_type == "youtube":
            result = summarize_youtube(source, args.whisper_model)
        elif source_type == "url":
            result = summarize_url(source)
        elif source_type == "audio":
            result = summarize_audio(source, args.whisper_model)
        
        if result:
            print(f"\n✅ Summary saved to: {result}")
        else:
            print("\n❌ Failed to generate summary")
            sys.exit(1)
            
    except Exception as e:
        log(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

# Summaries 🧾

Automated content extraction and summarization workspace.

## Overview

This folder contains AI-generated summaries from:
- **YouTube videos** (audio transcription via Whisper)
- **Web articles** (content extraction + AI summary)
- **Audio files** (local transcription)

All summaries are generated in German and saved as Markdown files.

## Generated Files

Summaries are automatically saved with the naming pattern:
- `youtube_YYYYMMDD_HHMMSS.md`
- `url_YYYYMMDD_HHMMSS.md`
- `audio_YYYYMMDD_HHMMSS.md`

## Usage

### Summarize a YouTube Video

```bash
cd /data/.openclaw/workspace/summarize
python3 summarize.py "https://youtube.com/watch?v=VIDEO_ID"
```

### Summarize a Web Article

```bash
python3 summarize.py "https://example.com/article"
```

### Transcribe Local Audio

```bash
python3 summarize.py "/path/to/audio.mp3" --type audio
```

### Advanced Options

```bash
# Use a larger Whisper model (better accuracy, slower)
python3 summarize.py "URL" --whisper-model medium

# Force source type
python3 summarize.py "URL" --type url

# Custom output file
python3 summarize.py "URL" --output /path/to/output.md
```

## Automation

### Daily Tech Summary (8:30 AM)

Collects and summarizes tech news from configured sources.

```bash
python3 monitor.py daily
```

### Weekly Podcast Review (Friday 4:00 PM)

Processes podcast episodes from configured channels.

```bash
python3 monitor.py weekly
```

### Configure Sources

Edit `/data/.openclaw/workspace/summarize/monitor.json`:

```json
{
  "sources": {
    "daily_tech": [
      "https://www.theverge.com/tech",
      "https://arstechnica.com/"
    ],
    "weekly_podcast": [
      "https://youtube.com/@PodcastChannel"
    ]
  }
}
```

### Cron Jobs

Add to crontab (`crontab -e`):

```bash
# Daily Tech Summary at 8:30 AM
30 8 * * * cd /data/.openclaw/workspace/summarize && python3 monitor.py daily

# Weekly Podcast Review on Friday at 4:00 PM
0 16 * * 5 cd /data/.openclaw/workspace/summarize && python3 monitor.py weekly
```

## Integration

### Project Generator

The Project Generator can read summaries from this folder to create project briefs, research documents, or content digests.

### API Key Configuration

For AI summaries, set one of these environment variables:

```bash
# OpenRouter (recommended for free models)
export OPENROUTER_API_KEY="your-key-here"
export OPENAI_MODEL="qwen/qwen-2.5-72b-instruct"

# Or OpenAI directly
export OPENAI_API_KEY="your-key-here"
export OPENAI_BASE_URL="https://api.openai.com/v1"
```

## Whisper Models

| Model | Parameters | Speed | Accuracy |
|-------|------------|-------|----------|
| tiny  | 39M        | ~32x  | Lower    |
| base  | 74M        | ~16x  | Good     |
| small | 244M       | ~6x   | Better   |
| medium| 769M       | ~2x   | High     |
| large | 1550M      | 1x    | Best     |

Default: `base` (good balance of speed/accuracy)

## Troubleshooting

### "No API key found"
Set `OPENROUTER_API_KEY` or `OPENAI_API_KEY` environment variable.

### "yt-dlp failed"
Update yt-dlp: `yt-dlp -U`

### "Whisper model not found"
Models are downloaded automatically on first use. Requires internet connection.

### "ffmpeg not found"
Install ffmpeg: `brew install ffmpeg` or `apt install ffmpeg`

## File Structure

```
/data/.openclaw/workspace/
├── summaries/              # Generated summaries (this folder)
│   └── README.md           # This file
├── summarize/
│   ├── summarize.py        # Main summarization script
│   ├── monitor.py          # Automation & scheduling
│   └── monitor.json        # Source configuration
└── ...
```

## License

Part of the OpenClaw workspace tools.

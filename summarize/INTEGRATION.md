# Integration Guide 🔌

## Project Generator Integration

The Project Generator can read summaries to create project briefs and research documents.

### Reading Summaries

```python
from pathlib import Path

summaries_dir = Path("/data/.openclaw/workspace/summaries")

# Get latest summaries
summaries = sorted(summaries_dir.glob("*.md"), reverse=True)[:5]

for summary in summaries:
    with open(summary, 'r') as f:
        content = f.read()
        # Process summary content
```

### Summary Format

All summaries follow this structure:

```markdown
# Summary

**Quelle:** <source URL>
**Typ:** youtube|url|audio
**Datum:** YYYY-MM-DD HH:MM:SS

---

## Zusammenfassung

<AI-generated summary in German>

---

**Generiert von:** summarize.py
```

## API Configuration

### Option 1: OpenRouter (Recommended)

```bash
export OPENROUTER_API_KEY="sk-or-..."
export OPENAI_MODEL="qwen/qwen-2.5-72b-instruct"
export OPENAI_BASE_URL="https://openrouter.ai/api/v1"
```

### Option 2: OpenAI Direct

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_BASE_URL="https://api.openai.com/v1"
export OPENAI_MODEL="gpt-4o"
```

### Option 3: Local Models (Ollama)

Modify `summarize.py` to use Ollama:

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | API key for summaries | Required |
| `OPENROUTER_API_KEY` | Alternative API key | - |
| `OPENAI_BASE_URL` | API endpoint | `https://openrouter.ai/api/v1` |
| `OPENAI_MODEL` | Model to use | `qwen/qwen-2.5-72b-instruct` |

## Workflow Examples

### Morning Briefing Script

```bash
#!/bin/bash
# morning-briefing.sh - Run at 8:00 AM

cd /data/.openclaw/workspace/summarize

# Generate daily tech summary
python3 monitor.py daily

# List recent summaries
python3 monitor.py list | tail -10

# Send to Telegram (if configured)
# openclaw message send "📰 Morning Tech Briefing ready!"
```

### Weekly Review Script

```bash
#!/bin/bash
# weekly-review.sh - Run Friday at 15:00

cd /data/.openclaw/workspace/summarize

# Process podcast episodes
python3 monitor.py weekly

# Compile weekly digest
cat summaries/podcast_*.md > weekly_digest.md

# Notify user
# openclaw message send "🎧 Weekly podcast review complete!"
```

## Monitoring & Logging

### Check Cron Logs

```bash
tail -f /data/.openclaw/workspace/summarize/cron.log
```

### Monitor Script Status

```bash
python3 monitor.py list
```

### Debug Mode

```bash
python3 summarize.py "URL" --whisper-model base 2>&1 | tee debug.log
```

## Performance Tips

1. **Whisper Model Selection**
   - `tiny`: Fast, low accuracy (good for testing)
   - `base`: Balanced (default)
   - `medium`: High accuracy, slower
   - `large`: Best accuracy, slowest

2. **Batch Processing**
   - Process multiple URLs in parallel
   - Use background jobs for long videos

3. **Storage Management**
   - Archive old summaries monthly
   - Compress audio files after transcription

## Troubleshooting

### Common Issues

**No summaries generated:**
- Check API key is set
- Verify internet connection
- Check cron.log for errors

**Slow transcription:**
- Use smaller Whisper model
- Reduce audio quality in yt-dlp

**Memory issues:**
- Process one source at a time
- Use `tiny` or `base` Whisper model

### Getting Help

```bash
python3 summarize.py --help
python3 monitor.py --help
```

## Extending the Tool

### Add New Source Types

Edit `summarize.py` and add a new handler:

```python
def summarize_rss(url: str) -> str:
    # Custom RSS feed handler
    pass
```

### Custom Summary Prompts

Modify the `generate_summary()` call:

```python
summary = generate_summary(
    text, 
    "Fasse zusammen mit Fokus auf technische Details..."
)
```

### Output Formats

Add JSON export:

```python
def save_summary_json(content: str, metadata: dict) -> str:
    # Save as JSON instead of Markdown
    pass
```

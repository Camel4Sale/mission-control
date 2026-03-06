# 🎮 Discord Integration Setup

**Status:** Pending guildId Configuration

---

## 📋 CURRENT STATUS

- ✅ Discord Bot Installed
- ✅ Bot Token Configured in OpenClaw
- ⚠️ **guildId Missing** — Cannot search Discord without it

---

## 🔍 HOW TO FIND YOUR GUILD ID

### Method 1: Discord Developer Mode
1. Open Discord Settings → Advanced
2. Enable "Developer Mode"
3. Right-click your server icon
4. Click "Copy Server ID" → This is your guildId

### Method 2: From Server URL
- Server URL: `https://discord.com/channels/GUILD_ID/channel_id`
- Copy the number after `/channels/`

### Method 3: Via Bot
```bash
# Once bot is connected, run:
/discord info
# Bot will reply with server info including guildId
```

---

## ⚙️ CONFIGURATION

**Add to OpenClaw config:**
```json
{
  "discord": {
    "guildId": "YOUR_SERVER_ID_HERE"
  }
}
```

**Our Server:** https://discord.gg/UGkgpRFj

---

## ✅ VERIFICATION

Once configured, test with:
```
"Search Discord for 'Next.js deployment error'"
```

---

**Priority:** 🔴 HIGH  
**ETA:** 5 minutes once guildId is provided

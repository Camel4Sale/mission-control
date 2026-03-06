# 🚀 Quickstart - Deal-Finder Pro

## In 5 Minuten zum ersten Deal

### 1. Installation (2 Min)

```bash
cd /data/.openclaw/workspace/elysium/plugins/deal-finder
npm install
```

### 2. Konfiguration (1 Min)

```bash
cp .env.example .env.local
```

`.env.local` bearbeiten:

```bash
OPENAI_API_KEY=sk-dein-api-key-hier
```

**API Key holen:** https://platform.openai.com/api-keys

### 3. Starten (1 Min)

```bash
npm run dev
```

### 4. Dashboard öffnen

👉 http://localhost:3000

### 5. Erste Deals sehen

Das Dashboard zeigt bereits Mock-Deals. Echte Deals werden automatisch alle 15 Minuten gescraped.

---

## 🔧 Wichtige Pfade

| Pfad | Beschreibung |
|------|--------------|
| `/` | Dashboard mit allen Deals |
| `/api/deals` | REST API für Deals |
| `/api/alerts` | Alert-Konfiguration |
| `/api/export?format=csv` | CSV Export |

---

## 📱 Features testen

### Filtern
- Stadt eingeben (z.B. "Berlin")
- Preisbereich setzen
- Mindest-Score filtern

### Ansichten
- **Grid:** Karten-Ansicht
- **Pipeline:** Kanban-Board
- **Markt:** Charts & Analysen

### Export
- CSV Button für Excel
- PDF Button für Reports

---

## ⚙️ Scraper anpassen

In `src/services/scheduler.ts`:

```typescript
zipCodes: ['10115', '10117', '10119'], // Deine PLZ-Bereiche
minPrice: 500,
maxPrice: 2000,
```

---

## 🆘 Probleme?

### "OpenAI API key not configured"
→ `.env.local` erstellt und API Key eingetragen?

### "Module not found"
→ `npm install` ausgeführt?

### Port 3000 belegt
→ Anderen Port: `PORT=3001 npm run dev`

---

## 📞 Nächste Schritte

1. **PLZ-Bereiche** anpassen (deine Zielstadt)
2. **Preis-Filter** setzen (dein Budget)
3. **Alerts konfigurieren** (Email/SMS)
4. **Erste Besichtigung** planen 🏠

---

**Viel Erfolg beim Deal-Finding! 🎯**

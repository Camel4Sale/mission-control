# 🚀 Deployment Guide - Celaris Solar Sales Tool

## Quick Deploy auf Vercel

### Option 1: Vercel Dashboard (Empfohlen)

1. **Repository vorbereiten**
   ```bash
   cd /data/.openclaw/workspace/celaris/sales-tool
   git init
   git add .
   git commit -m "Initial commit: Celaris Solar Sales Tool"
   ```

2. **Auf GitHub pushen**
   - Repository auf GitHub erstellen
   - Code pushen:
   ```bash
   git remote add origin https://github.com/your-org/celaris-sales-tool.git
   git push -u origin main
   ```

3. **Auf Vercel importieren**
   - Zu https://vercel.com gehen
   - "New Project" klicken
   - GitHub Repository auswählen
   - "Deploy" klicken

4. **Fertig!** 🎉
   - Deine App ist live unter `https://your-project.vercel.app`

### Option 2: Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Einloggen
vercel login

# Deployen
cd /data/.openclaw/workspace/celaris/sales-tool
vercel

# Production Deploy
vercel --prod
```

## Umgebungsvariablen auf Vercel

Nach dem Deploy in den Vercel Project Settings unter "Environment Variables":

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
EMAIL_FROM=noreply@celaris.de
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASSWORD=your-password
```

## Custom Domain

1. In Vercel Project Settings zu "Domains" navigieren
2. Domain eingeben (z.B. `solar.celaris.de`)
3. DNS Records beim Provider konfigurieren:
   ```
   Type: CNAME
   Name: solar (oder @)
   Value: cname.vercel-dns.com
   ```

## Performance Optimierung

Die App ist bereits optimiert:
- ✅ Static Site Generation (SSG)
- ✅ Image Optimization
- ✅ Automatic Code Splitting
- ✅ Tree Shaking

## Monitoring

- **Vercel Analytics:** In Project Settings aktivieren
- **Speed Insights:** Kostenlos für Core Web Vitals
- **Error Monitoring:** Mit Sentry integrierbar

## Updates

```bash
# Änderungen committen und pushen
git add .
git commit -m "Feature: Neue Funktion"
git push

# Vercel deployt automatisch!
```

## Local Testing vor Deploy

```bash
# Production Build testen
npm run build
npm start

# Läuft auf http://localhost:3000
```

## Backup & Restore

### Backup
```bash
# Datenbank Export (wenn vorhanden)
pg_dump celaris > backup.sql

# Code Backup
git push origin backup-branch
```

### Restore
```bash
# Von Vercel Dashboard: Previous Deployment wiederherstellen
# Oder: git revert + neuer Push
```

## SSL/HTTPS

- ✅ Automatisch von Vercel bereitgestellt
- ✅ Keine zusätzliche Konfiguration nötig
- ✅ Automatische Erneuerung

## Support

Bei Fragen:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**🌞 Viel Erfolg beim Deployen!**

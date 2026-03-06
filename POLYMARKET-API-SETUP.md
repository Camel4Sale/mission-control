# 📈 Polymarket API Keys Setup

**Status:** ⏳ Wartet auf API Keys von User

---

## 🔑 API KEYS BESORGEN

1. Gehe zu https://polymarket.com
2. Logge dich ein
3. Einstellungen → API
4. Erstelle neue API Keys:
   - API Key
   - API Secret
   - API Passphrase

---

## ⚙️ KONFIGURATION

Sobald du die Keys hast, sag mir:
```
"Polymarket API Key: YOUR_KEY"
"Polymarket API Secret: YOUR_SECRET"
"Polymarket API Passphrase: YOUR_PASSPHRASE"
```

Ich trage sie sicher in .env ein (nicht im Git!)

---

## 🛡️ SECURITY

- ✅ Keys nur in .env (nicht committen)
- ✅ .env in .gitignore
- ✅ Circuit-Breaker aktiv
- ✅ Max Position: $100
- ✅ Max Daily Loss: $500

---

## ✅ VERIFIKATION

Nach Konfiguration:
- Teste Paper-Trading (erstmal)
- Dann Live-Trading mit kleinen Beträgen
- Monitoring aktiv

---

**Dauer:** 5 Minuten nach Key-Eingabe  
**Priority:** 🔴 HIGH

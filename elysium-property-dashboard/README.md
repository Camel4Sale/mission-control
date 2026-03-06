# 🏠 ELYSIUM PROPERTY-DASHBOARD

**Immobilien-Management-System für Elysium**

---

## 🎯 FEATURES

1. **Property-Management** — Alle Immobilien im Überblick
2. **Tenant-Management** — Mieterverwaltung + Mietzahlung-Tracking
3. **Financial-Analytics** — Cashflow, ROI, Wertentwicklung
4. **Maintenance-Tracker** — Reparaturen + Wartungen
5. **Acquisition-Pipeline** — Neue Objekte + Due-Diligence

---

## 📁 STRUCTURE

```
elysium-property-dashboard/
├── prisma/
│   └── schema.prisma ✅ (10.3KB)
├── src/
│   ├── app/
│   │   ├── page.tsx (Dashboard)
│   │   ├── properties/
│   │   ├── tenants/
│   │   ├── financials/
│   │   └── maintenance/
│   └── components/
├── package.json
└── README.md
```

---

## 🗄️ DATABASE SCHEMA (Prisma)

### Models
- **Property** — Immobilien (Adresse, Größe, Wert, Miete)
- **Tenant** — Mieter (Kontakt, Mietbeginn, Verträge)
- **Lease** — Mietverträge (Laufzeit, Rate, Deposit)
- **Payment** — Mietzahlungen (Datum, Amount, Status)
- **Maintenance** — Reparaturen (Priority, Cost, Status)
- **Transaction** — Finanztransaktionen (Type, Amount, Category)

---

## 🚀 QUICK START

```bash
cd elysium-property-dashboard

# Dependencies installieren
npm install

# Database Setup
npx prisma generate
npx prisma db push

# Dev Server starten
npm run dev
```

---

## 📊 MOCK-DATEN

**5 Beispiel-Properties:**
1. Karlsruhe — Mehrfamilienhaus (8 Einheiten, €1.2M)
2. Stuttgart — Einfamilienhaus (4 Zimmer, €650k)
3. München — Wohnung (80m², €450k)
4. Heidelberg — Gewerbe (Büro, 200m², €800k)
5. Mannheim — Ladenlokal (150m², €380k)

**Gesamtwert:** ~€3.5M  
**Monatliche Mieteinnahmen:** ~€18k  
**ROI:** 6.2% Ø

---

## 🎨 TECH-STACK

- **Next.js 15** — App Router
- **TypeScript** — Strict Mode
- **TailwindCSS** — Styling
- **shadcn/ui** — Components
- **Recharts** — Analytics Charts
- **Prisma** — Database ORM

---

## 📈 FINANCIAL-METRICS

| Metrik | Wert |
|--------|------|
| **Portfolio Value** | €3.5M |
| **Monthly Rent** | €18k |
| **Annual Revenue** | €216k |
| **ROI (Ø)** | 6.2% |
| **Occupancy Rate** | 92% |
| **Maintenance Costs** | €8k/Jahr |

---

## 🛡️ SECURITY

- ✅ API-Keys in `.env` (nicht committen!)
- ✅ Database-Encryption
- ✅ Role-Based Access Control
- ✅ Audit-Logging

---

**READY TO DEPLOY!** 🏠🚀

*Last Updated: 2026-03-06 16:20*

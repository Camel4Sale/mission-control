# Polymarket Alpha Bots

**Vollständiges Trading-System für Informations-Vorteile auf Polymarket**

## 🎯 Überblick

Dieses System implementiert **4 modulare Alpha-Strategien** zur Identifikation von Trading-Vorteilen:

1. **On-Chain Analysis** - Whale-Tracking auf Polygon
2. **Social Media Monitoring** - Twitter, Reddit, Telegram Sentiment
3. **News API Integration** - Echtzeit-News mit NLP-Analyse
4. **Prediction Market Correlation** - Arbitrage zwischen Plattformen

## 📁 Struktur

```
polymarket-alpha-bots/
├── bots/alpha/
│   ├── __init__.py          # Package-Exports
│   ├── base.py              # Abstract Base Class
│   ├── on_chain.py          # Strategie 1: Whale-Tracking
│   ├── social_media.py      # Strategie 2: Social Monitoring
│   ├── news_api.py          # Strategie 3: News Integration
│   ├── correlation.py       # Strategie 4: Cross-Platform
│   └── config.py            # Konfiguration
│
├── engine/
│   ├── signal_generator.py  # Signal-Scoring & Ranking
│   ├── risk_manager.py      # Risk-Management
│   └── backtester.py        # Backtesting Engine
│
├── tests/
│   └── test_alpha_bots.py   # Unit-Tests
│
├── main.py                  # Haupt-Runner
├── requirements.txt         # Python-Dependencies
├── .env.example            # Environment-Vorlage
└── README.md               # Diese Datei
```

## 🚀 Quick Start

### 1. Installation

```bash
cd polymarket-alpha-bots

# Virtuelle Umgebung erstellen
python -m venv venv
source venv/bin/activate  # Linux/Mac
# oder: venv\Scripts\activate  # Windows

# Dependencies installieren
pip install -r requirements.txt
```

### 2. Konfiguration

```bash
# Environment-Variablen setzen
cp .env.example .env

# API-Keys in .env eintragen
nano .env
```

### 3. Paper-Trading Test

```bash
# Einzelnen Zyklus ausführen
python main.py

# ODER: Continuous Mode (alle 5 Min)
python -c "import asyncio; from main import PolymarketAlphaBot, Config; asyncio.run(PolymarketAlphaBot(Config()).run_continuous())"
```

### 4. Unit-Tests

```bash
pytest tests/ -v
```

## 🧠 Strategien im Detail

### 1. On-Chain Analysis (`on_chain.py`)

**Ziel:** Whale-Wallets tracken und kopieren

**Features:**
- Polygonscan API Integration
- Große Käufe (> $10k) erkennen
- Smart-Money Wallets mit Win-Rate > 60%
- Wallet-Cluster Analyse
- Insider-Wallet Tracking

**Signal-Beispiel:**
```python
Signal(
    strategy_name='OnChain-SmartMoney',
    market_name='Copy: Smart Money Alpha',
    action='BUY',
    confidence=80,
    metadata={'wallet_address': '0x...', 'win_rate': 0.68}
)
```

### 2. Social Media Monitoring (`social_media.py`)

**Ziel:** Social Hype früh erkennen

**Features:**
- Twitter API v2 Integration
- Reddit Subreddit-Monitoring
- Telegram Scraper (optional)
- Sentiment-Analyse mit TextBlob
- Hype-Score Berechnung (0-100)
- Auto-Trade bei Score > 70

**Hype-Score Faktoren:**
- Anzahl Mentions (40%)
- Engagement (30%)
- Sentiment (20%)
- Recency (10%)

### 3. News API Integration (`news_api.py`)

**Ziel:** News-basierte Signale in < 500ms

**Features:**
- CryptoPanic WebSocket
- Google News API
- NLP mit spaCy & SentenceTransformers
- Relevanz-Scoring (0-1)
- Sentiment-Analyse
- Auto-Execute bei High-Relevance

**Latenz-Ziel:** < 500ms von News zu Trade

### 4. Prediction Market Correlation (`correlation.py`)

**Ziel:** Preis-Unterschiede zwischen Plattformen nutzen

**Unterstützte Plattformen:**
- Polymarket (Crypto)
- PredictIt (US, reguliert)
- Betfair (Sport)
- Kalshi (US)

**Signal:** Wenn PredictIt 5% höher als Polymarket → Polymarket kaufen

## ⚙️ Engine Components

### Signal Generator (`engine/signal_generator.py`)

- Sammelt Signale von allen Strategien
- Bewertet mit Weighted Scoring:
  - Raw Confidence (40%)
  - Historical Accuracy (30%)
  - Recency (15%)
  - Strategy Weight (15%)
- Liefert Top 10 Signale für Execution

### Risk Manager (`engine/risk_manager.py`)

**Risk-Limits:**
- Max Daily Loss: 10%
- Max Weekly Loss: 20%
- Max Total Exposure: 50%
- Max per Market: 10%
- Min Diversifikation: 5 Märkte

**Features:**
- Circuit Breaker bei Loss-Limits
- Stop-Loss: 20% auto-exit
- Take-Profit: 50% partial-exit
- Position-Sizing nach Confidence

### Backtester (`engine/backtester.py`)

- Walk-Forward Testing
- Performance-Metriken:
  - Total Return
  - Sharpe Ratio
  - Max Drawdown
  - Win-Rate
  - Profit Factor

## 📊 Konfiguration

### API-Keys (`.env`)

```bash
# On-Chain
POLYGONSCAN_API_KEY=your_key
NANSEN_API_KEY=your_key

# Social Media
TWITTER_BEARER_TOKEN=your_token
REDDIT_CLIENT_ID=your_id

# News
CRYPTOPANIC_API_KEY=your_key

# Prediction Markets
PREDICTIT_API_KEY=your_key
KALSHI_API_KEY=your_key

# Trading
POLYMARKET_API_KEY=your_key
WALLET_PRIVATE_KEY=your_key
```

### Strategie-Einstellungen

```python
# bots/alpha/config.py

strategies = {
    'on_chain': {
        'enabled': True,
        'paper_trading': True,
        'min_confidence': 60,
    },
    'social_media': {
        'enabled': True,
        'paper_trading': True,
        'min_confidence': 70,
    },
    'news_api': {
        'enabled': True,
        'paper_trading': True,
        'min_confidence': 75,
    },
    'correlation': {
        'enabled': True,
        'paper_trading': True,
        'min_confidence': 65,
    },
}
```

## 🧪 Testing

### Unit-Tests ausführen

```bash
# Alle Tests
pytest tests/ -v

# Einzelne Test-Klasse
pytest tests/test_alpha_bots.py::TestRiskManager -v

# Mit Coverage
pytest tests/ --cov=bots.alpha --cov=engine
```

### Paper-Trading

```bash
# 1 Woche Paper-Trading
python main.py  # In loop mit 5-Min-Intervall

# Stats anzeigen
curl localhost:8000/status  # Wenn Dashboard aktiv
```

### Backtesting

```python
from main import PolymarketAlphaBot, Config
import asyncio

async def run_backtest():
    bot = PolymarketAlphaBot(Config())
    await bot.initialize()
    await bot.run_backtest(days=30)

asyncio.run(run_backtest())
```

## 📈 Monitoring

### Status-Endpoint

```python
bot = PolymarketAlphaBot(Config())
status = bot.get_status()

# Output:
{
    'paper_trading': True,
    'uptime_hours': 24.5,
    'strategies_active': 4,
    'signals_generated': 145,
    'trades_executed': 23,
    'risk_manager': {...},
    'signal_generator': {...},
}
```

### Logging

Logs werden gespeichert in:
- `polymarket_alpha.log` (File)
- Console (STDOUT)

Log-Level: `INFO` (default), änderbar in `main.py`

## 🚨 Risk-Management

### Circuit Breaker

Automatisches Trading-Halt bei:
- Daily Loss > 10%
- Weekly Loss > 20%
- System-Error

### Position-Limits

| Parameter | Wert |
|-----------|------|
| Max pro Trade | 5% |
| Max pro Markt | 10% |
| Max Total | 50% |
| Min Märkte | 5 |

### Stop-Loss / Take-Profit

- **Stop-Loss:** -20% (auto-exit)
- **Take-Profit:** +50% (50% Position exit)

## 🔒 Security

### API-Keys

- Niemals im Code hardcoden
- Immer aus Environment-Variablen laden
- `.env` nicht committen (in `.gitignore`)

### Wallet-Security

- Separate Hot/Cold Wallets
- Hot Wallet nur mit Trading-Betrag
- Private Key nie loggen

## 📝 Nächste Schritte

### Phase 1: Foundation ✅
- [x] Alle 4 Strategien implementiert
- [x] Engine Components (Signal, Risk, Backtest)
- [x] Unit-Tests
- [x] Paper-Trading Modus

### Phase 2: Testing
- [ ] Backtest auf historischen Daten
- [ ] Paper-Trading (1 Woche)
- [ ] Precision/Recall-Analyse

### Phase 3: Production
- [ ] Live-Trading (klein starten)
- [ ] Dashboard (Next.js)
- [ ] Alert-System (Telegram/Discord)
- [ ] Performance-Tracking

## 📄 Lizenz

MIT License - Eigene Recherche erforderlich. Keine Finanzberatung!

## ⚠️ Disclaimer

**Dies ist kein Finanzberatungssystem!**

- Trading von Prediction Markets ist riskant
- Totalverlust des Einsatzes möglich
- Eigene Recherche erforderlich
- Steuern beachten (DE: 1 Jahr Haltefrist für Crypto)

---

**Build with 🧊 by Molty**

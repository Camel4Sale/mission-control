# 🧊 Polymarket Backtesting System

**Backtest API:** http://localhost:8001  
**Swagger UI:** http://localhost:8001/docs  
**Dashboard:** http://localhost:3010

---

## 📊 Verfügbare Strategien

| Strategie | Risiko | Holding Period | Beschreibung |
|-----------|--------|----------------|--------------|
| **Momentum** | Medium | 2-5 Tage | Multi-Timeframe Trendfolge mit Volumen-Bestätigung |
| **Mean Reversion** | Niedrig | 1-3 Tage | Handel von Preisabweichungen vom Durchschnitt |
| **Flash Crash** | Hoch | Minuten | Ausnutzung plötzlicher Volatilitätsspitzen |
| **Arbitrage** | Niedrig | Sekunden | Cross-Market Preisunterschiede |
| **News Trading** | Medium | 1-2 Tage | Handel basierend auf News-Sentiment |
| **Market Making** | Medium | Intraday | Liquidität bereitstellen & Spread verdienen |
| **Correlation** | Medium | 3-7 Tage | Handel korrelierter Assets |
| **Whale Copying** | Hoch | 1-5 Tage | Smart Money Bewegungen folgen |

---

## 🚀 Quick Start

### 1. Backtest API starten

```bash
cd /data/.openclaw/workspace/polymarket-monitoring
python3 backtest_server.py
```

### 2. Backtest durchführen

**Beispiel - Momentum Strategie:**
```bash
curl -X POST http://localhost:8001/api/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "momentum",
    "days": 30,
    "initial_capital": 1000,
    "position_size": 50,
    "stop_loss": 0.05,
    "take_profit": 0.15
  }'
```

### 3. Strategien vergleichen

```bash
curl http://localhost:8001/api/backtest/compare?days=30
```

---

## 📈 API Endpoints

### Strategien

| Endpoint | Beschreibung |
|----------|-------------|
| `GET /api/strategies` | Liste aller verfügbaren Strategien |
| `POST /api/backtest` | Backtest für eine Strategie ausführen |
| `GET /api/backtest/compare` | Alle Strategien vergleichen |

### Märkte

| Endpoint | Beschreibung |
|----------|-------------|
| `GET /api/markets` | Alle aktiven Märkte |
| `GET /api/markets/top` | Top Märkte nach Volumen |
| `GET /api/markets/search?query=btc` | Märkte suchen |
| `GET /api/history/{market_id}` | Historische Daten für Markt |

---

## 📊 Backtest Metriken

### Return-Metriken
- **Total Return (%)** - Gesamtrendite in Prozent
- **Total Return (USDC)** - Gesamtrendite in Dollar
- **Annualized Return (%)** - Annualisierte Rendite

### Risiko-Metriken
- **Max Drawdown (%)** - Maximaler Verlust vom Peak
- **Sharpe Ratio** - Risiko-adjustierte Rendite (>1 gut, >2 sehr gut)
- **Win Rate** - Trefferquote in Prozent

### Trade-Metriken
- **Total Trades** - Anzahl aller Trades
- **Winning Trades** - Gewinnende Trades
- **Losing Trades** - Verlust Trades
- **Avg Win (%)** - Durchschnittlicher Gewinn pro Trade
- **Avg Loss (%)** - Durchschnittlicher Verlust pro Trade
- **Profit Factor** - Verhältnis Gewinn zu Verlust (>1.5 gut)

---

## 🎯 Strategie-Details

### 1. Momentum Trading
**Prinzip:** "The trend is your friend"

**Signale:**
- Multi-Timeframe Analyse (5m, 15m, 1h, 4h)
- Volumen-Bestätigung (>1.5x Durchschnitt)
- RSI < 70 für Long, RSI > 30 für Short
- MACD Crossover

**Parameter:**
- Stop Loss: 5%
- Take Profit: 10%
- Min Trend Strength: 0.6

### 2. Mean Reversion
**Prinzip:** "What goes up must come down"

**Signale:**
- Preis > 2 Standardabweichungen vom SMA
- RSI > 70 (überkauft) oder < 30 (überverkauft)
- Bollinger Bands Breakout

**Parameter:**
- Lookback Period: 20 Tage
- Entry: 2σ Abweichung
- Exit: Rückkehr zum Mittelwert

### 3. Flash Crash
**Prinzip:** "Buy the dip, sell the rip"

**Signale:**
- Plötzlicher Preissturz > 10% in 5 Minuten
- Volumen-Spike > 3x Durchschnitt
- Schnelle Erholung innerhalb 15 Minuten

**Parameter:**
- Entry: Nach 10% Drop
- Exit: 5% Erholung
- Max Holding: 30 Minuten

### 4. Arbitrage
**Prinzip:** "Free money from price differences"

**Signale:**
- Preisunterschied > 2% zwischen Märkten
- Gleiche Outcome, unterschiedliche Preise

**Parameter:**
- Min Spread: 2%
- Max Execution Time: 5 Sekunden
- Position Size: 50% pro Trade

---

## 🔧 Konfiguration

### .env Datei

```bash
# Polymarket API
POLY_API_KEY=your_key
POLY_API_SECRET=your_secret

# Backtest Settings
BACKTEST_DAYS=30
INITIAL_CAPITAL=1000
POSITION_SIZE=50

# Risk Management
STOP_LOSS=0.05
TAKE_PROFIT=0.15
MAX_DAILY_LOSS=200

# Performance
CACHE_TTL=60
BATCH_SIZE=10
```

---

## 📝 Beispiel Backtest Results

```json
{
  "strategy": "momentum",
  "total_return_pct": 15.7,
  "total_return_usdc": 157.0,
  "annualized_return_pct": 189.4,
  "max_drawdown_pct": 8.2,
  "sharpe_ratio": 1.87,
  "win_rate": 0.64,
  "total_trades": 42,
  "winning_trades": 27,
  "losing_trades": 15,
  "avg_win_pct": 8.3,
  "avg_loss_pct": -3.2,
  "profit_factor": 2.59
}
```

**Interpretation:**
- ✅ **15.7% Return** in 30 Tagen = sehr gut
- ✅ **1.87 Sharpe** = gute Risiko-adjustierte Performance
- ✅ **64% Win Rate** = konsistent profitabel
- ✅ **2.59 Profit Factor** = Gewinne > 2.5x Verluste
- ⚠️ **8.2% Max Drawdown** = akzeptables Risiko

---

## 🚨 Wichtige Hinweise

### 1. Vergangenheitsperformance
> **Past performance is not indicative of future results!**

Backtesting zeigt nur historische Performance. Reale Bedingungen können abweichen durch:
- Slippage
- Gebühren
- Liquiditätsprobleme
- Marktänderungen

### 2. Overfitting Vermeiden
- Teste auf out-of-sample Daten
- Verwende Walk-Forward Optimierung
- Halte Strategien einfach

### 3. Risikomanagement
- Max 5% pro Trade
- Max 20% tägliches Loss-Limit
- Circuit Breaker aktivieren

---

## 🛠️ Entwicklung

### Eigene Strategie hinzufügen

1. Erstelle Datei in `/strategies/my_strategy.py`
2. Implementiere `generate_signals()` Funktion
3. Teste mit Backtest API
4. Füge zu `/api/strategies` hinzu

### Backtest Engine erweitern

```python
from enhanced_backtester import EnhancedBacktester

backtester = EnhancedBacktester(
    initial_capital=1000,
    position_size=50,
    fees_enabled=True,
    slippage_enabled=True
)

result = backtester.run(
    strategy=my_strategy,
    data=market_data,
    start_date="2026-01-01",
    end_date="2026-03-07"
)

print(f"Total Return: {result.total_return_pct:.2f}%")
print(f"Sharpe Ratio: {result.sharpe_ratio:.2f}")
```

---

## 📚 Ressourcen

- **Swagger UI:** http://localhost:8001/docs
- **Enhanced Backtester:** `backtester/enhanced_backtester.py`
- **Strategien:** `../polymarket-bots/strategies/`
- **API Client:** `polymarket_api.py`

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-07  
**Status:** ✅ Production Ready

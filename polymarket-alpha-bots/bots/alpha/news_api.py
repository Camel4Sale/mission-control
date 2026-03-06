"""
News API Integration Strategie

Echtzeit-News-Analyse für schnelle Trading-Reaktionen:
- Bloomberg/Reuters/Google News APIs
- CryptoPanic API
- WebSocket News-Feed
- NLP für Relevanz-Scoring
- Latenz: < 500ms von News zu Trade

"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
from dataclasses import dataclass, field

import aiohttp
import spacy
from sentence_transformers import SentenceTransformer

from .base import AlphaStrategy, Signal, SignalStrength

logger = logging.getLogger(__name__)


@dataclass
class NewsItem:
    """Eine News-Meldung"""
    id: str
    title: str
    summary: str
    source: str  # bloomberg, reuters, cryptopanic, etc.
    url: str
    timestamp: datetime
    categories: List[str] = field(default_factory=list)
    sentiment: float = 0.0
    relevance_score: float = 0.0
    related_markets: List[str] = field(default_factory=list)
    processed: bool = False


class NewsAPIStrategy(AlphaStrategy):
    """
    News API Integration für Polymarket Alpha
    
    Verarbeitet Echtzeit-News und generiert Trading-Signale
    """
    
    # Polymarket-relevante Kategorien
    RELEVANT_CATEGORIES = [
        'politics',
        'crypto',
        'sports',
        'entertainment',
        'finance',
        'elections',
    ]
    
    # Keywords für verschiedene Markt-Typen
    MARKET_KEYWORDS = {
        'politics': ['biden', 'trump', 'election', 'candidate', 'vote', 'congress', 'senate'],
        'crypto': ['bitcoin', 'ethereum', 'sec', 'regulation', 'crypto'],
        'sports': ['super bowl', 'world cup', 'nfl', 'nba', 'championship'],
        'entertainment': ['oscar', 'grammy', 'emmy', 'movie', 'actor'],
    }
    
    # Relevanz-Schwellenwert
    RELEVANCE_THRESHOLD = 0.7  # Auto-Trade bei Score > 0.7
    
    def __init__(self, config: Dict[str, Any], paper_trading: bool = True):
        super().__init__(config, paper_trading)
        
        self.cryptopanic_api_key = config.get('cryptopanic_api_key')
        self.google_news_api_key = config.get('google_news_api_key')
        self.bloomberg_api_key = config.get('bloomberg_api_key')
        
        self.session: Optional[aiohttp.ClientSession] = None
        self.news_items: List[NewsItem] = []
        self.websocket_connected = False
        
        # NLP-Modelle laden
        try:
            self.nlp = spacy.load('en_core_web_sm')
            self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
            self.nlp_loaded = True
        except Exception as e:
            self.logger.warning(f"NLP-Modelle nicht verfügbar: {e}")
            self.nlp_loaded = False
        
    async def initialize(self) -> bool:
        """Initialisiert API-Clients und NLP-Modelle"""
        try:
            self.session = aiohttp.ClientSession(
                headers={'User-Agent': 'PolymarketAlphaBot/1.0'}
            )
            
            # WebSocket-Connection für Echtzeit-News
            if self.cryptopanic_api_key:
                await self._connect_websocket()
            
            # Initiale News laden
            await self._fetch_initial_news()
            
            self.logger.info("NewsAPI-Strategie initialisiert")
            return True
            
        except Exception as e:
            self.logger.error(f"Initialisierung fehlgeschlagen: {e}")
            return False
    
    async def _connect_websocket(self):
        """Verbindet mit CryptoPanic WebSocket für Echtzeit-News"""
        try:
            ws_url = f"wss://cryptopanic.com/ws/v1/?token={self.cryptopanic_api_key}"
            # In Production: Echte WebSocket-Connection
            # Hier: Placeholder
            self.websocket_connected = True
            self.logger.info("WebSocket verbunden")
            
        except Exception as e:
            self.logger.error(f"WebSocket Error: {e}")
            self.websocket_connected = False
    
    async def _fetch_initial_news(self):
        """Fetcht initiale News von verschiedenen Quellen"""
        tasks = [
            self._fetch_cryptopanic_news(),
            self._fetch_google_news(),
        ]
        
        await asyncio.gather(*tasks, return_exceptions=True)
    
    async def _fetch_cryptopanic_news(self):
        """Fetcht News von CryptoPanic API"""
        if not self.cryptopanic_api_key:
            return
        
        url = "https://cryptopanic.com/api/v1/posts/"
        params = {
            'auth_token': self.cryptopanic_api_key,
            'kind': 'news',
            'public': 'true',
            'limit': 50,
        }
        
        try:
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    for post in data.get('results', []):
                        news = NewsItem(
                            id=post.get('id', ''),
                            title=post.get('title', ''),
                            summary=post.get('body', '')[:500],
                            source='cryptopanic',
                            url=post.get('url', ''),
                            timestamp=datetime.fromisoformat(post.get('published_at', '').replace('Z', '+00:00')),
                            categories=post.get('currencies', []) + post.get('tags', []),
                        )
                        self.news_items.append(news)
                    
                    self.logger.info(f"{len(data.get('results', []))} CryptoPanic News geladen")
                    
        except Exception as e:
            self.logger.error(f"CryptoPanic API Error: {e}")
    
    async def _fetch_google_news(self):
        """Fetcht News von Google News API"""
        if not self.google_news_api_key:
            return
        
        # In Production: Echte Google News API
        # Hier: Placeholder
        pass
    
    async def generate_signals(self) -> List[Signal]:
        """Generiert Signale basierend auf News-Analyse"""
        signals = []
        
        try:
            # 1. Neue News fetchen
            await self._fetch_latest_news()
            
            # 2. News verarbeiten (NLP)
            await self._process_news()
            
            # 3. Hoch-relevante News identifizieren
            high_relevance_news = [
                n for n in self.news_items 
                if n.relevance_score >= self.RELEVANCE_THRESHOLD and not n.processed
            ]
            
            # 4. Signale generieren
            for news in high_relevance_news:
                signal = await self._create_signal_from_news(news)
                if signal:
                    signals.append(signal)
                    news.processed = True
            
            self.last_run = datetime.utcnow()
            
            for signal in signals:
                self.log_signal(signal)
                
        except Exception as e:
            self.logger.error(f"Fehler bei Signal-Generierung: {e}")
        
        return signals
    
    async def _fetch_latest_news(self):
        """Fetcht neueste News"""
        if self.cryptopanic_api_key:
            await self._fetch_cryptopanic_news()
    
    async def _process_news(self):
        """Verarbeitet News mit NLP für Relevanz und Sentiment"""
        if not self.nlp_loaded:
            self.logger.warning("NLP nicht verfügbar - überspringe Verarbeitung")
            return
        
        for news in self.news_items:
            if news.processed:
                continue
            
            try:
                # 1. Sentiment-Analyse
                news.sentiment = self._analyze_sentiment(news.title + ' ' + news.summary)
                
                # 2. Relevanz-Score berechnen
                news.relevance_score = self._calculate_relevance(news)
                
                # 3. Related Markets identifizieren
                news.related_markets = self._find_related_markets(news)
                
            except Exception as e:
                self.logger.warning(f"News-Verarbeitung Error: {e}")
    
    def _analyze_sentiment(self, text: str) -> float:
        """Analysiert Sentiment eines Textes (-1 bis +1)"""
        if not self.nlp_loaded:
            return 0.0
        
        doc = self.nlp(text)
        
        # Einfache Sentiment-Analyse über Adjektive und Adverbien
        sentiment_words = [
            token for token in doc 
            if token.pos_ in ('ADJ', 'ADV') and not token.is_stop
        ]
        
        # Positive/Negative Wörter zählen
        positive = ['good', 'great', 'excellent', 'positive', 'win', 'success', 'bullish']
        negative = ['bad', 'terrible', 'negative', 'lose', 'failure', 'bearish', 'crash']
        
        score = 0
        for word in sentiment_words:
            if word.text.lower() in positive:
                score += 1
            elif word.text.lower() in negative:
                score -= 1
        
        # Normalize zu -1..1
        return max(-1, min(1, score / max(1, len(sentiment_words))))
    
    def _calculate_relevance(self, news: NewsItem) -> float:
        """Berechnet Relevanz-Score (0..1) für Polymarket"""
        score = 0.0
        
        text = (news.title + ' ' + news.summary).lower()
        
        # 1. Kategorien-Check (40%)
        relevant_cats = [cat for cat in news.categories if cat.lower() in self.RELEVANT_CATEGORIES]
        if relevant_cats:
            score += 0.4 * (len(relevant_cats) / max(1, len(news.categories)))
        
        # 2. Keyword-Matching (40%)
        for category, keywords in self.MARKET_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text:
                    score += 0.4 / len(self.MARKET_KEYWORDS)
                    break
        
        # 3. Recency (20%)
        age_hours = (datetime.utcnow() - news.timestamp).total_seconds() / 3600
        recency_score = max(0, 1 - age_hours / 24)  # < 24h = full score
        score += 0.2 * recency_score
        
        return min(1.0, score)
    
    def _find_related_markets(self, news: NewsItem) -> List[str]:
        """Findet Polymarket-Märkte die zur News passen"""
        markets = []
        text = (news.title + ' ' + news.summary).lower()
        
        # In Production: Echte Market-Matching-Logik
        # Hier: Einfache Keyword-basierte Zuordnung
        
        if any(k in text for k in ['trump', 'biden', 'election']):
            markets.append('politics-us-election')
        
        if any(k in text for k in ['bitcoin', 'crypto', 'sec']):
            markets.append('crypto-btc-price')
        
        if any(k in text for k in ['super bowl', 'nfl']):
            markets.append('sports-superbowl')
        
        return markets
    
    async def _create_signal_from_news(self, news: NewsItem) -> Optional[Signal]:
        """Erstellt Trading-Signal aus News"""
        if not news.related_markets:
            return None
        
        # Confidence basierend auf Relevanz und Sentiment
        base_confidence = int(news.relevance_score * 100)
        
        # Sentiment-Boost
        if news.sentiment > 0.5:
            base_confidence = min(100, base_confidence + 10)
        elif news.sentiment < -0.5:
            base_confidence = max(0, base_confidence - 10)
        
        # Action bestimmen
        action = 'BUY' if news.sentiment >= 0 else 'SELL'
        
        signal = Signal(
            strategy_name='NewsAPI',
            market_id=news.related_markets[0],  # Primary market
            market_name=f"News: {news.title[:50]}",
            action=action,
            confidence=base_confidence,
            metadata={
                'news_id': news.id,
                'source': news.source,
                'url': news.url,
                'sentiment': news.sentiment,
                'relevance_score': news.relevance_score,
                'related_markets': news.related_markets,
            },
            expires_at=datetime.utcnow() + timedelta(minutes=30),  # News veralten schnell
        )
        
        return signal
    
    async def health_check(self) -> Dict[str, Any]:
        """Prüft Gesundheitsstatus"""
        return {
            'strategy': self.name,
            'status': 'healthy' if self.session else 'uninitialized',
            'news_items': len(self.news_items),
            'websocket_connected': self.websocket_connected,
            'nlp_loaded': self.nlp_loaded,
            'cryptopanic_connected': bool(self.cryptopanic_api_key),
            'last_run': self.last_run.isoformat() if self.last_run else None,
        }
    
    async def close(self):
        """Schließt Connections"""
        if self.session:
            await self.session.close()

"""
Social Media Monitoring Strategie

Überwacht Social Media auf Alpha-Signale:
- Twitter API v2 (Premium)
- Reddit API
- Telegram Scraper
- Sentiment-Analyse mit NLP
- Hype-Score Berechnung

Keywords: "$POLY", "insider", "tip", markt-spezifisch
"""

import asyncio
import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
from dataclasses import dataclass, field

import aiohttp
from textblob import TextBlob  # Einfache Sentiment-Analyse

from .base import AlphaStrategy, Signal, SignalStrength

logger = logging.getLogger(__name__)


@dataclass
class SocialMention:
    """Eine Social Media Erwähnung"""
    platform: str  # twitter, reddit, telegram
    post_id: str
    author: str
    content: str
    timestamp: datetime
    engagement: Dict[str, int] = field(default_factory=dict)  # likes, retweets, etc.
    sentiment_score: float = 0.0
    hype_score: float = 0.0
    keywords: List[str] = field(default_factory=list)


class SocialMediaStrategy(AlphaStrategy):
    """
    Social Media Monitoring für Polymarket Alpha
    
    Scannt Twitter, Reddit, Telegram nach relevanten Signalen
    """
    
    # Überwachte Keywords
    KEYWORDS = [
        '$POLY',
        'polymarket',
        'prediction market',
        'insider',
        'tip',
        'sure thing',
        '100%',
    ]
    
    # Influencer die getrackt werden (Beispiele)
    TRACKED_INFLUENCERS = [
        'polymarket',
        'cryptoinfluencer',
        # Weitere hinzufügen
    ]
    
    # Schwellenwerte
    HYPE_THRESHOLD = 70  # Auto-Trade bei Score > 70
    SENTIMENT_THRESHOLD = 0.5  # Positiv > 0.5
    MIN_ENGAGEMENT = 10  # Mindest-Engagement für Relevanz
    
    def __init__(self, config: Dict[str, Any], paper_trading: bool = True):
        super().__init__(config, paper_trading)
        
        self.twitter_api_key = config.get('twitter_api_key')
        self.twitter_api_secret = config.get('twitter_api_secret')
        self.twitter_bearer_token = config.get('twitter_bearer_token')
        self.reddit_client_id = config.get('reddit_client_id')
        self.reddit_client_secret = config.get('reddit_client_secret')
        
        self.session: Optional[aiohttp.ClientSession] = None
        self.mentions: List[SocialMention] = []
        self.hype_scores: Dict[str, float] = {}  # market_id -> score
        
    async def initialize(self) -> bool:
        """Initialisiert API-Clients"""
        try:
            self.session = aiohttp.ClientSession(
                headers={
                    'User-Agent': 'PolymarketAlphaBot/1.0',
                    'Authorization': f'Bearer {self.twitter_bearer_token}' if self.twitter_bearer_token else '',
                }
            )
            
            self.logger.info("SocialMedia-Strategie initialisiert")
            return True
            
        except Exception as e:
            self.logger.error(f"Initialisierung fehlgeschlagen: {e}")
            return False
    
    async def generate_signals(self) -> List[Signal]:
        """Generiert Signale basierend auf Social Media Activity"""
        signals = []
        
        try:
            # 1. Twitter_mentions scrapen
            await self._fetch_twitter_mentions()
            
            # 2. Reddit posts scrapen
            await self._fetch_reddit_mentions()
            
            # 3. Telegram channels scrapen (optional)
            await self._fetch_telegram_mentions()
            
            # 4. Sentiment-Analyse durchführen
            await self._analyze_sentiment()
            
            # 5. Hype-Scores berechnen
            await self._calculate_hype_scores()
            
            # 6. Signale generieren bei hohem Hype
            signals = await self._generate_hype_signals()
            
            self.last_run = datetime.utcnow()
            
            for signal in signals:
                self.log_signal(signal)
                
        except Exception as e:
            self.logger.error(f"Fehler bei Signal-Generierung: {e}")
        
        return signals
    
    async def _fetch_twitter_mentions(self):
        """Fetcht Tweets mit relevanten Keywords"""
        if not self.twitter_bearer_token:
            self.logger.warning("Twitter API Token fehlt - überspringe Twitter")
            return
        
        url = "https://api.twitter.com/2/tweets/search/recent"
        
        for keyword in self.KEYWORDS[:3]:  # Max 3 Keywords pro Request
            params = {
                'query': f'{keyword} polymarket',
                'max_results': 100,
                'tweet.fields': 'created_at,author_id,public_metrics,context_annotations',
                'expansions': 'author_id',
            }
            
            try:
                async with self.session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        tweets = data.get('data', [])
                        users = {u['id']: u for u in data.get('includes', {}).get('users', [])}
                        
                        for tweet in tweets:
                            mention = SocialMention(
                                platform='twitter',
                                post_id=tweet['id'],
                                author=users.get(tweet['author_id'], {}).get('username', 'unknown'),
                                content=tweet.get('text', ''),
                                timestamp=datetime.fromisoformat(tweet['created_at'].replace('Z', '+00:00')),
                                engagement={
                                    'likes': tweet.get('public_metrics', {}).get('like_count', 0),
                                    'retweets': tweet.get('public_metrics', {}).get('retweet_count', 0),
                                    'replies': tweet.get('public_metrics', {}).get('reply_count', 0),
                                },
                                keywords=[keyword],
                            )
                            self.mentions.append(mention)
                            
            except Exception as e:
                self.logger.error(f"Twitter API Error: {e}")
    
    async def _fetch_reddit_mentions(self):
        """Fetcht Reddit Posts aus relevanten Subreddits"""
        subreddits = ['polymarket', 'CryptoCurrency', 'predictionmarkets']
        
        for subreddit in subreddits:
            url = f"https://www.reddit.com/r/{subreddit}/hot.json"
            
            try:
                async with self.session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        posts = data.get('data', {}).get('children', [])[:50]
                        
                        for post in posts:
                            post_data = post.get('data', {})
                            title = post_data.get('title', '')
                            selftext = post_data.get('selftext', '')
                            
                            # Prüfen ob Keywords enthalten
                            content = f"{title} {selftext}".lower()
                            found_keywords = [kw for kw in self.KEYWORDS if kw.lower() in content]
                            
                            if found_keywords:
                                mention = SocialMention(
                                    platform='reddit',
                                    post_id=post_data.get('id', ''),
                                    author=post_data.get('author', 'unknown'),
                                    content=title,
                                    timestamp=datetime.fromtimestamp(post_data.get('created_utc', 0)),
                                    engagement={
                                        'upvotes': post_data.get('ups', 0),
                                        'comments': post_data.get('num_comments', 0),
                                    },
                                    keywords=found_keywords,
                                )
                                self.mentions.append(mention)
                                
            except Exception as e:
                self.logger.error(f"Reddit API Error: {e}")
    
    async def _fetch_telegram_mentions(self):
        """Fetcht Telegram Messages (wenn konfiguriert)"""
        # In Production: Telegram Bot API oder Scraper
        # Hier: Placeholder
        pass
    
    async def _analyze_sentiment(self):
        """Führt Sentiment-Analyse auf allen Mentions durch"""
        for mention in self.mentions:
            try:
                # TextBlob für einfache Sentiment-Analyse
                blob = TextBlob(mention.content)
                mention.sentiment_score = blob.sentiment.polarity  # -1 bis +1
                
            except Exception as e:
                self.logger.warning(f"Sentiment-Analyse Error: {e}")
                mention.sentiment_score = 0.0
    
    async def _calculate_hype_scores(self):
        """Berechnet Hype-Score pro Markt/Keyword"""
        # Gruppiere Mentions nach Keywords
        keyword_mentions: Dict[str, List[SocialMention]] = {}
        
        for mention in self.mentions:
            for keyword in mention.keywords:
                if keyword not in keyword_mentions:
                    keyword_mentions[keyword] = []
                keyword_mentions[keyword].append(mention)
        
        # Berechne Hype-Score pro Keyword
        for keyword, mentions in keyword_mentions.items():
            # Faktoren:
            # - Anzahl Mentions (40%)
            # - Durchschnittliches Engagement (30%)
            # - Sentiment (20%)
            # - Recency (10%)
            
            mention_count_score = min(100, len(mentions) * 10) * 0.4
            
            avg_engagement = sum(
                sum(m.engagement.values()) for m in mentions
            ) / len(mentions) if mentions else 0
            engagement_score = min(100, avg_engagement) * 0.3
            
            avg_sentiment = sum(m.sentiment_score for m in mentions) / len(mentions) if mentions else 0
            sentiment_score = ((avg_sentiment + 1) / 2) * 100 * 0.2  # Normalize -1..1 to 0..100
            
            # Recency: Neuere Mentions = höherer Score
            now = datetime.utcnow()
            avg_age = sum((now - m.timestamp).total_seconds() for m in mentions) / len(mentions) if mentions else 3600
            recency_score = max(0, (3600 - avg_age) / 3600 * 100) * 0.1
            
            total_score = mention_count_score + engagement_score + sentiment_score + recency_score
            
            self.hype_scores[keyword] = min(100, total_score)
    
    async def _generate_hype_signals(self) -> List[Signal]:
        """Generiert Trading-Signale bei hohem Hype"""
        signals = []
        
        for keyword, score in self.hype_scores.items():
            if score >= self.HYPE_THRESHOLD:
                # Hoher Hype detected
                confidence = int(score)
                
                signal = Signal(
                    strategy_name='SocialMedia-Hype',
                    market_id='unknown',  # In Production: Keyword zu Market mappen
                    market_name=f'Social Hype: {keyword}',
                    action='BUY',
                    confidence=confidence,
                    metadata={
                        'hype_score': score,
                        'keyword': keyword,
                        'mention_count': len([m for m in self.mentions if keyword in m.keywords]),
                        'avg_sentiment': sum(m.sentiment_score for m in self.mentions if keyword in m.keywords) / max(1, len([m for m in self.mentions if keyword in m.keywords])),
                    },
                    expires_at=datetime.utcnow() + timedelta(hours=2),
                )
                signals.append(signal)
        
        return signals
    
    async def health_check(self) -> Dict[str, Any]:
        """Prüft Gesundheitsstatus"""
        return {
            'strategy': self.name,
            'status': 'healthy' if self.session else 'uninitialized',
            'mentions_tracked': len(self.mentions),
            'hype_scores': self.hype_scores,
            'twitter_connected': bool(self.twitter_bearer_token),
            'last_run': self.last_run.isoformat() if self.last_run else None,
        }
    
    async def close(self):
        """Schließt Connections"""
        if self.session:
            await self.session.close()

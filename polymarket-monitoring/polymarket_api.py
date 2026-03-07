"""
Polymarket API Client
Fetches real market data, prices, and historical data for backtesting
"""
import aiohttp
import asyncio
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

POLYMARKET_API_BASE = "https://api.polymarket.com"
# Alternative endpoints:
# - https://gamma-api.polymarket.com (old)
# - https://api.polymarket.com (new)
# - https://polymarket.com/api (web)


class PolymarketAPI:
    """Polymarket API Client for real-time and historical data.
    
    Automatically falls back to mock data in Paper Trading mode or when API fails.
    """
    
    def __init__(self, api_key: Optional[str] = None, api_secret: Optional[str] = None, paper_trading: bool = False):
        self.api_key = api_key
        self.api_secret = api_secret
        self.paper_trading = paper_trading or (api_key == "paper_trading_key_demo")
        self.session: Optional[aiohttp.ClientSession] = None
        self.base_url = POLYMARKET_API_BASE
        self.mock_data = None
        
        # Import mock data generator for paper trading
        if self.paper_trading:
            try:
                from mock_data_generator import MockPolymarketData
                self.mock_data = MockPolymarketData(seed=42)
                logger.info("🧊 Paper Trading Mode: Using mock data generator")
            except Exception as e:
                logger.warning(f"Failed to load mock data generator: {e}")
                self.mock_data = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def get_markets(self, category: Optional[str] = None, limit: int = 50) -> List[Dict]:
        """Get active markets, optionally filtered by category."""
        url = f"{self.base_url}/markets"
        params = {"limit": limit, "active": "true"}
        if category:
            params["category"] = category
        
        try:
            async with self.session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data.get("markets", [])
                else:
                    logger.error(f"API error: {resp.status}")
                    return []
        except Exception as e:
            logger.error(f"Error fetching markets: {e}")
            return []
    
    async def get_market_orders(self, market_id: str) -> Dict:
        """Get order book for a specific market."""
        url = f"{self.base_url}/markets/{market_id}/order-book"
        
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    return await resp.json()
                return {}
        except Exception as e:
            logger.error(f"Error fetching orders for {market_id}: {e}")
            return {}
    
    async def get_market_trades(self, market_id: str, limit: int = 100) -> List[Dict]:
        """Get recent trades for a market."""
        url = f"{self.base_url}/markets/{market_id}/trades"
        params = {"limit": limit}
        
        try:
            async with self.session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data.get("trades", [])
                return []
        except Exception as e:
            logger.error(f"Error fetching trades for {market_id}: {e}")
            return []
    
    async def get_price_history(self, market_id: str, days: int = 30) -> List[Dict]:
        """
        Get historical price data for backtesting.
        Returns OHLCV data for the specified period.
        """
        # Paper trading mode - use mock data
        if self.paper_trading and self.mock_data:
            return self.mock_data.generate_price_history(market_id, days)
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        url = f"{self.base_url}/markets/{market_id}/history"
        params = {
            "start": int(start_date.timestamp()),
            "end": int(end_date.timestamp()),
            "interval": "1h"  # 1-hour candles
        }
        
        try:
            async with self.session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    history = data.get("history", [])
                    # If API returns empty, use mock data
                    if not history:
                        logger.warning(f"API returned empty history for {market_id}, using mock data")
                        if self.mock_data:
                            return self.mock_data.generate_price_history(market_id, days)
                        return []
                    return history
                else:
                    logger.warning(f"API error {resp.status} for {market_id}, using mock data")
                    if self.mock_data:
                        return self.mock_data.generate_price_history(market_id, days)
                    return []
        except Exception as e:
            logger.error(f"Error fetching history for {market_id}: {e}, using mock data")
            if self.mock_data:
                return self.mock_data.generate_price_history(market_id, days)
            return []
    
    async def get_user_positions(self, user_address: str) -> List[Dict]:
        """Get all positions for a user address."""
        url = f"{self.base_url}/data/user-positions"
        params = {"user": user_address}
        
        try:
            async with self.session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data.get("positions", [])
                return []
        except Exception as e:
            logger.error(f"Error fetching positions for {user_address}: {e}")
            return []
    
    async def get_top_markets(self, limit: int = 20) -> List[Dict]:
        """Get top markets by volume."""
        # Paper trading mode - use mock data
        if self.paper_trading and self.mock_data:
            return self.mock_data.get_top_markets(limit)
        
        url = f"{self.base_url}/markets"
        params = {
            "limit": limit,
            "sort": "volume",
            "order": "desc"
        }
        
        try:
            async with self.session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    markets = data.get("markets", [])
                    # If API returns empty, use mock data
                    if not markets:
                        logger.warning("API returned empty markets, using mock data")
                        if self.mock_data:
                            return self.mock_data.get_top_markets(limit)
                        return []
                    return markets
                else:
                    logger.warning(f"API error {resp.status}, using mock data")
                    if self.mock_data:
                        return self.mock_data.get_top_markets(limit)
                    return []
        except Exception as e:
            logger.error(f"Error fetching top markets: {e}, using mock data")
            if self.mock_data:
                return self.mock_data.get_top_markets(limit)
            return []
    
    async def search_markets(self, query: str, limit: int = 20) -> List[Dict]:
        """Search markets by keyword."""
        url = f"{self.base_url}/markets"
        params = {
            "search": query,
            "limit": limit
        }
        
        try:
            async with self.session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data.get("markets", [])
                return []
        except Exception as e:
            logger.error(f"Error searching markets: {e}")
            return []
    
    async def get_market_details(self, market_id: str) -> Dict:
        """Get detailed information about a specific market."""
        url = f"{self.base_url}/markets/{market_id}"
        
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    return await resp.json()
                return {}
        except Exception as e:
            logger.error(f"Error fetching market details for {market_id}: {e}")
            return {}
    
    async def get_categories(self) -> List[Dict]:
        """Get all market categories."""
        url = f"{self.base_url}/categories"
        
        try:
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data.get("categories", [])
                return []
        except Exception as e:
            logger.error(f"Error fetching categories: {e}")
            return []


# Convenience functions for synchronous usage
def get_markets_sync(category: Optional[str] = None, limit: int = 50) -> List[Dict]:
    """Synchronous wrapper for get_markets."""
    async def fetch():
        async with PolymarketAPI() as api:
            return await api.get_markets(category, limit)
    
    return asyncio.run(fetch())


def get_price_history_sync(market_id: str, days: int = 30) -> List[Dict]:
    """Synchronous wrapper for get_price_history."""
    async def fetch():
        async with PolymarketAPI() as api:
            return await api.get_price_history(market_id, days)
    
    return asyncio.run(fetch())


if __name__ == "__main__":
    # Test the API client
    async def test_api():
        # Use paper trading mode for testing (mock data)
        async with PolymarketAPI(paper_trading=True) as api:
            print("🧊 Fetching top markets (Paper Trading Mode)...")
            markets = await api.get_top_markets(limit=5)
            print(f"✅ Found {len(markets)} markets")
            
            if markets:
                market = markets[0]
                print(f"\n📊 Top market: {market.get('question', 'N/A')}")
                print(f"💰 Volume: ${market.get('volume', 0):,.2f}")
                
                # Get price history
                market_id = market.get('id')
                if market_id:
                    print(f"\n📈 Fetching price history for {market_id}...")
                    history = await api.get_price_history(market_id, days=7)
                    print(f"✅ Got {len(history)} data points")
            else:
                print("⚠️ No markets returned")
    
    asyncio.run(test_api())

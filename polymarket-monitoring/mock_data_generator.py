"""
Mock Data Generator for Paper Trading
Generates realistic Polymarket data for testing and backtesting
"""
import random
from datetime import datetime, timedelta
from typing import List, Dict
import math


class MockPolymarketData:
    """Generate realistic mock data for Paper Trading mode."""
    
    # Realistic market categories
    CATEGORIES = ["Politics", "Crypto", "Sports", "Finance", "Tech", "Entertainment"]
    
    # Sample market questions
    MARKET_TEMPLATES = [
        "Will Bitcoin reach $100K by {month} {year}?",
        "Will Trump win the {year} election?",
        "Will the Fed raise rates in {month}?",
        "Will Ethereum hit $5K before {month}?",
        "Will Tesla stock reach $300 in {year}?",
        "Will AI pass the Turing test by {year}?",
        "Will the Super Bowl go to overtime?",
        "Will a new COVID variant emerge in {year}?",
    ]
    
    OUTCOMES = ["Yes", "No"]
    
    def __init__(self, seed: int = 42):
        """Initialize with optional seed for reproducibility."""
        random.seed(seed)
        self.base_time = datetime.now()
    
    def generate_market(self, market_id: str) -> Dict:
        """Generate a single mock market."""
        category = random.choice(self.CATEGORIES)
        template = random.choice(self.MARKET_TEMPLATES)
        
        # Generate future date for template
        future_date = self.base_time + timedelta(days=random.randint(30, 365))
        month = future_date.strftime("%B")
        year = future_date.year
        
        question = template.format(month=month, year=year)
        
        # Generate realistic prices (between 0.10 and 0.90)
        yes_price = round(random.uniform(0.15, 0.85), 2)
        no_price = round(1.0 - yes_price + random.uniform(-0.02, 0.02), 2)
        
        # Ensure prices are between 0.01 and 0.99
        yes_price = max(0.01, min(0.99, yes_price))
        no_price = max(0.01, min(0.99, no_price))
        
        volume = random.randint(10000, 5000000)
        liquidity = random.randint(5000, 100000)
        
        return {
            "id": market_id,
            "question": question,
            "category": category,
            "outcomes": self.OUTCOMES,
            "yes_bid": yes_price - 0.02,
            "yes_ask": yes_price + 0.02,
            "no_bid": no_price - 0.02,
            "no_ask": no_price + 0.02,
            "last_price": yes_price,
            "volume": volume,
            "liquidity": liquidity,
            "open_interest": random.randint(1000, volume // 10),
            "close_time": (self.base_time + timedelta(days=random.randint(1, 90))).isoformat(),
            "active": True
        }
    
    def generate_markets(self, count: int = 20) -> List[Dict]:
        """Generate multiple mock markets."""
        markets = []
        for i in range(count):
            market_id = f"mock-market-{i:04d}"
            markets.append(self.generate_market(market_id))
        
        # Sort by volume
        markets.sort(key=lambda x: x["volume"], reverse=True)
        return markets
    
    def generate_price_history(self, market_id: str, days: int = 30, interval: str = "1h") -> List[Dict]:
        """
        Generate realistic price history using random walk with mean reversion.
        Simulates actual market movements.
        """
        history = []
        base_price = random.uniform(0.3, 0.7)  # Start between 0.30 and 0.70
        current_price = base_price
        
        # Generate data points
        if interval == "1h":
            points_per_day = 24
        elif interval == "1d":
            points_per_day = 1
        else:
            points_per_day = 24
        
        total_points = days * points_per_day
        
        for i in range(total_points):
            timestamp = self.base_time - timedelta(days=days) + timedelta(hours=i)
            
            # Random walk with mean reversion
            drift = (base_price - current_price) * 0.01  # Mean reversion
            random_change = random.gauss(0, 0.02)  # Random noise
            price_change = drift + random_change
            
            current_price += price_change
            current_price = max(0.01, min(0.99, current_price))  # Clamp to valid range
            
            # Generate OHLCV
            open_price = current_price
            close_price = current_price + random.gauss(0, 0.01)
            high_price = max(open_price, close_price) + abs(random.gauss(0, 0.005))
            low_price = min(open_price, close_price) - abs(random.gauss(0, 0.005))
            volume = random.randint(100, 10000)
            
            history.append({
                "timestamp": timestamp.isoformat(),
                "open": round(open_price, 4),
                "high": round(high_price, 4),
                "low": round(low_price, 4),
                "close": round(close_price, 4),
                "volume": volume,
                "market_id": market_id
            })
        
        return history
    
    def generate_order_book(self, market_id: str) -> Dict:
        """Generate realistic order book."""
        mid_price = random.uniform(0.3, 0.7)
        
        # Generate bids (buy orders)
        bids = []
        for i in range(10):
            price = round(mid_price - 0.01 - (i * 0.005), 4)
            size = random.randint(100, 5000)
            bids.append({"price": price, "size": size})
        
        # Generate asks (sell orders)
        asks = []
        for i in range(10):
            price = round(mid_price + 0.01 + (i * 0.005), 4)
            size = random.randint(100, 5000)
            asks.append({"price": price, "size": size})
        
        return {
            "market_id": market_id,
            "bids": bids,
            "asks": asks,
            "spread": round(asks[0]["price"] - bids[0]["price"], 4),
            "timestamp": datetime.now().isoformat()
        }
    
    def generate_trades(self, market_id: str, count: int = 50) -> List[Dict]:
        """Generate recent trade history."""
        trades = []
        base_price = random.uniform(0.3, 0.7)
        
        for i in range(count):
            timestamp = datetime.now() - timedelta(minutes=random.randint(0, 1440))
            price = round(base_price + random.gauss(0, 0.05), 4)
            price = max(0.01, min(0.99, price))
            size = random.randint(10, 1000)
            side = random.choice(["buy", "sell"])
            
            trades.append({
                "market_id": market_id,
                "timestamp": timestamp.isoformat(),
                "price": price,
                "size": size,
                "side": side,
                "taker_side": side
            })
        
        # Sort by timestamp
        trades.sort(key=lambda x: x["timestamp"], reverse=True)
        return trades
    
    def get_top_markets(self, limit: int = 20) -> List[Dict]:
        """Get top markets by volume."""
        markets = self.generate_markets(limit * 2)
        return markets[:limit]
    
    def search_markets(self, query: str, limit: int = 20) -> List[Dict]:
        """Search markets by keyword."""
        all_markets = self.generate_markets(100)
        query_lower = query.lower()
        
        filtered = [
            m for m in all_markets
            if query_lower in m["question"].lower() or query_lower in m["category"].lower()
        ][:limit]
        
        return filtered if filtered else all_markets[:limit]


# Singleton instance for consistent data
_mock_data = MockPolymarketData(seed=42)


def get_mock_markets(count: int = 20) -> List[Dict]:
    """Get mock markets."""
    return _mock_data.generate_markets(count)


def get_mock_history(market_id: str, days: int = 30) -> List[Dict]:
    """Get mock price history."""
    return _mock_data.generate_price_history(market_id, days)


def get_mock_top_markets(limit: int = 20) -> List[Dict]:
    """Get top mock markets by volume."""
    return _mock_data.get_top_markets(limit)


if __name__ == "__main__":
    # Test the mock data generator
    print("🧊 Testing Mock Data Generator...")
    
    # Generate markets
    markets = get_mock_markets(5)
    print(f"\n✅ Generated {len(markets)} markets:")
    for m in markets[:3]:
        print(f"  - {m['question'][:50]}... (Vol: ${m['volume']:,})")
    
    # Generate history
    history = get_mock_history("mock-market-0001", days=7)
    print(f"\n✅ Generated {len(history)} history data points")
    
    # Test search
    results = _mock_data.search_markets("Bitcoin", limit=3)
    print(f"\n✅ Search for 'Bitcoin': {len(results)} results")
    
    print("\n✅ Mock Data Generator Ready for Paper Trading!")

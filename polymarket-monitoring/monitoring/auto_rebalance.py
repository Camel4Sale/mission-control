"""
Auto-Rebalance - Portfolio Rebalancing Engine
"""
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class TargetAllocation:
    """Target allocation for a market/outcome"""
    market_id: str
    market_name: str
    outcome: str
    target_percent: float  # 0.0 to 1.0
    min_percent: float = 0.0
    max_percent: float = 1.0

@dataclass
class RebalanceAction:
    action_type: str  # BUY or SELL
    market_id: str
    market_name: str
    outcome: str
    current_percent: float
    target_percent: float
    deviation: float
    shares_to_trade: float
    estimated_value: float
    tax_impact: float  # Estimated tax if realized

class AutoRebalance:
    """Automatic portfolio rebalancing"""
    
    def __init__(self, pnl_tracker, alert_system, config):
        self.pnl_tracker = pnl_tracker
        self.alert_system = alert_system
        self.config = config.rebalance
        self.target_allocations: List[TargetAllocation] = []
        self.last_rebalance: Optional[datetime] = None
        self.rebalance_history: List[Dict] = []
        
    def set_target_allocations(self, allocations: List[TargetAllocation]):
        """Set target portfolio allocations"""
        total = sum(a.target_percent for a in allocations)
        if abs(total - 1.0) > 0.01:
            raise ValueError(f"Target allocations must sum to 1.0, got {total}")
        self.target_allocations = allocations
    
    def calculate_deviations(self) -> Dict[str, float]:
        """Calculate current vs target allocation deviations"""
        portfolio_value = self.pnl_tracker.get_portfolio_value()
        if portfolio_value == 0:
            return {}
        
        deviations = {}
        for target in self.target_allocations:
            position = self.pnl_tracker.positions.get(target.market_id)
            if position:
                current_percent = position.current_value / portfolio_value
                deviation = current_percent - target.target_percent
                deviations[target.market_id] = deviation
            else:
                deviations[target.market_id] = -target.target_percent  # Missing position
        
        return deviations
    
    def check_rebalance_needed(self) -> Tuple[bool, Dict[str, float]]:
        """Check if rebalancing is needed based on threshold"""
        deviations = self.calculate_deviations()
        max_deviation = max(abs(d) for d in deviations.values()) if deviations else 0
        
        needs_rebalance = max_deviation > self.config.deviation_threshold
        return needs_rebalance, deviations
    
    def generate_rebalance_actions(self, deviations: Dict[str, float]) -> List[RebalanceAction]:
        """Generate list of actions to rebalance portfolio"""
        actions = []
        portfolio_value = self.pnl_tracker.get_portfolio_value()
        
        for target in self.target_allocations:
            deviation = deviations.get(target.market_id, 0)
            
            if abs(deviation) < self.config.deviation_threshold:
                continue  # Within threshold
            
            position = self.pnl_tracker.positions.get(target.market_id)
            current_value = position.current_value if position else 0
            current_percent = current_value / portfolio_value if portfolio_value > 0 else 0
            
            # Calculate value to trade
            value_to_trade = abs(deviation) * portfolio_value
            
            # Get current price
            current_price = position.current_price if position else 0.5  # Default midpoint
            
            # Calculate shares to trade
            shares_to_trade = value_to_trade / current_price if current_price > 0 else 0
            
            # Determine action type
            action_type = "SELL" if deviation > 0 else "BUY"
            
            # Estimate tax impact (simplified - 20% short-term capital gains)
            tax_impact = 0.0
            if action_type == "SELL" and position:
                gain = (position.current_price - position.entry_price) * shares_to_trade
                if gain > 0:
                    tax_impact = gain * 0.20  # 20% tax rate
            
            action = RebalanceAction(
                action_type=action_type,
                market_id=target.market_id,
                market_name=target.market_name,
                outcome=target.outcome,
                current_percent=current_percent,
                target_percent=target.target_percent,
                deviation=deviation,
                shares_to_trade=shares_to_trade,
                estimated_value=value_to_trade,
                tax_impact=tax_impact
            )
            actions.append(action)
        
        # Sort by deviation magnitude (largest first)
        actions.sort(key=lambda x: abs(x.deviation), reverse=True)
        return actions
    
    def optimize_for_tax(self, actions: List[RebalanceAction]) -> List[RebalanceAction]:
        """Optimize actions for tax efficiency if enabled"""
        if not self.config.tax_optimized:
            return actions
        
        optimized = []
        for action in actions:
            # If selling at a loss, prioritize (tax loss harvesting)
            position = self.pnl_tracker.positions.get(action.market_id)
            if position and action.action_type == "SELL":
                unrealized_gain = (position.current_price - position.entry_price) * action.shares_to_trade
                if unrealized_gain < 0:
                    # Mark as priority (loss harvesting)
                    optimized.insert(0, action)
                else:
                    optimized.append(action)
            else:
                optimized.append(action)
        
        return optimized
    
    async def execute_rebalance(self, dry_run: bool = True) -> Dict:
        """Execute rebalancing"""
        needs_rebalance, deviations = self.check_rebalance_needed()
        
        if not needs_rebalance:
            return {
                "executed": False,
                "reason": "Within threshold",
                "max_deviation": max(abs(d) for d in deviations.values()) if deviations else 0
            }
        
        actions = self.generate_rebalance_actions(deviations)
        actions = self.optimize_for_tax(actions)
        
        if not actions:
            return {
                "executed": False,
                "reason": "No actions generated",
                "deviations": deviations
            }
        
        # Execute actions (in dry_run mode, just log)
        executed_actions = []
        for action in actions:
            if dry_run:
                print(f"📋 [DRY RUN] {action.action_type} {action.shares_to_trade:.2f} shares of {action.market_name}")
                print(f"   Value: ${action.estimated_value:.2f}, Tax impact: ${action.tax_impact:.2f}")
            else:
                # In production, execute actual trades via Polymarket API
                print(f"✅ Executing {action.action_type} {action.shares_to_trade:.2f} shares")
                # await self.execute_trade(action)
            
            executed_actions.append({
                "action_type": action.action_type,
                "market": action.market_name,
                "shares": action.shares_to_trade,
                "value": action.estimated_value,
                "tax_impact": action.tax_impact
            })
        
        # Record rebalance
        self.last_rebalance = datetime.now()
        self.rebalance_history.append({
            "timestamp": datetime.now().isoformat(),
            "actions": executed_actions,
            "deviations_before": deviations,
            "dry_run": dry_run
        })
        
        # Send alert
        if self.alert_system:
            await self.alert_system.send_rebalance_report(
                deviations={k: v for k, v in deviations.items()},
                actions_taken=[f"{a['action_type']} {a['shares']:.2f} {a['market']}" for a in executed_actions]
            )
        
        return {
            "executed": True,
            "actions_count": len(executed_actions),
            "actions": executed_actions,
            "deviations_before": deviations,
            "dry_run": dry_run
        }
    
    def get_rebalance_schedule(self) -> Dict:
        """Get rebalancing schedule info"""
        next_check = self.last_rebalance + timedelta(hours=self.config.check_interval_hours) if self.last_rebalance else datetime.now()
        
        return {
            "last_rebalance": self.last_rebalance.isoformat() if self.last_rebalance else None,
            "next_check": next_check.isoformat(),
            "check_interval_hours": self.config.check_interval_hours,
            "deviation_threshold": self.config.deviation_threshold,
            "tax_optimized": self.config.tax_optimized
        }
    
    def generate_rebalance_report(self) -> str:
        """Generate human-readable rebalancing report"""
        needs_rebalance, deviations = self.check_rebalance_needed()
        
        report = ["🔄 REBALANCING REPORT", "=" * 40]
        report.append(f"Last rebalance: {self.last_rebalance or 'Never'}")
        report.append(f"Threshold: {self.config.deviation_threshold*100:.1f}%")
        report.append("")
        
        if needs_rebalance:
            report.append("⚠️ REBALANCING NEEDED")
            report.append("")
            report.append("Current Deviations:")
            for market_id, dev in sorted(deviations.items(), key=lambda x: abs(x[1]), reverse=True):
                position = self.pnl_tracker.positions.get(market_id)
                name = position.market_name if position else market_id
                report.append(f"  {name}: {dev*100:+.2f}%")
        else:
            report.append("✅ Portfolio within target allocation")
            max_dev = max(abs(d) for d in deviations.values()) if deviations else 0
            report.append(f"Max deviation: {max_dev*100:.2f}%")
        
        return "\n".join(report)

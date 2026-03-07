"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock,
} from "lucide-react";

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types
interface PnLData {
  unrealized_pnl: number;
  realized_pnl: number;
  portfolio_value: number;
  roi: number;
  positions_count: number;
  timestamp: string;
}

interface Position {
  market_id: string;
  market_name: string;
  outcome: string;
  shares: number;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  roi: number;
  current_value: number;
  entry_value: number;
}

interface CircuitBreakerStatus {
  state: string;
  trading_allowed: boolean;
  manual_override_active: boolean;
  daily_pnl: number;
  daily_percent: number;
  daily_limit: number;
  daily_remaining: number;
  weekly_pnl: number;
  weekly_percent: number;
  weekly_limit: number;
  weekly_remaining: number;
  consecutive_errors: number;
  max_errors: number;
}

interface DailyPnL {
  date: string;
  pnl: number;
}

// Stat Card Component
function StatCard({ title, value, subvalue, icon: Icon, trend }: { title: string; value: string | number; subvalue?: string; icon: React.ElementType; trend?: string }) {
  const isPositive = trend === "up" || (typeof value === "number" && value >= 0);
  
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <Icon className={`w-5 h-5 ${isPositive ? "text-emerald-500" : "text-red-500"}`} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {typeof value === "number" 
          ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
          : value}
      </div>
      {subvalue && (
        <div className={`text-sm ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
          {subvalue}
        </div>
      )}
    </div>
  );
}

// Circuit Breaker Component
function CircuitBreakerStatus({ status }: { status: CircuitBreakerStatus }) {
  const stateColors: Record<string, string> = {
    active: "bg-emerald-500",
    halted: "bg-red-500",
    error: "bg-amber-500",
    manual: "bg-blue-500",
  };

  const stateLabels: Record<string, string> = {
    active: "ACTIVE",
    halted: "HALTED",
    error: "ERROR",
    manual: "MANUAL",
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Circuit Breaker
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${stateColors[status.state]} text-white`}>
          {stateLabels[status.state]}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Daily P&L</span>
            <span className={`${status.daily_pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {status.daily_pnl >= 0 ? "+" : ""}{status.daily_pnl.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${status.daily_pnl >= 0 ? "bg-emerald-500" : "bg-red-500"}`} 
              style={{ width: `${Math.min(Math.abs(status.daily_pnl) / Math.abs(status.daily_limit) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">Limit: {status.daily_limit}%</div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Weekly P&L</span>
            <span className={`${status.weekly_pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {status.weekly_pnl >= 0 ? "+" : ""}{status.weekly_pnl.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${status.weekly_pnl >= 0 ? "bg-emerald-500" : "bg-red-500"}`} 
              style={{ width: `${Math.min(Math.abs(status.weekly_pnl) / Math.abs(status.weekly_limit) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">Limit: {status.weekly_limit}%</div>
        </div>

        <div className="flex items-center gap-2 text-emerald-500 text-sm mt-4">
          <CheckCircle className="w-4 h-4" />
          <span>{status.trading_allowed ? "Trading Allowed" : "Trading Halted"}</span>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function PolymarketDashboard() {
  const [pnlData, setPnLData] = useState<PnLData | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [circuitBreaker, setCircuitBreaker] = useState<CircuitBreakerStatus | null>(null);
  const [dailyPnL, setDailyPnL] = useState<DailyPnL[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");

  // Fetch data from API
  const fetchData = async () => {
    try {
      const [pnlRes, positionsRes, circuitRes] = await Promise.all([
        fetch(`${API_BASE}/api/pnl`),
        fetch(`${API_BASE}/api/positions`),
        fetch(`${API_BASE}/api/circuit-breaker`),
      ]);

      const pnl = await pnlRes.json();
      const posData = await positionsRes.json();
      const circuit = await circuitRes.json();

      setPnLData(pnl);
      setPositions(posData.positions || []);
      setCircuitBreaker(circuit);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate daily P&L chart data from positions
  useEffect(() => {
    if (positions.length > 0) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      setDailyPnL(
        last7Days.map(date => ({
          date,
          pnl: Math.random() * 1000 - 300, // Placeholder - would come from historical API
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Polymarket Monitoring</h1>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last update: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* P&L Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Unrealized P&L" 
            value={pnlData?.unrealized_pnl || 0} 
            subvalue={pnlData ? `${((pnlData.unrealized_pnl / (pnlData.portfolio_value - pnlData.unrealized_pnl)) * 100).toFixed(2)}%` : "0%"}
            icon={TrendingUp}
            trend={pnlData && pnlData.unrealized_pnl >= 0 ? "up" : "down"}
          />
          <StatCard 
            title="Realized P&L" 
            value={pnlData?.realized_pnl || 0} 
            subvalue="All time"
            icon={DollarSign}
            trend={pnlData && pnlData.realized_pnl >= 0 ? "up" : "down"}
          />
          <StatCard 
            title="Portfolio Value" 
            value={pnlData?.portfolio_value || 0} 
            subvalue={`${pnlData?.positions_count || 0} positions`}
            icon={Activity}
          />
          <StatCard 
            title="Total ROI" 
            value={pnlData ? (pnlData.roi * 100).toFixed(2) + "%" : "0%"} 
            subvalue="Since inception"
            icon={TrendingUp}
            trend={pnlData && pnlData.roi >= 0 ? "up" : "down"}
          />
        </div>

        {/* Charts & Circuit Breaker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* P&L Performance Chart */}
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">P&L Performance</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab("daily")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === "daily" ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                >
                  Daily
                </button>
                <button 
                  onClick={() => setActiveTab("weekly")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === "weekly" ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => setActiveTab("monthly")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === "monthly" ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="h-80">
              {dailyPnL.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyPnL}>
                    <defs>
                      <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1f2937", 
                        border: "1px solid #374151",
                        borderRadius: "8px"
                      }}
                    />
                    <Area type="monotone" dataKey="pnl" stroke="#10b981" fillOpacity={1} fill="url(#colorPnl)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No data available - Add positions to see P&L history
                </div>
              )}
            </div>
          </div>

          {/* Circuit Breaker */}
          {circuitBreaker && <CircuitBreakerStatus status={circuitBreaker} />}
        </div>

        {/* Positions Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Open Positions</h3>
          {positions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">Market</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">Outcome</th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">Shares</th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">Entry</th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">Current</th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">P&L</th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-3 px-4">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position, idx) => (
                    <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-4 text-sm text-white">{position.market_name}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${position.outcome === "Yes" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                          {position.outcome}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-300 text-right">{position.shares}</td>
                      <td className="py-4 px-4 text-sm text-gray-300 text-right">${position.entry_price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-sm text-gray-300 text-right">${position.current_price.toFixed(2)}</td>
                      <td className={`py-4 px-4 text-sm text-right font-medium ${position.unrealized_pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {position.unrealized_pnl >= 0 ? "+" : ""}${position.unrealized_pnl.toFixed(2)}
                      </td>
                      <td className={`py-4 px-4 text-sm text-right font-medium ${position.roi >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {(position.roi * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No open positions</p>
              <p className="text-sm mt-2">Add positions via the API or monitoring bot</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

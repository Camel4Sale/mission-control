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
  PieChart,
  Pie,
  Cell,
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
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

// Mock data - in production, fetch from API
const mockPnLData = {
  total_unrealized_pnl: 1247.53,
  total_realized_pnl: 3891.22,
  total_portfolio_value: 15420.80,
  overall_roi: 0.3421,
  positions_count: 8,
};

const mockDailyPnL = [
  { date: "2026-02-28", pnl: 234.50 },
  { date: "2026-03-01", pnl: -123.20 },
  { date: "2026-03-02", pnl: 456.80 },
  { date: "2026-03-03", pnl: 189.30 },
  { date: "2026-03-04", pnl: -67.40 },
  { date: "2026-03-05", pnl: 512.90 },
  { date: "2026-03-06", pnl: 345.60 },
];

const mockWeeklyPnL = [
  { week: "W8", pnl: 1234.50 },
  { week: "W9", pnl: 2341.20 },
  { week: "W10", pnl: 1876.30 },
  { week: "W11", pnl: 3421.80 },
  { week: "W12", pnl: 2109.40 },
];

const mockMonthlyPnL = [
  { month: "Nov", pnl: 4521.30 },
  { month: "Dec", pnl: 6234.80 },
  { month: "Jan", pnl: 3891.20 },
  { month: "Feb", pnl: 5123.60 },
  { month: "Mar", pnl: 2847.90 },
];

const mockPositions = [
  { market_id: "1", market_name: "Fed Rate March", outcome: "Yes", shares: 150, entry_price: 0.42, current_price: 0.58, unrealized_pnl: 24.00, roi: 0.381 },
  { market_id: "2", market_name: "BTC $100K Q1", outcome: "No", shares: 200, entry_price: 0.65, current_price: 0.71, unrealized_pnl: 12.00, roi: 0.092 },
  { market_id: "3", market_name: "Election Winner", outcome: "Yes", shares: 100, entry_price: 0.35, current_price: 0.29, unrealized_pnl: -6.00, roi: -0.171 },
  { market_id: "4", market_name: "Super Bowl LVIII", outcome: "Yes", shares: 75, entry_price: 0.52, current_price: 0.68, unrealized_pnl: 12.00, roi: 0.308 },
];

const mockCircuitBreaker = {
  state: "active",
  daily_pnl: 345.60,
  daily_percent: 2.34,
  daily_limit: -10.0,
  weekly_pnl: 2109.40,
  weekly_percent: 14.21,
  weekly_limit: -20.0,
  trading_allowed: true,
};

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"];

function StatCard({ title, value, subvalue, icon: Icon, trend }: any) {
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

function CircuitBreakerStatus({ status }: { status: any }) {
  const stateColors: any = {
    active: "bg-emerald-500",
    halted: "bg-red-500",
    error: "bg-amber-500",
    manual: "bg-blue-500",
  };

  const stateLabels: any = {
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
            <span className={status.daily_pnl >= 0 ? "text-emerald-500" : "text-red-500"}>
              {status.daily_pnl >= 0 ? "+" : ""}{status.daily_pnl.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${status.daily_pnl >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(Math.abs(status.daily_pnl) / 10 * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">Limit: {status.daily_limit}%</div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Weekly P&L</span>
            <span className={status.weekly_pnl >= 0 ? "text-emerald-500" : "text-red-500"}>
              {status.weekly_pnl >= 0 ? "+" : ""}{status.weekly_pnl.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${status.weekly_pnl >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(Math.abs(status.weekly_pnl) / 20 * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">Limit: {status.weekly_limit}%</div>
        </div>

        {status.trading_allowed ? (
          <div className="flex items-center gap-2 text-emerald-500 text-sm mt-4">
            <CheckCircle className="w-4 h-4" />
            <span>Trading Allowed</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-4">
            <AlertTriangle className="w-4 h-4" />
            <span>Trading Halted</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const chartData = timeframe === "daily" ? mockDailyPnL : timeframe === "weekly" ? mockWeeklyPnL : mockMonthlyPnL;
  const xKey = timeframe === "daily" ? "date" : timeframe === "weekly" ? "week" : "month";

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
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Unrealized P&L"
            value={mockPnLData.total_unrealized_pnl}
            subvalue={`${mockPnLData.total_unrealized_pnl >= 0 ? "+" : ""}${((mockPnLData.total_unrealized_pnl / mockPnLData.total_portfolio_value) * 100).toFixed(2)}%`}
            icon={mockPnLData.total_unrealized_pnl >= 0 ? TrendingUp : TrendingDown}
            trend={mockPnLData.total_unrealized_pnl >= 0 ? "up" : "down"}
          />
          <StatCard
            title="Realized P&L"
            value={mockPnLData.total_realized_pnl}
            subvalue="All time"
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Portfolio Value"
            value={mockPnLData.total_portfolio_value}
            subvalue={`${mockPnLData.positions_count} positions`}
            icon={BarChart3}
            trend="up"
          />
          <StatCard
            title="Total ROI"
            value={`${(mockPnLData.overall_roi * 100).toFixed(2)}%`}
            subvalue="Since inception"
            icon={PieChartIcon}
            trend="up"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* P&L Chart */}
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">P&L Performance</h3>
              <div className="flex gap-2">
                {(["daily", "weekly", "monthly"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeframe === tf
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {tf.charAt(0).toUpperCase() + tf.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey={xKey} 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "P&L"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fill="url(#pnlGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Circuit Breaker */}
          <div>
            <CircuitBreakerStatus status={mockCircuitBreaker} />
          </div>
        </div>

        {/* Positions Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Open Positions</h3>
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
                {mockPositions.map((pos) => (
                  <tr key={pos.market_id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 text-sm text-white">{pos.market_name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        pos.outcome === "Yes" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {pos.outcome}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300 text-right">{pos.shares}</td>
                    <td className="py-4 px-4 text-sm text-gray-300 text-right">${pos.entry_price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm text-gray-300 text-right">${pos.current_price.toFixed(2)}</td>
                    <td className={`py-4 px-4 text-sm text-right font-medium ${
                      pos.unrealized_pnl >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}>
                      {pos.unrealized_pnl >= 0 ? "+" : ""}${pos.unrealized_pnl.toFixed(2)}
                    </td>
                    <td className={`py-4 px-4 text-sm text-right font-medium ${
                      pos.roi >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}>
                      {(pos.roi * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategy Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Performance */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Weekly Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart3 className="w-full h-full" />
                <LineChart data={mockWeeklyPnL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                  />
                  <Line type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Monthly Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockMonthlyPnL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                  />
                  <Line type="monotone" dataKey="pnl" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

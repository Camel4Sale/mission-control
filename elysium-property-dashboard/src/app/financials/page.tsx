'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FinancialChart } from '@/components/FinancialChart';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Download, Calendar, PieChart as PieChartIcon, BarChart3 
} from 'lucide-react';

const cashflowData = [
  { month: 'Jan 2025', income: 24500, expenses: 8200, cashflow: 16300 },
  { month: 'Feb 2025', income: 25100, expenses: 9800, cashflow: 15300 },
  { month: 'Mär 2025', income: 24800, expenses: 7500, cashflow: 17300 },
  { month: 'Apr 2025', income: 25200, expenses: 8900, cashflow: 16300 },
  { month: 'Mai 2025', income: 25600, expenses: 9200, cashflow: 16400 },
  { month: 'Jun 2025', income: 25400, expenses: 8100, cashflow: 17300 },
];

const incomeByCategory = [
  { name: 'Miete', value: 152400 },
  { name: 'Nebenkosten', value: 18600 },
  { name: 'Stellplätze', value: 9600 },
  { name: 'Sonstiges', value: 3200 },
];

const expensesByCategory = [
  { name: 'Instandhaltung', value: 42800 },
  { name: 'Versicherung', value: 12400 },
  { name: 'Verwaltung', value: 18200 },
  { name: 'Steuern', value: 28600 },
  { name: 'Finanzierung', value: 15800 },
];

const roiByProperty = [
  { name: 'Karlsruhe MFH', roi: 8.06, value: 1580000 },
  { name: 'Stuttgart EFH', roi: 4.27, value: 890000 },
  { name: 'München Wohnung', roi: 3.89, value: 615000 },
  { name: 'Heidelberg Büro', roi: 4.98, value: 1380000 },
  { name: 'Mannheim Laden', roi: 6.23, value: 485000 },
  { name: 'Pforzheim Mixed', roi: 8.68, value: 865000 },
];

const transactions = [
  { id: '1', date: '2025-03-01', type: 'INCOME', category: 'RENT', description: 'Mieteingang Gartenstadt', amount: 8400, property: 'Gartenstadt Residenz' },
  { id: '2', date: '2025-03-01', type: 'INCOME', category: 'RENT', description: 'Mieteingang Villa Killesberg', amount: 2400, property: 'Villa Killesberg' },
  { id: '3', date: '2025-03-02', type: 'EXPENSE', category: 'MAINTENANCE', description: 'Heizungsreparatur', amount: -1200, property: 'Gartenstadt Residenz' },
  { id: '4', date: '2025-03-01', type: 'EXPENSE', category: 'INSURANCE', description: 'Gebäudeversicherung Q1', amount: -450, property: 'Gartenstadt Residenz' },
  { id: '5', date: '2025-03-01', type: 'INCOME', category: 'RENT', description: 'Mieteingang Schwabing Loft', amount: 1680, property: 'Schwabing Loft' },
  { id: '6', date: '2025-03-03', type: 'INCOME', category: 'RENT', description: 'Mieteingang Bürocenter', amount: 4800, property: 'Neuenheimer Bürocenter' },
];

export default function FinancialsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [timeRange, setTimeRange] = useState<'6M' | '1Y' | 'ALL'>('6M');

  const totalIncome = cashflowData.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = cashflowData.reduce((sum, m) => sum + m.expenses, 0);
  const totalCashflow = totalIncome - totalExpenses;
  const averageMonthlyCashflow = totalCashflow / cashflowData.length;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="lg:ml-64 p-6 pt-20 lg:pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Finanzübersicht</h1>
            <p className="text-muted-foreground">
              Cashflow, ROI und detaillierte Finanzanalysen
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="6M">Letzte 6 Monate</option>
              <option value="1Y">Letztes Jahr</option>
              <option value="ALL">Gesamt</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gesamteinnahmen</p>
                <p className="text-2xl font-bold text-green-500">{(totalIncome / 1000).toFixed(1)}K€</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+5.2% vs. Vorperiode</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gesamtausgaben</p>
                <p className="text-2xl font-bold text-red-500">{(totalExpenses / 1000).toFixed(1)}K€</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>+2.8% vs. Vorperiode</span>
                </div>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Netto-Cashflow</p>
                <p className="text-2xl font-bold text-blue-500">{(totalCashflow / 1000).toFixed(1)}K€</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <span>Ø {(averageMonthlyCashflow / 1000).toFixed(1)}K€/Monat</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ø ROI Portfolio</p>
                <p className="text-2xl font-bold text-purple-500">6.02%</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Ø Markt: 4.5%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <PieChartIcon className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Cashflow Entwicklung
              </h3>
            </div>
            <FinancialChart data={cashflowData} type="cashflow" />
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                ROI nach Property
              </h3>
            </div>
            <FinancialChart data={roiByProperty} type="roi" />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Einnahmen nach Kategorie</h3>
            <FinancialChart data={incomeByCategory} type="income-expense" />
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Ausgaben nach Kategorie</h3>
            <FinancialChart data={expensesByCategory} type="income-expense" />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Letzte Transaktionen
            </h3>
            <button className="text-sm text-primary hover:underline">Alle anzeigen</button>
          </div>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'INCOME' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {transaction.type === 'INCOME' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.property} • {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { FinancingCalculator } from '@/components/FinancingCalculator';
import { CashflowAnalyzer } from '@/components/CashflowAnalyzer';
import { LongTermProjection } from '@/components/LongTermProjection';
import { ScenarioComparison } from '@/components/ScenarioComparison';
import { ETFComparison } from '@/components/ETFComparison';
import { PortfolioTracker } from '@/components/PortfolioTracker';
import { ExitPlanner } from '@/components/ExitPlanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Download, Home as HomeIcon, TrendingUp, PieChart, BarChart3, Briefcase, LogOut } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('financing');

  const tabs = [
    { id: 'financing', label: 'Finanzierung', icon: Home },
    { id: 'cashflow', label: 'Cashflow', icon: TrendingUp },
    { id: 'projection', label: 'Prognose', icon: BarChart3 },
    { id: 'scenarios', label: 'Szenarien', icon: PieChart },
    { id: 'etf', label: 'ETF-Vergleich', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'exit', label: 'Exit', icon: LogOut },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Buy-to-Let Analyzer
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Elysium Investment Plugin
                </p>
              </div>
            </div>
            
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF Export</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-2 rounded-lg data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 transition-all"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6">
            <TabsContent value="financing">
              <FinancingCalculator />
            </TabsContent>
            
            <TabsContent value="cashflow">
              <CashflowAnalyzer />
            </TabsContent>
            
            <TabsContent value="projection">
              <LongTermProjection />
            </TabsContent>
            
            <TabsContent value="scenarios">
              <ScenarioComparison />
            </TabsContent>
            
            <TabsContent value="etf">
              <ETFComparison />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <PortfolioTracker />
            </TabsContent>
            
            <TabsContent value="exit">
              <ExitPlanner />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>© 2024 Elysium Buy-to-Let Analyzer. Alle Berechnungen ohne Gewähr.</p>
            <p className="mt-1">Dies ist ein Planungstool und ersetzt keine professionelle Finanzberatung.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Building, TrendingUp, DollarSign, Home, Calendar,
  AlertTriangle, CheckCircle, Clock, Users, Wrench, Camera, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { 
  fetchDealPipeline, fetchRenovationPhases, fetchHandymen, 
  fetchMarketingTrackers, fetchPortfolioFinance 
} from '@/lib/api';
import { DealPipeline, RenovationPhase, Handyman, MarketingTracker, PortfolioFinance } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

const stageColors: Record<string, { bg: string; text: string }> = {
  'found': { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
  'calculating': { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' },
  'inspection': { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  'negotiation': { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4' },
  'notar': { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' },
  'owned': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
  'renovation': { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  'sold': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
};

const stageLabels: Record<string, string> = {
  'found': 'Gefunden',
  'calculating': 'Kalkulation',
  'inspection': 'Besichtigung',
  'negotiation': 'Verhandlung',
  'notar': 'Notar',
  'owned': 'Im Besitz',
  'renovation': 'Renovierung',
  'sold': 'Verkauft',
};

const phaseColors: Record<string, string> = {
  'planning': '#6b7280',
  'demolition': '#ef4444',
  'plumbing': '#06b6d4',
  'electrical': '#f59e0b',
  'drywall': '#8b5cf6',
  'flooring': '#10b981',
  'painting': '#ec4899',
  'final': '#22c55e',
};

export default function ElysiumPage() {
  const [deals, setDeals] = useState<DealPipeline[]>([]);
  const [handymen, setHandymen] = useState<Handyman[]>([]);
  const [marketing, setMarketing] = useState<MarketingTracker[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioFinance | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [renovationPhases, setRenovationPhases] = useState<RenovationPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [d, h, m, p] = await Promise.all([
        fetchDealPipeline(), fetchHandymen(), 
        fetchMarketingTrackers(), fetchPortfolioFinance()
      ]);
      setDeals(d); setHandymen(h); setMarketing(m); setPortfolio(p);
      if (d.length > 0) {
        setSelectedDeal(d[0].id);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDeal) {
      import('@/lib/api').then(api => {
        api.fetchRenovationPhases(selectedDeal).then(setRenovationPhases);
      });
    }
  }, [selectedDeal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  // Calculate stats
  const totalInvested = deals.reduce((sum, d) => sum + d.purchasePrice + d.renovationCosts, 0);
  const expectedReturn = deals.reduce((sum, d) => sum + d.expectedSalePrice, 0);
  const totalROI = ((expectedReturn - totalInvested) / totalInvested * 100);

  // Deals by stage
  const activeDeals = deals.filter(d => !['sold'].includes(d.stage));
  const soldDeals = deals.filter(d => d.stage === 'sold');

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building size={28} className="text-[#10b981]" />
          <div>
            <h1 className="text-2xl font-semibold">Elysium</h1>
            <p className="text-sm text-[var(--text-secondary)]">Fix & Flip Immobilien</p>
          </div>
        </div>
        <button className="btn btn-primary">
          + Deal hinzufügen
        </button>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2">
        <Link href="/unternehmen/elysium/crm" className="card p-3 hover:border-[#10b981] transition-colors flex items-center gap-2">
          <Users size={16} className="text-[#10b981]" />
          <span className="text-sm font-medium">CRM</span>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </Link>
        <Link href="/unternehmen/elysium/finance" className="card p-3 hover:border-[#10b981] transition-colors flex items-center gap-2">
          <DollarSign size={16} className="text-[#10b981]" />
          <span className="text-sm font-medium">Finanzen</span>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </Link>
        <Link href="/unternehmen/elysium/projects" className="card p-3 hover:border-[#10b981] transition-colors flex items-center gap-2">
          <Home size={16} className="text-[#10b981]" />
          <span className="text-sm font-medium">Projekte</span>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </Link>
        <Link href="/unternehmen/elysium/team" className="card p-3 hover:border-[#10b981] transition-colors flex items-center gap-2">
          <Users size={16} className="text-[#10b981]" />
          <span className="text-sm font-medium">Team</span>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </Link>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
              <DollarSign size={20} className="text-[#10b981]" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{(((portfolio?.totalCapitalInvested) || 0) / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-[var(--text-muted)]">Gebundenes Kapital</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center">
              <TrendingUp size={20} className="text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{(((portfolio?.netProfit12Months) || 0) / 1000).toFixed(0)}k</p>
              <p className="text-xs text-[var(--text-muted)]">Gewinn 12M</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
              <Clock size={20} className="text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{((portfolio?.averageFlipDays) || 0)}</p>
              <p className="text-xs text-[var(--text-muted)]">Ø Tage/Flip</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
              <Home size={20} className="text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{((portfolio?.activeDeals) || 0)}</p>
              <p className="text-xs text-[var(--text-muted)]">Aktive Deals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Deal Pipeline */}
        <div className="col-span-2 card p-4">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <Building size={16} className="text-[#10b981]" />
            Deal Pipeline
          </h2>

          {/* Pipeline Stages */}
          <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
            {['found', 'calculating', 'inspection', 'negotiation', 'notar', 'owned', 'renovation', 'sold'].map(stage => {
              const count = deals.filter(d => d.stage === stage).length;
              return (
                <div key={stage} className="flex-shrink-0">
                  <div 
                    className="px-2 py-2 rounded-lg text-center min-w-[60px] cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: stageColors[stage]?.bg }}
                    onClick={() => {
                      const deal = deals.find(d => d.stage === stage);
                      if (deal) setSelectedDeal(deal.id);
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: stageColors[stage]?.text }}>{count}</p>
                    <p className="text-[8px] text-[var(--text-muted)]">{stageLabels[stage]}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deals List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {deals.map(deal => (
              <div 
                key={deal.id}
                onClick={() => setSelectedDeal(deal.id)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedDeal === deal.id 
                    ? 'bg-[rgba(16,185,129,0.1)] border border-[#10b981]' 
                    : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{deal.property}</p>
                    <p className="text-xs text-[var(--text-muted)]">{deal.address}</p>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: stageColors[deal.stage]?.bg, color: stageColors[deal.stage]?.text }}
                  >
                    {stageLabels[deal.stage]}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-[var(--text-muted)]">Kauf</p>
                    <p className="font-medium">€{(deal.purchasePrice / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">Renovierung</p>
                    <p className="font-medium">€{(deal.renovationCosts / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">Verkauf</p>
                    <p className="font-medium">€{(deal.expectedSalePrice / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)]">ROI</p>
                    <p className="font-medium text-[#22c55e]">{deal.roi}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deal Details */}
        <div className="space-y-4">
          {/* Selected Deal Details */}
          {selectedDeal && (
            <div className="card p-4">
              <h3 className="font-medium mb-3">Deal Details</h3>
              {(() => {
                const deal = deals.find(d => d.id === selectedDeal);
                if (!deal) return null;
                
                const marketingDeal = marketing.find(m => m.dealId === deal.id);
                
                return (
                  <div className="space-y-4">
                    {/* Renovation Phases */}
                    {deal.stage === 'renovation' && renovationPhases.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-1">
                          <Wrench size={12} />
                          Renovierungsphasen
                        </h4>
                        <div className="space-y-1">
                          {renovationPhases.map(phase => (
                            <div key={phase.id} className="flex items-center gap-2 text-xs">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: phaseColors[phase.phase] }}
                              />
                              <span className="flex-1 capitalize">{phase.phase}</span>
                              <span className={phase.status === 'completed' ? 'text-[#22c55e]' : phase.status === 'in-progress' ? 'text-[#f59e0b]' : 'text-[var(--text-muted)]'}>
                                {phase.status === 'completed' ? '✓' : phase.status === 'in-progress' ? '●' : '○'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Marketing */}
                    {marketingDeal && (
                      <div>
                        <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-1">
                          <Camera size={12} />
                          Vermarktung
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`p-2 rounded ${marketingDeal.staging ? 'bg-[rgba(34,197,94,0.15)]' : 'bg-[var(--bg-tertiary)]'}`}>
                            Staging {marketingDeal.staging ? '✓' : '○'}
                          </div>
                          <div className={`p-2 rounded ${marketingDeal.photoshoot ? 'bg-[rgba(34,197,94,0.15)]' : 'bg-[var(--bg-tertiary)]'}`}>
                            Fotos {marketingDeal.photoshoot ? '✓' : '○'}
                          </div>
                          <div className={`p-2 rounded ${marketingDeal.listingsOnline ? 'bg-[rgba(34,197,94,0.15)]' : 'bg-[var(--bg-tertiary)]'}`}>
                            Inserate {marketingDeal.listingsOnline ? '✓' : '○'}
                          </div>
                          <div className="p-2 rounded bg-[var(--bg-tertiary)]">
                            {marketingDeal.viewings} Besichtigungen
                          </div>
                        </div>
                        {marketingDeal.notarDate && (
                          <p className="text-xs text-[#10b981] mt-2">
                            📅 Notar: {format(parseISO(marketingDeal.notarDate), 'd. MMM yyyy', { locale: de })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Handymen */}
          <div className="card p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Users size={14} className="text-[#10b981]" />
              Handwerker
            </h3>
            <div className="space-y-2">
              {handymen.map(h => (
                <div key={h.id} className="flex items-center justify-between text-xs p-2 rounded bg-[var(--bg-tertiary)]">
                  <div>
                    <p className="font-medium">{h.name}</p>
                    <p className="text-[var(--text-muted)]">{h.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#f59e0b]">★ {h.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

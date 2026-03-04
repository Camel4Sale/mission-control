'use client';

import { useState, useEffect } from 'react';
import { 
  Sun, TrendingUp, DollarSign, Package, Truck, 
  AlertTriangle, CheckCircle, Clock, Building, Users, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { 
  fetchSalesLeads, fetchSupplyOrders, fetchInstallationProjects, 
  fetchSolarFinancials 
} from '@/lib/api';
import { SalesLead, SupplyOrder, InstallationProject, SolarFinancials } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

const stageColors: Record<string, { bg: string; text: string }> = {
  'first-contact': { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
  'offer-sent': { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' },
  'negotiation': { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  'contract': { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4' },
  'won': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
  'lost': { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
};

const stageLabels: Record<string, string> = {
  'first-contact': 'Erstkontakt',
  'offer-sent': 'Angebot gesendet',
  'negotiation': 'Verhandlung',
  'contract': 'Vertrag',
  'won': 'Gewonnen',
  'lost': 'Verloren',
};

const installStatusColors: Record<string, { bg: string; text: string }> = {
  'planning': { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
  'scaffolding': { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' },
  'roof-mount': { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
  'electrical': { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4' },
  'inspection': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
  'completed': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
};

export default function CelarisPage() {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [orders, setOrders] = useState<SupplyOrder[]>([]);
  const [installations, setInstallations] = useState<InstallationProject[]>([]);
  const [financials, setFinancials] = useState<SolarFinancials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [l, o, i, f] = await Promise.all([
        fetchSalesLeads(), fetchSupplyOrders(), 
        fetchInstallationProjects(), fetchSolarFinancials()
      ]);
      setLeads(l); setOrders(o); setInstallations(i); setFinancials(f);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b]"></div>
      </div>
    );
  }

  // Calculate pipeline value
  const pipelineValue = leads.reduce((sum, l) => sum + l.value, 0);
  const weightedValue = leads.reduce((sum, l) => sum + (l.value * l.probability / 100), 0);
  const wonValue = leads.filter(l => l.stage === 'won').reduce((sum, l) => sum + l.value, 0);

  // Delayed orders
  const delayedOrders = orders.filter(o => o.status === 'delayed');

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sun size={28} className="text-[#f59e0b]" />
          <div>
            <h1 className="text-2xl font-semibold">Celaris</h1>
            <p className="text-sm text-[var(--text-secondary)]">Solar Solutions</p>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2">
        <Link href="/unternehmen/celaris/crm" className="card p-3 hover:border-[#f59e0b] transition-colors flex items-center gap-2">
          <Users size={16} className="text-[#f59e0b]" />
          <span className="text-sm font-medium">CRM</span>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </Link>
        <Link href="/unternehmen/celaris/finance" className="card p-3 hover:border-[#f59e0b] transition-colors flex items-center gap-2">
          <DollarSign size={16} className="text-[#f59e0b]" />
          <span className="text-sm font-medium">Finanzen</span>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </Link>
        <Link href="/unternehmen/celaris/projects" className="card p-3 hover:border-[#f59e0b] transition-colors flex items-center gap-2">
          <Package size={16} className="text-[#f59e0b]" />
          <span className="text-sm font-medium">Projekte</span>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </Link>
        <Link href="/unternehmen/celaris/team" className="card p-3 hover:border-[#f59e0b] transition-colors flex items-center gap-2">
          <Building size={16} className="text-[#f59e0b]" />
          <span className="text-sm font-medium">Team</span>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
              <TrendingUp size={20} className="text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{financials?.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">Umsatz MTD</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center">
              <DollarSign size={20} className="text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{financials?.cashflow.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">Cashflow</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
              <Package size={20} className="text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{(pipelineValue / 1000).toFixed(0)}k</p>
              <p className="text-xs text-[var(--text-muted)]">Pipeline</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
              <Users size={20} className="text-[#06b6d4]" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{(weightedValue / 1000).toFixed(0)}k</p>
              <p className="text-xs text-[var(--text-muted)]">Weighted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <div className="card p-4">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#f59e0b]" />
            Sales Pipeline
          </h2>
          
          {/* Pipeline Stages */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {['first-contact', 'offer-sent', 'negotiation', 'contract', 'won'].map(stage => {
              const count = leads.filter(l => l.stage === stage).length;
              return (
                <div key={stage} className="flex-shrink-0">
                  <div 
                    className="px-3 py-2 rounded-lg text-center min-w-[80px]"
                    style={{ backgroundColor: stageColors[stage]?.bg }}
                  >
                    <p className="text-lg font-bold" style={{ color: stageColors[stage]?.text }}>{count}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{stageLabels[stage]}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leads List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {leads.map(lead => (
              <div 
                key={lead.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]"
              >
                <div>
                  <p className="font-medium text-sm">{lead.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {lead.company || 'Privat'} • {lead.probability}% Wahrscheinlichkeit
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{lead.value.toLocaleString()}</p>
                  <span 
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: stageColors[lead.stage]?.bg, color: stageColors[lead.stage]?.text }}
                  >
                    {stageLabels[lead.stage]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supply Chain */}
        <div className="space-y-4">
          {/* Orders */}
          <div className="card p-4">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <Truck size={16} className="text-[#f59e0b]" />
              Lieferungen
            </h2>
            
            <div className="space-y-2">
              {orders.map(order => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]"
                >
                  <div>
                    <p className="font-medium text-sm">{order.supplier}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {order.items.map(i => i.name).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span 
                      className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                        order.status === 'delayed' ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]' :
                        order.status === 'shipped' ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]' :
                        order.status === 'delivered' ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]' :
                        'bg-[rgba(107,114,128,0.15)] text-[#6b7280]'
                      }`}
                    >
                      {order.status === 'delayed' && <AlertTriangle size={10} />}
                      {order.status}
                    </span>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {format(parseISO(order.expectedDelivery), 'd. MMM', { locale: de })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installations */}
          <div className="card p-4">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <Building size={16} className="text-[#f59e0b]" />
              Installationen
            </h2>
            
            <div className="space-y-3">
              {installations.map(inst => (
                <div key={inst.id} className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{inst.customer}</p>
                      <p className="text-xs text-[var(--text-muted)]">{inst.address}</p>
                    </div>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: installStatusColors[inst.status]?.bg, color: installStatusColors[inst.status]?.text }}
                    >
                      {inst.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>{inst.panels} Module • {inst.power} kWp</span>
                    <span className="text-[var(--text-muted)]">
                      {format(parseISO(inst.plannedEndDate), 'd. MMM', { locale: de })}
                    </span>
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

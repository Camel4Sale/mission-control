'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Sun, Building, Code, Users, FileText, DollarSign, 
  TrendingUp, Package, Clock, Phone, Mail, Plus,
  ArrowLeft, Activity
} from 'lucide-react';
import { CompanyContact, Activity as ActivityType, Invoice, Transaction, Project, Document, TeamMember, TeamTask } from '@/types';
import { 
  fetchCompanyContacts, fetchActivities, fetchInvoices, 
  fetchTransactions, fetchProjects, fetchDocuments, 
  fetchTeamMembers, fetchTeamTasks 
} from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

// Company config
const companyConfig: Record<string, { name: string; icon: typeof Sun; color: string; bgColor: string }> = {
  celaris: { name: 'Celaris', icon: Sun, color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)' },
  elysium: { name: 'Elysium', icon: Building, color: '#10b981', bgColor: 'rgba(16,185,129,0.15)' },
  pathium: { name: 'Pathium', icon: Code, color: '#06b6d4', bgColor: 'rgba(6,182,212,0.15)' },
};

const sections = [
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'finance', label: 'Finanzen', icon: DollarSign },
  { id: 'projects', label: 'Projekte', icon: Package },
  { id: 'docs', label: 'Dokumente', icon: FileText },
  { id: 'team', label: 'Team', icon: Users },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const company = params.company as string;
  const config = companyConfig[company];
  const Icon = config?.icon || Sun;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-[var(--border)] flex flex-col">
        {/* Company Header */}
        <div className="p-4 border-b border-[var(--border)]">
          <Link 
            href="/unternehmen" 
            className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-4"
          >
            <ArrowLeft size={14} />
            Zurück
          </Link>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: config?.bgColor }}
            >
              <Icon size={20} style={{ color: config?.color }} />
            </div>
            <div>
              <h1 className="font-semibold">{config?.name}</h1>
              <p className="text-xs text-[var(--text-muted)]">
                {company === 'celaris' ? 'Solar Solutions' : company === 'elysium' ? 'Fix & Flip Immobilien' : 'Software Development'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sections.map(section => (
            <Link
              key={section.id}
              href={`/unternehmen/${company}/${section.id}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                router.asPath.includes(`/${section.id}`)
                  ? 'bg-[var(--bg-hover)] text-[var(--text)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]'
              }`}
            >
              <section.icon size={16} />
              {section.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// CRM Page Component
export function CompanyCRM() {
  const params = useParams();
  const company = params.company as string;
  const config = companyConfig[company];
  
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contacts' | 'activities'>('contacts');

  useEffect(() => {
    const loadData = async () => {
      const [c, a] = await Promise.all([
        fetchCompanyContacts(company),
        fetchActivities()
      ]);
      setContacts(c);
      setActivities(a.filter(act => 
        company === 'celaris' && ['c1','c2','c3','c4'].includes(act.contactId || '') ||
        company === 'elysium' && ['c5','c6','c7'].includes(act.contactId || '') ||
        company === 'pathium' && ['c8','c9','c10'].includes(act.contactId || '')
      ));
      setLoading(false);
    };
    loadData();
  }, [company]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: config?.color }}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">CRM</h1>
          <p className="text-sm text-[var(--text-muted)]">Kunden & Ansprechpartner</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          Kontakt hinzufügen
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'contacts'
              ? 'bg-[var(--bg-hover)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Kontakte ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'activities'
              ? 'bg-[var(--bg-hover)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Aktivitäten ({activities.length})
        </button>
      </div>

      {activeTab === 'contacts' ? (
        /* Contacts Table */
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--bg-tertiary)]">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Name</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Rolle</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Unternehmen</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Kontakt</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Letzter Kontakt</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-hover)]">
                  <td className="p-3">
                    <div className="font-medium">{contact.name}</div>
                  </td>
                  <td className="p-3 text-sm text-[var(--text-muted)]">{contact.role}</td>
                  <td className="p-3 text-sm">{contact.company || '-'}</td>
                  <td className="p-3 text-sm">
                    <div className="flex gap-2">
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                          <Mail size={14} />
                        </a>
                      )}
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                          <Phone size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-[var(--text-muted)]">
                    {contact.lastContact ? format(parseISO(contact.lastContact), 'd. MMM yyyy', { locale: de }) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Activities Timeline */
        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="card p-4 flex gap-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ 
                  backgroundColor: 
                    activity.type === 'meeting' ? 'rgba(139,92,246,0.15)' :
                    activity.type === 'call' ? 'rgba(6,182,212,0.15)' :
                    activity.type === 'email' ? 'rgba(245,158,11,0.15)' :
                    'rgba(107,114,128,0.15)'
                }}
              >
                {activity.type === 'meeting' && <Users size={18} className="text-[#8b5cf6]" />}
                {activity.type === 'call' && <Phone size={18} className="text-[#06b6d4]" />}
                {activity.type === 'email' && <Mail size={18} className="text-[#f59e0b]" />}
                {activity.type === 'note' && <Activity size={18} className="text-[#6b7280]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    {format(parseISO(activity.date), 'd. MMM yyyy, HH:mm', { locale: de })}
                  </span>
                </div>
                {activity.description && (
                  <p className="text-sm text-[var(--text-muted)] mt-1">{activity.description}</p>
                )}
                {activity.outcome && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-[var(--bg-tertiary)]">
                    {activity.outcome}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Finance Page Component
export function CompanyFinance() {
  const params = useParams();
  const company = params.company as string;
  const config = companyConfig[company];
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'transactions'>('overview');

  useEffect(() => {
    const loadData = async () => {
      const [inv, trans] = await Promise.all([
        fetchInvoices(company),
        fetchTransactions(company)
      ]);
      setInvoices(inv);
      setTransactions(trans);
      setLoading(false);
    };
    loadData();
  }, [company]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: config?.color }}></div>
      </div>
    );
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const openInvoices = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0);
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Finanzen</h1>
          <p className="text-sm text-[var(--text-muted)]">Einnahmen, Ausgaben & Rechnungen</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          Rechnung erstellen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)]">Einnahmen (MTD)</p>
          <p className="text-2xl font-bold text-[#22c55e]">€{totalIncome.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)]">Ausgaben (MTD)</p>
          <p className="text-2xl font-bold text-[#ef4444]">€{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)]">Netto</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
            €{netProfit.toLocaleString()}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)]">Offene Rechnungen</p>
          <p className="text-2xl font-bold">€{openInvoices.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['overview', 'invoices', 'transactions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[var(--bg-hover)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab === 'overview' ? 'Übersicht' : tab === 'invoices' ? 'Rechnungen' : 'Buchungen'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <div className="card p-4">
            <h3 className="font-medium mb-4">Letzte Rechnungen</h3>
            <div className="space-y-2">
              {invoices.slice(0, 5).map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-2 rounded bg-[var(--bg-tertiary)]">
                  <div>
                    <p className="font-medium text-sm">{inv.invoiceNumber}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {format(parseISO(inv.issueDate), 'd. MMM yyyy', { locale: de })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">€{inv.total.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      inv.status === 'paid' ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]' :
                      inv.status === 'sent' ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]' :
                      inv.status === 'overdue' ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]' :
                      'bg-[var(--bg-tertiary)]'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card p-4">
            <h3 className="font-medium mb-4">Letzte Buchungen</h3>
            <div className="space-y-2">
              {transactions.slice(0, 5).map(trans => (
                <div key={trans.id} className="flex items-center justify-between p-2 rounded bg-[var(--bg-tertiary)]">
                  <div>
                    <p className="font-medium text-sm">{trans.description}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {format(parseISO(trans.date), 'd. MMM yyyy', { locale: de })}
                    </p>
                  </div>
                  <p className={`font-semibold ${trans.type === 'income' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {trans.type === 'income' ? '+' : '-'}€{trans.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'invoices' ? (
        /* Invoices Table */
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--bg-tertiary)]">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Rechnung</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Datum</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Fällig</th>
                <th className="text-right p-3 text-xs font-medium text-[var(--text-muted)]">Betrag</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-hover)]">
                  <td className="p-3 font-medium">{inv.invoiceNumber}</td>
                  <td className="p-3 text-sm text-[var(--text-muted)]">
                    {format(parseISO(inv.issueDate), 'd. MMM yyyy', { locale: de })}
                  </td>
                  <td className="p-3 text-sm text-[var(--text-muted)]">
                    {format(parseISO(inv.dueDate), 'd. MMM yyyy', { locale: de })}
                  </td>
                  <td className="p-3 text-right font-semibold">€{inv.total.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      inv.status === 'paid' ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]' :
                      inv.status === 'sent' ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]' :
                      inv.status === 'overdue' ? 'bg-[rgba(239,68,68,0.15)] text-[#ef4444]' :
                      inv.status === 'draft' ? 'bg-[rgba(107,114,128,0.15)] text-[#6b7280]' :
                      'bg-[var(--bg-tertiary)]'
                    }`}>
                      {inv.status === 'paid' ? 'Bezahlt' : inv.status === 'sent' ? 'Offen' : inv.status === 'overdue' ? 'Überfällig' : 'Entwurf'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Transactions Table */
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--bg-tertiary)]">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Datum</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Beschreibung</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Kategorie</th>
                <th className="text-right p-3 text-xs font-medium text-[var(--text-muted)]">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(trans => (
                <tr key={trans.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-hover)]">
                  <td className="p-3 text-sm text-[var(--text-muted)]">
                    {format(parseISO(trans.date), 'd. MMM yyyy', { locale: de })}
                  </td>
                  <td className="p-3 font-medium">{trans.description}</td>
                  <td className="p-3 text-sm text-[var(--text-muted)]">{trans.category}</td>
                  <td className={`p-3 text-right font-semibold ${trans.type === 'income' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {trans.type === 'income' ? '+' : '-'}€{trans.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Projects Page Component
export function CompanyProjects() {
  const params = useParams();
  const company = params.company as string;
  const config = companyConfig[company];
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects(company).then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, [company]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: config?.color }}></div>
      </div>
    );
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    planning: { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
    active: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
    'on-hold': { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
    completed: { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
  };

  const statusLabels: Record<string, string> = {
    planning: 'Planung',
    active: 'Aktiv',
    'on-hold': 'Pausiert',
    completed: 'Abgeschlossen',
    cancelled: 'Abgebrochen',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projekte</h1>
          <p className="text-sm text-[var(--text-muted)]">Projektübersicht & Meilensteine</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          Projekt erstellen
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-4">
        {projects.map(project => (
          <div key={project.id} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">{project.description}</p>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: statusColors[project.status]?.bg, color: statusColors[project.status]?.text }}
              >
                {statusLabels[project.status]}
              </span>
            </div>

            {/* Dates & Budget */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
              <div>
                <p className="text-[var(--text-muted)]">Start</p>
                <p className="font-medium">{format(parseISO(project.startDate), 'd. MMM', { locale: de })}</p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Deadline</p>
                <p className="font-medium">
                  {project.deadline ? format(parseISO(project.deadline), 'd. MMM', { locale: de }) : '-'}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Budget</p>
                <p className="font-medium">
                  {project.budget ? `€${(project.budget / 1000).toFixed(0)}k` : '-'}
                </p>
              </div>
            </div>

            {/* Milestones */}
            {project.milestones.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Meilensteine</p>
                <div className="space-y-1">
                  {project.milestones.map(milestone => (
                    <div key={milestone.id} className="flex items-center gap-2 text-xs">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          milestone.status === 'completed' ? 'bg-[#22c55e]' :
                          milestone.status === 'in-progress' ? 'bg-[#f59e0b]' :
                          milestone.status === 'blocked' ? 'bg-[#ef4444]' :
                          'bg-[#6b7280]'
                        }`}
                      />
                      <span className="flex-1">{milestone.title}</span>
                      <span className="text-[var(--text-muted)]">
                        {milestone.status === 'completed' ? '✓' : milestone.status === 'in-progress' ? '●' : milestone.dueDate ? format(parseISO(milestone.dueDate), 'd. MMM') : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Documents Page Component
export function CompanyDocs() {
  const params = useParams();
  const company = params.company as string;
  const config = companyConfig[company];
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchDocuments(company).then(data => {
      setDocuments(data);
      setLoading(false);
    });
  }, [company]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: config?.color }}></div>
      </div>
    );
  }

  const categories = ['all', ...new Set(documents.map(d => d.type))];
  const filteredDocs = filter === 'all' ? documents : documents.filter(d => d.type === filter);

  const typeIcons: Record<string, string> = {
    contract: '📄',
    quote: '💰',
    invoice: '🧾',
    template: '📋',
    report: '📊',
    other: '📁',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dokumente</h1>
          <p className="text-sm text-[var(--text-muted)]">Vorlagen, Verträge & Berichte</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          Dokument hochladen
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === cat
                ? 'bg-[var(--bg-hover)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {cat === 'all' ? 'Alle' : cat === 'contract' ? 'Verträge' : cat === 'quote' ? 'Angebote' : cat === 'invoice' ? 'Rechnungen' : cat === 'template' ? 'Vorlagen' : cat === 'report' ? 'Berichte' : 'Sonstige'}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="card p-4 hover:border-[var(--border)] cursor-pointer transition-colors">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{typeIcons[doc.type] || '📁'}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{doc.category}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {format(parseISO(doc.updatedAt), 'd. MMM yyyy', { locale: de })}
                </p>
              </div>
            </div>
            {doc.tags && doc.tags.length > 0 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {doc.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Team Page Component
export function CompanyTeam() {
  const params = useParams();
  const company = params.company as string;
  const config = companyConfig[company];
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'tasks'>('members');

  useEffect(() => {
    const loadData = async () => {
      const [m, t] = await Promise.all([
        fetchTeamMembers(company),
        fetchTeamTasks(company)
      ]);
      setMembers(m);
      setTasks(t);
      setLoading(false);
    };
    loadData();
  }, [company]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: config?.color }}></div>
      </div>
    );
  }

  const priorityColors: Record<string, string> = {
    low: '#6b7280',
    medium: '#f59e0b',
    high: '#ef4444',
    urgent: '#dc2626',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Team</h1>
          <p className="text-sm text-[var(--text-muted)]">Mitarbeiter & Aufgaben</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          Member hinzufügen
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'members'
              ? 'bg-[var(--bg-hover)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Mitglieder ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'bg-[var(--bg-hover)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Aufgaben ({tasks.length})
        </button>
      </div>

      {activeTab === 'members' ? (
        /* Members Grid */
        <div className="grid grid-cols-3 gap-4">
          {members.map(member => (
            <div key={member.id} className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                {member.avatar ? (
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center font-medium">
                    {member.avatar}
                  </div>
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: config?.color }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{member.role}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Mail size={12} />
                  <span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Phone size={12} />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.hourlyRate && (
                  <p className="text-[var(--text-muted)]">€{member.hourlyRate}/h</p>
                )}
              </div>

              {member.skills && member.skills.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {member.skills.map(skill => (
                    <span key={skill} className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Tasks Table */
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--bg-tertiary)]">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Aufgabe</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Status</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Priorität</th>
                <th className="text-left p-3 text-xs font-medium text-[var(--text-muted)]">Fällig</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const assignee = members.find(m => m.id === task.assigneeId);
                return (
                  <tr key={task.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-hover)]">
                    <td className="p-3">
                      <div className="font-medium">{task.title}</div>
                      {assignee && (
                        <div className="text-xs text-[var(--text-muted)]">{assignee.name}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'done' ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]' :
                        task.status === 'in-progress' ? 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]' :
                        task.status === 'review' ? 'bg-[rgba(139,92,246,0.15)] text-[#8b5cf6]' :
                        'bg-[rgba(107,114,128,0.15)] text-[#6b7280]'
                      }`}>
                        {task.status === 'done' ? 'Erledigt' : task.status === 'in-progress' ? 'In Arbeit' : task.status === 'review' ? 'Review' : 'Offen'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: priorityColors[task.priority] + '20', color: priorityColors[task.priority] }}
                      >
                        {task.priority === 'low' ? 'Niedrig' : task.priority === 'medium' ? 'Mittel' : task.priority === 'high' ? 'Hoch' : 'Dringend'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-[var(--text-muted)]">
                      {task.dueDate ? format(parseISO(task.dueDate), 'd. MMM', { locale: de }) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

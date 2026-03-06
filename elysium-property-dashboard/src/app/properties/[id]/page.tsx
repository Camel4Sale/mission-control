'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { FinancialChart } from '@/components/FinancialChart';
import { 
  ArrowLeft, Building2, MapPin, Euro, Calendar, Users, 
  Wrench, FileText, Edit, Trash2, Download, Phone, Mail 
} from 'lucide-react';

const mockProperty = {
  id: '1',
  name: 'Gartenstadt Residenz',
  address: 'Gartenstraße 45-47',
  city: 'Karlsruhe',
  zipCode: '76135',
  propertyType: 'RESIDENTIAL' as const,
  status: 'RENTED' as const,
  size: 680,
  rooms: 24,
  units: 8,
  yearBuilt: 1985,
  purchasePrice: 1250000,
  currentValue: 1580000,
  monthlyRent: 8400,
  description: 'Attraktives Mehrfamilienhaus mit 8 Wohneinheiten in ruhiger Lage. Voll vermietet. Das Objekt wurde 2020 teilweise saniert (Dach, Fassade).',
  images: ['/images/karlsruhe-1.jpg', '/images/karlsruhe-2.jpg'],
};

const mockTenants = [
  { id: '1', name: 'Michael Weber', email: 'm.weber@email.de', phone: '+49 721 123456', unit: 'Nr. 1', rent: 1050, leaseEnd: '2027-02-28' },
  { id: '2', name: 'Anna Schmidt', email: 'a.schmidt@email.de', phone: '+49 721 234567', unit: 'Nr. 2', rent: 980, leaseEnd: '2026-12-31' },
  { id: '3', name: 'Thomas Müller', email: 't.mueller@email.de', phone: '+49 721 345678', unit: 'Nr. 3', rent: 1100, leaseEnd: '2027-06-30' },
];

const mockMaintenances = [
  { id: '1', title: 'Heizungsreparatur', status: 'COMPLETED', priority: 'HIGH', cost: 1200, date: '2025-02-05' },
  { id: '2', title: 'Jährliche Prüfung', status: 'PENDING', priority: 'MEDIUM', cost: 800, date: '2025-03-15' },
];

const valueHistoryData = [
  { date: '2023-01-01', value: 1450000 },
  { date: '2024-01-01', value: 1520000 },
  { date: '2025-01-01', value: 1580000 },
];

export default function PropertyDetails() {
  const params = useParams();
  const [darkMode, setDarkMode] = useState(true);
  const property = mockProperty;

  const roi = ((property.monthlyRent * 12) / property.purchasePrice) * 100;
  const yieldPercent = ((property.monthlyRent * 12) / property.currentValue) * 100;

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
        {/* Back Button */}
        <Link href="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{property.name}</h1>
              <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
                Vermietet
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{property.address}, {property.zipCode} {property.city}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted">
              <Edit className="w-4 h-4" />
              Bearbeiten
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Wert</p>
            <p className="text-xl font-bold">{(property.currentValue / 1000000).toFixed(2)}M€</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Kaufpreis</p>
            <p className="text-xl font-bold">{(property.purchasePrice / 1000000).toFixed(2)}M€</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Monatsmiete</p>
            <p className="text-xl font-bold text-green-500">{(property.monthlyRent / 1000).toFixed(1)}K€</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">ROI</p>
            <p className="text-xl font-bold text-purple-500">{roi.toFixed(2)}%</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Yield</p>
            <p className="text-xl font-bold text-blue-500">{yieldPercent.toFixed(2)}%</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Einheiten</p>
            <p className="text-xl font-bold">{property.units}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Info */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Objektinformationen</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Typ</p>
                  <p className="font-medium">Wohnimmobilie</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Größe</p>
                  <p className="font-medium">{property.size} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zimmer</p>
                  <p className="font-medium">{property.rooms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Baujahr</p>
                  <p className="font-medium">{property.yearBuilt}</p>
                </div>
              </div>
              {property.description && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Beschreibung</p>
                  <p className="text-sm">{property.description}</p>
                </div>
              )}
            </div>

            {/* Value History Chart */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Wertentwicklung</h3>
              <FinancialChart data={valueHistoryData} type="value-history" />
            </div>

            {/* Tenants */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Mieter ({mockTenants.length})
                </h3>
                <Link href="/tenants" className="text-sm text-primary hover:underline">
                  Alle anzeigen
                </Link>
              </div>
              <div className="space-y-3">
                {mockTenants.map(tenant => (
                  <div key={tenant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">{tenant.unit} • {tenant.rent}€/Monat</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${tenant.phone}`} className="p-2 hover:bg-background rounded-lg">
                        <Phone className="w-4 h-4" />
                      </a>
                      <a href={`mailto:${tenant.email}`} className="p-2 hover:bg-background rounded-lg">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-all">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Vertrag anzeigen</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-all">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  <span>Wartung anlegen</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-all">
                  <Euro className="w-5 h-5 text-green-500" />
                  <span>Zahlung erfassen</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-all">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>Termin vereinbaren</span>
                </button>
              </div>
            </div>

            {/* Recent Maintenance */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Wartungen
                </h3>
                <Link href="/maintenance" className="text-sm text-primary hover:underline">
                  Alle
                </Link>
              </div>
              <div className="space-y-3">
                {mockMaintenances.map(m => (
                  <div key={m.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{m.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        m.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {m.status === 'COMPLETED' ? 'Erledigt' : 'Ausstehend'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.cost}€ • {m.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dokumente
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-all text-left">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Kaufvertrag</p>
                    <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-all text-left">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Grundbuchauszug</p>
                    <p className="text-xs text-muted-foreground">PDF • 856 KB</p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

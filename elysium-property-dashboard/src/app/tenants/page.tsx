'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Users, Mail, Phone, Calendar, Euro, FileText, Plus, Search } from 'lucide-react';

const mockTenants = [
  {
    id: '1',
    firstName: 'Michael',
    lastName: 'Weber',
    email: 'm.weber@email.de',
    phone: '+49 721 123456',
    property: 'Gartenstadt Residenz',
    unit: 'Nr. 1',
    rent: 1050,
    leaseStart: '2022-03-01',
    leaseEnd: '2027-02-28',
    deposit: 2100,
    status: 'ACTIVE',
  },
  {
    id: '2',
    firstName: 'Anna',
    lastName: 'Schmidt',
    email: 'a.schmidt@email.de',
    phone: '+49 721 234567',
    property: 'Gartenstadt Residenz',
    unit: 'Nr. 2',
    rent: 980,
    leaseStart: '2021-06-01',
    leaseEnd: '2026-12-31',
    deposit: 1960,
    status: 'ACTIVE',
  },
  {
    id: '3',
    firstName: 'Thomas',
    lastName: 'Müller',
    email: 't.mueller@email.de',
    phone: '+49 89 555666',
    property: 'Schwabing Loft',
    unit: 'Wohnung 3',
    rent: 1680,
    leaseStart: '2024-01-01',
    leaseEnd: '2026-12-31',
    deposit: 3360,
    status: 'ACTIVE',
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Müller',
    email: 'sarah.mueller@email.de',
    phone: '+49 711 987654',
    property: 'Villa Killesberg',
    unit: 'Gesamt',
    rent: 2400,
    leaseStart: '2023-06-01',
    leaseEnd: '2028-05-31',
    deposit: 4800,
    status: 'ACTIVE',
  },
];

export default function TenantsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = mockTenants.filter(tenant =>
    tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const totalRent = mockTenants.reduce((sum, t) => sum + t.rent, 0);
  const totalDeposit = mockTenants.reduce((sum, t) => sum + t.deposit, 0);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="lg:ml-64 p-6 pt-20 lg:pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mieterverwaltung</h1>
            <p className="text-muted-foreground">
              Alle Mieter und Mietverträge im Überblick
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 w-fit">
            <Plus className="w-4 h-4" />
            Neuer Mieter
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktive Mieter</p>
                <p className="text-2xl font-bold">{mockTenants.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Euro className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gesamtmiete/Monat</p>
                <p className="text-2xl font-bold text-green-500">{(totalRent / 1000).toFixed(1)}K€</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kautionen</p>
                <p className="text-2xl font-bold text-purple-500">{(totalDeposit / 1000).toFixed(1)}K€</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verträge enden 2026</p>
                <p className="text-2xl font-bold text-orange-500">
                  {mockTenants.filter(t => t.leaseEnd.startsWith('2026')).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Suche nach Name, Email, Property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Mieter</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Property</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Kontakt</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Miete</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vertragsende</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{tenant.firstName} {tenant.lastName}</p>
                      <p className="text-sm text-muted-foreground">{tenant.unit}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{tenant.property}</p>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <a href={`mailto:${tenant.email}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Mail className="w-3 h-3" />
                        {tenant.email}
                      </a>
                      <a href={`tel:${tenant.phone}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <Phone className="w-3 h-3" />
                        {tenant.phone}
                      </a>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-green-500">{tenant.rent}€</p>
                    <p className="text-xs text-muted-foreground">Kaution: {tenant.deposit}€</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {new Date(tenant.leaseEnd).toLocaleDateString('de-DE')}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium">
                      Aktiv
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-all">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-all">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTenants.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Keine Mieter gefunden
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

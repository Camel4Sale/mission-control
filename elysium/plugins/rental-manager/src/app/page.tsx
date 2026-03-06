'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Euro, 
  Wrench, 
  AlertTriangle,
  Settings,
  Menu,
  X
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import PropertyManager from '@/components/PropertyManager';
import ContractGenerator from '@/components/ContractGenerator';
import UtilityBillCreator from '@/components/UtilityBillCreator';
import RentTracker from '@/components/RentTracker';
import DefectReporter from '@/components/DefectReporter';
import CraftsmenManager from '@/components/CraftsmenManager';
import TenantScreeningComponent from '@/components/TenantScreening';

type Page = 'dashboard' | 'properties' | 'contracts' | 'utility-bills' | 'payments' | 'defects' | 'craftsmen' | 'screening';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: Array<{ id: Page; label: string; icon: any }> = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'properties', label: 'Objekte', icon: Home },
    { id: 'contracts', label: 'Verträge', icon: FileText },
    { id: 'utility-bills', label: 'Nebenkosten', icon: Euro },
    { id: 'payments', label: 'Zahlungen', icon: Euro },
    { id: 'defects', label: 'Mängel', icon: AlertTriangle },
    { id: 'craftsmen', label: 'Handwerker', icon: Wrench },
    { id: 'screening', label: 'Mieter-Screening', icon: Users },
  ];

  const renderPage = () => {
    // Mock-Daten für Demo
    const mockProperties = [
      {
        id: '1',
        name: 'Wohnung Musterstraße',
        type: 'wohnung' as const,
        address: { street: 'Musterstraße 1', zip: '10115', city: 'Berlin', country: 'Deutschland' },
        details: { sqm: 75, rooms: 3, yearBuilt: 2015 },
        documents: [],
        valueHistory: [{ date: new Date(), value: 350000, source: 'Schätzung' }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockTenants = [
      {
        id: '1',
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        phone: '+49 123 456789',
        address: { street: 'Musterstraße 1', zip: '10115', city: 'Berlin' },
        riskLevel: 'green' as const,
        createdAt: new Date(),
      },
    ];

    const mockPayments = [
      {
        id: '1',
        contractId: '1',
        tenantId: '1',
        amount: 850,
        dueDate: new Date(),
        status: 'paid' as const,
        reminderSent: false,
        reminderCount: 0,
      },
    ];

    const mockCraftsmen = [
      {
        id: '1',
        name: 'Hans Müller',
        company: 'Müller Sanitär',
        trade: 'Klempner',
        phone: '+49 123 456789',
        email: 'hans@mueller.de',
        address: { street: 'Handwerkerweg 1', zip: '10115', city: 'Berlin' },
        ratings: [],
        workHistory: [],
        costTracking: [],
      },
    ];

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            properties={{ total: 5, occupied: 4, vacant: 1 }}
            tenants={{ total: 12, active: 10 }}
            payments={{ total: 8500, paid: 7650, overdue: 850, pending: 0 }}
            defects={{ open: 3, urgent: 1, inProgress: 2 }}
            recentActivity={[
              { id: '1', type: 'payment', message: 'Mieteingang von Max M.', timestamp: new Date() },
              { id: '2', type: 'defect', message: 'Neue Mängelmeldung: Heizung defekt', timestamp: new Date() },
              { id: '3', type: 'contract', message: 'Vertrag erstellt für Wohnung A', timestamp: new Date() },
            ]}
          />
        );
      case 'properties':
        return (
          <PropertyManager
            properties={mockProperties}
            onAdd={async () => {}}
            onEdit={async () => {}}
            onDelete={async () => {}}
          />
        );
      case 'contracts':
        return (
          <ContractGenerator
            properties={mockProperties}
            tenants={mockTenants}
            onCreateContract={async () => {}}
          />
        );
      case 'utility-bills':
        return (
          <UtilityBillCreator
            properties={mockProperties}
            onCreateBill={async () => {}}
          />
        );
      case 'payments':
        return (
          <RentTracker
            payments={mockPayments}
            tenants={mockTenants}
            onSyncBank={async () => {}}
            onSendReminder={async () => {}}
            onMarkPaid={async () => {}}
            onExport={async () => {}}
          />
        );
      case 'defects':
        return (
          <DefectReporter
            properties={mockProperties}
            craftsmen={mockCraftsmen}
            onSubmit={async () => {}}
          />
        );
      case 'craftsmen':
        return (
          <CraftsmenManager
            craftsmen={mockCraftsmen}
            onAdd={async () => {}}
            onEdit={async () => {}}
            onDelete={async () => {}}
          />
        );
      case 'screening':
        return (
          <TenantScreeningComponent
            tenant={mockTenants[0]}
            onPerformScreening={async () => ({ id: '1', tenantId: '1', riskAssessment: { level: 'green', factors: [] }, consentGiven: true, createdAt: new Date() })}
            onContactPreviousLandlord={async () => {}}
            onUploadIncomeDocument={async () => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-600">Elysium Rental</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-30 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Elysium Rental</h1>
          <p className="text-xs text-gray-500 mt-1">Vermieter-Toolkit</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Einstellungen</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <main className="min-h-screen">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

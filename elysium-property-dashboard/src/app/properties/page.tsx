'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { PropertyList } from '@/components/PropertyList';
import { Plus, Download, Upload } from 'lucide-react';

const mockProperties = [
  {
    id: '1',
    name: 'Gartenstadt Residenz',
    address: 'Gartenstraße 45-47',
    city: 'Karlsruhe',
    zipCode: '76135',
    propertyType: 'RESIDENTIAL' as const,
    status: 'RENTED' as const,
    size: 680,
    units: 8,
    yearBuilt: 1985,
    purchasePrice: 1250000,
    currentValue: 1580000,
    monthlyRent: 8400,
    _count: { leases: 8, maintenance: 2 },
  },
  {
    id: '2',
    name: 'Villa Killesberg',
    address: 'Heilmannstraße 23',
    city: 'Stuttgart',
    zipCode: '70192',
    propertyType: 'RESIDENTIAL' as const,
    status: 'RENTED' as const,
    size: 185,
    units: 1,
    yearBuilt: 1965,
    purchasePrice: 680000,
    currentValue: 890000,
    monthlyRent: 2400,
    _count: { leases: 1, maintenance: 0 },
  },
  {
    id: '3',
    name: 'Schwabing Loft',
    address: 'Leopoldstraße 89/3',
    city: 'München',
    zipCode: '80802',
    propertyType: 'RESIDENTIAL' as const,
    status: 'RENTED' as const,
    size: 80,
    units: 1,
    yearBuilt: 2015,
    purchasePrice: 520000,
    currentValue: 615000,
    monthlyRent: 1680,
    _count: { leases: 1, maintenance: 1 },
  },
  {
    id: '4',
    name: 'Neuenheimer Bürocenter',
    address: 'Neuenheimer Landstraße 12',
    city: 'Heidelberg',
    zipCode: '69120',
    propertyType: 'COMMERCIAL' as const,
    status: 'RENTED' as const,
    size: 320,
    units: 4,
    yearBuilt: 2008,
    purchasePrice: 1150000,
    currentValue: 1380000,
    monthlyRent: 4800,
    _count: { leases: 4, maintenance: 1 },
  },
  {
    id: '5',
    name: 'Planken Store',
    address: 'Planken 7',
    city: 'Mannheim',
    zipCode: '68161',
    propertyType: 'COMMERCIAL' as const,
    status: 'RENTED' as const,
    size: 145,
    units: 1,
    yearBuilt: 1970,
    purchasePrice: 420000,
    currentValue: 485000,
    monthlyRent: 2200,
    _count: { leases: 1, maintenance: 0 },
  },
  {
    id: '6',
    name: 'Altstadt Apartment',
    address: 'Salzstraße 14/2',
    city: 'Freiburg',
    zipCode: '79098',
    propertyType: 'RESIDENTIAL' as const,
    status: 'VACANT' as const,
    size: 65,
    units: 1,
    yearBuilt: 1890,
    purchasePrice: 340000,
    currentValue: 395000,
    monthlyRent: 1100,
    _count: { leases: 0, maintenance: 1 },
  },
  {
    id: '7',
    name: 'Projekt Weststadt',
    address: 'Moltkestraße 88',
    city: 'Karlsruhe',
    zipCode: '76133',
    propertyType: 'RESIDENTIAL' as const,
    status: 'FOR_SALE' as const,
    size: 450,
    units: 6,
    yearBuilt: 1975,
    purchasePrice: 0,
    currentValue: 920000,
    monthlyRent: 0,
    _count: { leases: 0, maintenance: 0 },
  },
  {
    id: '8',
    name: 'Altstadt Komplex',
    address: 'Westliche Karl-Friedrich-Straße 34',
    city: 'Pforzheim',
    zipCode: '75172',
    propertyType: 'MIXED_USE' as const,
    status: 'RENTED' as const,
    size: 520,
    units: 5,
    yearBuilt: 1960,
    purchasePrice: 780000,
    currentValue: 865000,
    monthlyRent: 5600,
    _count: { leases: 5, maintenance: 2 },
  },
];

export default function PropertiesPage() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleExport = () => {
    // CSV Export Logic
    const headers = ['Name', 'Stadt', 'Typ', 'Status', 'Größe', 'Wert', 'Miete'];
    const rows = mockProperties.map(p => [
      p.name,
      p.city,
      p.propertyType,
      p.status,
      `${p.size} m²`,
      `${p.currentValue}€`,
      `${p.monthlyRent}€`,
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties-export.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="lg:ml-64 p-6 pt-20 lg:pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Properties</h1>
            <p className="text-muted-foreground">
              Verwalte alle deine Immobilien an einem Ort
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link
              href="/properties/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Neues Property
            </Link>
          </div>
        </div>

        {/* Property List */}
        <PropertyList properties={mockProperties} />
      </main>
    </div>
  );
}

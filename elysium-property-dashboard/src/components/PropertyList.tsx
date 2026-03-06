'use client';

import { useState } from 'react';
import { Search, Filter, Grid3x3, List as ListIcon } from 'lucide-react';
import { Property, PropertyType, PropertyStatus } from '@prisma/client';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: (Property & {
    _count?: {
      leases: number;
      maintenance: number;
    };
  })[];
}

export function PropertyList({ properties }: PropertyListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<PropertyType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<PropertyStatus | 'ALL'>('ALL');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || property.propertyType === filterType;
    const matchesStatus = filterStatus === 'ALL' || property.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: properties.length,
    rented: properties.filter(p => p.status === 'RENTED').length,
    vacant: properties.filter(p => p.status === 'VACANT').length,
    renovation: properties.filter(p => p.status === 'RENOVATION').length,
    totalValue: properties.reduce((sum, p) => sum + p.currentValue, 0),
    totalRent: properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0),
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Gesamt</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Vermietet</p>
          <p className="text-2xl font-bold text-green-500">{stats.rented}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Frei</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.vacant}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Renovierung</p>
          <p className="text-2xl font-bold text-orange-500">{stats.renovation}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Portfolio-Wert</p>
          <p className="text-lg font-bold text-primary">
            {(stats.totalValue / 1000000).toFixed(2)}M€
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Monatsmiete</p>
          <p className="text-lg font-bold text-green-500">
            {(stats.totalRent / 1000).toFixed(1)}K€
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Suche nach Name, Stadt, Adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as PropertyType | 'ALL')}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          >
            <option value="ALL">Alle Typen</option>
            <option value="RESIDENTIAL">Wohnen</option>
            <option value="COMMERCIAL">Gewerbe</option>
            <option value="MIXED_USE">Mixed Use</option>
            <option value="LAND">Grundstück</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PropertyStatus | 'ALL')}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          >
            <option value="ALL">Alle Status</option>
            <option value="RENTED">Vermietet</option>
            <option value="VACANT">Frei</option>
            <option value="RENOVATION">Renovierung</option>
            <option value="FOR_SALE">Zum Verkauf</option>
          </select>

          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Property Grid/List */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine Properties gefunden</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-3'
        }>
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

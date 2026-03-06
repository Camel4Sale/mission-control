'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PropertyCard } from '@/components/PropertyCard'

// Mock-Daten
const properties = [
  {
    id: '1',
    address: 'Kaiserstraße 123, 76133 Karlsruhe',
    type: 'Mehrfamilienhaus',
    units: 8,
    value: 1200000,
    monthlyRent: 6400,
    occupancy: 100,
    roi: 6.4,
  },
  {
    id: '2',
    address: 'Königstraße 45, 70173 Stuttgart',
    type: 'Einfamilienhaus',
    units: 1,
    value: 650000,
    monthlyRent: 2800,
    occupancy: 100,
    roi: 5.2,
  },
  {
    id: '3',
    address: 'Leopoldstraße 78, 80802 München',
    type: 'Wohnung',
    units: 1,
    value: 450000,
    monthlyRent: 2200,
    occupancy: 100,
    roi: 5.9,
  },
  {
    id: '4',
    address: 'Hauptstraße 12, 69117 Heidelberg',
    type: 'Gewerbe',
    units: 1,
    value: 800000,
    monthlyRent: 4500,
    occupancy: 100,
    roi: 6.8,
  },
  {
    id: '5',
    address: 'Planken 56, 68161 Mannheim',
    type: 'Ladenlokal',
    units: 1,
    value: 380000,
    monthlyRent: 2100,
    occupancy: 0,
    roi: 0,
  },
]

export default function Dashboard() {
  // Berechnungen
  const totalValue = properties.reduce((sum, p) => sum + p.value, 0)
  const monthlyRent = properties.reduce((sum, p) => sum + p.monthlyRent, 0)
  const avgRoi = properties.filter(p => p.roi > 0).reduce((sum, p) => sum + p.roi, 0) / properties.filter(p => p.roi > 0).length
  const occupancyRate = (properties.filter(p => p.occupancy > 0).length / properties.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                🏠 Elysium Property Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Immobilien-Management-System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {properties.length} Properties
              </Badge>
              <Badge variant="default" className="text-sm">
                Portfolio
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtwert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{(totalValue / 1000000).toFixed(2)}M</div>
              <p className="text-xs text-slate-500">
                {properties.length} Immobilien
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monatliche Miete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{monthlyRent.toLocaleString()}</div>
              <p className="text-xs text-slate-500">
                €{(monthlyRent * 12 / 1000).toFixed(1)}k/Jahr
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ø ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRoi.toFixed(1)}%</div>
              <p className="text-xs text-slate-500">
                Before Tax
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vermietungsquote</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate.toFixed(0)}%</div>
              <p className="text-xs text-slate-500">
                {properties.filter(p => p.occupancy > 0).length}/{properties.length} Einheiten
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Property-Liste */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  )
}

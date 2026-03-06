'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Home, Euro, TrendingUp, Key } from 'lucide-react'

interface Property {
  id: string
  address: string
  type: string
  units: number
  value: number
  monthlyRent: number
  occupancy: number
  roi: number
}

export function PropertyCard({ property }: { property: Property }) {
  const isRented = property.occupancy > 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {property.type}
            </span>
          </div>
          <Badge variant={isRented ? 'default' : 'secondary'}>
            {isRented ? '✓ Vermietet' : '○ Frei'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Adresse */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{property.address}</p>
            <p className="text-xs text-slate-500">{property.units} Einheit{property.units > 1 ? 'en' : ''}</p>
          </div>
        </div>

        {/* Wert & Miete */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Wert</p>
              <p className="text-sm font-semibold">€{(property.value / 1000).toFixed(0)}k</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Miete/Monat</p>
              <p className="text-sm font-semibold">€{property.monthlyRent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <TrendingUp className={`h-4 w-4 ${property.roi > 6 ? 'text-green-500' : property.roi > 4 ? 'text-yellow-500' : 'text-red-500'}`} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">ROI</span>
              <span className={`text-sm font-bold ${property.roi > 6 ? 'text-green-600' : property.roi > 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                {property.roi > 0 ? `${property.roi.toFixed(1)}%` : '—'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Details
        </Button>
        <Button size="sm" className="flex-1">
          Bearbeiten
        </Button>
      </CardFooter>
    </Card>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, DollarSign, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface TokenData {
  hour: string
  tokens: number
  cost: number
}

export function TokenUsage() {
  const [data, setData] = useState<TokenData[]>([])
  const [totalTokens, setTotalTokens] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [efficiency, setEfficiency] = useState(0)

  useEffect(() => {
    // Mock data for last 24 hours
    const mockData: TokenData[] = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date()
      hour.setHours(hour.getHours() - i)
      return {
        hour: hour.toLocaleTimeString('de-DE', { hour: '2-digit' }),
        tokens: Math.floor(Math.random() * 500000) + 100000,
        cost: Math.random() * 0.5 + 0.1,
      }
    }).reverse()

    const total = mockData.reduce((sum, d) => sum + d.tokens, 0)
    const cost = mockData.reduce((sum, d) => sum + d.cost, 0)

    setData(mockData)
    setTotalTokens(total)
    setTotalCost(cost)
    setEfficiency(Math.floor(Math.random() * 50) + 150) // 150-200%
  }, [])

  const modelDistribution = [
    { name: 'qwen3.5', value: 45, color: '#8b5cf6' },
    { name: 'minimax-m2.5', value: 30, color: '#3b82f6' },
    { name: 'devstral', value: 15, color: '#22c55e' },
    { name: 'other', value: 10, color: '#f59e0b' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Usage Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{(totalTokens / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-muted-foreground">Total Tokens (24h)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Total Cost (24h)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{efficiency}%</p>
                <p className="text-xs text-muted-foreground">Token Efficiency</p>
              </div>
            </div>
          </div>

          {/* Usage Over Time */}
          <div>
            <h3 className="text-sm font-medium mb-4">Token Usage (Last 24 Hours)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="tokens" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Tokens" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Model Distribution */}
          <div>
            <h3 className="text-sm font-medium mb-4">Usage by Model</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={modelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {modelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

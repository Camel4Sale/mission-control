'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, XCircle, GitBranch, HardDrive, Cpu } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

interface HealthMetric {
  name: string
  value: number
  status: 'healthy' | 'warning' | 'critical'
}

export function WorkspaceHealth() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [overallHealth, setOverallHealth] = useState(0)

  useEffect(() => {
    // Mock data
    const mockMetrics: HealthMetric[] = [
      { name: 'Git Status', value: 95, status: 'healthy' },
      { name: 'Build Status', value: 100, status: 'healthy' },
      { name: 'Error Rate', value: 2, status: 'healthy' },
      { name: 'Disk Usage', value: 61, status: 'warning' },
      { name: 'Memory', value: 58, status: 'healthy' },
      { name: 'CPU', value: 12, status: 'healthy' },
    ]

    const avg = mockMetrics.reduce((sum, m) => sum + m.value, 0) / mockMetrics.length
    setMetrics(mockMetrics)
    setOverallHealth(Math.round(avg))
  }, [])

  const radarData = metrics.map(m => ({
    subject: m.name,
    A: m.value,
    fullMark: 100,
  }))

  const getStatusIcon = (status: string) => {
    if (status === 'healthy') return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === 'warning') return <AlertCircle className="h-4 w-4 text-yellow-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Health Score */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              {overallHealth >= 90 ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : overallHealth >= 70 ? (
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="text-2xl font-bold">{overallHealth}%</p>
                <p className="text-xs text-muted-foreground">Overall Health</p>
              </div>
            </div>
            <Badge variant={overallHealth >= 90 ? 'default' : overallHealth >= 70 ? 'secondary' : 'destructive'}>
              {overallHealth >= 90 ? 'Healthy' : overallHealth >= 70 ? 'Warning' : 'Critical'}
            </Badge>
          </div>

          {/* Metrics List */}
          <div className="space-y-3">
            {metrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(metric.status)}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        metric.status === 'healthy' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{metric.value}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Radar Chart */}
          <div>
            <h3 className="text-sm font-medium mb-4">Health Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Health" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

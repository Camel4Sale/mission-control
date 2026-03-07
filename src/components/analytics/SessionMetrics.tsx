'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface SessionData {
  hour: string
  sessions: number
  avgDuration: number
}

export function SessionMetrics() {
  const [data, setData] = useState<SessionData[]>([])
  const [activeSessions, setActiveSessions] = useState(0)
  const [avgDuration, setAvgDuration] = useState(0)

  useEffect(() => {
    // Mock data
    const mockData: SessionData[] = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date()
      hour.setHours(hour.getHours() - i)
      return {
        hour: hour.toLocaleTimeString('de-DE', { hour: '2-digit' }),
        sessions: Math.floor(Math.random() * 20) + 5,
        avgDuration: Math.floor(Math.random() * 1800) + 300, // 5-35 min
      }
    }).reverse()

    setData(mockData)
    setActiveSessions(Math.floor(Math.random() * 5) + 1)
    setAvgDuration(Math.floor(mockData.reduce((sum, d) => sum + d.avgDuration, 0) / mockData.length))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{activeSessions}</p>
                <p className="text-xs text-muted-foreground">Active Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{Math.floor(avgDuration / 60)}m {avgDuration % 60}s</p>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </div>
            </div>
          </div>

          {/* Sessions Over Time */}
          <div>
            <h3 className="text-sm font-medium mb-4">Sessions (Last 24 Hours)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#3b82f6" name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Avg Duration Trend */}
          <div>
            <h3 className="text-sm font-medium mb-4">Avg Session Duration</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgDuration" stroke="#a855f7" strokeWidth={2} name="Duration (s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Clock, CheckCircle, RefreshCw } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface AutomationStats {
  totalAutomated: number
  automationRate: number
  cronJobsActive: number
  autoCommits: number
  scheduledTasks: number
}

export function AutomationTracking() {
  const [stats, setStats] = useState<AutomationStats>({
    totalAutomated: 0,
    automationRate: 0,
    cronJobsActive: 0,
    autoCommits: 0,
    scheduledTasks: 0,
  })

  const automationTypes = [
    { name: 'Cron Jobs', value: 12, color: '#8b5cf6' },
    { name: 'Auto-Commits', value: 8, color: '#3b82f6' },
    { name: 'Scheduled', value: 5, color: '#22c55e' },
    { name: 'Triggers', value: 3, color: '#f59e0b' },
  ]

  useEffect(() => {
    // Mock data
    setStats({
      totalAutomated: 156,
      automationRate: 87,
      cronJobsActive: 12,
      autoCommits: 45,
      scheduledTasks: 23,
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Zap className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalAutomated}</p>
                <p className="text-xs text-muted-foreground">Automated Tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.automationRate}%</p>
                <p className="text-xs text-muted-foreground">Automation Rate</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.cronJobsActive}</p>
                <p className="text-xs text-muted-foreground">Active Cron Jobs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <RefreshCw className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.autoCommits}</p>
                <p className="text-xs text-muted-foreground">Auto-Commits</p>
              </div>
            </div>
          </div>

          {/* Automation Types */}
          <div>
            <h3 className="text-sm font-medium mb-4">Automation by Type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={automationTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {automationTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Cron Jobs Status */}
          <div>
            <h3 className="text-sm font-medium mb-4">Active Cron Jobs</h3>
            <div className="space-y-2">
              {[
                { name: 'morning-reminder', schedule: '9:00 daily', status: 'active' },
                { name: 'weather-karlsruhe', schedule: '9:00 daily', status: 'active' },
                { name: 'daily-briefing', schedule: '8:00 daily', status: 'active' },
                { name: 'email-check', schedule: '10:00, 16:00', status: 'active' },
                { name: 'calendar-check', schedule: '8:00, 14:00, 18:00', status: 'active' },
                { name: 'task-reminder', schedule: '9:00, 15:00', status: 'active' },
                { name: 'github-check', schedule: '11:00, 17:00', status: 'active' },
                { name: 'git-auto-commit', schedule: '20:00 daily', status: 'active' },
                { name: 'weekly-summary', schedule: 'Sunday 18:00', status: 'active' },
                { name: 'security-audit', schedule: 'Sunday 2:00', status: 'active' },
                { name: 'disk-usage', schedule: '6:00 daily', status: 'active' },
                { name: 'uptime-check', schedule: 'Every 15 min', status: 'active' },
              ].map((job, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{job.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{job.schedule}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

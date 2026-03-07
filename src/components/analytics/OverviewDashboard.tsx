'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, CheckCircle, Clock, Zap, TrendingUp, AlertCircle } from 'lucide-react'

interface OverviewStats {
  totalTasks: number
  completionRate: number
  activeAgents: number
  tokenUsage: number
  avgTaskTime: number
  errorRate: number
}

export function OverviewDashboard() {
  const [stats, setStats] = useState<OverviewStats>({
    totalTasks: 0,
    completionRate: 0,
    activeAgents: 0,
    tokenUsage: 0,
    avgTaskTime: 0,
    errorRate: 0,
  })

  useEffect(() => {
    // Load from localStorage or API
    const loadData = () => {
      const tasks = JSON.parse(localStorage.getItem('mc-tasks') || '[]')
      const completed = tasks.filter((t: any) => t.status === 'completed').length
      const errors = tasks.filter((t: any) => t.status === 'error').length

      setStats({
        totalTasks: tasks.length,
        completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
        activeAgents: Math.floor(Math.random() * 5) + 1, // Mock
        tokenUsage: Math.floor(Math.random() * 1000000) + 500000, // Mock
        avgTaskTime: Math.floor(Math.random() * 300) + 60, // Mock (seconds)
        errorRate: tasks.length > 0 ? Math.round((errors / tasks.length) * 100) : 0,
      })
    }

    loadData()
    const interval = setInterval(loadData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Overview</h1>
        <p className="text-muted-foreground">Real-time metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAgents}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        {/* Token Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.tokenUsage / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        {/* Avg Task Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Task Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(stats.avgTaskTime / 60)}m {stats.avgTaskTime % 60}s</div>
            <p className="text-xs text-muted-foreground">Per task</p>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorRate}%</div>
            <p className="text-xs text-muted-foreground">Failed tasks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

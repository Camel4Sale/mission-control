'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Zap, Clock, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Agent {
  id: string
  name: string
  status: 'active' | 'idle' | 'error'
  tasksCompleted: number
  uptime: number
  avgResponseTime: number
}

export function AgentActivity() {
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    // Mock data
    const mockAgents: Agent[] = [
      { id: '1', name: 'main', status: 'active', tasksCompleted: 150, uptime: 98.5, avgResponseTime: 2.3 },
      { id: '2', name: 'subagent-1', status: 'active', tasksCompleted: 87, uptime: 95.2, avgResponseTime: 3.1 },
      { id: '3', name: 'subagent-2', status: 'idle', tasksCompleted: 45, uptime: 92.8, avgResponseTime: 4.2 },
      { id: '4', name: 'subagent-3', status: 'active', tasksCompleted: 62, uptime: 97.1, avgResponseTime: 2.8 },
      { id: '5', name: 'subagent-4', status: 'error', tasksCompleted: 23, uptime: 88.5, avgResponseTime: 5.6 },
    ]
    setAgents(mockAgents)
  }, [])

  const agentChartData = agents.map(a => ({
    name: a.name,
    tasks: a.tasksCompleted,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Agent List */}
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className={`h-5 w-5 ${
                    agent.status === 'active' ? 'text-green-500' :
                    agent.status === 'idle' ? 'text-yellow-500' : 'text-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {agent.tasksCompleted} tasks • {agent.uptime}% uptime
                    </p>
                  </div>
                </div>
                <Badge variant={
                  agent.status === 'active' ? 'default' :
                  agent.status === 'idle' ? 'secondary' : 'destructive'
                }>
                  {agent.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Tasks per Agent Chart */}
          <div>
            <h3 className="text-sm font-medium mb-4">Tasks per Agent</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={agentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

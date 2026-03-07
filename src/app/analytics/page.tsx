'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { TopBar } from '@/components/TopBar'
import { OverviewDashboard } from '@/components/analytics/OverviewDashboard'
import { TaskMetrics } from '@/components/analytics/TaskMetrics'
import { AgentActivity } from '@/components/analytics/AgentActivity'
import { TokenUsage } from '@/components/analytics/TokenUsage'
import { SessionMetrics } from '@/components/analytics/SessionMetrics'
import { WorkspaceHealth } from '@/components/analytics/WorkspaceHealth'
import { AutomationTracking } from '@/components/analytics/AutomationTracking'

export default function AnalyticsPage() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <TopBar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <Navigation />
      
      <main className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6">
        <OverviewDashboard />
        
        <div className="grid gap-6 md:grid-cols-2">
          <TaskMetrics />
          <AgentActivity />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <TokenUsage />
          <SessionMetrics />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <WorkspaceHealth />
          <AutomationTracking />
        </div>
      </main>
    </div>
  )
}

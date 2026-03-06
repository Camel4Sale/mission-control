'use client';

import { useState, useEffect } from 'react';
import { 
  generateGatewayHealth, 
  generateCronJobs, 
  generateSubAgentActivity, 
  generateTokenUsage,
  generateSessionMetrics,
  generateModelUsage,
  generateGitStatus,
  generateFileChanges,
  generateStorageUsage,
  generateSkillInventory,
  generateAutomationTracking,
} from '@/lib/analytics';
import { StatusCards } from '@/components/analytics/StatusCards';
import { SessionMetricsCard } from '@/components/analytics/SessionMetrics';
import { ModelUsageChart } from '@/components/analytics/ModelUsageChart';
import { SubAgentActivityPanel } from '@/components/analytics/SubAgentActivity';
import { WorkspaceHealthPanel } from '@/components/analytics/WorkspaceHealth';
import { AutomationTrackingPanel } from '@/components/analytics/AutomationTracking';
import { RefreshCw, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const [gatewayHealth, setGatewayHealth] = useState(generateGatewayHealth());
  const [cronJobs, setCronJobs] = useState(generateCronJobs());
  const [subAgents, setSubAgents] = useState(generateSubAgentActivity());
  const [tokenUsage, setTokenUsage] = useState(generateTokenUsage());
  const [sessionMetrics, setSessionMetrics] = useState(generateSessionMetrics());
  const [modelUsage, setModelUsage] = useState(generateModelUsage());
  const [gitStatus, setGitStatus] = useState(generateGitStatus());
  const [fileChanges, setFileChanges] = useState(generateFileChanges());
  const [storage, setStorage] = useState(generateStorageUsage());
  const [skills, setSkills] = useState(generateSkillInventory());
  const [automation, setAutomation] = useState(generateAutomationTracking());

  const refreshData = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setGatewayHealth(generateGatewayHealth());
      setCronJobs(generateCronJobs());
      setSubAgents(generateSubAgentActivity());
      setTokenUsage(generateTokenUsage());
      setSessionMetrics(generateSessionMetrics());
      setModelUsage(generateModelUsage());
      setGitStatus(generateGitStatus());
      setFileChanges(generateFileChanges());
      setStorage(generateStorageUsage());
      setSkills(generateSkillInventory());
      setAutomation(generateAutomationTracking());
      setLastRefresh(new Date());
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-primary p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-accent" />
            Analytics Dashboard
          </h1>
          <p className="text-secondary mt-1">
            OpenClaw metrics and system health
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: OpenClaw Status */}
          <section>
            <h2 className="text-xl font-display font-bold mb-4">OpenClaw Status</h2>
            <StatusCards gatewayHealth={gatewayHealth} cronJobs={cronJobs} />
          </section>

          {/* Section 2: Session Metrics + Sub-Agent Activity */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SessionMetricsCard metrics={sessionMetrics} />
            </div>
            <div className="lg:col-span-2">
              <SubAgentActivityPanel agents={subAgents} />
            </div>
          </section>

          {/* Section 3: Model Usage */}
          <section>
            <ModelUsageChart models={modelUsage} />
          </section>

          {/* Section 4: Workspace Health */}
          <section>
            <h2 className="text-xl font-display font-bold mb-4">Workspace Health</h2>
            <WorkspaceHealthPanel 
              gitStatus={gitStatus}
              fileChanges={fileChanges}
              storage={storage}
              skills={skills}
            />
          </section>

          {/* Section 5: Automation Tracking */}
          <section>
            <AutomationTrackingPanel tracking={automation} cronJobs={cronJobs} />
          </section>
        </div>
      )}
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production this would connect to OpenClaw
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  switch (type) {
    case 'status':
      return NextResponse.json({
        status: 'online',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        model: 'minimax-m2.5',
        timestamp: new Date().toISOString()
      });

    case 'sessions':
      return NextResponse.json({
        active: 1,
        total: 3,
        lastActivity: new Date().toISOString()
      });

    case 'cron':
      return NextResponse.json({
        jobs: [
          { name: 'weather-karlsruhe', nextRun: '2026-03-04T09:00:00+01:00', enabled: true },
          { name: 'morning-reminder', nextRun: '2026-03-04T09:00:00+01:00', enabled: true },
          { name: 'daily-briefing', nextRun: '2026-03-04T08:00:00+01:00', enabled: true },
          { name: 'git-auto-commit', nextRun: '2026-03-03T20:00:00+01:00', enabled: true },
          { name: 'uptime-check', nextRun: 'continuous', enabled: true },
          { name: 'disk-usage-alert', nextRun: '2026-03-04T06:00:00+01:00', enabled: true },
          { name: 'security-audit', nextRun: '2026-03-08T02:00:00+01:00', enabled: true },
          { name: 'weekly-summary', nextRun: '2026-03-08T18:00:00+01:00', enabled: true },
          { name: 'skill-updates', nextRun: '2026-03-09T10:00:00+01:00', enabled: true }
        ]
      });

    case 'memory':
      return NextResponse.json({
        files: ['2026-03-03.md'],
        lastUpdated: '2026-03-03T22:31:00+01:00'
      });

    case 'channels':
      return NextResponse.json({
        telegram: { configured: true, active: true },
        whatsapp: { linked: true, active: true },
        discord: { configured: false },
        slack: { configured: false }
      });

    case 'skills':
      return NextResponse.json({
        installed: ['weather', 'himalaya', 'github', 'healthcheck', 'qmd-skill', 'model-usage'],
        available: ['coding-agent', 'automation-workflows', 'auto-updater']
      });

    default:
      return NextResponse.json({
        name: 'Molty 🧊',
        role: 'Personal AI Assistant',
        version: '1.0.0',
        endpoints: ['status', 'sessions', 'cron', 'memory', 'channels', 'skills']
      });
  }
}

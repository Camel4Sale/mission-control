'use client';

import { GitStatus, FileChanges, StorageUsage, SkillInventory, formatNumber } from '@/lib/analytics';
import { GitBranch, FileText, HardDrive, Package, TrendingUp, TrendingDown } from 'lucide-react';

interface WorkspaceHealthProps {
  gitStatus: GitStatus;
  fileChanges: FileChanges[];
  storage: StorageUsage;
  skills: SkillInventory;
}

export function WorkspaceHealthPanel({ gitStatus, fileChanges, storage, skills }: WorkspaceHealthProps) {
  return (
    <div className="space-y-4">
      {/* Git Status */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-accent" />
            <h3 className="font-display font-bold">Git Status</h3>
          </div>
          <span className="badge badge-accent">{gitStatus.branch}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <GitMetric label="24h" commits={gitStatus.commits24h} pushes={gitStatus.pushes24h} />
          <GitMetric label="7d" commits={gitStatus.commits7d} pushes={gitStatus.pushes7d} />
          <GitMetric label="30d" commits={gitStatus.commits30d} pushes={gitStatus.pushes7d + gitStatus.pushes24h} />
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-subtle">
          <div className="text-sm">
            <span className="text-muted">{gitStatus.branches} branches</span>
          </div>
          {gitStatus.uncommittedChanges > 0 && (
            <div className="text-sm text-warning">
              ⚠ {gitStatus.uncommittedChanges} uncommitted changes
            </div>
          )}
        </div>
      </div>

      {/* File Changes */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold">File Changes</h3>
        </div>

        <div className="space-y-3">
          {fileChanges.map(change => (
            <div key={change.period} className="flex items-center gap-3">
              <span className="text-xs text-muted w-10">{change.period}</span>
              <div className="flex-1 flex gap-1">
                <div 
                  className="h-2 rounded-full bg-success"
                  style={{ width: `${(change.added / (change.added + change.modified + change.deleted)) * 100}%` }}
                  title={`+${change.added} added`}
                />
                <div 
                  className="h-2 rounded-full bg-info"
                  style={{ width: `${(change.modified / (change.added + change.modified + change.deleted)) * 100}%` }}
                  title={`~${change.modified} modified`}
                />
                <div 
                  className="h-2 rounded-full bg-danger"
                  style={{ width: `${(change.deleted / (change.added + change.modified + change.deleted)) * 100}%` }}
                  title={`-${change.deleted} deleted`}
                />
              </div>
              <span className="text-xs text-secondary w-20 text-right">
                +{change.added} ~{change.modified} -{change.deleted}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Usage */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold">Storage</h3>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary">
              {formatNumber(storage.used / 1024 / 1024 / 1024)}GB / {formatNumber(storage.total / 1024 / 1024 / 1024)}GB used
            </span>
            <span className="text-sm font-bold text-accent">{((storage.used / storage.total) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-accent-hover transition-all"
              style={{ width: `${(storage.used / storage.total) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {storage.byCategory.map(cat => (
            <div key={cat.name} className="flex items-center justify-between text-sm">
              <span className="text-secondary">{cat.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted">{formatNumber(cat.size / 1024 / 1024)}MB</span>
                <span className="badge badge-default px-2 py-0.5">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Inventory */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            <h3 className="font-display font-bold">Skills</h3>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-success">{skills.active} active</span>
            <span className="badge badge-default">{skills.disabled} disabled</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.skills.slice(0, 15).map(skill => (
            <span 
              key={skill.name}
              className={`badge px-3 py-1.5 ${skill.status === 'active' ? 'badge-accent' : 'badge-default'}`}
            >
              {skill.name}
            </span>
          ))}
        </div>
        
        {skills.skills.length > 15 && (
          <div className="text-center text-sm text-muted mt-3">
            +{skills.skills.length - 15} more skills
          </div>
        )}
      </div>
    </div>
  );
}

function GitMetric({ label, commits, pushes }: { label: string; commits: number; pushes: number }) {
  return (
    <div className="text-center p-3 bg-secondary rounded-lg">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-xl font-display font-bold text-primary">{commits}</div>
      <div className="text-xs text-secondary flex items-center justify-center gap-1">
        <TrendingUp className="w-3 h-3" />
        {pushes} pushes
      </div>
    </div>
  );
}

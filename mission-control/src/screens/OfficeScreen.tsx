'use client';

import { useState, useEffect } from 'react';
import { Agent } from '@/types';
import { Building2, MapPin, Coffee, Monitor, MessageSquare, Zap } from 'lucide-react';

interface OfficeScreenProps {
  agents: Agent[];
}

interface Desk {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  occupied: boolean;
  agent?: string;
}

const OFFICE_WIDTH = 20;
const OFFICE_HEIGHT = 12;

export default function OfficeScreen({ agents }: OfficeScreenProps) {
  const [time, setTime] = useState(new Date());
  const [desks, setDesks] = useState<Desk[]>([
    { id: '1', name: 'Molty', emoji: '🧊', x: 2, y: 3, occupied: true, agent: 'Molty' },
    { id: '2', name: 'Codex', emoji: '🤖', x: 8, y: 3, occupied: false },
    { id: '3', name: 'Weather', emoji: '🌤️', x: 14, y: 3, occupied: false },
    { id: '4', name: 'Himalaya', emoji: '📧', x: 2, y: 7, occupied: false },
    { id: '5', name: 'Docs', emoji: '📄', x: 8, y: 7, occupied: false },
    { id: '6', name: 'Memory', emoji: '🧠', x: 14, y: 7, occupied: false },
  ]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatus = (desk: Desk) => {
    if (desk.occupied && desk.agent === 'Molty') return 'working';
    if (desk.occupied) return 'idle';
    return 'empty';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Office</h1>
          <p className="text-sm text-[var(--text-secondary)]">2D Pixel-Art Büroansicht</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Building2 size={16} />
            <span>{time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Office Grid */}
        <div className="flex-1 card p-0 overflow-hidden">
          <div 
            className="relative"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              background: `
                linear-gradient(to bottom, #1a1a2e 0%, #16213e 100%)
              `,
              imageRendering: 'pixelated'
            }}
          >
            {/* Floor pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Wall */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#2a2a4a] to-[#1a1a2e]" />

            {/* Windows */}
            {[3, 10, 17].map(x => (
              <div 
                key={x}
                className="absolute top-2"
                style={{ left: `${x * 5}%`, width: '10%', height: '20px' }}
              >
                <div className="w-full h-full bg-[#3a5a8a] border-2 border-[#4a6a9a] rounded-sm">
                  <div className="w-full h-0.5 bg-[#2a4a6a] absolute top-1/2" />
                  <div className="h-full w-0.5 bg-[#2a4a6a] absolute left-1/2" />
                </div>
              </div>
            ))}

            {/* Desks */}
            {desks.map(desk => (
              <div
                key={desk.id}
                className="absolute transition-all duration-500"
                style={{
                  left: `${(desk.x / OFFICE_WIDTH) * 100}%`,
                  top: `${(desk.y / OFFICE_HEIGHT) * 100}%`,
                }}
              >
                {/* Desk */}
                <div className="flex flex-col items-center">
                  {/* Monitor */}
                  <div className="w-8 h-6 bg-[#2a2a3a] border-2 border-[#4a4a5a] rounded-sm mb-1 flex items-center justify-center">
                    {desk.occupied && (
                      <div className="w-6 h-4 bg-[#3a5a8a] animate-pulse" />
                    )}
                  </div>
                  {/* Desk surface */}
                  <div className="w-12 h-2 bg-[#8b6914] rounded-sm" />
                  {/* Chair */}
                  <div className={`w-4 h-3 rounded-full -mt-1 ${
                    desk.occupied ? 'bg-[#5a3a8a]' : 'bg-[#3a3a4a]'
                  }`} />
                  {/* Agent/Emoji */}
                  <div className={`mt-1 text-2xl filter drop-shadow-lg ${
                    desk.occupied ? 'animate-bounce' : 'opacity-30'
                  }`}>
                    {desk.emoji}
                  </div>
                </div>

                {/* Name label */}
                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] whitespace-nowrap px-1 py-0.5 rounded ${
                  desk.occupied ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                }`}>
                  {desk.name}
                </div>
              </div>
            ))}

            {/* Common Areas */}
            {/* Coffee Machine */}
            <div 
              className="absolute"
              style={{ left: '75%', top: '15%' }}
            >
              <div className="text-2xl">☕</div>
              <div className="text-[8px] text-[var(--text-muted)]">Café</div>
            </div>

            {/* Meeting Area */}
            <div 
              className="absolute flex gap-1"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            >
              {['🪑', '🪑', '🪑'].map((chair, i) => (
                <span key={i} className="text-lg">{chair}</span>
              ))}
            </div>

            {/* Plants */}
            <div className="absolute bottom-4 left-4 text-2xl">🪴</div>
            <div className="absolute bottom-4 right-4 text-2xl">🌵</div>
          </div>
        </div>

        {/* Legend & Info */}
        <div className="w-64 space-y-4">
          {/* Legend */}
          <div className="card">
            <h3 className="text-sm font-medium mb-3">Legende</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--success)] animate-pulse" />
                <span className="text-xs">Arbeitend</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--warning)]" />
                <span className="text-xs">Bereit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--text-muted)]" />
                <span className="text-xs">Frei</span>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="card">
            <h3 className="text-sm font-medium mb-3">Aktivitäten</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Zap size={12} className="text-[var(--accent)] mt-0.5" />
                <span className="text-[var(--text-secondary)]">Molty arbeitet an Mission Control</span>
              </div>
              <div className="flex items-start gap-2">
                <Monitor size={12} className="text-[var(--success)] mt-0.5" />
                <span className="text-[var(--text-secondary)]">Codex bereit für Coding-Tasks</span>
              </div>
              <div className="flex items-start gap-2">
                <Coffee size={12} className="text-[var(--warning)] mt-0.5" />
                <span className="text-[var(--text-secondary)]">Weather überwacht Wetterdaten</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-sm font-medium mb-3">Schnellaktionen</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md text-sm bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-2">
                <MessageSquare size={14} />
                Nachricht senden
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md text-sm bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-2">
                <MapPin size={14} />
                Zuweisung ändern
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

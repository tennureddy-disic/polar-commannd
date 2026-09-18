import React, { useState, useEffect } from 'react';
import { Compass, ShieldAlert, Radio, Wifi, WifiOff, Clock, Terminal } from 'lucide-react';

export default function Navbar({ isOffline, onToggleOffline, activeAlertsCount = 7 }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.toUTCString().replace('GMT', 'UTC');
      setTimeStr(utc);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(12px)'
    }}>
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)'
        }}>
          <Compass size={24} color="#060a12" strokeWidth={2.5} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="font-hud" style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.12em',
              textShadow: '0 0 10px rgba(0, 240, 255, 0.5)'
            }}>
              POLAR COMMAND
            </span>
            <span className="badge-tag badge-cyan">
              OPS v2.6
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            INTEGRATED POLAR EXPEDITION LOGISTICS & ASSET MANAGEMENT
          </div>
        </div>
      </div>

      {/* Center Mission Time Readout */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '6px 14px',
        borderRadius: '6px',
        border: '1px solid rgba(56, 189, 248, 0.15)'
      }}>
        <Clock size={15} color="var(--accent-cyan)" />
        <span className="font-mono" style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
          {timeStr || 'SYNCHRONIZING UTC...'}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>|</span>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
          HIMADRI • MAITRI • BHARATI
        </span>
      </div>

      {/* Right Controls & Offline Simulator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Alerts Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          padding: '5px 10px',
          borderRadius: '4px'
        }}>
          <ShieldAlert size={15} color="#f87171" />
          <span className="font-hud" style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
            {activeAlertsCount} ACTIVE ALERTS
          </span>
        </div>

        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className={isOffline ? 'pulse-emergency' : 'pulse-online'} style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isOffline ? '#ef4444' : '#10b981'
          }} />
          <span className="font-hud" style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: isOffline ? '#ef4444' : '#10b981',
            letterSpacing: '0.08em'
          }}>
            {isOffline ? '🔴 OFFLINE' : '🟢 ONLINE'}
          </span>
        </div>

        {/* Offline Mode Toggle Button */}
        <button
          onClick={onToggleOffline}
          className="btn-tactical"
          style={{
            borderColor: isOffline ? '#ef4444' : 'rgba(56, 189, 248, 0.4)',
            background: isOffline ? 'rgba(239, 68, 68, 0.2)' : undefined
          }}
          title="Simulate offline field behavior with localStorage fallback"
        >
          {isOffline ? <Wifi size={15} color="#10b981" /> : <WifiOff size={15} color="#f87171" />}
          <span>{isOffline ? 'RESTORE ONLINE' : 'SIMULATE OFFLINE MODE'}</span>
        </button>
      </div>
    </header>
  );
}

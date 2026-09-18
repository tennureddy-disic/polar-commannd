import React from 'react';
import { WifiOff, Database } from 'lucide-react';

export default function OfflineBanner({ isOffline }) {
  if (!isOffline) return null;

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.95) 0%, rgba(185, 28, 28, 0.9) 100%)',
      color: '#ffffff',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
      position: 'relative',
      zIndex: 999
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <WifiOff size={20} color="#ffffff" className="pulse-emergency" />
        <div>
          <span className="font-hud" style={{ fontWeight: 700, letterSpacing: '0.05em', marginRight: '8px' }}>
            OFFLINE MODE ACTIVE:
          </span>
          <span style={{ fontSize: '0.88rem' }}>
            Data will sync when connection returns. Operating on local cache (localStorage).
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <Database size={14} />
        <span>LOCAL CACHE ENFORCED</span>
      </div>
    </div>
  );
}

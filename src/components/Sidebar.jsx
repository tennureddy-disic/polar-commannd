import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  PackageCheck,
  Boxes,
  Cpu,
  Users,
  MapPin,
  AlertOctagon,
  Bot,
  Sliders,
  FileBarChart2,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, badge: 'LIVE' },
  { path: '/expeditions', label: 'Expeditions', icon: Compass, badge: '03' },
  { path: '/cargo', label: 'Cargo', icon: PackageCheck, badge: '42' },
  { path: '/inventory', label: 'Inventory', icon: Boxes, badge: 'WARN' },
  { path: '/assets', label: 'Assets', icon: Cpu, badge: '04' },
  { path: '/personnel', label: 'Personnel', icon: Users, badge: '86' },
  { path: '/map', label: 'Map', icon: MapPin, badge: 'GEO' },
  { path: '/emergency', label: 'Emergency', icon: AlertOctagon, badge: 'CRIT', isEmergency: true },
  { path: '/agent', label: 'AI Agent', icon: Bot, badge: 'AI' },
  { path: '/simulation', label: 'Simulation', icon: Sliders, badge: 'TEST' },
  { path: '/reports', label: 'Reports', icon: FileBarChart2, badge: 'DOCS' }
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '240px',
      minWidth: '240px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-card)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px 12px',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '4px 12px 10px',
          fontWeight: 700
        }}>
          Tactical Operations
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: isActive
                  ? (item.isEmergency ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 240, 255, 0.12)')
                  : 'transparent',
                border: isActive
                  ? (item.isEmergency ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(0, 240, 255, 0.35)')
                  : '1px solid transparent',
                transition: 'all 0.15s ease-in-out',
                position: 'relative'
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon
                      size={18}
                      color={
                        isActive
                          ? (item.isEmergency ? '#ef4444' : 'var(--accent-cyan)')
                          : (item.isEmergency ? '#f87171' : 'var(--text-muted)')
                      }
                    />
                    <span className="font-hud" style={{
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: '0.04em'
                    }}>
                      {item.label}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-hud)',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontWeight: 700,
                    backgroundColor: item.isEmergency
                      ? 'rgba(239, 68, 68, 0.25)'
                      : (isActive ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)'),
                    color: item.isEmergency ? '#fca5a5' : (isActive ? 'var(--accent-cyan)' : 'var(--text-muted)')
                  }}>
                    {item.badge}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Terminal Mini Status at Sidebar Bottom */}
      <div style={{
        marginTop: '16px',
        padding: '10px 12px',
        background: 'rgba(6, 11, 20, 0.8)',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        borderRadius: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span className="font-hud" style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>
            NCAOR GOA LINK
          </span>
          <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>SYNCED</span>
        </div>
        <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          LATENCY: 48ms | SBD: RDY
        </div>
      </div>
    </aside>
  );
}

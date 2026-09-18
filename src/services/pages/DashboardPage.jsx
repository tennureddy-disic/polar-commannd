import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Compass,
  Users,
  Package,
  Cpu,
  Bell,
  MapPin,
  Flame,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Wind,
  Thermometer
} from 'lucide-react';
import { apiClient, getCachedData, setCachedData } from '../../api/client';

export default function DashboardPage({ isOffline }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      if (isOffline) {
        const cached = getCachedData('dashboard', null);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }
      }
      const res = await apiClient.get('/dashboard');
      setData(res.data);
      setCachedData('dashboard', res.data);
    } catch (err) {
      console.warn('Backend fetch failed, falling back to cache', err);
      const cached = getCachedData('dashboard', null);
      if (cached) setData(cached);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [isOffline]);

  if (loading && !data) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" size={28} color="var(--accent-cyan)" />
        <div style={{ marginTop: '12px', fontFamily: 'var(--font-hud)' }}>INITIALIZING POLAR COMMAND TELEMETRY...</div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    active_expeditions: '03',
    polar_stations: '03',
    personnel: '86',
    cargo_in_transit: '42',
    critical_assets: '04',
    active_alerts: '07'
  };

  const risk = data?.mission_risk || {
    overall_status_label: 'OVERALL RISK: HIGH',
    inventory_risk: 'CRITICAL',
    cargo_risk: 'HIGH',
    asset_risk: 'CRITICAL',
    personnel_risk: 'MODERATE'
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="font-hud" style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.08em' }}>
              POLAR COMMAND
            </h1>
            <span className="badge-tag badge-cyan">
              DEMO / SYNTHETIC DATA
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
            Intelligent Offline-First Polar Expedition Operations Platform
          </p>
        </div>

        <button onClick={fetchDashboard} className="btn-tactical">
          <RefreshCw size={15} />
          <span>REFRESH FEEDS</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        <div className="hud-card" style={{ padding: '16px' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span className="font-hud" style={{ fontSize: '0.75rem', fontWeight: 600 }}>ACTIVE EXPEDITIONS</span>
            <Compass size={18} color="var(--accent-cyan)" />
          </div>
          <div className="font-hud" style={{ fontSize: '2.1rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
            {kpis.active_expeditions}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px' }}>All 3 Stations Active</div>
        </div>

        <div className="hud-card" style={{ padding: '16px' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span className="font-hud" style={{ fontSize: '0.75rem', fontWeight: 600 }}>POLAR STATIONS</span>
            <MapPin size={18} color="var(--accent-cyan)" />
          </div>
          <div className="font-hud" style={{ fontSize: '2.1rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
            {kpis.polar_stations}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>Himadri • Maitri • Bharati</div>
        </div>

        <div className="hud-card" style={{ padding: '16px' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span className="font-hud" style={{ fontSize: '0.75rem', fontWeight: 600 }}>PERSONNEL</span>
            <Users size={18} color="var(--accent-cyan)" />
          </div>
          <div className="font-hud" style={{ fontSize: '2.1rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
            {kpis.personnel}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Deployed Across Bases</div>
        </div>

        <div className="hud-card" style={{ padding: '16px' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span className="font-hud" style={{ fontSize: '0.75rem', fontWeight: 600 }}>CARGO IN TRANSIT</span>
            <Package size={18} color="var(--accent-amber)" />
          </div>
          <div className="font-hud" style={{ fontSize: '2.1rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
            {kpis.cargo_in_transit}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#f59e0b', marginTop: '2px' }}>POLAR-2026-00451 Delayed</div>
        </div>

        <div className="hud-card" style={{ padding: '16px' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span className="font-hud" style={{ fontSize: '0.75rem', fontWeight: 600 }}>CRITICAL ASSETS</span>
            <Cpu size={18} color="#ef4444" />
          </div>
          <div className="font-hud" style={{ fontSize: '2.1rem', fontWeight: 700, color: '#ef4444', marginTop: '6px' }}>
            {kpis.critical_assets}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '2px' }}>G-04 Overhaul Overdue</div>
        </div>

        <div className="hud-card" style={{ padding: '16px' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span className="font-hud" style={{ fontSize: '0.75rem', fontWeight: 600 }}>ACTIVE ALERTS</span>
            <Bell size={18} color="#f59e0b" />
          </div>
          <div className="font-hud" style={{ fontSize: '2.1rem', fontWeight: 700, color: '#f59e0b', marginTop: '6px' }}>
            {kpis.active_alerts}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '2px' }}>Fuel & Power Warnings</div>
        </div>
      </div>

      {/* Mission Risk Banner */}
      <div className="hud-card" style={{
        padding: '20px 24px',
        borderLeft: '4px solid #ef4444',
        background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(13, 22, 38, 0.9) 100%)'
      }}>
        <div className="hud-corner-br"></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={24} color="#ef4444" className="pulse-emergency" />
              <span className="font-hud" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.06em' }}>
                MISSION RISK: {risk.overall_status_label}
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginTop: '6px' }}>
              Primary Risk Vector: Fuel depletion predicted in 16.7 days (25-day resupply) + Generator G-04 overdue for overhaul.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>INVENTORY RISK</div>
              <div className="font-hud" style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                {risk.inventory_risk}
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CARGO RISK</div>
              <div className="font-hud" style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                {risk.cargo_risk}
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ASSET RISK</div>
              <div className="font-hud" style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                {risk.asset_risk}
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PERSONNEL RISK</div>
              <div className="font-hud" style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                {risk.personnel_risk}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Polar Stations Section & Quick Map Preview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--accent-cyan)" />
            <h2 className="font-hud" style={{ fontSize: '1.15rem', color: '#ffffff', letterSpacing: '0.06em' }}>
              POLAR RESEARCH STATIONS
            </h2>
          </div>
          <button onClick={() => navigate('/map')} className="btn-tactical" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <span>OPEN FULL INTERACTIVE MAP</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {(data?.stations_preview || []).map((station) => (
            <div key={station.name} className="hud-card" style={{ padding: '18px' }}>
              <div className="hud-corner-tl"></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 className="font-hud" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                    {station.name}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {station.region}
                  </div>
                </div>

                <span className={`badge-tag ${
                  station.status === 'CRITICAL' ? 'badge-red' :
                  station.status === 'WARNING' ? 'badge-amber' : 'badge-green'
                }`}>
                  {station.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PERSONNEL</div>
                  <div className="font-hud" style={{ fontSize: '1rem', color: '#ffffff' }}>{station.personnel_count} Crew</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>FUEL STOCK</div>
                  <div className="font-hud" style={{
                    fontSize: '1rem',
                    color: station.fuel_liters <= 3000 ? '#ef4444' : '#10b981'
                  }}>
                    {station.fuel_liters} L
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={14} color="#38bdf8" />
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SURFACE TEMP</div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{station.temperature_c}°C</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wind size={14} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>WIND SPEED</div>
                    <div className="font-mono" style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{station.wind_speed_kmh} km/h</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '0.74rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>Asset Status:</strong> {station.asset_status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Tactical Alerts Feed */}
      <div className="hud-card" style={{ padding: '20px' }}>
        <div className="hud-corner-tl"></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--accent-amber)" />
            <h2 className="font-hud" style={{ fontSize: '1.1rem', color: '#ffffff', letterSpacing: '0.06em' }}>
              REAL-TIME MISSION ALERTS
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Showing 7 Most Critical Events</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(data?.recent_alerts || []).map((alert) => (
            <div key={alert.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'rgba(6, 11, 20, 0.6)',
              borderRadius: '6px',
              borderLeft: `3px solid ${
                alert.severity === 'CRITICAL' ? '#ef4444' :
                alert.severity === 'HIGH' ? '#f59e0b' : '#38bdf8'
              }`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge-tag ${
                  alert.severity === 'CRITICAL' ? 'badge-red' :
                  alert.severity === 'HIGH' ? 'badge-amber' : 'badge-cyan'
                }`}>
                  {alert.severity}
                </span>

                <div>
                  <div className="font-hud" style={{ fontSize: '0.88rem', color: '#f1f5f9', fontWeight: 600 }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {alert.message}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>{alert.station_name}</div>
                <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{alert.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

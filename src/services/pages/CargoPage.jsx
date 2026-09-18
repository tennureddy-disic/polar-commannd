import React, { useState, useEffect } from 'react';
import { Package, Truck, Anchor, ShieldAlert, ArrowRight, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { apiClient, getCachedData, setCachedData } from '../../api/client';

export default function CargoPage({ isOffline }) {
  const [cargoList, setCargoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchCargo = async () => {
    try {
      if (isOffline) {
        const cached = getCachedData('cargo', null);
        if (cached) {
          setCargoList(cached);
          setLoading(false);
          return;
        }
      }
      const res = await apiClient.get('/cargo');
      setCargoList(res.data);
      setCachedData('cargo', res.data);
    } catch (err) {
      const cached = getCachedData('cargo', []);
      setCargoList(cached);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCargo();
  }, [isOffline]);

  const handleSimulateDelay = async () => {
    setSimulating(true);
    try {
      if (isOffline) {
        // Offline simulation update in local state and cache
        const updated = cargoList.map(c => {
          if (c.tracking_id === 'POLAR-2026-00451') {
            return {
              ...c,
              delay_days: (c.delay_days || 10) + 10,
              updated_eta: '02 Oct',
              risk_level: 'CRITICAL',
              status: 'DELAYED'
            };
          }
          return c;
        });
        setCargoList(updated);
        setCachedData('cargo', updated);
        setNotification('Simulated +10 day delay saved to local cache (Offline Mode).');
      } else {
        const res = await apiClient.post('/cargo/delay', {
          tracking_id: 'POLAR-2026-00451',
          additional_delay_days: 10
        });
        // Refresh cargo list
        await fetchCargo();
        setNotification(`Delayed +10 Days: ${res.data.tracking_id} updated ETA: ${res.data.updated_eta}, Risk: ${res.data.risk_level}`);
      }
    } catch (err) {
      setNotification('Delay update failed. Reverting to local state.');
    } finally {
      setSimulating(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const mainCargo = cargoList.find(c => c.tracking_id === 'POLAR-2026-00451') || {
    tracking_id: 'POLAR-2026-00451',
    description: 'Critical Generator Spare',
    priority: 'CRITICAL',
    status: 'DELAYED',
    current_location: 'Indian Ocean Transit',
    original_eta: '12 Sept',
    updated_eta: '22 Sept',
    risk_level: 'HIGH',
    delay_days: 10,
    route_stage: 'Ship'
  };

  // Route stages: Warehouse -> Indian Port -> Ship -> Polar Station
  const stages = [
    { label: 'Warehouse', completed: true, location: 'Goa Central Depot' },
    { label: 'Indian Port', completed: true, location: 'Mormugao Port Berth 4' },
    { label: 'Ship', current: true, location: 'R/V Bharati Transit (Indian Ocean)' },
    { label: 'Polar Station', completed: false, location: 'Maitri Research Base' }
  ];

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={24} color="var(--accent-cyan)" />
          <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            CARGO TRACKING & MARITIME SUPPLY PIPELINE
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Real-time voyage tracking, delay escalation, and polar logistics waypoint surveillance
        </p>
      </div>

      {notification && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          padding: '12px 16px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={18} color="#ef4444" />
          <span className="font-hud" style={{ fontSize: '0.85rem' }}>{notification}</span>
        </div>
      )}

      {/* Main Demo Cargo Card */}
      <div className="hud-card" style={{ padding: '24px', border: '1px solid rgba(0, 240, 255, 0.35)' }}>
        <div className="hud-corner-tl"></div>
        <div className="hud-corner-br"></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="font-mono" style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {mainCargo.tracking_id}
              </span>
              <span className="badge-tag badge-red">
                PRIORITY: {mainCargo.priority}
              </span>
              <span className="badge-tag badge-amber">
                STATUS: {mainCargo.status}
              </span>
            </div>

            <h2 className="font-hud" style={{ fontSize: '1.45rem', color: '#ffffff', marginTop: '8px' }}>
              {mainCargo.description}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              Destination: Maitri Research Station | Cargo: High-Pressure Fuel Injectors & Cylinder Heads
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '10px 18px',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>CARGO RISK</div>
              <div className="font-hud" style={{ fontSize: '1.2rem', color: '#ef4444', fontWeight: 700 }}>
                {mainCargo.risk_level}
              </div>
            </div>

            <button
              onClick={handleSimulateDelay}
              disabled={simulating}
              className="btn-tactical btn-danger"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              <Clock size={16} />
              <span>{simulating ? 'TRANSMITTING DELAY...' : 'SIMULATE +10 DAY DELAY'}</span>
            </button>
          </div>
        </div>

        {/* Cargo Telemetry Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '20px'
        }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CURRENT LOCATION</div>
            <div className="font-hud" style={{ fontSize: '0.95rem', color: '#38bdf8', marginTop: '2px' }}>
              {mainCargo.current_location}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ORIGINAL ETA</div>
            <div className="font-mono" style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '2px' }}>
              {mainCargo.original_eta}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UPDATED ETA</div>
            <div className="font-mono" style={{ fontSize: '1.05rem', color: '#f59e0b', fontWeight: 700, marginTop: '2px' }}>
              {mainCargo.updated_eta} (+{mainCargo.delay_days}d)
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VESSEL / CONVEYANCE</div>
            <div className="font-hud" style={{ fontSize: '0.95rem', color: '#ffffff', marginTop: '2px' }}>
              R/V Polar Carrier IV
            </div>
          </div>
        </div>

        {/* Route Visualization Pipeline: Warehouse -> Indian Port -> Ship -> Polar Station */}
        <div style={{ marginTop: '28px' }}>
          <div className="font-hud" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '14px', letterSpacing: '0.05em' }}>
            LOGISTICS ROUTE PIPELINE
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            position: 'relative'
          }}>
            {stages.map((stage, idx) => (
              <div
                key={stage.label}
                style={{
                  background: stage.current ? 'rgba(0, 240, 255, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                  border: stage.current
                    ? '1px solid var(--accent-cyan)'
                    : (stage.completed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'),
                  padding: '14px',
                  borderRadius: '6px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    STAGE 0{idx + 1}
                  </span>
                  {stage.completed ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : stage.current ? (
                    <span className="badge-tag badge-cyan">ACTIVE</span>
                  ) : (
                    <span className="badge-tag" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>PENDING</span>
                  )}
                </div>

                <div className="font-hud" style={{ fontSize: '1rem', color: stage.current ? 'var(--accent-cyan)' : '#ffffff', marginTop: '8px' }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {stage.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet Cargo Manifest Table */}
      <div className="hud-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="font-hud" style={{ fontSize: '1.15rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            GLOBAL FLEET CARGO MANIFEST (42 ITEMS IN TRANSIT)
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Showing Key Tracked Shipments</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>TRACKING ID</th>
                <th style={{ padding: '10px 12px' }}>DESCRIPTION</th>
                <th style={{ padding: '10px 12px' }}>PRIORITY</th>
                <th style={{ padding: '10px 12px' }}>STATUS</th>
                <th style={{ padding: '10px 12px' }}>CURRENT LOCATION</th>
                <th style={{ padding: '10px 12px' }}>ETA</th>
                <th style={{ padding: '10px 12px' }}>RISK</th>
              </tr>
            </thead>
            <tbody>
              {cargoList.map((item) => (
                <tr key={item.tracking_id} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  backgroundColor: item.tracking_id === 'POLAR-2026-00451' ? 'rgba(0, 240, 255, 0.04)' : 'transparent'
                }}>
                  <td className="font-mono" style={{ padding: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {item.tracking_id}
                  </td>
                  <td style={{ padding: '12px', color: '#ffffff' }}>{item.description}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge-tag ${item.priority === 'CRITICAL' ? 'badge-red' : item.priority === 'HIGH' ? 'badge-amber' : 'badge-cyan'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge-tag ${item.status === 'DELAYED' ? 'badge-red' : 'badge-green'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>{item.current_location}</td>
                  <td className="font-mono" style={{ padding: '12px', color: item.delay_days > 0 ? '#f59e0b' : '#94a3b8' }}>
                    {item.updated_eta} {item.delay_days > 0 ? `(+${item.delay_days}d)` : ''}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge-tag ${item.risk_level === 'CRITICAL' || item.risk_level === 'HIGH' ? 'badge-red' : 'badge-green'}`}>
                      {item.risk_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

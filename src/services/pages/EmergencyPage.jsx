import React, { useState, useEffect } from 'react';
import { AlertOctagon, ShieldAlert, Cpu, Wrench, UserCheck, Bot, CheckCircle2, ZapOff, Play } from 'lucide-react';
import { apiClient, getCachedData, setCachedData } from '../../api/client';

export default function EmergencyPage({ isOffline, onEmergencyTriggered }) {
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [eventsLog, setEventsLog] = useState([]);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        if (isOffline) {
          const cached = getCachedData('emergencies', []);
          setEventsLog(cached);
          if (cached.length > 0) {
            setEmergencyTriggered(true);
            setEventData(cached[0]);
          }
          return;
        }
        const res = await apiClient.get('/emergencies');
        setEventsLog(res.data);
        setCachedData('emergencies', res.data);
        if (res.data.length > 0) {
          setEmergencyTriggered(true);
          setEventData(res.data[0]);
        }
      } catch (err) {
        const cached = getCachedData('emergencies', []);
        setEventsLog(cached);
      }
    };
    fetchEmergencies();
  }, [isOffline]);

  const handleSimulateFailure = async () => {
    setSimulating(true);
    try {
      if (isOffline) {
        // Offline simulation response
        const fallbackEvent = {
          id: Date.now(),
          code: 'EMERG-2026-G04',
          title: 'CRITICAL POWER ALERT: Main Generator G-04 Failure',
          asset_name: 'Generator G-04',
          asset_status: 'FAILED',
          backup_status: 'G-05 AVAILABLE (Warm Standby Ready)',
          spare_status: 'SP-104 AVAILABLE (Station Stores)',
          technician_status: 'AVAILABLE (Senior Power Systems Engineer on shift)',
          ai_recommendation: 'Activate backup generator G-05 and assign available technician.',
          severity: 'CRITICAL',
          active: true,
          created_at: new Date().toUTCString()
        };
        setEventData(fallbackEvent);
        setEmergencyTriggered(true);
        const updated = [fallbackEvent, ...eventsLog];
        setEventsLog(updated);
        setCachedData('emergencies', updated);
        if (onEmergencyTriggered) onEmergencyTriggered();
      } else {
        const res = await apiClient.post('/emergency/simulate', { asset_id: 'G-04' });
        setEventData(res.data);
        setEmergencyTriggered(true);
        setEventsLog([res.data, ...eventsLog]);
        if (onEmergencyTriggered) onEmergencyTriggered();
      }
    } catch (err) {
      console.error('Emergency simulation failed', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertOctagon size={24} color="#ef4444" />
          <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            TACTICAL EMERGENCY RESPONSE & FAILOVER CENTER
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Automated crisis orchestration, redundant asset activation, and instant prescriptive action guidance
        </p>
      </div>

      {/* Main Simulation Control Card */}
      <div className="hud-card" style={{
        padding: '24px',
        border: '1px solid #ef4444',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(13, 22, 38, 0.95) 100%)'
      }}>
        <div className="hud-corner-tl" style={{ borderColor: '#ef4444' }}></div>
        <div className="hud-corner-br" style={{ borderColor: '#ef4444' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ZapOff size={24} color="#ef4444" className={emergencyTriggered ? 'pulse-emergency' : ''} />
              <span className="font-hud" style={{ fontSize: '1.3rem', color: '#ffffff', fontWeight: 700 }}>
                CATASTROPHIC BASE POWER FAILURE DRILL
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', marginTop: '6px' }}>
              Simulate sudden mechanical failure of primary power plant Generator G-04 at Maitri Station.
            </p>
          </div>

          <button
            onClick={handleSimulateFailure}
            disabled={simulating}
            className="btn-tactical btn-danger"
            style={{
              padding: '14px 28px',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.08em'
            }}
          >
            <AlertOctagon size={20} />
            <span>{simulating ? 'EXECUTING FAILOVER SIMULATION...' : '🚨 SIMULATE GENERATOR G-04 FAILURE'}</span>
          </button>
        </div>
      </div>

      {/* Reactive Emergency Triage HUD State */}
      {emergencyTriggered && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Quad Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {/* Box 1: G-04 FAILED */}
            <div className="hud-card" style={{
              padding: '18px',
              border: '2px solid #ef4444',
              background: 'rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Cpu size={22} color="#ef4444" />
                <span className="badge-tag badge-red">CRITICAL ALARM</span>
              </div>
              <div className="font-hud" style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 700, marginTop: '10px' }}>
                G-04
              </div>
              <div className="font-hud" style={{ fontSize: '1.1rem', color: '#ef4444', fontWeight: 700, marginTop: '2px' }}>
                FAILED
              </div>
              <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '4px' }}>
                Primary Caterpillar 3512B tripped on thermal overload.
              </div>
            </div>

            {/* Box 2: G-05 BACKUP AVAILABLE */}
            <div className="hud-card" style={{
              padding: '18px',
              border: '1px solid #10b981',
              background: 'rgba(16, 185, 129, 0.12)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Cpu size={22} color="#10b981" />
                <span className="badge-tag badge-green">STANDBY READY</span>
              </div>
              <div className="font-hud" style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 700, marginTop: '10px' }}>
                G-05
              </div>
              <div className="font-hud" style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                BACKUP AVAILABLE
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6ee7b7', marginTop: '4px' }}>
                Cummins QSK19 auxiliary pre-heated, ready for load transfer.
              </div>
            </div>

            {/* Box 3: SP-104 SPARE AVAILABLE */}
            <div className="hud-card" style={{
              padding: '18px',
              border: '1px solid var(--accent-cyan)',
              background: 'rgba(0, 240, 255, 0.12)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Wrench size={22} color="var(--accent-cyan)" />
                <span className="badge-tag badge-cyan">PARTS IN STORE</span>
              </div>
              <div className="font-hud" style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 700, marginTop: '10px' }}>
                SP-104
              </div>
              <div className="font-hud" style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '2px' }}>
                SPARE AVAILABLE
              </div>
              <div style={{ fontSize: '0.72rem', color: '#7dd3fc', marginTop: '4px' }}>
                Injector and overhaul gasket kit verified in Maitri storeroom.
              </div>
            </div>

            {/* Box 4: Technician AVAILABLE */}
            <div className="hud-card" style={{
              padding: '18px',
              border: '1px solid #38bdf8',
              background: 'rgba(56, 189, 248, 0.12)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <UserCheck size={22} color="#38bdf8" />
                <span className="badge-tag badge-cyan">ON WATCH</span>
              </div>
              <div className="font-hud" style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 700, marginTop: '10px' }}>
                Technician
              </div>
              <div className="font-hud" style={{ fontSize: '1.1rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                AVAILABLE
              </div>
              <div style={{ fontSize: '0.72rem', color: '#93c5fd', marginTop: '4px' }}>
                Er. Sandeep Rao on active duty, equipped with lockout gear.
              </div>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="hud-card" style={{
            padding: '24px',
            border: '2px solid var(--accent-cyan)',
            background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.15) 0%, rgba(13, 22, 38, 0.95) 100%)',
            boxShadow: '0 0 24px rgba(0, 240, 255, 0.2)'
          }}>
            <div className="hud-corner-tl"></div>
            <div className="hud-corner-br"></div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(0, 240, 255, 0.18)',
                border: '1px solid var(--accent-cyan)'
              }}>
                <Bot size={28} color="var(--accent-cyan)" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-hud" style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.06em' }}>
                    AI RECOMMENDATION
                  </span>
                  <span className="badge-tag badge-cyan">PRESCRIPTIVE DISPATCH</span>
                </div>

                <div className="font-hud" style={{
                  fontSize: '1.35rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  marginTop: '10px',
                  lineHeight: '1.4'
                }}>
                  Activate backup generator G-05 and assign available technician.
                </div>

                <div style={{
                  marginTop: '14px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    background: 'rgba(0,0,0,0.35)',
                    padding: '6px 12px',
                    borderRadius: '4px'
                  }}>
                    Action Step 1: Open main breaker G-04
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    background: 'rgba(0,0,0,0.35)',
                    padding: '6px 12px',
                    borderRadius: '4px'
                  }}>
                    Action Step 2: Auto-sync G-05 to base electrical bus
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    background: 'rgba(0,0,0,0.35)',
                    padding: '6px 12px',
                    borderRadius: '4px'
                  }}>
                    Action Step 3: Issue overhaul work ticket SP-104
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Event Audit Log */}
      <div className="hud-card" style={{ padding: '20px' }}>
        <h3 className="font-hud" style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '14px', letterSpacing: '0.06em' }}>
          EMERGENCY INCIDENT AUDIT LOG
        </h3>

        {eventsLog.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            No simulated or live critical emergencies registered in the current session.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {eventsLog.map((ev, i) => (
              <div key={ev.id || i} style={{
                background: 'rgba(6, 11, 20, 0.7)',
                padding: '12px 16px',
                borderRadius: '6px',
                borderLeft: '4px solid #ef4444',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{ev.code}</span>
                    <span className="badge-tag badge-red">{ev.severity}</span>
                  </div>
                  <div className="font-hud" style={{ fontSize: '1rem', color: '#ffffff', marginTop: '4px' }}>
                    {ev.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    AI Guidance: {ev.ai_recommendation}
                  </div>
                </div>

                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {ev.created_at}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

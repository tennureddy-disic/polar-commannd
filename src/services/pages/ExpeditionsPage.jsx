import React, { useState, useEffect } from 'react';
import { Compass, Users, Package, AlertTriangle, ShieldCheck, X, Calendar, UserCheck } from 'lucide-react';
import { apiClient, getCachedData, setCachedData } from '../../api/client';

export default function ExpeditionsPage({ isOffline }) {
  const [expeditions, setExpeditions] = useState([]);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpeditions = async () => {
      try {
        if (isOffline) {
          const cached = getCachedData('expeditions', null);
          if (cached) {
            setExpeditions(cached);
            setLoading(false);
            return;
          }
        }
        const res = await apiClient.get('/expeditions');
        setExpeditions(res.data);
        setCachedData('expeditions', res.data);
      } catch (err) {
        const cached = getCachedData('expeditions', []);
        setExpeditions(cached);
      } finally {
        setLoading(false);
      }
    };
    fetchExpeditions();
  }, [isOffline]);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass size={24} color="var(--accent-cyan)" />
          <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            ACTIVE POLAR EXPEDITIONS
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Real-time mission tracking, station assignment, personnel headcount, and operational risk status
        </p>
      </div>

      {/* Expeditions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {expeditions.map((exp) => (
          <div
            key={exp.code}
            className="hud-card"
            style={{
              padding: '20px',
              cursor: 'pointer',
              borderColor: selectedExpedition?.code === exp.code ? 'var(--accent-cyan)' : undefined
            }}
            onClick={() => setSelectedExpedition(exp)}
          >
            <div className="hud-corner-tl"></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {exp.code}
                </span>
                <h2 className="font-hud" style={{ fontSize: '1.15rem', color: '#ffffff', marginTop: '4px' }}>
                  {exp.name}
                </h2>
              </div>

              <span className={`badge-tag ${
                exp.mission_risk === 'HIGH' ? 'badge-red' :
                exp.mission_risk === 'MEDIUM' ? 'badge-amber' : 'badge-green'
              }`}>
                {exp.mission_risk} RISK
              </span>
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '8px 12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STATION</div>
                <div className="font-hud" style={{ fontSize: '0.95rem', color: '#38bdf8' }}>{exp.station_name}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '8px 12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STATUS</div>
                <div className="badge-tag badge-green" style={{ marginTop: '4px' }}>{exp.status}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '8px 12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PERSONNEL</div>
                <div className="font-hud" style={{ fontSize: '0.95rem', color: '#ffffff' }}>{exp.personnel_count} Specialists</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '8px 12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CARGO ALLOCATED</div>
                <div className="font-hud" style={{ fontSize: '0.95rem', color: '#ffffff' }}>{exp.cargo_count} Containers</div>
              </div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Mission Leader: <strong style={{ color: '#e2e8f0' }}>{exp.leader}</strong>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                Click for details →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Details Slide-out / Modal Drawer */}
      {selectedExpedition && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="hud-card" style={{
            maxWidth: '580px',
            width: '100%',
            padding: '24px',
            border: '1px solid var(--accent-cyan)',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)'
          }}>
            <div className="hud-corner-tl"></div>
            <div className="hud-corner-br"></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {selectedExpedition.code} • DETAILS PANEL
                </span>
                <h2 className="font-hud" style={{ fontSize: '1.35rem', color: '#ffffff', marginTop: '4px' }}>
                  {selectedExpedition.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedExpedition(null)}
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="badge-tag badge-cyan">Station: {selectedExpedition.station_name}</span>
                <span className={`badge-tag ${selectedExpedition.mission_risk === 'HIGH' ? 'badge-red' : 'badge-amber'}`}>
                  Risk: {selectedExpedition.mission_risk}
                </span>
                <span className="badge-tag badge-green">Status: {selectedExpedition.status}</span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '6px' }}>
                  SCIENTIFIC & OPERATIONAL OBJECTIVES
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.45' }}>
                  {selectedExpedition.objectives}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MISSION COMMANDER</div>
                  <div className="font-hud" style={{ fontSize: '0.9rem', color: '#ffffff', marginTop: '2px' }}>
                    {selectedExpedition.leader}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TIMELINE WINDOW</div>
                  <div className="font-mono" style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '2px' }}>
                    {selectedExpedition.start_date} → {selectedExpedition.target_date}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SPECIALIST HEADCOUNT</div>
                  <div className="font-hud" style={{ fontSize: '1rem', color: '#ffffff' }}>
                    {selectedExpedition.personnel_count} Crew Members
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ALLOCATED FREIGHT</div>
                  <div className="font-hud" style={{ fontSize: '1rem', color: '#ffffff' }}>
                    {selectedExpedition.cargo_count} TEU Units
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedExpedition(null)} className="btn-tactical">
                CLOSE DETAILS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Shield, HeartPulse, HardHat, Compass, Activity } from 'lucide-react';
import { apiClient, getCachedData, setCachedData } from '../../api/client';

export default function PersonnelPage({ isOffline }) {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        if (isOffline) {
          const cached = getCachedData('personnel', null);
          if (cached) {
            setPersonnel(cached);
            setLoading(false);
            return;
          }
        }
        const res = await apiClient.get('/personnel');
        setPersonnel(res.data);
        setCachedData('personnel', res.data);
      } catch (err) {
        const cached = getCachedData('personnel', []);
        setPersonnel(cached);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonnel();
  }, [isOffline]);

  const totalHeadcount = personnel.reduce((acc, p) => acc + p.head_count, 0) || 86;

  const getRoleIcon = (role) => {
    if (role.includes('Leader')) return Compass;
    if (role.includes('Engineer')) return HardHat;
    if (role.includes('Scientist')) return Activity;
    if (role.includes('Medical')) return HeartPulse;
    if (role.includes('Technician')) return HardHat;
    return Users;
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={24} color="var(--accent-cyan)" />
          <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            POLAR EXPEDITION PERSONNEL COMPLEMENT
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Specialist group distribution, operational readiness, and station watch rotations
        </p>
      </div>

      {/* Headcount Banner */}
      <div className="hud-card" style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div className="hud-corner-tl"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '8px',
            background: 'rgba(0, 240, 255, 0.12)',
            border: '1px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={28} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL DEPLOYED POLAR PERSONNEL</div>
            <div className="font-hud" style={{ fontSize: '2.4rem', fontWeight: 700, color: '#ffffff' }}>
              {totalHeadcount} <span style={{ fontSize: '1rem', color: 'var(--accent-cyan)' }}>SPECIALISTS</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ARCTIC (HIMADRI)</div>
            <div className="font-hud" style={{ fontSize: '1.2rem', color: '#ffffff' }}>18 Crew</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ANTARCTIC (MAITRI)</div>
            <div className="font-hud" style={{ fontSize: '1.2rem', color: '#ffffff' }}>42 Crew</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ANTARCTIC (BHARATI)</div>
            <div className="font-hud" style={{ fontSize: '1.2rem', color: '#ffffff' }}>26 Crew</div>
          </div>
        </div>
      </div>

      {/* Specialist Groups Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {personnel.map((p) => {
          const Icon = getRoleIcon(p.role_category);
          return (
            <div key={p.role_category} className="hud-card" style={{ padding: '18px' }}>
              <div className="hud-corner-tl"></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.25)'
                  }}>
                    <Icon size={20} color="var(--accent-cyan)" />
                  </div>
                  <div>
                    <h3 className="font-hud" style={{ fontSize: '1.05rem', color: '#ffffff' }}>
                      {p.role_category}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {p.station_name}
                    </div>
                  </div>
                </div>

                <span className={`badge-tag ${p.readiness_status === 'HIGH ALERT' ? 'badge-amber' : 'badge-green'}`}>
                  {p.readiness_status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>HEADCOUNT</div>
                <div className="font-hud" style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 700 }}>
                  {p.head_count} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Crew</span>
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shift Rotation:</span>
                  <span className="font-mono" style={{ color: '#cbd5e1' }}>{p.shift_rotation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Key Officer:</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{p.key_contact}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Roster Table */}
      <div className="hud-card" style={{ padding: '20px' }}>
        <h3 className="font-hud" style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px', letterSpacing: '0.06em' }}>
          PERSONNEL ROSTER SUMMARY
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>ROLE CATEGORY</th>
                <th style={{ padding: '10px 12px' }}>HEADCOUNT</th>
                <th style={{ padding: '10px 12px' }}>LOCATION</th>
                <th style={{ padding: '10px 12px' }}>READINESS</th>
                <th style={{ padding: '10px 12px' }}>WATCH ROTATION</th>
                <th style={{ padding: '10px 12px' }}>LEAD CONTACT</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((p) => (
                <tr key={p.role_category} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td className="font-hud" style={{ padding: '12px', color: '#ffffff', fontWeight: 600 }}>{p.role_category}</td>
                  <td className="font-mono" style={{ padding: '12px', color: 'var(--accent-cyan)', fontWeight: 700 }}>{p.head_count}</td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>{p.station_name}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge-tag ${p.readiness_status === 'HIGH ALERT' ? 'badge-amber' : 'badge-green'}`}>
                      {p.readiness_status}
                    </span>
                  </td>
                  <td className="font-mono" style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.shift_rotation}</td>
                  <td style={{ padding: '12px', color: '#38bdf8' }}>{p.key_contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, CheckCircle2, ShieldCheck, Wrench, Clock, Layers, ArrowRight } from 'lucide-react';
import { apiClient, getCachedData, setCachedData } from '../../api/client';

export default function AssetsPage({ isOffline }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        if (isOffline) {
          const cached = getCachedData('assets', null);
          if (cached) {
            setAssets(cached);
            setLoading(false);
            return;
          }
        }
        const res = await apiClient.get('/assets');
        setAssets(res.data);
        setCachedData('assets', res.data);
      } catch (err) {
        const cached = getCachedData('assets', []);
        setAssets(cached);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [isOffline]);

  const lifecycleStages = [
    'Procured',
    'Transported',
    'Station',
    'In Operation',
    'Maintenance',
    'Retired'
  ];

  const g04 = assets.find(a => a.asset_id === 'G-04') || {
    asset_id: 'G-04',
    name: 'Generator G-04 (Primary Base Power)',
    status: 'CRITICAL',
    operating_hours: 4820,
    maintenance_status: 'OVERDUE',
    backup_asset: 'G-05 AVAILABLE',
    spare_parts: 'SP-104 AVAILABLE',
    lifecycle_stage: 'Maintenance',
    notes: 'Exceeded 4,500hr service limit.'
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={24} color="var(--accent-cyan)" />
          <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            CRITICAL ASSET LIFECYCLE & FLEET HEALTH
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Power generation redundancy, operating hours tracking, and spare kit readiness
        </p>
      </div>

      {/* Flagship Asset Card: GENERATOR G-04 */}
      <div className="hud-card" style={{
        padding: '24px',
        border: '1px solid #ef4444',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(13, 22, 38, 0.95) 100%)'
      }}>
        <div className="hud-corner-tl" style={{ borderColor: '#ef4444' }}></div>
        <div className="hud-corner-br" style={{ borderColor: '#ef4444' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="font-mono" style={{ fontSize: '1.3rem', color: '#ef4444', fontWeight: 700 }}>
                {g04.asset_id}
              </span>
              <span className="badge-tag badge-red">
                STATUS: {g04.status}
              </span>
              <span className="badge-tag badge-amber">
                MAINTENANCE: {g04.maintenance_status}
              </span>
            </div>

            <h2 className="font-hud" style={{ fontSize: '1.45rem', color: '#ffffff', marginTop: '8px' }}>
              {g04.name}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              Location: Maitri Base Central Utility Module | Model: Caterpillar 3512B 1200kVA
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 16px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>OPERATING HOURS</div>
              <div className="font-hud" style={{ fontSize: '1.4rem', color: '#ef4444', fontWeight: 700 }}>
                {g04.operating_hours} hrs
              </div>
              <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>Threshold: 4500 hrs</div>
            </div>
          </div>
        </div>

        {/* Redundancy & Spare Status Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PRIMARY BACKUP UNIT</div>
              <div className="font-hud" style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: 700 }}>
                {g04.backup_asset}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.35)', padding: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wrench size={22} color="var(--accent-cyan)" />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ON-SITE REPLACEMENT KIT</div>
              <div className="font-hud" style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {g04.spare_parts}
              </div>
            </div>
          </div>
        </div>

        {/* Asset Lifecycle Visualization: Procured -> Transported -> Station -> In Operation -> Maintenance -> Retired */}
        <div style={{ marginTop: '28px' }}>
          <div className="font-hud" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '14px', letterSpacing: '0.05em' }}>
            ASSET LIFECYCLE VISUALIZATION
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {lifecycleStages.map((stage, idx) => {
              const isCurrent = g04.lifecycle_stage === stage;
              const isPast = idx < lifecycleStages.indexOf(g04.lifecycle_stage);

              return (
                <div
                  key={stage}
                  style={{
                    background: isCurrent
                      ? 'rgba(239, 68, 68, 0.25)'
                      : (isPast ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.5)'),
                    border: isCurrent
                      ? '1px solid #ef4444'
                      : (isPast ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'),
                    padding: '12px 10px',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}
                >
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: isCurrent ? '#fca5a5' : 'var(--text-muted)' }}>
                    PHASE 0{idx + 1}
                  </div>
                  <div className="font-hud" style={{
                    fontSize: '0.88rem',
                    color: isCurrent ? '#ffffff' : (isPast ? '#34d399' : '#64748b'),
                    marginTop: '4px',
                    fontWeight: isCurrent ? 700 : 500
                  }}>
                    {stage}
                  </div>
                  {isCurrent && (
                    <div className="badge-tag badge-red" style={{ marginTop: '6px', fontSize: '0.6rem' }}>
                      CURRENT
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fleet Assets Cards List */}
      <div>
        <h3 className="font-hud" style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '14px', letterSpacing: '0.06em' }}>
          SECONDARY & TACTICAL ASSETS
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {assets.filter(a => a.asset_id !== 'G-04').map((asset) => (
            <div key={asset.asset_id} className="hud-card" style={{ padding: '18px' }}>
              <div className="hud-corner-tl"></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {asset.asset_id}
                  </span>
                  <h4 className="font-hud" style={{ fontSize: '1.05rem', color: '#ffffff', marginTop: '2px' }}>
                    {asset.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Station: {asset.station_name} | {asset.type}
                  </div>
                </div>

                <span className={`badge-tag ${asset.status === 'OPERATIONAL' || asset.status === 'STANDBY' ? 'badge-green' : 'badge-amber'}`}>
                  {asset.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '14px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>OPERATING HOURS</div>
                  <div className="font-mono" style={{ fontSize: '0.9rem', color: '#ffffff' }}>{asset.operating_hours} hrs</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>MAINTENANCE</div>
                  <div className="font-hud" style={{ fontSize: '0.85rem', color: asset.maintenance_status === 'OVERDUE' ? '#ef4444' : '#34d399' }}>
                    {asset.maintenance_status}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>Lifecycle:</strong> {asset.lifecycle_stage} | <strong style={{ color: '#cbd5e1' }}>Backup:</strong> {asset.backup_asset}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

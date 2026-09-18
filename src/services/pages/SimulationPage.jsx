import React, { useState } from 'react';
import { Sliders, Play, ShieldAlert, ArrowRight, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiClient } from "../../api/client";

export default function SimulationPage({ isOffline }) {
  const [cargoDelayDays, setCargoDelayDays] = useState(10);
  const [consumptionIncreasePct, setConsumptionIncreasePct] = useState(0);
  const [assetFailure, setAssetFailure] = useState('None');
  const [simResult, setSimResult] = useState(null);
  const [running, setRunning] = useState(false);

  const handleRunSimulation = async () => {
    setRunning(true);
    try {
      if (isOffline) {
        // Offline simulation logic
        const baseFuelDays = 16.7;
        const adjFuelDays = Number((3000 / (180 * (1 + consumptionIncreasePct / 100))).toFixed(1));
        const effectiveResupply = 25 + cargoDelayDays;
        const afterRisk = (cargoDelayDays >= 10 || assetFailure === 'G-04') ? 'HIGH' : 'MEDIUM';

        setSimResult({
          before: {
            mission_risk: 'MEDIUM',
            fuel_endurance_days: baseFuelDays,
            resupply_eta_days: 25,
            critical_asset_status: 'G-04 Operational (Overdue)',
            logistics_status: 'Cargo In Transit (Indian Ocean)'
          },
          after: {
            mission_risk: afterRisk,
            fuel_endurance_days: adjFuelDays,
            effective_resupply_days: effectiveResupply,
            fuel_gap_deficit_days: Math.max(0, effectiveResupply - adjFuelDays),
            critical_asset_status: assetFailure !== 'None' ? `${assetFailure} FAILED` : 'G-04 Operational',
            logistics_status: cargoDelayDays > 0 ? `Delayed +${cargoDelayDays} Days` : 'Normal'
          },
          impact_analysis: [
            `Resupply arrival delayed by +${cargoDelayDays} days.`,
            `Fuel consumption elevated by +${consumptionIncreasePct}%.`,
            assetFailure !== 'None' ? `Simulated failure on ${assetFailure}.` : 'No additional asset failures.'
          ],
          recommendation: "Prioritize critical cargo and prepare alternative resupply arrangements."
        });
        setRunning(false);
        return;
      }

      const res = await apiClient.post('/simulation', {
        cargo_delay_days: cargoDelayDays,
        consumption_increase_pct: consumptionIncreasePct,
        asset_failure: assetFailure
      });
      setSimResult(res.data);
    } catch (err) {
      console.error('Simulation error', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sliders size={24} color="var(--accent-cyan)" />
          <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            EXPEDITION WHAT-IF SIMULATOR
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Stress-test polar logistics resilience against supply chain delays, severe cold consumption spikes, and equipment failures
        </p>
      </div>

      {/* Simulator Controls Card */}
      <div className="hud-card" style={{ padding: '24px' }}>
        <div className="hud-corner-tl"></div>
        <h2 className="font-hud" style={{ fontSize: '1.15rem', color: 'var(--accent-cyan)', marginBottom: '18px', letterSpacing: '0.05em' }}>
          SIMULATION CONTROLS & DISRUPTION VARIABLES
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Control 1: Cargo Delay */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="font-hud" style={{ fontSize: '0.85rem', color: '#ffffff' }}>CARGO DELAY</span>
              <span className="badge-tag badge-cyan font-mono">+{cargoDelayDays} DAYS</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[0, 5, 10, 15].map((days) => (
                <button
                  key={days}
                  onClick={() => setCargoDelayDays(days)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '4px',
                    border: cargoDelayDays === days ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)',
                    background: cargoDelayDays === days ? 'rgba(0, 240, 255, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                    color: cargoDelayDays === days ? 'var(--accent-cyan)' : '#cbd5e1',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem'
                  }}
                >
                  +{days}d
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Simulates ice-block or maritime transit postponement for POLAR-2026-00451.
            </div>
          </div>

          {/* Control 2: Consumption Increase */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="font-hud" style={{ fontSize: '0.85rem', color: '#ffffff' }}>CONSUMPTION INCREASE</span>
              <span className="badge-tag badge-amber font-mono">+{consumptionIncreasePct}%</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[0, 10, 20, 30].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setConsumptionIncreasePct(pct)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '4px',
                    border: consumptionIncreasePct === pct ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                    background: consumptionIncreasePct === pct ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                    color: consumptionIncreasePct === pct ? '#fbbf24' : '#cbd5e1',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem'
                  }}
                >
                  +{pct}%
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Simulates severe -45°C polar vortex requiring maximum auxiliary module heating.
            </div>
          </div>

          {/* Control 3: Asset Failure */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="font-hud" style={{ fontSize: '0.85rem', color: '#ffffff' }}>ASSET FAILURE</span>
              <span className="badge-tag badge-red font-mono">{assetFailure}</span>
            </div>

            <select
              value={assetFailure}
              onChange={(e) => setAssetFailure(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-card)',
                color: '#ffffff',
                padding: '8px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-hud)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="None">None (Nominal Fleet)</option>
              <option value="G-04">Generator G-04</option>
              <option value="Vehicle">Snowcat Vehicle SC-02</option>
              <option value="Scientific Equipment">Scientific Lidar AL-03</option>
            </select>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Injects sudden equipment breakdown into base operational load.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleRunSimulation}
            disabled={running}
            className="btn-tactical"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <Play size={16} />
            <span>{running ? 'PROCESSING WHAT-IF MODEL...' : 'RUN SIMULATION'}</span>
          </button>
        </div>
      </div>

      {/* Before vs After Impact Analysis */}
      {simResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* BEFORE Card */}
            <div className="hud-card" style={{ padding: '20px', borderLeft: '4px solid #38bdf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-hud" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>BASELINE CONDITIONS</span>
                <span className="badge-tag badge-cyan">BEFORE</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MISSION RISK:</div>
                <div className="font-hud" style={{ fontSize: '1.6rem', color: '#38bdf8', fontWeight: 700 }}>
                  {simResult.before.mission_risk}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '14px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>FUEL ENDURANCE</div>
                  <div className="font-mono" style={{ fontSize: '1rem', color: '#ffffff' }}>
                    {simResult.before.fuel_endurance_days} days
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>RESUPPLY ETA</div>
                  <div className="font-mono" style={{ fontSize: '1rem', color: '#ffffff' }}>
                    {simResult.before.resupply_eta_days} days
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                Asset Health: {simResult.before.critical_asset_status}
              </div>
            </div>

            {/* AFTER Card */}
            <div className="hud-card" style={{ padding: '20px', borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-hud" style={{ fontSize: '0.85rem', color: '#fca5a5' }}>PROJECTED OUTCOME</span>
                <span className="badge-tag badge-red">AFTER</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>MISSION RISK:</div>
                <div className="font-hud" style={{ fontSize: '1.6rem', color: '#ef4444', fontWeight: 700 }}>
                  {simResult.after.mission_risk}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '14px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PROJECTED ENDURANCE</div>
                  <div className="font-mono" style={{ fontSize: '1rem', color: '#ef4444', fontWeight: 700 }}>
                    {simResult.after.fuel_endurance_days} days
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>EFFECTIVE RESUPPLY</div>
                  <div className="font-mono" style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: 700 }}>
                    {simResult.after.effective_resupply_days} days
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#fca5a5' }}>
                Asset Health: <strong>{simResult.after.critical_asset_status}</strong>
              </div>
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="hud-card" style={{
            padding: '20px 24px',
            border: '1px solid #ef4444',
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(13, 22, 38, 0.95) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={22} color="#ef4444" />
              <span className="font-hud" style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>
                PRESCRIPTIVE SIMULATION RECOMMENDATION
              </span>
            </div>

            <div className="font-hud" style={{ fontSize: '1.25rem', color: '#fca5a5', marginTop: '10px' }}>
              {simResult.recommendation}
            </div>

            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {simResult.impact_analysis.map((impact, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>•</span>
                  <span>{impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

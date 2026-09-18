import React, { useState, useEffect } from 'react';
import { FileBarChart2, ShieldAlert, CheckCircle2, AlertTriangle, Download, Filter, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { apiClient, getCachedData, setCachedData } from "../../api/client";
export default function ReportsPage({ isOffline }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
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
        const cached = getCachedData('dashboard', null);
        setData(cached);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [isOffline]);

  const riskData = [
    { domain: 'Inventory (Fuel)', score: 92, level: 'CRITICAL', color: '#ef4444' },
    { domain: 'Cargo (Transit)', score: 78, level: 'HIGH', color: '#f59e0b' },
    { domain: 'Asset (G-04)', score: 88, level: 'HIGH', color: '#ef4444' },
    { domain: 'Personnel Readiness', score: 40, level: 'MODERATE', color: '#38bdf8' }
  ];

  const categoryBreakdown = [
    { name: 'Fuel', value: 35, color: '#ef4444' },
    { name: 'Logistics', value: 25, color: '#f59e0b' },
    { name: 'Asset Overhaul', value: 25, color: '#00f0ff' },
    { name: 'Environmental', value: 15, color: '#38bdf8' }
  ];

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileBarChart2 size={24} color="var(--accent-cyan)" />
            <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
              EXPEDITION OPERATIONS AUDIT & MISSION RISK REPORT
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Integrated operational summary for Expedition Command, Jury Review, and Logistics Task Force
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} className="btn-tactical" style={{ padding: '8px 16px' }}>
            <Printer size={15} />
            <span>PRINT / SAVE REPORT</span>
          </button>
        </div>
      </div>

      {/* Mission Risk Summary Banner */}
      <div className="hud-card" style={{ padding: '20px 24px', borderLeft: '4px solid #ef4444' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="badge-tag badge-red">EXECUTIVE STATUS</div>
            <h2 className="font-hud" style={{ fontSize: '1.4rem', color: '#ffffff', marginTop: '6px' }}>
              OVERALL POLAR MISSION RISK: HIGH
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginTop: '4px' }}>
              Synthesis of Arctic (Himadri) and Antarctic (Maitri, Bharati) real-time risk indicators.
            </p>
          </div>

          <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
            CYCLE: 2026-Q3 | AUDIT REF: POLAR-CMD-9021
          </div>
        </div>
      </div>

      {/* 4 Risk Domain Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="hud-card" style={{ padding: '16px', borderTop: '3px solid #ef4444' }}>
          <span className="badge-tag badge-red">INVENTORY RISK</span>
          <h3 className="font-hud" style={{ fontSize: '1.2rem', color: '#ef4444', marginTop: '8px' }}>CRITICAL</h3>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
            Fuel runway calculated at 16.7 days against 25-day resupply voyage.
          </p>
        </div>

        <div className="hud-card" style={{ padding: '16px', borderTop: '3px solid #f59e0b' }}>
          <span className="badge-tag badge-amber">CARGO RISK</span>
          <h3 className="font-hud" style={{ fontSize: '1.2rem', color: '#f59e0b', marginTop: '8px' }}>HIGH</h3>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
            Spare assembly POLAR-2026-00451 delayed +10 days in Indian Ocean.
          </p>
        </div>

        <div className="hud-card" style={{ padding: '16px', borderTop: '3px solid #ef4444' }}>
          <span className="badge-tag badge-red">ASSET RISK</span>
          <h3 className="font-hud" style={{ fontSize: '1.2rem', color: '#ef4444', marginTop: '8px' }}>HIGH</h3>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
            Generator G-04 overdue for overhaul (4,820 hrs logged).
          </p>
        </div>

        <div className="hud-card" style={{ padding: '16px', borderTop: '3px solid #38bdf8' }}>
          <span className="badge-tag badge-cyan">PERSONNEL RISK</span>
          <h3 className="font-hud" style={{ fontSize: '1.2rem', color: '#38bdf8', marginTop: '8px' }}>MODERATE</h3>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
            86 personnel active across 3 bases. Extreme cold rotation protocols in force.
          </p>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Risk Index Bar Chart */}
        <div className="hud-card" style={{ padding: '20px' }}>
          <h3 className="font-hud" style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px' }}>
            RISK EXPOSURE SEVERITY BY OPERATIONAL DOMAIN
          </h3>
          <div style={{ width: '100%', height: '230px' }}>
            <ResponsiveContainer>
              <BarChart data={riskData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="domain" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0c1628', borderColor: 'var(--accent-cyan)', color: '#ffffff' }} />
                <Bar dataKey="score" name="Risk Index (0-100)" radius={[4, 4, 0, 0]}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Factor Distribution Pie */}
        <div className="hud-card" style={{ padding: '20px' }}>
          <h3 className="font-hud" style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px' }}>
            MISSION VULNERABILITY COMPOSITION
          </h3>
          <div style={{ width: '100%', height: '230px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0c1628', borderColor: 'var(--accent-cyan)', color: '#ffffff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Emergency Events Summary Section */}
      <div className="hud-card" style={{ padding: '20px' }}>
        <h3 className="font-hud" style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '12px' }}>
          LOGGED EMERGENCY & CONTINGENCY EVENTS
        </h3>
        <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.6' }}>
          • Generator G-04 thermal excursion threshold registered at Maitri Base.<br />
          • Standby generator G-05 and spare kit SP-104 confirmed ready in redundant reserve.<br />
          • Maritime delay notification broadcasted for freight container POLAR-2026-00451.
        </div>
      </div>
    </div>
  );
}

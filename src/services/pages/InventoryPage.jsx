import React, { useState, useEffect } from 'react';
import { Boxes, Flame, AlertTriangle, CheckCircle, ShieldAlert, TrendingDown, ArrowDownRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import { apiClient, getCachedData, setCachedData } from '../../api/client';

export default function InventoryPage({ isOffline }) {
  const [inventory, setInventory] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isOffline) {
          const cachedInv = getCachedData('inventory', null);
          const cachedPred = getCachedData('predictions', null);
          if (cachedInv && cachedPred) {
            setInventory(cachedInv);
            setPredictions(cachedPred);
            setLoading(false);
            return;
          }
        }
        const [invRes, predRes] = await Promise.all([
          apiClient.get('/inventory'),
          apiClient.get('/predictions')
        ]);
        setInventory(invRes.data);
        setPredictions(predRes.data);
        setCachedData('inventory', invRes.data);
        setCachedData('predictions', predRes.data);
      } catch (err) {
        const cachedInv = getCachedData('inventory', []);
        const cachedPred = getCachedData('predictions', null);
        setInventory(cachedInv);
        setPredictions(cachedPred);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOffline]);

  // Fuel data values
  const fuelItem = inventory.find(i => i.category === 'Fuel') || {
    quantity: 3000,
    daily_consumption: 180,
    days_remaining: 16.7,
    resupply_days: 25
  };

  const burnData = [
    { day: 'Day 0', stock: 3000, resupplyLine: 0 },
    { day: 'Day 5', stock: 2100, resupplyLine: 0 },
    { day: 'Day 10', stock: 1200, resupplyLine: 0 },
    { day: 'Day 15', stock: 300, resupplyLine: 0 },
    { day: 'Day 16.7 (DEPLETION)', stock: 0, resupplyLine: 0 },
    { day: 'Day 20 (DEFICIT)', stock: 0, deficit: 600 },
    { day: 'Day 25 (RESUPPLY)', stock: 5000, resupplyArrival: 5000 }
  ];

  const inventoryChartData = [
    { category: 'Fuel (Days)', remaining: 16.7, resupply: 25, isCritical: true },
    { category: 'Food (Days)', remaining: 55.8, resupply: 25, isCritical: false },
    { category: 'Medical (Days)', remaining: 128.5, resupply: 25, isCritical: false },
    { category: 'Spares (Days)', remaining: 24.0, resupply: 25, isCritical: true }
  ];

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Boxes size={24} color="var(--accent-cyan)" />
          <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            POLAR INVENTORY & BURN-RATE ANALYTICS
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Predictive longevity calculation, resupply deficit gap analysis, and life-support reserves
        </p>
      </div>

      {/* Primary Highlight Card: FUEL CRITICAL RISK */}
      <div className="hud-card" style={{
        padding: '24px',
        border: '1px solid #ef4444',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(13, 22, 38, 0.95) 100%)'
      }}>
        <div className="hud-corner-tl" style={{ borderColor: '#ef4444' }}></div>
        <div className="hud-corner-br" style={{ borderColor: '#ef4444' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={22} color="#ef4444" className="pulse-emergency" />
              <span className="badge-tag badge-red">
                ⚠ CRITICAL FUEL RISK
              </span>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                POLAR GRADE DIESEL (MAITRI BASE)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginTop: '12px' }}>
              <div className="font-hud" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff' }}>
                3000 L
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                Burn Rate: <strong style={{ color: '#f87171' }}>180 L/day</strong>
              </div>
            </div>
          </div>

          {/* Longevity Formula Showcase */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '14px 20px',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BACKEND CALCULATION ENGINE:</div>
            <div className="font-mono" style={{ fontSize: '1rem', color: '#38bdf8' }}>
              3000 L ÷ 180 L/day = <span style={{ color: '#ef4444', fontWeight: 700 }}>16.7 Days</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
              Resupply Target: <strong>25 Days</strong> (Deficit: -8.3 Days)
            </div>
          </div>
        </div>

        {/* 3 Metric Comparison Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '20px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED REMAINING</div>
            <div className="font-hud" style={{ fontSize: '1.4rem', color: '#ef4444', fontWeight: 700 }}>
              16.7 Days
            </div>
            <div style={{ fontSize: '0.72rem', color: '#fca5a5' }}>Projected runout date: 04 Oct</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NEXT RESUPPLY WINDOW</div>
            <div className="font-hud" style={{ fontSize: '1.4rem', color: '#38bdf8', fontWeight: 700 }}>
              25 Days
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>R/V Bharati ETA: 13 Oct</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DEFICIT EXPOSURE GAP</div>
            <div className="font-hud" style={{ fontSize: '1.4rem', color: '#f59e0b', fontWeight: 700 }}>
              8.3 Days Gap
            </div>
            <div style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Base heat shutoff risk</div>
          </div>
        </div>

        {/* System Recommendation */}
        <div style={{
          marginTop: '18px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderLeft: '4px solid #ef4444',
          padding: '12px 16px',
          borderRadius: '4px'
        }}>
          <span className="font-hud" style={{ fontSize: '0.82rem', color: '#fca5a5', fontWeight: 700 }}>
            TACTICAL RECOMMENDATION:
          </span>
          <p style={{ color: '#ffffff', fontSize: '0.88rem', marginTop: '4px' }}>
            {predictions?.fuel?.recommendation || 'Prioritize fuel resupply or reduce consumption.'}
          </p>
        </div>
      </div>

      {/* Recharts Longevity & Depletion Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Fuel Depletion Area Chart */}
        <div className="hud-card" style={{ padding: '20px' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 className="font-hud" style={{ fontSize: '1.05rem', color: '#ffffff' }}>
              FUEL STOCK PROJECTION VS RESUPPLY TIMELINE
            </h3>
            <span className="badge-tag badge-red">CRITICAL RUNOUT</span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer>
              <AreaChart data={burnData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c1628', borderColor: 'var(--accent-cyan)', color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="stock" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#fuelGradient)" name="Fuel Remaining (L)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Category Inventory Runway Bar Chart */}
        <div className="hud-card" style={{ padding: '20px' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 className="font-hud" style={{ fontSize: '1.05rem', color: '#ffffff' }}>
              INVENTORY RUNWAY COMPARISON (DAYS REMAINING)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: 25 Days Resupply</span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer>
              <BarChart data={inventoryChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c1628', borderColor: 'var(--accent-cyan)', color: '#ffffff' }}
                />
                <Bar dataKey="remaining" name="Days Remaining" radius={[4, 4, 0, 0]}>
                  {inventoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.remaining < entry.resupply ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* All Inventory Categories Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {inventory.map((item) => (
          <div key={item.name} className="hud-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="badge-tag badge-cyan">{item.category}</span>
              <span className={`badge-tag ${item.risk_level === 'CRITICAL' ? 'badge-red' : item.risk_level === 'HIGH' ? 'badge-amber' : 'badge-green'}`}>
                {item.status}
              </span>
            </div>

            <h4 className="font-hud" style={{ fontSize: '1.05rem', color: '#ffffff', marginTop: '10px' }}>
              {item.name}
            </h4>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '14px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ON-HAND STOCK</div>
                <div className="font-hud" style={{ fontSize: '1.3rem', color: '#ffffff' }}>
                  {item.quantity} {item.unit}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>RUNWAY</div>
                <div className="font-mono" style={{ fontSize: '1.1rem', color: item.days_remaining < item.resupply_days ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                  {item.days_remaining} d
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px', fontSize: '0.74rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              {item.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

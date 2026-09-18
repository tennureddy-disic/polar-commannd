import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, ShieldAlert, Thermometer, Wind, Fuel, Users, Package } from 'lucide-react';
import { apiClient, getCachedData, setCachedData } from '../../api/client';

// Fix standard leaflet icon path issues in React Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom glowing tactical station icon creator
const createTacticalIcon = (color = '#00f0ff', label = '') => {
  return L.divIcon({
    className: 'custom-tactical-pin',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      ">
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${color}33;
          border: 2px solid ${color};
          box-shadow: 0 0 12px ${color};
          animation: pulse-glow 2s infinite;
        "></div>
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${color};
        "></div>
        <div style="
          position: absolute;
          top: -18px;
          white-space: nowrap;
          font-family: 'Chakra Petch', sans-serif;
          font-weight: 700;
          font-size: 11px;
          color: #ffffff;
          background: rgba(8, 14, 26, 0.85);
          border: 1px solid ${color};
          padding: 1px 6px;
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.6);
        ">${label}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export default function MapPage({ isOffline }) {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        if (isOffline) {
          const cached = getCachedData('stations', null);
          if (cached) {
            setStations(cached);
            return;
          }
        }
        const res = await apiClient.get('/stations');
        setStations(res.data);
        setCachedData('stations', res.data);
      } catch (err) {
        const cached = getCachedData('stations', []);
        setStations(cached);
      }
    };
    fetchStations();
  }, [isOffline]);

  // Key map coordinate landmarks
  const INDIA_HQ = { name: 'Goa Polar HQ / Mormugao Port', lat: 15.38, lng: 73.83, color: '#f59e0b' };

  // Shipping routes coordinates
  // Route 1: Goa -> Maitri (via Indian Ocean & Southern Ocean)
  const routeGoaToMaitri = [
    [15.38, 73.83],
    [5.0, 70.0],
    [-15.0, 60.0],
    [-35.0, 45.0],
    [-55.0, 25.0],
    [-70.77, 11.73]
  ];

  // Route 2: Goa -> Bharati (via Southern Ocean corridor)
  const routeGoaToBharati = [
    [15.38, 73.83],
    [-5.0, 80.0],
    [-30.0, 85.0],
    [-55.0, 80.0],
    [-69.41, 76.19]
  ];

  // Route 3: Goa -> Himadri (Arctic transit via Atlantic)
  const routeGoaToHimadri = [
    [15.38, 73.83],
    [12.0, 50.0],
    [25.0, 36.0],
    [36.0, -5.0],
    [60.0, 2.0],
    [78.92, 11.93]
  ];

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass size={24} color="var(--accent-cyan)" />
          <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
            TACTICAL POLAR GEOSPATIAL MAP & MARITIME ROUTES
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Global surveillance of Arctic station Himadri, Antarctic bases Maitri & Bharati, and supply corridors from India
        </p>
      </div>

      {/* Map + Sidebar Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', minHeight: '620px' }}>
        {/* Leaflet Map Box */}
        <div className="hud-card" style={{ padding: '4px', overflow: 'hidden', height: '620px' }}>
          <MapContainer
            center={[5.0, 45.0]}
            zoom={2}
            minZoom={1}
            maxZoom={8}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: '6px' }}
          >
            {/* Dark tactical basemap tiles */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Logistics Route Lines */}
            <Polyline
              positions={routeGoaToMaitri}
              pathOptions={{ color: '#ef4444', weight: 3, dashArray: '6, 8', opacity: 0.85 }}
            />
            <Polyline
              positions={routeGoaToBharati}
              pathOptions={{ color: '#38bdf8', weight: 2.5, dashArray: '5, 6', opacity: 0.8 }}
            />
            <Polyline
              positions={routeGoaToHimadri}
              pathOptions={{ color: '#10b981', weight: 2.5, dashArray: '5, 6', opacity: 0.8 }}
            />

            {/* India Port HQ Marker */}
            <Marker
              position={[INDIA_HQ.lat, INDIA_HQ.lng]}
              icon={createTacticalIcon('#f59e0b', 'INDIA HQ')}
              eventHandlers={{
                click: () => {
                  setSelectedStation({
                    name: 'Goa Central Polar Depot & Port',
                    region: 'India Logistics Hub',
                    personnel_count: 'HQ Command',
                    fuel_liters: 'Resupply Depot',
                    status: 'OPERATIONAL',
                    temperature_c: 29.0,
                    wind_speed_kmh: 12.0,
                    alerts_count: 0,
                    asset_status: 'Deep-water berth loading vessel R/V Bharati'
                  });
                }
              }}
            >
              <Popup>
                <div style={{ padding: '6px' }}>
                  <div className="font-hud" style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: 700 }}>
                    NCAOR GOA CENTRAL PORT
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                    Origin port for Antarctic winter supplies & Arctic equipment air-cargo.
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Polar Station Markers */}
            {stations.map((st) => {
              const markerColor = st.name === 'Maitri' ? '#ef4444' : (st.name === 'Himadri' ? '#00f0ff' : '#10b981');
              return (
                <Marker
                  key={st.name}
                  position={[st.latitude, st.longitude]}
                  icon={createTacticalIcon(markerColor, st.name.toUpperCase())}
                  eventHandlers={{
                    click: () => setSelectedStation(st)
                  }}
                >
                  <Popup>
                    <div style={{ padding: '6px', minWidth: '220px' }}>
                      <div className="font-hud" style={{ fontSize: '1.05rem', color: markerColor, fontWeight: 700 }}>
                        {st.name} Station
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {st.region}
                      </div>

                      <div style={{ marginTop: '8px', fontSize: '0.8rem', lineHeight: '1.6' }}>
                        <div>👥 <strong>Personnel:</strong> {st.personnel_count} Crew</div>
                        <div>⛽ <strong>Fuel:</strong> {st.fuel_liters} L</div>
                        <div>📦 <strong>Cargo:</strong> Active Voyage</div>
                        <div>⚠️ <strong>Alerts:</strong> {st.alerts_count} Active</div>
                        <div>⚙️ <strong>Asset:</strong> {st.asset_status}</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Selected Station Telemetry Panel */}
        <div className="hud-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div className="hud-corner-tl"></div>
          <div style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', paddingBottom: '10px' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
              TACTICAL SECTOR HUD
            </span>
            <h2 className="font-hud" style={{ fontSize: '1.35rem', color: '#ffffff', marginTop: '2px' }}>
              {selectedStation ? selectedStation.name : 'Select a Station Marker'}
            </h2>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              {selectedStation ? selectedStation.region : 'Click on Himadri, Maitri, Bharati or India HQ'}
            </div>
          </div>

          {selectedStation ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-hud" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SECTOR STATUS</span>
                <span className={`badge-tag ${
                  selectedStation.status === 'CRITICAL' ? 'badge-red' :
                  selectedStation.status === 'WARNING' ? 'badge-amber' : 'badge-green'
                }`}>
                  {selectedStation.status}
                </span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={20} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>STATION PERSONNEL</div>
                  <div className="font-hud" style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                    {selectedStation.personnel_count} Specialists
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Fuel size={20} color={selectedStation.fuel_liters <= 3000 ? '#ef4444' : '#10b981'} />
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>FUEL STOCK</div>
                  <div className="font-hud" style={{ fontSize: '1.1rem', color: selectedStation.fuel_liters <= 3000 ? '#ef4444' : '#ffffff' }}>
                    {selectedStation.fuel_liters} L
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TEMPERATURE</div>
                  <div className="font-mono" style={{ fontSize: '0.95rem', color: '#38bdf8' }}>
                    {selectedStation.temperature_c}°C
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>WIND GUSTS</div>
                  <div className="font-mono" style={{ fontSize: '0.95rem', color: '#f59e0b' }}>
                    {selectedStation.wind_speed_kmh} km/h
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ASSET TELEMETRY</div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px', lineHeight: '1.4' }}>
                  {selectedStation.asset_status}
                </div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '10px',
                borderRadius: '4px'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#fca5a5' }}>CARGO ALLOCATION</div>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: '#ffffff', marginTop: '2px' }}>
                  Critical Spare POLAR-2026-00451 in transit
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem', textAlign: 'center', marginTop: '40px' }}>
              <Navigation size={32} color="var(--accent-cyan)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
              Click any station pin on the tactical map to inspect its live personnel, fuel telemetry, cargo status, and asset health.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

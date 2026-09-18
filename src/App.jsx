import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import OfflineBanner from './components/OfflineBanner';

import DashboardPage from "./services/pages/DashboardPage";
import ExpeditionsPage from "./services/pages/ExpeditionsPage";
import CargoPage from "./services/pages/CargoPage";
import InventoryPage from "./services/pages/InventoryPage";
import AssetsPage from "./services/pages/AssetsPage";
import PersonnelPage from "./services/pages/PersonnelPage";
import MapPage from "./services/pages/MapPage";
import EmergencyPage from "./services/pages/EmergencyPage";
import AgentPage from "./services/pages/AgentPage";
import SimulationPage from "./services/pages/SimulationPage";
import ReportsPage from "./services/pages/ReportsPage";

export default function App() {
  const [isOffline, setIsOffline] = useState(false);

  return (
    <BrowserRouter>
      <div className="command-dark" style={{ display: 'flex', minHeight: '100vh' }}>
        <OfflineBanner isOffline={isOffline} />
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Navbar isOffline={isOffline} onToggleOffline={() => setIsOffline(!isOffline)} />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<DashboardPage isOffline={isOffline} />} />
              <Route path="/expeditions" element={<ExpeditionsPage isOffline={isOffline} />} />
              <Route path="/cargo" element={<CargoPage isOffline={isOffline} />} />
              <Route path="/inventory" element={<InventoryPage isOffline={isOffline} />} />
              <Route path="/assets" element={<AssetsPage isOffline={isOffline} />} />
              <Route path="/personnel" element={<PersonnelPage isOffline={isOffline} />} />
              <Route path="/map" element={<MapPage isOffline={isOffline} />} />
              <Route path="/emergency" element={<EmergencyPage isOffline={isOffline} />} />
              <Route path="/agent" element={<AgentPage isOffline={isOffline} />} />
              <Route path="/simulation" element={<SimulationPage isOffline={isOffline} />} />
              <Route path="/reports" element={<ReportsPage isOffline={isOffline} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
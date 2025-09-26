import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './context/User.jsx'; // Keep, but it's not the primary control

// Core App Components
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';

// Page Components
import Dashboard from './components/Dashboard.jsx';
import Properties from './components/Properties.jsx';
import Units from './components/Units.jsx';
import Tenants from './components/Tenants.jsx';
import Leases from './components/Leases.jsx';
import Payments from './components/Payments.jsx';
import Expenses from './components/Expenses.jsx';
import Reports from './components/Reports.jsx';
import Settings from './components/Settings.jsx';

// ❌ Authentication Components are no longer imported

// This component renders the main application layout.
function LoggedInApp() {
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className={`app-container ${theme}-theme`}>
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="content-wrapper">
        <Topbar 
          toggleSidebar={toggleSidebar} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/properties" element={<Properties searchQuery={searchQuery} />} />
            <Route path="/units" element={<Units searchQuery={searchQuery} />} />
            <Route path="/tenants" element={<Tenants searchQuery={searchQuery} />} />
            <Route path="/leases" element={<Leases searchQuery={searchQuery} />} />
            <Route path="/payments" element={<Payments searchQuery={searchQuery} />} />
            <Route path="/expenses" element={<Expenses searchQuery={searchQuery} />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings setTheme={setTheme} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
     </div>
  );
}

// This is the main App component that handles the top-level routing logic.
function App() {
  // ❌ Conditional login logic removed. App always renders the dashboard.
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<LoggedInApp />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
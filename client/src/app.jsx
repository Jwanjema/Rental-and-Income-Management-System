import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.js';
import Topbar from './components/Topbar.js';
import Properties from './components/Properties.js';
import Dashboard from './components/Dashboard.js';
import Tenants from './components/Tenants.js';
import Agents from './components/Agents.js';
import Leases from './components/Leases.js';
import Payments from './components/Payments.js';
import Reports from './components/Reports.js';
import Settings from './components/Settings.js';
import Units from './components/Units.js';
import './app.css';

const themes = {
  light: {
    primary: '#007bff',
    background: '#f4f7f9',
    card: '#ffffff',
    text: '#333333',
    link: '#007bff',
    sidebar: '#ffffff',
    border: '#e9ecef',
  },
  dark: {
    primary: '#4c9aff',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    link: '#4c9aff',
    sidebar: '#1e1e1e',
    border: '#333333',
  },
  blue: {
    primary: '#007bff',
    background: '#e9f5ff',
    card: '#ffffff',
    text: '#333333',
    link: '#007bff',
    sidebar: '#ffffff',
    border: '#cce5ff',
  },
  teal: {
    primary: '#008080',
    background: '#e6f7f7',
    card: '#ffffff',
    text: '#333333',
    link: '#008080',
    sidebar: '#ffffff',
    border: '#c4e0e0',
  },
};

const App = () => {
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const currentTheme = themes[theme];

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', backgroundColor: currentTheme.background, minHeight: '100vh' }}>
        <Sidebar currentTheme={currentTheme} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Topbar currentTheme={currentTheme} setTheme={setTheme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Routes>
            <Route path="/" element={<Dashboard currentTheme={currentTheme} />} />
            <Route path="/properties" element={<Properties currentTheme={currentTheme} searchQuery={searchQuery} />} />
            <Route path="/tenants" element={<Tenants currentTheme={currentTheme} searchQuery={searchQuery} />} />
            <Route path="/agents" element={<Agents currentTheme={currentTheme} searchQuery={searchQuery} />} />
            <Route path="/leases" element={<Leases currentTheme={currentTheme} searchQuery={searchQuery} />} />
            <Route path="/payments" element={<Payments currentTheme={currentTheme} searchQuery={searchQuery} />} />
            <Route path="/reports" element={<Reports currentTheme={currentTheme} />} />
            <Route path="/settings" element={<Settings setTheme={setTheme} currentTheme={currentTheme} />} />
            <Route path="/units" element={<Units currentTheme={currentTheme} searchQuery={searchQuery} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
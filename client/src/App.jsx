import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './context/User.jsx';

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
import Expenses from './components/Expenses.jsx'; // <-- IMPORT THE NEW COMPONENT
import Reports from './components/Reports.jsx';
import Settings from './components/Settings.jsx';

// Authentication Components
import LoginPage from './components/LoginPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';

// This component renders the main application layout for a logged-in user.
function LoggedInApp() {
  const [theme, setTheme] = useState('light'); // You can enhance this to save to user settings
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
            <Route path="/expenses" element={<Expenses searchQuery={searchQuery} />} /> {/* <-- ADD THE NEW ROUTE */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings setTheme={setTheme} />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect any other path to the dashboard */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

// This is the main App component that handles the top-level routing logic.
function App() {
  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          // If a user is logged in, render the full application.
          <Route path="/*" element={<LoggedInApp />} />
        ) : (
          // If no user is logged in, render only the authentication pages.
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
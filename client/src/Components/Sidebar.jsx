import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/', icon: '🏠' },
  { name: 'Properties', path: '/properties', icon: '🏡' },
  { name: 'Units', path: '/units', icon: '🏢' },
  { name: 'Agents', path: '/agents', icon: '👤' },
  { name: 'Tenants', path: '/tenants', icon: '👥' },
  { name: 'Leases', path: '/leases', icon: '📜' },
  { name: 'Payments', path: '/payments', icon: '💵' },
  { name: 'Reports', path: '/reports', icon: '📊' },
  { name: 'Settings', path: '/settings', icon: '⚙' }
];

const Sidebar = ({ currentTheme }) => {
  const location = useLocation();

  return (
    <div
      style={{
        width: '280px',
        backgroundColor: currentTheme.sidebar,
        height: '100vh',
        padding: '2rem 1rem',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <div
          style={{
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            color: currentTheme.primary,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          <span
            style={{
              backgroundColor: currentTheme.primary,
              color: 'white',
              padding: '0.5rem',
              borderRadius: '8px',
              marginRight: '0.5rem'
            }}
          >
            RI
          </span>
          <span style={{ color: currentTheme.text }}>Rentals & Income</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map((item) => (
            <li key={item.name} style={{ marginBottom: '0.5rem' }}>
              <Link
                to={item.path}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor:
                    location.pathname === item.path
                      ? currentTheme.border
                      : 'transparent',
                  color:
                    location.pathname === item.path
                      ? currentTheme.link
                      : currentTheme.text,
                  fontWeight:
                    location.pathname === item.path ? 'bold' : 'normal',
                  transition: 'background-color 0.2s'
                }}
              >
                <span style={{ marginRight: '1rem' }}>{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          fontSize: '0.8rem',
          color: currentTheme.text,
          padding: '1rem',
          borderTop: `1px solid ${currentTheme.border}`,
          marginTop: '1rem'
        }}
      >
        <p>Tip: Use the + Add button on each data page to create new items.</p>
      </div>
    </div>
  );
};

export default Sidebar;

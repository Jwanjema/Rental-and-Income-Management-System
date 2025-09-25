import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/', icon: '🏠' },
  { name: 'Properties', path: '/properties', icon: '🏡' },
  { name: 'Units', path: '/units', icon: '🏢' },
  { name: 'Tenants', path: '/tenants', icon: '👥' },
  { name: 'Leases', path: '/leases', icon: '📜' },
  { name: 'Payments', path: '/payments', icon: '💵' },
  { name: 'Expenses', path: '/expenses', icon: '🧾' }, // <-- ADDED THIS NEW LINK
  { name: 'Reports', path: '/reports', icon: '📊' },
  { name: 'Settings', path: '/settings', icon: '⚙️' }
];

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div>
        <div className="logo">Rentals & Income</div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.name}>
              <NavLink to={item.path} className={({ isActive }) => isActive ? "active" : ""}>
                <span role="img" aria-label={item.name}>{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
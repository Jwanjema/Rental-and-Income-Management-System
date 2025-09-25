import React, { useContext } from 'react';
import { UserContext } from '../context/User.jsx';

const Topbar = ({ toggleSidebar, searchQuery, setSearchQuery }) => {
  const { user, setUser } = useContext(UserContext);
  
  const handleLogout = () => {
    fetch("/api/logout", {
      method: "DELETE",
      credentials: 'include' // <-- This was the missing piece
    })
    .then(r => {
        if (r.ok) {
            setUser(null); // This will trigger the redirect to the login page
        }
    });
  };

  return (
    <header className="topbar">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="topbar-right">
        <span>Welcome, {user.username}</span>
        <button onClick={handleLogout} className="cancel-button">Logout</button>
      </div>
    </header>
  );
};

export default Topbar;
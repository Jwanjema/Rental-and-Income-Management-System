import React, { useState } from 'react';
import '../app.css';

const Settings = ({ currentTheme, setTheme }) => {
  const [name, setName] = useState('Admin');
  const [email, setEmail] = useState('admin@rentals.co');
  const [password, setPassword] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved! (Data is not persisted)');
    console.log('Saved data:', { name, email, password });
  };

  return (
    <div
      className="page-content"
      style={{
        padding: '2rem',
        backgroundColor: currentTheme.background,
        minHeight: '100vh',
        color: currentTheme.text
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          Settings
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>
          Manage your account and app settings
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}
      >
        {/* Account Information Section */}
        <div
          style={{
            backgroundColor: currentTheme.card,
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)'
          }}
        >
          <h3 style={{ marginTop: 0 }}>Account Information</h3>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold'
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '4px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.text
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold'
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '4px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.text
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold'
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '4px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.text
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: currentTheme.primary,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Theme Settings Section */}
        <div
          style={{
            backgroundColor: currentTheme.card,
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)'
          }}
        >
          <h3 style={{ marginTop: 0 }}>Theme Settings</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setTheme('light')}
              style={{
                backgroundColor: currentTheme.background,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`,
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Light Theme
            </button>
            <button
              onClick={() => setTheme('dark')}
              style={{
                backgroundColor: currentTheme.background,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`,
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Dark Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

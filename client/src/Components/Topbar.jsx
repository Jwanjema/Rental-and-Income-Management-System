import React from 'react';

const Topbar = ({ currentTheme, setTheme }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      backgroundColor: currentTheme.card,
      boxShadow: '0 0 10px rgba(0,0,0,0.05)',
      marginBottom: '2rem',
      color: currentTheme.text,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => setTheme('blue')} style={{ border: `1px solid ${currentTheme.primary}`, color: currentTheme.primary, background: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>
          Blue
        </button>
        <button onClick={() => setTheme('teal')} style={{ border: `1px solid ${currentTheme.primary}`, color: currentTheme.primary, background: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>
          Teal
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ backgroundColor: currentTheme.primary, color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
            U
          </div>
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ fontWeight: 'bold' }}>Admin</div>
            <div style={{ color: currentTheme.text, fontSize: '0.8rem' }}>admin@rentals.co</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
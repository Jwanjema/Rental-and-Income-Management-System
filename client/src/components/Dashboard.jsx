import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardSummary } from '../api.js'; // Import API function
import '../app.css';

const Dashboard = ({ currentTheme }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthlyIncomeData = [
    { name: 'Jan', income: 4000 },
    { name: 'Feb', income: 3000 },
    { name: 'Mar', income: 5000 },
    { name: 'Apr', income: 2780 },
    { name: 'May', income: 4500 },
    { name: 'Jun', income: 6000 },
  ];

  const recentActivity = [
    { id: 1, type: 'Payment Received', details: 'Rent for 123 Main St received from Alice Smith' },
    { id: 2, type: 'New Lease', details: 'Lease signed for 456 Oak Ave' },
    { id: 3, type: 'Payment Overdue', details: 'Rent for 789 Pine Ln is overdue' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardSummary();
        setSummaryData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const cardStyle = {
    backgroundColor: currentTheme.card,
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)',
  };

  const textStyle = {
    color: currentTheme.text,
  };

  // Conditional rendering: show a loading message if data is not yet available
  if (loading) {
    return (
      <div style={{ padding: '2rem', ...textStyle }}>
        <h1>Loading Dashboard Data...</h1>
      </div>
    );
  }

  // Once loading is complete and summaryData is not null, render the dashboard
  return (
    <div style={{ padding: '2rem', backgroundColor: currentTheme.background, minHeight: '100vh', ...textStyle }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>Welcome back, Admin!</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <h4 style={{ margin: 0, color: '#6c757d' }}>Total Properties</h4>
          <h2 style={{ margin: '0.5rem 0 0', ...textStyle }}>{summaryData.total_properties}</h2>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: 0, color: '#6c757d' }}>Occupied Units</h4>
          <h2 style={{ margin: '0.5rem 0 0', ...textStyle }}>{summaryData.occupied_units}</h2>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: 0, color: '#6c757d' }}>Vacant Units</h4>
          <h2 style={{ margin: '0.5rem 0 0', ...textStyle }}>{summaryData.vacant_units}</h2>
        </div>
        <div style={cardStyle}>
          <h4 style={{ margin: 0, color: '#6c757d' }}>Total Monthly Rent</h4>
          <h2 style={{ margin: '0.5rem 0 0', ...textStyle }}>Ksh {summaryData.total_monthly_rent}</h2>
        </div>
      </div>

      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Monthly Income Chart */}
        <div style={{ ...cardStyle }}>
          <h3 style={{ marginTop: 0 }}>Monthly Income</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyIncomeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
              <XAxis dataKey="name" stroke={currentTheme.text} />
              <YAxis stroke={currentTheme.text} />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke={currentTheme.primary} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div style={{ ...cardStyle }}>
          <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recentActivity.map(activity => (
              <li key={activity.id} style={{ borderBottom: '1px solid #dee2e6', padding: '1rem 0' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{activity.type}</p>
                <p style={{ margin: '0.25rem 0 0', color: '#6c757d' }}>{activity.details}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
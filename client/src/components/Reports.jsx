import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../app.css';

const monthlyIncomeData = [
  { name: 'Jan', income: 4000 },
  { name: 'Feb', income: 3000 },
  { name: 'Mar', income: 5000 },
  { name: 'Apr', income: 2780 },
  { name: 'May', income: 4500 },
];

const propertyStatusData = [
  { name: 'Occupied', value: 3 },
  { name: 'Vacant', value: 2 },
];

const COLORS = ['#007bff', '#8884d8'];

const Reports = ({ currentTheme }) => {
  return (
    <div style={{ padding: '2rem', backgroundColor: currentTheme.background, minHeight: '100vh', color: currentTheme.text }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Reports</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>Visualize your property and financial data</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

        <div style={{ backgroundColor: currentTheme.card, padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ marginTop: 0 }}>Monthly Income</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyIncomeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
              <XAxis dataKey="name" stroke={currentTheme.text} />
              <YAxis stroke={currentTheme.text} />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill={currentTheme.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: currentTheme.card, padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ marginTop: 0 }}>Property Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {propertyStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Reports;
import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Assuming 'propertiesApi' is an object that contains the correct BASE_URL
import { propertiesApi, API_BASE_URL } from '../api.js'; 
import { UserContext } from '../context/User.jsx';

// ❌ REMOVED: const API_BASE_URL = '/api'; - This caused the error!

const SummaryCard = ({ title, value, prefix = '', suffix = '', color = 'var(--text-color)' }) => (
    <div className="summary-card">
        <h4>{title}</h4>
        <h2 style={{ color }}>{prefix}{value.toLocaleString()}{suffix}</h2>
    </div>
);

const Reports = () => {
    const { user } = useContext(UserContext);
    const [reportData, setReportData] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState('all');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        // propertiesApi.getAll() should already be using the correct BASE_URL
        propertiesApi.getAll().then(setProperties).catch(err => console.error("Failed to fetch properties:", err));
    }, []);

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            try {
                // ✅ FIX: Use the imported API_BASE_URL (which should be the full Render domain)
                // and remove the leading /api from the path.
                const response = await fetch(`${API_BASE_URL}/reports/property_financials?property_id=${selectedProperty}&year=${selectedYear}`, { credentials: 'include' });
                if (!response.ok) throw new Error('Network response was not ok');
                setReportData(await response.json());
            } catch (error) {
                console.error("Failed to fetch report data:", error);
                setReportData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, [selectedProperty, selectedYear]);

    const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    if (loading) return <h1>Generating Reports...</h1>;

    return (
        <div>
            <div className="page-header">
                <div><h1>Reports Dashboard</h1><p>Analyze the financial performance of your properties.</p></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Property</label>
                        <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
                            <option value="all">All Properties</option>
                            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Year</label>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {reportData ? (
                <>
                    <div className="dashboard-summary-cards">
                        <SummaryCard title="Total Income" value={reportData.total_income} prefix={`${user.currency} `} color="var(--success-color)" />
                        <SummaryCard title="Total Expenses" value={reportData.total_expense} prefix={`${user.currency} `} color="var(--danger-color)" />
                        <SummaryCard title="Net Profit" value={reportData.net_profit} prefix={`${user.currency} `} color={reportData.net_profit >= 0 ? 'var(--primary-color)' : 'var(--danger-color)'} />
                        <SummaryCard title="Occupancy Rate" value={reportData.occupancy_rate} suffix=" %" />
                    </div>
                    <div className="dashboard-widgets">
                        <div className="widget">
                            <h3>Monthly Performance ({selectedYear})</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={reportData.monthly_breakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${user.currency} ${value.toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="Income" fill="var(--success-color)" />
                                    <Bar dataKey="Expense" fill="var(--danger-color)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="widget">
                            <h3>Expense Breakdown</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={reportData.expense_breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {reportData.expense_breakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${user.currency} ${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                        </div>
                    </div>
                </>
            ) : ( <div className="widget"><p>No data available for the selected filters. Please add some payments or expenses.</p></div> )}
        </div>
    );
};

export default Reports;
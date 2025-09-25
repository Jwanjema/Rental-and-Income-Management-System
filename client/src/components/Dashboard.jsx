import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../api.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch dashboard summary:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="page-content"><h1>Loading Dashboard...</h1></div>;
    }

    if (!summary) {
        return <div className="page-content"><h1>Could not load dashboard data.</h1></div>;
    }

    const financialData = [
        { name: 'Rent Summary', Collected: summary.total_collected, Pending: summary.total_pending }
    ];

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>
            <div className="dashboard-summary-cards">
                <div className="summary-card"><h4>Total Properties</h4><h2>{summary.total_properties}</h2></div>
                <div className="summary-card"><h4>Occupied Units</h4><h2>{summary.occupied_units}</h2></div>
                <div className="summary-card"><h4>Vacant Units</h4><h2>{summary.vacant_units}</h2></div>
                <div className="summary-card"><h4>Leases Expiring Soon</h4><h2>{summary.expiring_leases_count}</h2></div>
            </div>

            <div className="dashboard-widgets">
                <div className="widget">
                    <h3>Financial Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={financialData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `Ksh ${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="Collected" fill="var(--success-color)" />
                            <Bar dataKey="Pending" fill="var(--warning-color)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="widget">
                    <h3>Overdue Rents</h3>
                    <ul>
                        {summary.overdue_leases.length > 0 ? summary.overdue_leases.map(lease => (
                            <li key={lease.lease_id}>
                                <span>{lease.tenant_name} (Unit {lease.unit_number})</span>
                                <strong style={{color: 'var(--danger-color)'}}>Ksh {lease.balance.toLocaleString()}</strong>
                            </li>
                        )) : <p>No overdue rents. Great job!</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
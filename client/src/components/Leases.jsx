import React, { useState, useEffect, useContext } from 'react';
import AddFormModal from './AddFormModal.jsx';
import { leasesApi, tenantsApi, unitsApi } from '../api.js';
import { UserContext } from '../context/User.jsx';

const Leases = ({ searchQuery }) => {
    const { user } = useContext(UserContext);
    const [leases, setLeases] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // The enhanced form layout definition
    const fields = [
        { type: 'heading', label: 'Parties & Property' },
        { name: 'tenant_id', label: 'Tenant', type: 'select', validation: { required: true }, className: 'grid-span-2' },
        { name: 'unit_id', label: 'Unit', type: 'select', validation: { required: true }, className: 'grid-span-2' },
        { type: 'heading', label: 'Lease Term' },
        { name: 'start_date', label: 'Start Date', type: 'date', validation: { required: true } },
        { name: 'end_date', label: 'End Date', type: 'date', validation: { required: true } },
        { type: 'heading', label: 'Financials' },
        { name: 'rent_amount', label: 'Rent Amount', type: 'number', placeholder: `e.g., 15000`, validation: { required: true, positive: true }, className: 'grid-span-2' },
    ];

    const fetchData = async () => {
        try {
            const [leasesData, tenantsData, unitsData] = await Promise.all([
                leasesApi.getAll(),
                tenantsApi.getAll(),
                unitsApi.getAll(),
            ]);
            setLeases(leasesData);
            setTenants(tenantsData);
            setUnits(unitsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            if (loading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleFormSubmit = async (formData) => {
        const payload = {
            ...formData,
            tenant_id: parseInt(formData.tenant_id),
            unit_id: parseInt(formData.unit_id),
            rent_amount: parseFloat(formData.rent_amount),
        };
        try {
            if (editingItem) {
                await leasesApi.update(editingItem.id, payload);
            } else {
                await leasesApi.add(payload);
            }
            await fetchData();
        } catch (error) {
            console.error("Failed to save lease:", error);
        } finally {
            handleCloseModal();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This will delete the lease and all its payments.")) {
            try {
                await leasesApi.delete(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete lease:", error);
            }
        }
    };

    const getName = (id, list) => list.find(item => item.id === id)?.name || 'N/A';
    const getUnitInfo = (id) => {
        const unit = units.find(u => u.id === id);
        return unit ? `${unit.unit_number} (${unit.property.name})` : 'N/A';
    };

    const filteredData = leases.filter(item =>
        getName(item.tenant_id, tenants).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getUnitInfo(item.unit_id).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const modalInitialData = editingItem ? {
        ...editingItem,
        start_date: editingItem.start_date?.split('T')[0],
        end_date: editingItem.end_date?.split('T')[0],
    } : {};

    const availableUnitsForModal = units.filter(unit => {
        if (unit.status === 'vacant') return true;
        if (editingItem && unit.id === editingItem.unit_id) return true;
        return false;
    });

    if (loading) return <h1>Loading Leases...</h1>;

    return (
        <div>
            <div className="page-header">
                <div><h1>Leases</h1><p>Manage all lease agreements</p></div>
                <button className="submit-button" onClick={() => handleOpenModal()}>+ Add Lease</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Tenant</th>
                            <th>Unit</th>
                            <th>Rent</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id}>
                                <td>{getName(item.tenant_id, tenants)}</td>
                                <td>{getUnitInfo(item.unit_id)}</td>
                                <td>{user.currency} {item.rent_amount.toLocaleString()}</td>
                                <td>{user.currency} {item.balance.toLocaleString()}</td>
                                <td><span className={`status-badge status-${item.status.replace(/\s+/g, '-').toLowerCase()}`}>{item.status}</span></td>
                                <td className="action-buttons">
                                    <button onClick={() => handleOpenModal(item)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <AddFormModal
                    title={editingItem ? "Edit Lease" : "Add New Lease"}
                    fields={fields}
                    initialData={modalInitialData}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                    selectOptions={{
                        tenant_id: tenants.map(t => ({ value: t.id, label: t.name })),
                        unit_id: availableUnitsForModal.map(u => ({ value: u.id, label: `${u.unit_number} (${u.property.name})` })),
                    }}
                />
            )}
        </div>
    );
};

export default Leases;
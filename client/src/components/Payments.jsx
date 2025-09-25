import React, { useState, useEffect, useContext } from 'react';
import AddFormModal from './AddFormModal.jsx';
import { paymentsApi, leasesApi } from '../api.js';
import { UserContext } from '../context/User.jsx';

const Payments = ({ searchQuery }) => {
    const { user } = useContext(UserContext);
    const [payments, setPayments] = useState([]);
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fields = [
        { name: 'lease_id', label: 'Lease Agreement', type: 'select', validation: { required: true }, className: 'grid-span-2' },
        { name: 'amount', label: 'Amount', type: 'number', placeholder: 'e.g., 15000', validation: { required: true, positive: true } },
        { name: 'date', label: 'Payment Date', type: 'date', validation: { required: true } },
        { name: 'method', label: 'Method', type: 'select', options: [{ value: 'cash', label: 'Cash' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'mpesa', label: 'M-Pesa' }], validation: { required: true }, className: 'grid-span-2' },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paymentsData, leasesData] = await Promise.all([paymentsApi.getAll(), leasesApi.getAll()]);
            setPayments(paymentsData);
            setLeases(leasesData);
        } catch (error) { console.error("Failed to fetch data:", error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenModal = (item = null) => {
        const initialData = item ? { ...item, date: item.date?.split('T')[0] } : {};
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => { setIsModalOpen(false); setEditingItem(null); };

    const handleFormSubmit = async (formData) => {
        const payload = { ...formData, lease_id: parseInt(formData.lease_id), amount: parseFloat(formData.amount) };
        try {
            if (editingItem) { await paymentsApi.update(editingItem.id, payload); }
            else { await paymentsApi.add(payload); }
            fetchData();
        } catch (error) { console.error("Failed to save payment:", error); }
        finally { handleCloseModal(); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            try { await paymentsApi.delete(id); fetchData(); }
            catch (error) { console.error("Failed to delete payment:", error); }
        }
    };
    
    const getLeaseInfo = (leaseId) => { const lease = leases.find(l => l.id === leaseId); return lease ? `${lease.tenant.name} - Unit ${lease.unit.unit_number}` : 'N/A'; };
    const filteredData = payments.filter(item => getLeaseInfo(item.lease_id).toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return <h1>Loading Payments...</h1>;

    return (
        <div>
            <div className="page-header">
                <div><h1>Payments</h1><p>Track all received payments</p></div>
                <button className="submit-button" onClick={() => handleOpenModal()}>+ Add Payment</button>
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Lease Details</th><th>Amount</th><th>Date</th><th>Method</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id}>
                                <td>{getLeaseInfo(item.lease_id)}</td>
                                <td>{user.currency} {item.amount.toLocaleString()}</td>
                                <td>{item.date.split('T')[0]}</td>
                                <td>{item.method}</td>
                                <td className="action-buttons"><button onClick={() => handleOpenModal(item)}>Edit</button><button onClick={() => handleDelete(item.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <AddFormModal
                    title={editingItem ? "Edit Payment" : "Add Payment"}
                    fields={fields}
                    initialData={editingItem || {}}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                    selectOptions={{ lease_id: leases.map(l => ({ value: l.id, label: `${l.tenant.name} (Unit ${l.unit.unit_number})` })) }}
                />
            )}
        </div>
    );
};

export default Payments;
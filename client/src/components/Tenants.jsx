import React, { useState, useEffect } from 'react';
import AddFormModal from './AddFormModal.jsx';
import { tenantsApi } from '../api.js';

const Tenants = ({ searchQuery }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fields = [
        { name: 'name', label: 'Full Name', type: 'text', validation: { required: true, minLength: 3 } },
        { name: 'contact', label: 'Contact (Email or Phone)', type: 'text', validation: { required: true } },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            setData(await tenantsApi.getAll());
        } catch (error) {
            console.error("Failed to fetch tenants:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormSubmit = async (formData) => {
        try {
            if (editingItem) {
                await tenantsApi.update(editingItem.id, formData);
            } else {
                await tenantsApi.add(formData);
            }
            fetchData();
        } catch (error) {
            console.error("Failed to save tenant:", error);
        } finally {
            handleCloseModal();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This will delete associated leases and payments.")) {
            try {
                await tenantsApi.delete(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete tenant:", error);
            }
        }
    };

    const filteredData = data.filter(item =>
        (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.contact?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (loading) return <h1>Loading Tenants...</h1>;

    return (
        <div>
            <div className="page-header">
                <div><h1>Tenants</h1><p>Manage all tenant records</p></div>
                <button className="submit-button" onClick={() => handleOpenModal()}>+ Add Tenant</button>
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Name</th><th>Contact</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.contact}</td>
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
                    title={editingItem ? "Edit Tenant" : "Add Tenant"}
                    fields={fields}
                    initialData={editingItem || {}}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Tenants;
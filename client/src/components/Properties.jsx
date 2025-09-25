import React, { useState, useEffect } from 'react';
import AddFormModal from './AddFormModal.jsx';
import { propertiesApi } from '../api.js';

const Properties = ({ searchQuery }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fields = [
        { name: 'name', label: 'Property Name', type: 'text', validation: { required: true, minLength: 3 } },
        { name: 'address', label: 'Address', type: 'text', validation: { required: true } },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            setData(await propertiesApi.getAll());
        } catch (error) {
            console.error("Failed to fetch properties:", error);
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
                await propertiesApi.update(editingItem.id, formData);
            } else {
                await propertiesApi.add(formData);
            }
            fetchData();
        } catch (error) {
            console.error("Failed to save property:", error);
        } finally {
            handleCloseModal();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This will delete all associated units, leases, and payments.")) {
            try {
                await propertiesApi.delete(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete property:", error);
            }
        }
    };

    const filteredData = data.filter(item =>
        (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.address?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (loading) return <h1>Loading...</h1>;

    return (
        <div>
            <div className="page-header">
                <div><h1>Properties</h1><p>Manage your properties</p></div>
                <button className="submit-button" onClick={() => handleOpenModal()}>+ Add Property</button>
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Name</th><th>Address</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.address}</td>
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
                    title={editingItem ? "Edit Property" : "Add Property"}
                    fields={fields}
                    initialData={editingItem || {}}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Properties;
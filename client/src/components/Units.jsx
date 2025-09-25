import React, { useState, useEffect } from 'react';
import AddFormModal from './AddFormModal.jsx';
import { unitsApi, propertiesApi } from '../api.js';

const Units = ({ searchQuery }) => {
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fields = [
        { name: 'unit_number', label: 'Unit Number', type: 'text', validation: { required: true } },
        { name: 'property_id', label: 'Property', type: 'select', validation: { required: true } },
        { name: 'status', label: 'Status', type: 'select', options: [{ value: 'vacant', label: 'Vacant' }, { value: 'occupied', label: 'Occupied' }], validation: { required: true } },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [unitsData, propertiesData] = await Promise.all([
                unitsApi.getAll(),
                propertiesApi.getAll(),
            ]);
            setUnits(unitsData);
            setProperties(propertiesData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
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
            const payload = { ...formData, property_id: parseInt(formData.property_id, 10) };
            if (editingItem) {
                await unitsApi.update(editingItem.id, payload);
            } else {
                await unitsApi.add(payload);
            }
            fetchData();
        } catch (error) {
            console.error("Failed to save unit:", error);
        } finally {
            handleCloseModal();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this unit?")) {
            try {
                await unitsApi.delete(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete unit:", error);
            }
        }
    };

    const getPropertyName = (propertyId) => properties.find(p => p.id === propertyId)?.name || 'N/A';
    
    const filteredData = units.filter(unit =>
        (unit.unit_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        getPropertyName(unit.property_id).toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <h1>Loading Units...</h1>;

    return (
        <div>
            <div className="page-header">
                <div><h1>Units</h1><p>Manage all individual units</p></div>
                <button className="submit-button" onClick={() => handleOpenModal()}>+ Add Unit</button>
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Unit Number</th><th>Property</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id}>
                                <td>{item.unit_number}</td>
                                <td>{getPropertyName(item.property_id)}</td>
                                <td><span className={`status-badge status-${item.status}`}>{item.status}</span></td>
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
                    title={editingItem ? "Edit Unit" : "Add Unit"}
                    fields={fields}
                    initialData={editingItem || {}}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                    selectOptions={{ property_id: properties.map(p => ({ value: p.id, label: p.name })) }}
                />
            )}
        </div>
    );
};

export default Units;
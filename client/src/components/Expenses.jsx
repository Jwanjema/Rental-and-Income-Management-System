import React, { useState, useEffect, useContext } from 'react';
import AddFormModal from './AddFormModal.jsx';
import { expensesApi, propertiesApi } from '../api.js';
import { UserContext } from '../context/User.jsx';

const Expenses = ({ searchQuery }) => {
    const { user } = useContext(UserContext);
    const [expenses, setExpenses] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fields = [
        { name: 'property_id', label: 'Property', type: 'select', validation: { required: true }, className: 'grid-span-2' },
        { name: 'category', label: 'Category', type: 'select', options: [
            {value: 'Repairs', label: 'Repairs'}, {value: 'Utilities', label: 'Utilities'},
            {value: 'Taxes', label: 'Taxes'}, {value: 'Management', label: 'Management'},
            {value: 'Other', label: 'Other'},
        ], validation: { required: true } },
        { name: 'amount', label: 'Amount', type: 'number', validation: { required: true, positive: true } },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'e.g., Fix leaking sink in Unit 1A', validation: { required: true, minLength: 5 }, className: 'grid-span-2' },
        { name: 'date', label: 'Date of Expense', type: 'date', validation: { required: true }, className: 'grid-span-2' },
    ];
    
    const fetchData = async () => {
        try {
            const [expensesData, propertiesData] = await Promise.all([
                expensesApi.getAll(),
                propertiesApi.getAll(),
            ]);
            setExpenses(expensesData);
            setProperties(propertiesData);
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
            property_id: parseInt(formData.property_id),
            amount: parseFloat(formData.amount),
        };
        try {
            if (editingItem) {
                await expensesApi.update(editingItem.id, payload);
            } else {
                await expensesApi.add(payload);
            }
            await fetchData();
        } catch (error) {
            console.error("Failed to save expense:", error);
        } finally {
            handleCloseModal();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense record?")) {
            try {
                await expensesApi.delete(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete expense:", error);
            }
        }
    };
    
    const getPropertyName = (propertyId) => properties.find(p => p.id === propertyId)?.name || 'N/A';
    
    const filteredData = expenses.filter(item =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getPropertyName(item.property_id).toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const modalInitialData = editingItem ? {
        ...editingItem,
        date: editingItem.date?.split('T')[0],
    } : {};

    if (loading) return <h1>Loading Expenses...</h1>;

    return (
        <div>
            <div className="page-header">
                <div><h1>Expenses</h1><p>Track all property-related expenses</p></div>
                <button className="submit-button" onClick={() => handleOpenModal()}>+ Add Expense</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Property</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(item => (
                            <tr key={item.id}>
                                <td>{item.date.split('T')[0]}</td>
                                <td>{getPropertyName(item.property_id)}</td>
                                <td>{item.category}</td>
                                <td>{item.description}</td>
                                <td>{user.currency} {item.amount.toLocaleString()}</td>
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
                    title={editingItem ? "Edit Expense" : "Add New Expense"}
                    fields={fields}
                    initialData={modalInitialData}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                    selectOptions={{ property_id: properties.map(p => ({ value: p.id, label: p.name })) }}
                />
            )}
        </div>
    );
};

export default Expenses;
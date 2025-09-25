import React, { useState, useEffect } from 'react';
import { getUnits, getProperties, addUnit, updateUnit, deleteUnit } from '../api.js';
import AddFormModal from './AddFormModal.jsx';
import '../app.css';

const Units = ({ searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editingUnit, setEditingUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  const unitFields = [
    { name: 'unit_number', label: 'Unit Number', type: 'text', placeholder: 'e.g., 1A, 2B' },
    { name: 'status', label: 'Status', type: 'select', options: ['vacant', 'occupied'] },
    { name: 'property_id', label: 'Property', type: 'select', options: properties.map(p => ({ value: p.id, label: p.name })) },
  ];

  const refreshData = async () => {
    setLoading(true);
    try {
      const unitsData = await getUnits();
      const propertiesData = await getProperties();
      setUnits(unitsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error("Failed to fetch units and properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenModal = (unit = null) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
  };

  const handleAddOrUpdateUnit = async (newUnit) => {
    try {
      if (editingUnit) {
        await updateUnit(editingUnit.id, newUnit);
      } else {
        await addUnit(newUnit);
      }
      refreshData();
    } catch (error) {
      console.error("Failed to save unit:", error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteUnit = async (id) => {
    try {
      await deleteUnit(id);
      refreshData();
    } catch (error) {
      console.error("Failed to delete unit:", error.message);
    }
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  };

  const filteredUnits = units.filter(unit =>
    unit.unit_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getPropertyName(unit.property_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-content" style={{ padding: '2rem' }}>
        <h1>Loading Units...</h1>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Units</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>Manage rental units</p>
        </div>
        <button onClick={() => handleOpenModal()} style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + Add Unit
        </button>
      </div>

      <div className="table-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Unit Number</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Property</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map(unit => (
              <tr key={unit.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{unit.unit_number}</td>
                <td style={{ padding: '1rem' }}>{unit.status}</td>
                <td style={{ padding: '1rem' }}>{getPropertyName(unit.property_id)}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(unit)} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteUnit(unit.id)} style={{ border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddFormModal
          title={editingUnit ? "Edit Unit" : "Add New Unit"}
          fields={unitFields}
          initialData={editingUnit}
          onSubmit={handleAddOrUpdateUnit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Units;
import React, { useState, useEffect } from 'react';
import AddFormModal from './AddFormModal.jsx';
import { getProperties, addProperty, updateProperty, deleteProperty } from '../api.js'; // Import API functions
import '../app.css';

const Properties = ({ searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the form fields
  const propertyFields = [
    { name: 'name', label: 'Property Name', type: 'text', placeholder: 'Enter property name' },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Enter property address' },
  ];

  // Function to refresh the properties list from the back-end
  const refreshProperties = async () => {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties when the component mounts
  useEffect(() => {
    refreshProperties();
  }, []);

  const handleOpenModal = (property = null) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleAddOrUpdateProperty = async (newProperty) => {
    try {
      if (editingProperty) {
        // Use the update API function
        await updateProperty(editingProperty.id, newProperty);
      } else {
        // Use the add API function
        await addProperty(newProperty);
      }
      refreshProperties(); // Refresh the list after a successful operation
    } catch (error) {
      console.error("Failed to save property:", error);
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await deleteProperty(id);
      refreshProperties(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-content" style={{ padding: '2rem' }}>
        <h1>Loading Properties...</h1>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Properties</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>Manage your rental properties and their details</p>
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
          + Add Property
        </button>
      </div>

      <div className="table-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Address</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map(property => (
              <tr key={property.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{property.name}</td>
                <td style={{ padding: '1rem' }}>{property.address}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(property)} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteProperty(property.id)} style={{ border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddFormModal
          title={editingProperty ? "Edit Property" : "Add New Property"}
          fields={propertyFields}
          initialData={editingProperty}
          onSubmit={handleAddOrUpdateProperty}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Properties;
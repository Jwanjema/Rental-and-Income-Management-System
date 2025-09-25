import React, { useState } from 'react';
import AddFormModal from './AddFormModal.jsx';
import '../app.css';

const Leases = ({ searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leases, setLeases] = useState([
    { id: 1, property: '123 Main St', tenant: 'Alice Smith', rent: 1500, status: 'Active' },
    { id: 2, property: '456 Oak Ave', tenant: 'Bob Johnson', rent: 1200, status: 'Active' },
  ]);
  const [editingLease, setEditingLease] = useState(null);

  const leaseFields = [
    { name: 'property', label: 'Property', type: 'text', placeholder: 'Enter property address' },
    { name: 'tenant', label: 'Tenant', type: 'text', placeholder: 'Enter tenant name' },
    { name: 'rent', label: 'Monthly Rent', type: 'number', placeholder: 'Enter monthly rent' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Expired'] },
  ];

  const handleOpenModal = (lease = null) => {
    setEditingLease(lease);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLease(null);
  };

  const handleAddOrUpdateLease = (newLease) => {
    if (editingLease) {
      setLeases(prevLeases =>
        prevLeases.map(l => (l.id === editingLease.id ? { ...newLease, id: l.id } : l))
      );
    } else {
      setLeases(prevLeases => {
        const newId = Math.max(...prevLeases.map(l => l.id), 0) + 1;
        return [...prevLeases, { ...newLease, id: newId }];
      });
    }
    handleCloseModal();
  };

  const handleDeleteLease = (id) => {
    setLeases(prevLeases => prevLeases.filter(l => l.id !== id));
  };

  const filteredLeases = leases.filter(lease =>
    lease.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lease.tenant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content" style={{ padding: '2rem', backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Leases</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>Track your property leases and their status</p>
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
          + Add Lease
        </button>
      </div>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Property</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Tenant</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Monthly Rent</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeases.map(lease => (
              <tr key={lease.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{lease.property}</td>
                <td style={{ padding: '1rem' }}>{lease.tenant}</td>
                <td style={{ padding: '1rem' }}>Ksh {lease.rent}</td>
                <td style={{ padding: '1rem' }}>{lease.status}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(lease)} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteLease(lease.id)} style={{ border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddFormModal
          title={editingLease ? "Edit Lease" : "Add New Lease"}
          fields={leaseFields}
          initialData={editingLease}
          onSubmit={handleAddOrUpdateLease}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Leases;
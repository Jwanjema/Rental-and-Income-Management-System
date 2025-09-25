import React, { useState } from 'react';
import AddFormModal from './AddFormModal.jsx';
import '../app.css';

const Tenants = ({ searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice.s@example.com', phone: '555-111-2222' },
    { id: 2, name: 'Bob Johnson', email: 'bob.j@example.com', phone: '555-333-4444' },
  ]);
  const [editingTenant, setEditingTenant] = useState(null);

  const tenantFields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter tenant name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter tenant email' },
    { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter tenant phone number' },
  ];

  const handleOpenModal = (tenant = null) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  const handleAddOrUpdateTenant = (newTenant) => {
    if (editingTenant) {
      setTenants(prevTenants =>
        prevTenants.map(t => (t.id === editingTenant.id ? { ...newTenant, id: t.id } : t))
      );
    } else {
      setTenants(prevTenants => {
        const newId = Math.max(...prevTenants.map(t => t.id), 0) + 1;
        return [...prevTenants, { ...newTenant, id: newId }];
      });
    }
    handleCloseModal();
  };

  const handleDeleteTenant = (id) => {
    setTenants(prevTenants => prevTenants.filter(t => t.id !== id));
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content" style={{ padding: '2rem', backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Tenants</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>Manage your tenants and their lease information</p>
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
          + Add Tenant
        </button>
      </div>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Phone</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map(tenant => (
              <tr key={tenant.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{tenant.name}</td>
                <td style={{ padding: '1rem' }}>{tenant.email}</td>
                <td style={{ padding: '1rem' }}>{tenant.phone}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(tenant)} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteTenant(tenant.id)} style={{ border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddFormModal
          title={editingTenant ? "Edit Tenant" : "Add New Tenant"}
          fields={tenantFields}
          initialData={editingTenant}
          onSubmit={handleAddOrUpdateTenant}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Tenants;
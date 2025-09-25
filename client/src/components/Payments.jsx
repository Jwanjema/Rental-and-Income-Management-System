import React, { useState } from 'react';
import AddFormModal from './AddFormModal.jsx';
import '../app.css';

const Payments = ({ searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState([
    { id: 1, property: '123 Main St', tenant: 'Alice Smith', amount: 1500, date: '2025-09-24', status: 'Paid' },
    { id: 2, property: '789 Pine Ln', tenant: 'Jane Doe', amount: 1800, date: '2025-09-24', status: 'Pending' },
  ]);
  const [editingPayment, setEditingPayment] = useState(null);

  const paymentFields = [
    { name: 'property', label: 'Property', type: 'text', placeholder: 'Enter property address' },
    { name: 'tenant', label: 'Tenant', type: 'text', placeholder: 'Enter tenant name' },
    { name: 'amount', label: 'Amount', type: 'number', placeholder: 'Enter payment amount' },
    { name: 'date', label: 'Date', type: 'text', placeholder: 'YYYY-MM-DD' },
    { name: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending', 'Overdue'] },
  ];

  const handleOpenModal = (payment = null) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
  };

  const handleAddOrUpdatePayment = (newPayment) => {
    if (editingPayment) {
      setPayments(prevPayments =>
        prevPayments.map(p => (p.id === editingPayment.id ? { ...newPayment, id: p.id } : p))
      );
    } else {
      setPayments(prevPayments => {
        const newId = Math.max(...prevPayments.map(p => p.id), 0) + 1;
        return [...prevPayments, { ...newPayment, id: newId }];
      });
    }
    handleCloseModal();
  };

  const handleDeletePayment = (id) => {
    setPayments(prevPayments => prevPayments.filter(p => p.id !== id));
  };

  const filteredPayments = payments.filter(payment =>
    payment.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.tenant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content" style={{ padding: '2rem', backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Payments</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>Manage your incoming rental payments</p>
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
          + Add Payment
        </button>
      </div>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Property</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Tenant</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Amount</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#000408ff', fontWeight: 'normal' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#6c757d', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{payment.property}</td>
                <td style={{ padding: '1rem' }}>{payment.tenant}</td>
                <td style={{ padding: '1rem' }}>Ksh {payment.amount}</td>
                <td style={{ padding: '1rem' }}>{payment.date}</td>
                <td style={{ padding: '1rem' }}>{payment.status}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(payment)} style={{ border: 'none', background: 'none', color: '#010a14ff', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeletePayment(payment.id)} style={{ border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddFormModal
          title={editingPayment ? "Edit Payment" : "Add New Payment"}
          fields={paymentFields}
          initialData={editingPayment}
          onSubmit={handleAddOrUpdatePayment}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Payments;
import React, { useState } from 'react';
import AddFormModal from './AddFormModal.jsx';
import '../app.css';

const Agents = ({ searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agents, setAgents] = useState([
    { id: 1, name: 'Mary W.', email: 'mary.w@example.com', phone: '555-123-4567', propertiesManaged: 2 },
    { id: 2, name: 'James K.', email: 'james.k@example.com', phone: '555-987-6543', propertiesManaged: 1 },
  ]);
  const [editingAgent, setEditingAgent] = useState(null);

  const agentFields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter agent name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter agent email' },
    { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter agent phone number' },
  ];

  const handleOpenModal = (agent = null) => {
    setEditingAgent(agent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAgent(null);
  };

  const handleAddOrUpdateAgent = (newAgent) => {
    if (editingAgent) {
      setAgents(prevAgents =>
        prevAgents.map(a => (a.id === editingAgent.id ? { ...newAgent, id: a.id } : a))
      );
    } else {
      setAgents(prevAgents => {
        const newId = Math.max(...prevAgents.map(a => a.id), 0) + 1;
        return [...prevAgents, { ...newAgent, id: newId }];
      });
    }
    handleCloseModal();
  };

  const handleDeleteAgent = (id) => {
    setAgents(prevAgents => prevAgents.filter(a => a.id !== id));
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content" style={{ padding: '2rem', backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Agents</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#6c757d' }}>Manage your agents and their assigned properties</p>
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
          + Add Agent
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
            {filteredAgents.map(agent => (
              <tr key={agent.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '1rem' }}>{agent.name}</td>
                <td style={{ padding: '1rem' }}>{agent.email}</td>
                <td style={{ padding: '1rem' }}>{agent.phone}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(agent)} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteAgent(agent.id)} style={{ border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddFormModal
          title={editingAgent ? "Edit Agent" : "Add New Agent"}
          fields={agentFields}
          initialData={editingAgent}
          onSubmit={handleAddOrUpdateAgent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Agents;
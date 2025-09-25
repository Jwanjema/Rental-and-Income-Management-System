import React, { useState, useEffect } from 'react';
import '../app.css';

const AddFormModal = ({ title, fields, initialData, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            const initial = {};
            fields.forEach(field => {
                initial[field.name] = '';
            });
            setFormData(initial);
        }
    }, [initialData, fields]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderInput = (field) => {
        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required
                    />
                );
            case 'select':
                return (
                    <select
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select a {field.label} --</option>
                        {field.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {fields.map(field => (
                        <div key={field.name} className="form-group">
                            <label>{field.label}</label>
                            {renderInput(field)}
                        </div>
                    ))}
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                        <button type="submit" className="submit-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFormModal;
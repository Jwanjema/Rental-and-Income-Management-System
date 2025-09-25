import React, { useState, useEffect } from 'react';

const AddFormModal = ({ title, fields, initialData = {}, onSubmit, onClose, selectOptions = {} }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [leaseDuration, setLeaseDuration] = useState('');

    useEffect(() => {
        const initialFormState = {};
        fields.forEach(field => {
            if (field.type !== 'heading') { initialFormState[field.name] = initialData[field.name] || ''; }
        });
        setFormData(initialFormState);
    }, [fields, initialData]);

    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            if (end > start) {
                let months = (end.getFullYear() - start.getFullYear()) * 12;
                months -= start.getMonth(); months += end.getMonth();
                const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
                setLeaseDuration(`${months} months (${days} days)`);
            } else { setLeaseDuration('End date must be after start date'); }
        } else { setLeaseDuration(''); }
    }, [formData.start_date, formData.end_date]);

    const validate = (currentFormData) => {
        const newErrors = {};
        fields.forEach(field => {
            if (field.validation) {
                const value = currentFormData[field.name]; const rules = field.validation;
                if (rules.required && !value) newErrors[field.name] = `${field.label} is required.`;
                else if (rules.minLength && value && String(value).length < rules.minLength) newErrors[field.name] = `${field.label} must be at least ${rules.minLength} characters.`;
                else if (field.type === 'number' && value && isNaN(Number(value))) newErrors[field.name] = `${field.label} must be a number.`;
                else if (rules.positive && Number(value) <= 0) newErrors[field.name] = `${field.label} must be a positive number.`;
            }
        });
        return newErrors;
    };
    
    useEffect(() => { setErrors(validate(formData)); }, [formData]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalErrors = validate(formData);
        if (Object.keys(finalErrors).length === 0) onSubmit(formData);
        else setErrors(finalErrors);
    };
    
    const renderField = (field) => {
        switch (field.type) {
            case 'heading': return <h3 className="form-heading">{field.label}</h3>;
            case 'select':
                const options = field.options || selectOptions[field.name] || [];
                return (<select name={field.name} value={formData[field.name] || ''} onChange={handleChange}><option value="">-- Select {field.label} --</option>{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>);
            case 'date': return <input type="date" name={field.name} value={formData[field.name] || ''} onChange={handleChange} />;
            case 'textarea': return <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} placeholder={field.placeholder} />;
            default: return <input type={field.type || 'text'} name={field.name} value={formData[field.name] || ''} onChange={handleChange} placeholder={field.placeholder} />;
        }
    };

    const isFormValid = Object.keys(errors).length === 0;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header"><h2>{title}</h2><button className="close-button" onClick={onClose}>&times;</button></div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-body">
                        <div className="form-grid">
                            {fields.map((field) => (
                                field.type === 'heading' ? renderField(field) :
                                <div key={field.name} className={`form-group ${field.className || ''}`}>
                                    <label>{field.label}</label>
                                    {renderField(field)}
                                    {errors[field.name] && <div className="form-error">{errors[field.name]}</div>}
                                </div>
                            ))}
                             {leaseDuration && <div className="form-info-display">Lease Duration: {leaseDuration}</div>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-button" disabled={!isFormValid}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFormModal;
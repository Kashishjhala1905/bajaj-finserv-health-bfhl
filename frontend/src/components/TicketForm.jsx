import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const TicketForm = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!formData.subject.trim()) {
      tempErrors.subject = 'Subject is required';
    }
    if (!formData.description.trim()) {
      tempErrors.description = 'Description is required';
    }
    if (!formData.customerEmail.trim()) {
      tempErrors.customerEmail = 'Customer email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail)) {
        tempErrors.customerEmail = 'Please enter a valid email address';
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error dynamically as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const success = await onCreate(formData);
      if (success) {
        setFormData({
          subject: '',
          description: '',
          customerEmail: '',
          priority: 'medium'
        });
        onClose();
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Ticket</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="customerEmail">Customer Email</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className={`form-control ${errors.customerEmail ? 'is-invalid' : ''}`}
                placeholder="customer@company.com"
                disabled={submitting}
              />
              {errors.customerEmail && (
                <span className="invalid-feedback">
                  <AlertCircle size={12} /> {errors.customerEmail}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                placeholder="Brief summary of the issue"
                disabled={submitting}
              />
              {errors.subject && (
                <span className="invalid-feedback">
                  <AlertCircle size={12} /> {errors.subject}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Detailed context about the technical problem..."
                disabled={submitting}
              />
              {errors.description && (
                <span className="invalid-feedback">
                  <AlertCircle size={12} /> {errors.description}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="priority">Initial Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-control"
                disabled={submitting}
              >
                <option value="low">Low (72 hr SLA)</option>
                <option value="medium">Medium (24 hr SLA)</option>
                <option value="high">High (4 hr SLA)</option>
                <option value="urgent">Urgent (1 hr SLA)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;

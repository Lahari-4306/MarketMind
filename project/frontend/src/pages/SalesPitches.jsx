import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, AlertCircle } from 'lucide-react';
import { salesPitchService } from '../services/api';
import { validateInput } from '../services/domainGuard';

export default function SalesPitches() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    customer_type: ''
  });

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await salesPitchService.getAll();
      setPitches(response.data);
    } catch (err) {
      setError('Failed to load sales pitches');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const validation = validateInput(`${formData.product} ${formData.customer_type}`);
    if (!validation.valid) {
      setError(validation.message);
      setSubmitting(false);
      return;
    }

    try {
      const response = await salesPitchService.create(formData);
      setPitches(prev => [response.data, ...prev]);
      setFormData({ product: '', customer_type: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create sales pitch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sales pitch?')) return;
    try {
      await salesPitchService.delete(id);
      setPitches(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete sales pitch');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h2 style={{ marginBottom: 'var(--spacing-xs)' }}>Sales Pitch Generator</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create compelling sales pitches with AI</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          New Pitch
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div className="glass-card card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Create New Sales Pitch</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label className="form-label">Product *</label>
                <input
                  type="text"
                  name="product"
                  className="form-input"
                  placeholder="e.g., Enterprise CRM Platform"
                  value={formData.product}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Customer Type *</label>
                <select
                  name="customer_type"
                  className="form-input form-select"
                  value={formData.customer_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Customer Type</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Small Business">Small Business</option>
                  <option value="Startup">Startup</option>
                  <option value="SMB">SMB</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="Consumer">Consumer</option>
                  <option value="Government">Government</option>
                  <option value="Non-Profit">Non-Profit</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Generating...' : 'Generate Pitch'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {pitches.length === 0 ? (
        <div className="glass-card card empty-state">
          <MessageSquare size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">No sales pitches yet</h3>
          <p className="empty-state-text">Create your first AI-powered sales pitch</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Create Pitch
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {pitches.map((pitch) => (
            <div key={pitch.id} className="glass-card card result-card">
              <div className="result-meta">
                <div>
                  <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{pitch.product}</h4>
                  <span className="badge badge-primary">{pitch.customer_type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                    {new Date(pitch.created_at).toLocaleDateString()}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pitch.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="result-content">{pitch.generated_content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

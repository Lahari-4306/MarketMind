import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Trash2, AlertCircle, Briefcase } from 'lucide-react';
import { businessInsightService } from '../services/api';
import { validateInput } from '../services/domainGuard';

export default function BusinessInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    business_description: ''
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await businessInsightService.getAll();
      setInsights(response.data);
    } catch (err) {
      setError('Failed to load business insights');
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

    const validation = validateInput(formData.business_description, 'business_insights');
    if (!validation.valid) {
      setError(validation.message);
      setSubmitting(false);
      return;
    }

    try {
      const response = await businessInsightService.create(formData);
      setInsights(prev => [response.data, ...prev]);
      setFormData({ business_description: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate insights');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this insight?')) return;
    try {
      await businessInsightService.delete(id);
      setInsights(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setError('Failed to delete insight');
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
          <h2 style={{ marginBottom: 'var(--spacing-xs)' }}>Business Insights</h2>
          <p style={{ color: 'var(--text-secondary)' }}>AI-powered strategic business analysis</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          New Insight
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
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Generate Business Insights</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Business Description *</label>
              <textarea
                name="business_description"
                className="form-input form-textarea"
                placeholder="Describe your business (e.g., 'B2B SaaS platform for project management targeting small and medium enterprises')"
                value={formData.business_description}
                onChange={handleChange}
                required
                rows={4}
              />
              <p className="form-hint">Provide details about your business model, target market, and key challenges</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Analyzing...' : 'Generate Insights'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {insights.length === 0 ? (
        <div className="glass-card card empty-state">
          <Briefcase size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">No insights generated yet</h3>
          <p className="empty-state-text">Get AI-powered strategic insights for your business</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Generate Insight
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {insights.map((insight) => (
            <div key={insight.id} className="glass-card card result-card">
              <div className="result-meta">
                <div>
                  <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>Business Insight</h4>
                  <span className="badge badge-success">Strategic Analysis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                    {new Date(insight.created_at).toLocaleDateString()}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(insight.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
                <strong>Input:</strong> {insight.business_description}
              </div>
              <div className="result-content">{insight.generated_content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

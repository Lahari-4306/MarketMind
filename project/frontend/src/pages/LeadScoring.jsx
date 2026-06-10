import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, AlertCircle, Gauge } from 'lucide-react';
import { leadScoreService } from '../services/api';
import { validateInput } from '../services/domainGuard';

export default function LeadScoring() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company_size: '',
    industry: '',
    budget: '',
    engagement_level: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await leadScoreService.getAll();
      setLeads(response.data);
    } catch (err) {
      setError('Failed to load leads');
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

    const validation = validateInput(`${formData.industry} ${formData.company_size}`);
    if (!validation.valid) {
      setError(validation.message);
      setSubmitting(false);
      return;
    }

    try {
      const response = await leadScoreService.create(formData);
      setLeads(prev => [response.data, ...prev]);
      setFormData({ company_size: '', industry: '', budget: '', engagement_level: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to score lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadScoreService.delete(id);
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      setError('Failed to delete lead');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'var(--success-500)';
    if (score >= 50) return 'var(--warning-500)';
    return 'var(--error-500)';
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'High') return 'badge-success';
    if (priority === 'Medium') return 'badge-warning';
    return 'badge-error';
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
          <h2 style={{ marginBottom: 'var(--spacing-xs)' }}>Lead Scoring</h2>
          <p style={{ color: 'var(--text-secondary)' }}>AI-powered lead qualification and scoring</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          Score New Lead
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
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Score New Lead</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label className="form-label">Company Size *</label>
                <select
                  name="company_size"
                  className="form-input form-select"
                  value={formData.company_size}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Industry *</label>
                <select
                  name="industry"
                  className="form-input form-select"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Consulting">Consulting</option>
                  <option value="SaaS">SaaS</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Budget *</label>
                <select
                  name="budget"
                  className="form-input form-select"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Budget</option>
                  <option value="Low">Low (&lt;$10k)</option>
                  <option value="Medium">Medium ($10k - $50k)</option>
                  <option value="High">High ($50k - $100k)</option>
                  <option value="Enterprise">Enterprise ($100k+)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Engagement Level *</label>
                <select
                  name="engagement_level"
                  className="form-input form-select"
                  value={formData.engagement_level}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="Low">Low - Minimal interaction</option>
                  <option value="Medium">Medium - Some interest shown</option>
                  <option value="High">High - Active engagement</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Scoring...' : 'Score Lead'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {leads.length === 0 ? (
        <div className="glass-card card empty-state">
          <Target size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">No leads scored yet</h3>
          <p className="empty-state-text">Start by scoring your first lead</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Score Lead
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {leads.map((lead) => (
            <div key={lead.id} className="glass-card card result-card">
              <div className="result-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Gauge size={24} style={{ color: getScoreColor(lead.score) }} />
                    <span className="result-score" style={{ color: getScoreColor(lead.score) }}>
                      {lead.score?.toFixed(0) || 0}
                    </span>
                  </div>
                  <span className={`badge ${getPriorityBadge(lead.priority)}`}>
                    {lead.priority} Priority
                  </span>
                  <span className="badge badge-primary">{lead.industry}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(lead.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
                <span><strong>Company Size:</strong> {lead.company_size}</span>
                <span><strong>Budget:</strong> {lead.budget}</span>
                <span><strong>Engagement:</strong> {lead.engagement_level}</span>
              </div>
              <div className="result-content">{lead.generated_content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

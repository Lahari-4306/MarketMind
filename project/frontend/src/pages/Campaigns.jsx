import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, FileText, AlertCircle } from 'lucide-react';
import { campaignService } from '../services/api';
import { validateInput } from '../services/domainGuard';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    industry: '',
    target_audience: '',
    campaign_goal: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignService.getAll();
      setCampaigns(response.data);
    } catch (err) {
      setError('Failed to load campaigns');
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

    const validation = validateInput(`${formData.industry} ${formData.product_name} ${formData.target_audience}`, 'campaign');
    if (!validation.valid) {
      setError(validation.message);
      setSubmitting(false);
      return;
    }

    try {
      const response = await campaignService.create(formData);
      setCampaigns(prev => [response.data, ...prev]);
      setFormData({ product_name: '', industry: '', target_audience: '', campaign_goal: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await campaignService.delete(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete campaign');
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
          <h2 style={{ marginBottom: 'var(--spacing-xs)' }}>Campaign Generator</h2>
          <p style={{ color: 'var(--text-secondary)' }}>AI-powered marketing campaign creation</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          New Campaign
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
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Create New Campaign</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="product_name"
                  className="form-input"
                  placeholder="e.g., CRM Pro Software"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
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
                <label className="form-label">Target Audience *</label>
                <input
                  type="text"
                  name="target_audience"
                  className="form-input"
                  placeholder="e.g., Small business owners aged 25-45"
                  value={formData.target_audience}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Campaign Goal *</label>
                <select
                  name="campaign_goal"
                  className="form-input form-select"
                  value={formData.campaign_goal}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Goal</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Sales Conversion">Sales Conversion</option>
                  <option value="Customer Retention">Customer Retention</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Market Expansion">Market Expansion</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Generating...' : 'Generate Campaign'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="glass-card card empty-state">
          <Megaphone size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">No campaigns yet</h3>
          <p className="empty-state-text">Create your first AI-powered marketing campaign</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Create Campaign
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="glass-card card result-card">
              <div className="result-meta">
                <div>
                  <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{campaign.product_name}</h4>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <span className="badge badge-primary">{campaign.industry}</span>
                    <span className="badge badge-success">{campaign.campaign_goal}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="result-content">{campaign.generated_content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

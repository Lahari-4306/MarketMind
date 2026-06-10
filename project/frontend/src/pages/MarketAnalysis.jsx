import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, Trash2, AlertCircle, Globe } from 'lucide-react';
import { marketAnalysisService } from '../services/api';
import { validateInput } from '../services/domainGuard';

export default function MarketAnalysis() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    industry: ''
  });

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await marketAnalysisService.getAll();
      setAnalyses(response.data);
    } catch (err) {
      setError('Failed to load market analyses');
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

    const validation = validateInput(formData.industry, 'market_analysis');
    if (!validation.valid) {
      setError(validation.message);
      setSubmitting(false);
      return;
    }

    try {
      const response = await marketAnalysisService.create(formData);
      setAnalyses(prev => [response.data, ...prev]);
      setFormData({ industry: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze market');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    try {
      await marketAnalysisService.delete(id);
      setAnalyses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError('Failed to delete analysis');
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
          <h2 style={{ marginBottom: 'var(--spacing-xs)' }}>Market Analysis</h2>
          <p style={{ color: 'var(--text-secondary)' }}>AI-powered industry and market insights</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          New Analysis
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
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Analyze Market</h3>
          <form onSubmit={handleSubmit}>
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
                <option value="FinTech">FinTech</option>
                <option value="EdTech">EdTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="CleanTech">CleanTech</option>
                <option value="AgTech">AgTech</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Analyzing...' : 'Generate Analysis'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {analyses.length === 0 ? (
        <div className="glass-card card empty-state">
          <Globe size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">No market analyses yet</h3>
          <p className="empty-state-text">Generate your first market analysis</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Analyze Market
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {analyses.map((analysis) => (
            <div key={analysis.id} className="glass-card card result-card">
              <div className="result-meta">
                <div>
                  <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{analysis.industry} Market</h4>
                  <span className="badge badge-primary">Market Analysis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(analysis.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="result-content">{analysis.generated_content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Megaphone, MessageSquare, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import KPICard from '../components/KPICard';
import { dashboardService } from '../services/api';

const COLORS = ['#0066ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>{error}</p>
      </div>
    );
  }

  const leadPriorityData = stats?.leads_by_priority
    ? Object.entries(stats.leads_by_priority).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }))
    : [];

  const industryData = stats?.campaigns_by_industry
    ? Object.entries(stats.campaigns_by_industry).map(([name, value]) => ({
        name,
        campaigns: value
      }))
    : [];

  return (
    <div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <KPICard title="Total Campaigns" value={stats?.total_campaigns || 0} icon={Megaphone} color="blue" />
        <KPICard title="Sales Pitches" value={stats?.total_pitches || 0} icon={MessageSquare} color="green" />
        <KPICard title="Leads Processed" value={stats?.total_leads || 0} icon={Target} color="orange" />
        <KPICard title="Insights Generated" value={stats?.total_insights || 0} icon={Lightbulb} color="purple" />
      </div>

      <div className="dashboard-grid">

        {/* LEAD PRIORITY PIE CHART */}
        <div className="glass-card dashboard-card">
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Lead Priority Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadPriorityData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INDUSTRY BAR CHART */}
        <div className="glass-card dashboard-card">
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Campaigns by Industry</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData.length ? industryData : [{ name: 'No Data', campaigns: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="campaigns" fill="#0066ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="glass-card dashboard-card">
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Actions</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <Link to="/campaigns" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Generate New Campaign</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/sales-pitches" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Create Sales Pitch</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/lead-scoring" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Score New Lead</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/market-analysis" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Analyze Market</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY */}
      {stats?.recent_activity?.length > 0 && (
        <div className="glass-card card" style={{ marginTop: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Recent Activity</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {stats.recent_activity.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: index !== stats.recent_activity.length - 1
                    ? '1px solid var(--border-color)'
                    : 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={`badge badge-${item.type === 'campaign' ? 'primary' : 'success'}`}>
                    {item.type}
                  </span>
                  <span>{item.name}</span>
                </div>

                <span style={{ fontSize: '12px', color: 'gray' }}>
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
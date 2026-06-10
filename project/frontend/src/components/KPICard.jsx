import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  change,
  changeType = 'positive'
}) {
  return (
    <div className="glass-card kpi-card">
      <div className={`kpi-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="kpi-content">
        <div className="kpi-label">{title}</div>
        <div className="kpi-value">{value}</div>
        {change && (
          <div className={`kpi-change ${changeType}`}>
            {changeType === 'positive' ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}

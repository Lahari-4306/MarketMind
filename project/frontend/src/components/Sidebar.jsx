import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Target,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  Sun,
  Moon,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/campaigns', label: 'Campaign Generator', icon: Megaphone },
  { path: '/sales-pitches', label: 'Sales Pitch', icon: MessageSquare },
  { path: '/lead-scoring', label: 'Lead Scoring', icon: Target },
  { path: '/market-analysis', label: 'Market Analysis', icon: BarChart3 },
  { path: '/business-insights', label: 'Business Insights', icon: Lightbulb },
  { path: '/profile', label: 'Settings', icon: Settings },
];

export default function Sidebar({ darkMode, onToggleTheme, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <TrendingUp size={24} />
        </div>
        <span className="sidebar-logo-text">MarketMind</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Main Menu</div>
          {navItems.slice(0, 6).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Account</div>
          {navItems.slice(6).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="theme-toggle">
        <button className="theme-toggle-btn" onClick={onToggleTheme}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-footer-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

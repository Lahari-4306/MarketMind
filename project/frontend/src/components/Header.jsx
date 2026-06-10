import React, { useState } from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onMenuClick, pageTitle }) {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const userInitials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        <div className="header-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </div>

        <div className="header-icon-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </div>

        <div className="user-menu">
          <div className="user-avatar">{userInitials}</div>
          <div className="user-info">
            <span className="user-name">{user?.full_name || 'User'}</span>
            <span className="user-role">{user?.role || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

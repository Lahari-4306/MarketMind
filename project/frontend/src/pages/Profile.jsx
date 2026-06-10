import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [error, setError] = useState('');

  const userInitials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="glass-card card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 700
          }}>
            {userInitials}
          </div>
          <div>
            <h2>{user?.full_name || 'User'}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <User size={20} style={{ color: 'var(--primary-500)' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Full Name</div>
              <div style={{ fontWeight: 500 }}>{user?.full_name || 'Not set'}</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Mail size={20} style={{ color: 'var(--primary-500)' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Email</div>
              <div style={{ fontWeight: 500 }}>{user?.email}</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Shield size={20} style={{ color: 'var(--primary-500)' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Role</div>
              <div style={{ fontWeight: 500 }}>
                <span className={`badge ${user?.role === 'admin' ? 'badge-success' : 'badge-primary'}`}>
                  {user?.role || 'User'}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Calendar size={20} style={{ color: 'var(--primary-500)' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Member Since</div>
              <div style={{ fontWeight: 500 }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <button className="btn btn-danger" style={{ width: '100%' }} onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

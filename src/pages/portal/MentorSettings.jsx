import React from 'react';
import SEO from '../../components/SEO/SEO';
import { Bell, Palette } from 'lucide-react';

export default function MentorSettings() {
  return (
    <>
      <SEO title="Mentor Settings | Taksha Nexus Workspace" />
      <div style={{ padding: 'var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 'var(--space-2)' }}>Settings</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Configure your workspace preferences.</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Notifications Card */}
          <div style={{ background: 'var(--color-surface)', border: '4px solid var(--color-ink)', padding: 'var(--space-6)', boxShadow: '8px 8px 0 0 var(--color-ink)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Bell size={20} /> Notification Preferences
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontWeight: 800, cursor: 'pointer', marginBottom: 'var(--space-3)' }}>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-ink)' }} />
              Email me when a new application is submitted
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontWeight: 800, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-ink)' }} />
              Email me when an intern submits a task
            </label>
          </div>

          {/* Theme Card */}
          <div style={{ background: 'var(--color-surface)', border: '4px solid var(--color-ink)', padding: 'var(--space-6)', boxShadow: '8px 8px 0 0 var(--color-ink)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Palette size={20} /> Workspace Theme
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>The Neo-Brutalist theme is currently locked for all users.</p>
            <button disabled style={{ padding: '8px 16px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)', fontWeight: 800, opacity: 0.5 }}>
              Default Theme Active
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

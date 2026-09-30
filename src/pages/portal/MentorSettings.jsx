import React from 'react';
import SEO from '../../components/SEO/SEO';
import { Palette } from 'lucide-react';
import PasswordSettings from '../../components/PasswordSettings';
import NotificationSettings from '../../components/NotificationSettings';
import { useTheme } from '../../context/ThemeProvider';
import './InternSettings.css';
import './InternLeave.css';

export default function MentorSettings() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <SEO title="Mentor Settings | Taksha Nexus Workspace" />
      <div style={{ padding: 'var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 'var(--space-2)' }}>Settings</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Configure your workspace preferences.</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <NotificationSettings />
          <PasswordSettings />

          {/* Theme Card */}
          <div style={{ background: 'var(--color-surface)', border: '4px solid var(--color-ink)', padding: 'var(--space-6)', boxShadow: '8px 8px 0 0 var(--color-ink)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Palette size={20} /> Workspace Theme
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Choose the appearance of your workspace.</p>
            <button onClick={toggleTheme} style={{ padding: '8px 16px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)', fontWeight: 800, opacity: 0.5 }}>
              Switch to {theme === 'dark' ? 'light' : 'dark'} theme
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

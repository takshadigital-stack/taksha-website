import React from 'react';
import PasswordSettings from '../../components/PasswordSettings';
import NotificationSettings from '../../components/NotificationSettings';
import './InternLeave.css';
import SEO from '../../components/SEO/SEO';
import './InternSettings.css';

export default function InternSettings() {

  
  return (
    <>
      <SEO title="Settings | Taksha Nexus Workspace" />
      <div className="intern-settings">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Settings</h1>
            <p className="intern-tasks__subtitle">Manage your account preferences and notifications.</p>
          </div>
        </header>

        <NotificationSettings />
        <PasswordSettings />
      </div>
    </>
  );
}

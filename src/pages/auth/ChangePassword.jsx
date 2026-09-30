import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tempToken = location.state?.tempToken;
  const email = location.state?.email;

  if (!tempToken) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      setError('Password must contain 8–72 characters');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      await loginWithToken(data.token, data.user);
      const portal = data.user.role === 'SUPER_ADMIN' ? 'superadmin' : data.user.role === 'MENTOR' ? 'mentor' : 'intern';
      navigate(`/${portal}/dashboard`, { replace: true });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Taksha Nexus Workspace | Change Password" />
      <div className="auth-card" style={{ padding: 0 }}>
        <div className="auth-banner" style={{ background: 'var(--color-card-blue)' }}>
          ACCOUNT ACTIVATION
        </div>

        <div style={{ padding: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            Welcome to Taksha Nexus, <strong>{email}</strong>.<br/>Please set your permanent password to continue.
          </p>

          {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800, textAlign: 'center' }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__group">
              <label className="auth-form__label" htmlFor="newPassword">NEW PASSWORD</label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password" minLength={8} maxLength={72}
                className="auth-form__input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-form__group" style={{ marginTop: 'var(--space-4)' }}>
              <label className="auth-form__label" htmlFor="confirmPassword">CONFIRM PASSWORD</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password" minLength={8} maxLength={72}
                className="auth-form__input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-form__submit"
              disabled={isLoading}
              style={{ marginTop: 'var(--space-8)' }}
            >
              {isLoading ? 'SAVING...' : 'ACTIVATE ACCOUNT'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

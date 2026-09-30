import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      if (result.role === 'MENTOR') {
        navigate('/mentor/dashboard');
      } else if (result.role === 'SUPER_ADMIN') {
        navigate('/superadmin/dashboard');
      } else {
        navigate('/intern/dashboard');
      }
    } else if (result.requirePasswordChange) {
      navigate('/change-password', { state: { tempToken: result.tempToken, email: result.email } });
    } else {
      setError(result.error || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Taksha Workspace | Login" />
      <div className="auth-card" style={{ padding: 0 }}>
        <div className="auth-banner">AUTHORIZED PERSONNEL ONLY</div>

        <div style={{ padding: 'var(--space-8)' }}>
          {error && (
            <div style={{ color: '#e5484d', marginBottom: 'var(--space-4)', fontWeight: 800, textAlign: 'center' }}>
              {error}
            </div>
          )}
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-form__group">
              <label className="auth-form__label" htmlFor="email">EMAIL</label>
              <input
                id="email"
                autoComplete="username"
                type="email"
                className="auth-form__input"
                placeholder="you@taksha.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form__group" style={{ marginTop: 'var(--space-4)' }}>
              <label className="auth-form__label" htmlFor="password">PASSWORD</label>
              <input
                id="password"
                autoComplete="current-password"
                type="password"
                className="auth-form__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-form__submit"
              disabled={isLoading}
              style={{ marginTop: 'var(--space-8)' }}
            >
              {isLoading ? '...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
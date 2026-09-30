import { useState } from 'react';
import axios from 'axios';
export default function PasswordSettings() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const submit = async event => {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setError(''); setNotice('');
    if (values.newPassword !== values.confirmPassword) { setError('Passwords do not match'); return; }
    setBusy(true);
    try { await axios.post((import.meta.env.VITE_API_URL || '/api') + '/auth/update-password', values); form.reset(); setNotice('Password updated.'); }
    catch (err) { setError(err.response?.data?.error || 'Unable to update password. Please try again.'); }
    finally { setBusy(false); }
  };
  return <section className="settings-section">
    <h2 className="settings-section-title">Change Password</h2>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    <form onSubmit={submit}>
      <div className="leave-form-group"><label htmlFor="current-password" className="leave-label">Current Password</label><input id="current-password" name="currentPassword" type="password" autoComplete="current-password" className="leave-input" required /></div>
      <div className="leave-form-group"><label htmlFor="new-password" className="leave-label">New Password</label><input id="new-password" name="newPassword" type="password" autoComplete="new-password" minLength={8} maxLength={72} className="leave-input" required /></div>
      <div className="leave-form-group"><label htmlFor="confirm-password" className="leave-label">Confirm Password</label><input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={72} className="leave-input" required /></div>
      <button type="submit" disabled={busy} className="leave-submit">{busy ? 'Updating...' : 'Update Password'}</button>
    </form>
  </section>;
}

import { useEffect, useState } from 'react';
import axios from 'axios';
export default function NotificationSettings() {
  const [values, setValues] = useState({ emailNotifications: true, taskNotifications: true });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const url = (import.meta.env.VITE_API_URL || '/api') + '/users/preferences';
  useEffect(() => {
    let active = true;
    axios.get(url).then(res => { if (active) setValues(previous => ({ ...previous, ...res.data })); })
      .catch(() => { if (active) setError('Unable to load notification preferences.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [url]);
  const save = async event => {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try { await axios.put(url, values); setNotice('Preferences saved.'); }
    catch (err) { setError(err.response?.data?.error || 'Unable to save preferences.'); }
    finally { setBusy(false); }
  };
  return <section className="settings-section"><h2 className="settings-section-title">Notifications</h2>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    <form onSubmit={save}>
      <label className="settings-toggle"><span>Email Notifications</span><input type="checkbox" checked={values.emailNotifications} disabled={loading || busy} onChange={e => setValues(previous => ({ ...previous, emailNotifications: e.target.checked }))} /></label>
      <label className="settings-toggle"><span>Task Assignment Alerts</span><input type="checkbox" checked={values.taskNotifications} disabled={loading || busy} onChange={e => setValues(previous => ({ ...previous, taskNotifications: e.target.checked }))} /></label>
      <button type="submit" className="leave-submit" disabled={loading || busy}>{busy ? 'Saving...' : 'Save Preferences'}</button>
    </form>
  </section>;
}

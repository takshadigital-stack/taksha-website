import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';
import './InternLeave.css';

export default function InternLeave() {
  const { user } = useAuth();
  const isIntern = user?.role === 'INTERN';
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    axios.get(API_URL + '/leaves').then(res => { if (active) setLeaveHistory(res.data); })
      .catch(() => { if (active) setError('Unable to load leave history. Please try again later.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [API_URL]);
  const submitLeave = async event => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setNotice(''); setError('');
    if (data.to < data.from) { setError('The end date must be on or after the start date.'); return; }
    setSubmitting(true);
    try {
      const res = await axios.post(API_URL + '/leaves', data);
      setLeaveHistory(previous => [res.data, ...previous]);
      form.reset(); setNotice('Leave request submitted for review.');
    } catch (err) { setError(err.response?.data?.error || 'Unable to submit leave request. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const review = async (id, status) => {
    if (submitting) return;
    setSubmitting(true); setError(''); setNotice('');
    try { const res = await axios.put(API_URL + '/leaves/' + id + '/status', { status }); setLeaveHistory(previous => previous.map(leave => leave.id === id ? { ...leave, ...res.data } : leave)); setNotice('Leave request reviewed.'); }
    catch (err) { setError(err.response?.data?.error || 'Unable to review leave request.'); }
    finally { setSubmitting(false); }
  };

  return (
    <>
      <SEO title="Leave Management | Taksha Nexus Workspace" />
      <div className="intern-leave">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Leave Management</h1>
            <p className="intern-tasks__subtitle">{isIntern ? 'Request time off and view your leave history.' : 'Review leave requests from your interns.'}</p>
          </div>
        </header>

        {error && <p role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        <div className="leave-grid" style={isIntern ? undefined : { gridTemplateColumns: '1fr' }}>
          {/* Request Form */}
          {isIntern && <div className="leave-form-container">
            <h2 className="leave-form-title">Request Leave</h2>
            <form onSubmit={submitLeave}>
              <div className="leave-form-group">
                <label htmlFor="leave-type" className="leave-label">Leave Type</label>
                <select id="leave-type" name="type" className="leave-select" required>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div className="leave-form-group" style={{ flex: 1 }}>
                  <label htmlFor="leave-from" className="leave-label">From Date</label>
                  <input id="leave-from" name="from" type="date" className="leave-input" required />
                </div>
                <div className="leave-form-group" style={{ flex: 1 }}>
                  <label htmlFor="leave-to" className="leave-label">To Date</label>
                  <input id="leave-to" name="to" type="date" className="leave-input" required />
                </div>
              </div>

              <div className="leave-form-group">
                <label htmlFor="leave-reason" className="leave-label">Reason</label>
                <textarea id="leave-reason" name="reason" required maxLength={2000} className="leave-textarea" placeholder="Briefly explain the reason for your leave request..."></textarea>
              </div>

              <button type="submit" disabled={submitting} className="leave-submit">{submitting ? 'Submitting...' : 'Submit Request'}</button>
            </form>
          </div>}

          {/* History Table */}
          <div className="leave-history-container">
            <h2 className="leave-form-title">Leave History</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="leave-history-table">
                <thead>
                  <tr>
                    {!isIntern && <th>Intern</th>}
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                    {!isIntern && <th>Review</th>}
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.length === 0 && <tr><td colSpan={isIntern ? 4 : 6}>{loading ? 'Loading leave history...' : 'No leave requests yet.'}</td></tr>}
                  {leaveHistory.map(leave => (
                    <tr key={leave.id}>
                      {!isIntern && <td>{leave.intern?.name || leave.internId}</td>}
                      <td style={{ fontWeight: 800 }}>{leave.type}</td>
                      <td>{leave.from} <br/><small>to {leave.to}</small></td>
                      <td>{leave.days}</td>
                      <td>
                        <span className={`leave-badge leave-badge--${leave.status}`}>
                          {leave.status}
                        </span>
                      </td>
                      {!isIntern && <td>{leave.status === 'PENDING' ? <div style={{ display: 'flex', gap: 8 }}><button disabled={submitting} onClick={() => review(leave.id, 'APPROVED')}>Approve</button><button disabled={submitting} onClick={() => review(leave.id, 'REJECTED')}>Reject</button></div> : 'Reviewed'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

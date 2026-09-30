import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO/SEO';

const VerifyCertificate = () => {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();
  
  const [inputNumber, setInputNumber] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [certificateData, setCertificateData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setInputNumber(certificateNumber || '');
    setCertificateData(null); setErrorMessage('');
    if (!certificateNumber) { setStatus('idle'); return; }
    const controller = new AbortController();
    setStatus('loading');
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    fetch(API_URL + '/certificates/verify/' + encodeURIComponent(certificateNumber), { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(response.status === 404 ? 'No certificate found with this number.' : 'Failed to verify certificate. Please try again later.');
        return response.json();
      }).then(data => { if (!controller.signal.aborted) { setCertificateData(data); setStatus('success'); } })
      .catch(error => { if (!controller.signal.aborted) { setErrorMessage(error.message); setStatus('error'); } });
    return () => controller.abort();
  }, [certificateNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputNumber.trim()) return;
    
    // Instead of directly verifying, navigate so the URL updates
    navigate(`/verify/${encodeURIComponent(inputNumber.trim())}`);
  };

  return (
    <div className="verify-page" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 20px', backgroundColor: 'var(--color-bg)' }}>
      <SEO 
        title={certificateNumber ? `Verify Certificate - ${certificateNumber}` : "Verify Certificate"}
        description="Verify the authenticity of a Taksha Nexus internship certificate."
      />
      
      <div className="verify-container" style={{ maxWidth: '600px', width: '100%', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: 'var(--border-width) solid var(--color-border)', padding: 'clamp(20px, 5vw, 40px)', overflowWrap: 'anywhere', textAlign: 'center' }}>
        
        <h1 style={{ fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '10px', fontWeight: '700' }}>
          Certificate Verification
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>
          Enter the unique certificate number found on the bottom right of the document to verify its authenticity.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
          <input
            type="text"
            aria-label="Certificate number" required maxLength={100}
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="e.g. TK/IC/2026/0001"
            style={{ flex: '1 1 180px', minWidth: 0, padding: '12px 16px', borderRadius: '6px', border: 'var(--border-width) solid var(--color-border)', fontSize: '16px', outline: 'none', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            style={{ padding: '12px 24px', backgroundColor: 'var(--color-ink)', color: 'var(--color-bg)', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            {status === 'loading' ? 'Checking...' : 'Verify'}
          </button>
        </form>

        {status === 'loading' && (
          <div style={{ padding: '40px 0' }}>
            <div className="loader-line" style={{ margin: '0 auto' }}></div>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '15px' }}>Verifying records...</p>
          </div>
        )}

        {status === 'error' && (
          <div role="alert" style={{ backgroundColor: 'var(--color-card-pink)', border: '2px solid var(--color-ink)', borderRadius: '8px', padding: '24px', color: 'var(--color-ink)' }}>
            <svg style={{ width: '48px', height: '48px', margin: '0 auto 10px', color: 'var(--color-ink)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>Verification Failed</h3>
            <p>{errorMessage}</p>
          </div>
        )}

        {status === 'success' && certificateData && (
          <div style={{ border: '2px solid var(--color-ink)', borderRadius: '8px', overflow: 'hidden', textAlign: 'left' }}>
            <div style={{ backgroundColor: 'var(--color-card-mint)', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '2px solid var(--color-ink)' }}>
              <div style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-bg)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 style={{ color: 'var(--color-ink)', fontSize: '18px', fontWeight: '700', margin: 0 }}>Verified Authentic</h3>
                <p style={{ color: 'var(--color-ink)', fontSize: '14px', margin: 0, opacity: 0.8 }}>This certificate is valid and issued by Taksha Nexus.</p>
              </div>
            </div>
            
            <div style={{ padding: '24px', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Intern Name</div>
                  <div style={{ fontSize: '16px', color: 'var(--color-text-primary)', fontWeight: '600' }}>{certificateData.internName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Role / Track</div>
                  <div style={{ fontSize: '16px', color: 'var(--color-text-primary)', fontWeight: '600' }}>{certificateData.role}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Date Range</div>
                  <div style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>{certificateData.startDate} — {certificateData.endDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Issued On</div>
                  <div style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>{new Date(certificateData.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              {certificateData.projectsCompleted && certificateData.projectsCompleted.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>Completed Projects</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {certificateData.projectsCompleted.map((project, idx) => (
                      <li key={idx} style={{ padding: '10px 0', borderBottom: idx !== certificateData.projectsCompleted.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                        <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{project.projectName}</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'flex', gap: '15px' }}>
                          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>View Live</a>}
                          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>View Source</a>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;

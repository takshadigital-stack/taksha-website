import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO/SEO';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Careers.css';

export default function OfferResponse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioning, setActioning] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetch(`${API_URL}/applications/${id}/offer-details`)
      .then(res => {
        if (!res.ok) throw new Error('Offer not found or invalid');
        return res.json();
      })
      .then(data => {
        setOffer(data);
        setLoading(false);
        if (data.offerStatus === 'Accepted' || data.offerStatus === 'Declined') {
          setSuccess(true);
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAction = async (action) => {
    setActioning(true);
    try {
      const res = await fetch(`${API_URL}/applications/${id}/offer-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setOffer(prev => ({ ...prev, offerStatus: action === 'accept' ? 'Accepted' : 'Declined' }));
      setSuccess(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setActioning(false);
    }
  };

  // Build PDF URL: use Supabase URL if available, otherwise use the public API endpoint
  const getPdfUrl = () => {
    if (offer?.offerUrl && offer.offerUrl.startsWith('http')) {
      return offer.offerUrl;
    }
    return `${API_URL}/applications/${id}/offer-pdf-public`;
  };

  return (
    <>
      <SEO title="Offer Response | Taksha Nexus" />
      <Navbar />
      <main className="careers-page" style={{ minHeight: '80vh', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {loading ? (
            <div style={{ textAlign: 'center', paddingTop: '4rem' }}>Loading offer details...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--color-card-pink)', paddingTop: '4rem' }}>
              <h2>{error}</h2>
              <p>This link may have expired or is invalid.</p>
            </div>
          ) : (
            <div style={{ background: '#111', padding: 'var(--space-8)', borderRadius: '16px', border: '1px solid #333' }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'inline-block', padding: '4px 12px', background: '#333', borderRadius: '20px', fontSize: '12px', letterSpacing: '2px', marginBottom: 'var(--space-4)' }}>
                  TAKSHA HR
                </div>
                <h1 style={{ fontSize: '32px', marginBottom: 'var(--space-4)' }}>Internship Offer</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>For {offer.name}</p>
              </div>

              {success ? (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: offer.offerStatus === 'Accepted' ? 'var(--color-card-green)' : 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                    Offer {offer.offerStatus}
                  </h3>
                  {offer.offerStatus === 'Accepted' && (
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      Welcome to Taksha Nexus! Your intern account has been created and your login details have been sent to <strong>{offer.email}</strong>.
                      <br/><br/>
                      <button className="tn-button" onClick={() => navigate('/login')}>Go to Login</button>
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div style={{ background: '#000', padding: 'var(--space-6)', borderRadius: '12px', marginBottom: 'var(--space-8)' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: 'var(--space-4)' }}>Role Details</h3>
                    <p><strong>Position:</strong> {offer.roleTitle}</p>
                    <p><strong>Duration:</strong> {offer.duration || '3 Months'}</p>
                    <p><strong>Location:</strong> Remote</p>
                    <div style={{ marginTop: 'var(--space-4)' }}>
                      <a href={getPdfUrl()} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-card-blue)', textDecoration: 'underline' }}>
                        View Official Offer Letter (PDF)
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <button 
                      onClick={() => handleAction('decline')}
                      disabled={actioning}
                      style={{ padding: '16px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      Decline Offer
                    </button>
                    <button 
                      onClick={() => handleAction('accept')}
                      disabled={actioning}
                      className="tn-button"
                      style={{ width: '100%', padding: '16px' }}
                    >
                      {actioning ? 'Processing...' : 'Accept Offer'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          
        </div>
      </main>
      <Footer />
    </>
  );
}


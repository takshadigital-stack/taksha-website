import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Pencil, Save, X, Download } from 'lucide-react';
import './InternProfile.css';

export default function InternProfile() {
  const { user, updateProfile } = useAuth();
  const { checkEligibility, generateCertificate } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: user?.phone || '',
    location: user?.location || '',
    college: user?.college || '',
    degree: user?.degree || '',
    specialization: user?.specialization || '',
    currentYear: user?.currentYear || '',
    graduationYear: user?.graduationYear || '',
    skills: user?.skills || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || ''
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [certData, setCertData] = useState(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  useEffect(() => {
    const fetchEligibility = async () => {
      const data = await checkEligibility(user.id);
      setCertData(data);
    };
    if (user?.id) fetchEligibility();
  }, [user, checkEligibility]);

  const handleDownloadCertificate = async () => {
    setIsGeneratingCert(true);
    let certId = certData?.certificate?.id;

    if (!certData?.alreadyIssued) {
      const res = await generateCertificate(user.id);
      if (res.success) {
        certId = res.certificate.id;
        setCertData(prev => ({ ...prev, alreadyIssued: true, certificate: res.certificate }));
      } else {
        alert(res.error || 'Failed to generate certificate');
        setIsGeneratingCert(false);
        return;
      }
    }

    const backendUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');
    window.open(`${backendUrl}/api/certificates/${certId}/download`, '_blank');
    setIsGeneratingCert(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      phone: user?.phone || '',
      location: user?.location || '',
      college: user?.college || '',
      degree: user?.degree || '',
      specialization: user?.specialization || '',
      currentYear: user?.currentYear || '',
      graduationYear: user?.graduationYear || '',
      skills: user?.skills || '',
      githubUrl: user?.githubUrl || '',
      linkedinUrl: user?.linkedinUrl || '',
      portfolioUrl: user?.portfolioUrl || ''
    });
    setError('');
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError('');
    const res = await updateProfile(editData);
    if (res.success) {
      setIsEditing(false);
    } else {
      setError(res.error || 'Failed to save changes.');
    }
    setIsSaving(false);
  };

  return (
    <>
      <SEO title="My Profile | Taksha Nexus Workspace" />
      <div className="intern-profile">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">My Profile</h1>
            <p className="intern-tasks__subtitle">Your official Taksha Nexus intern record.</p>
          </div>
          <div>
            {!isEditing ? (
              <button className="intern-btn intern-btn--view" onClick={handleEditClick} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Pencil size={16} /> Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="intern-btn intern-btn--view" onClick={handleCancelClick} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-bg)' }}>
                  <X size={16} /> Cancel
                </button>
                <button className="intern-btn intern-btn--assign" onClick={handleSaveClick} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </header>

        {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">{user?.initials || 'KA'}</div>
            <div>
              <h2 className="profile-title">{user?.name || 'Kamana Agrawal'}</h2>
              <div className="profile-role">Frontend Track Intern</div>
            </div>
          </div>

          <div className="profile-body">
            <div>
              <div className="profile-info-group">
                <div className="profile-label">Email Address</div>
                <div className="profile-value">{user?.email || 'kamana@taksha.in'}</div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Phone Number</div>
                {isEditing ? (
                  <input
                    type="text"
                    className="profile-input"
                    value={editData.phone}
                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                ) : (
                  <div className="profile-value">{user?.phone || '+91 98765 43210'}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Location</div>
                {isEditing ? (
                  <input
                    type="text"
                    className="profile-input"
                    value={editData.location}
                    onChange={e => setEditData({ ...editData, location: e.target.value })}
                    placeholder="Remote (India)"
                  />
                ) : (
                  <div className="profile-value">{user?.location || 'Remote (India)'}</div>
                )}
              </div>
            </div>

            <div>
              <div className="profile-info-group">
                <div className="profile-label">Intern ID</div>
                <div className="profile-value">{user?.id || '\u2014'}</div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Lead Mentor</div>
                <div className="profile-value">Mentor Kamana</div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Start Date</div>
                <div className="profile-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '\u2014'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
              <h3 className="profile-title" style={{ fontSize: '1.2rem', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-ink)', paddingBottom: 'var(--space-2)' }}>
                Extended Profile Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
                <div>
                  <div className="profile-info-group">
                    <div className="profile-label">College / University</div>
                    {isEditing ? (
                      <input type="text" className="profile-input" value={editData.college} onChange={e => setEditData({ ...editData, college: e.target.value })} placeholder="Not set" />
                    ) : (
                      <div className="profile-value">{user?.college || '—'}</div>
                    )}
                  </div>
                  <div className="profile-info-group">
                    <div className="profile-label">Degree</div>
                    {isEditing ? (
                      <input type="text" className="profile-input" value={editData.degree} onChange={e => setEditData({ ...editData, degree: e.target.value })} placeholder="Not set" />
                    ) : (
                      <div className="profile-value">{user?.degree || '—'}</div>
                    )}
                  </div>
                  <div className="profile-info-group">
                    <div className="profile-label">Specialization</div>
                    {isEditing ? (
                      <input type="text" className="profile-input" value={editData.specialization} onChange={e => setEditData({ ...editData, specialization: e.target.value })} placeholder="Not set" />
                    ) : (
                      <div className="profile-value">{user?.specialization || '—'}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div className="profile-info-group" style={{ flex: 1 }}>
                      <div className="profile-label">Current Year</div>
                      {isEditing ? (
                        <input type="text" className="profile-input" value={editData.currentYear} onChange={e => setEditData({ ...editData, currentYear: e.target.value })} placeholder="Not set" />
                      ) : (
                        <div className="profile-value">{user?.currentYear || '—'}</div>
                      )}
                    </div>
                    <div className="profile-info-group" style={{ flex: 1 }}>
                      <div className="profile-label">Grad Year</div>
                      {isEditing ? (
                        <input type="text" className="profile-input" value={editData.graduationYear} onChange={e => setEditData({ ...editData, graduationYear: e.target.value })} placeholder="Not set" />
                      ) : (
                        <div className="profile-value">{user?.graduationYear || '—'}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="profile-info-group">
                    <div className="profile-label">Skills</div>
                    {isEditing ? (
                      <input type="text" className="profile-input" value={editData.skills} onChange={e => setEditData({ ...editData, skills: e.target.value })} placeholder="Not set" />
                    ) : (
                      <div className="profile-value">{user?.skills || '—'}</div>
                    )}
                  </div>
                  <div className="profile-info-group">
                    <div className="profile-label">GitHub URL</div>
                    {isEditing ? (
                      <input type="text" className="profile-input" value={editData.githubUrl} onChange={e => setEditData({ ...editData, githubUrl: e.target.value })} placeholder="Not set" />
                    ) : (
                      <div className="profile-value">
                        {user?.githubUrl ? <a href={user.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>View GitHub ↗</a> : '—'}
                      </div>
                    )}
                  </div>
                  <div className="profile-info-group">
                    <div className="profile-label">LinkedIn URL</div>
                    {isEditing ? (
                      <input type="text" className="profile-input" value={editData.linkedinUrl} onChange={e => setEditData({ ...editData, linkedinUrl: e.target.value })} placeholder="Not set" />
                    ) : (
                      <div className="profile-value">
                        {user?.linkedinUrl ? <a href={user.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>View LinkedIn ↗</a> : '—'}
                      </div>
                    )}
                  </div>
                  <div className="profile-info-group">
                    <div className="profile-label">Portfolio URL</div>
                    {isEditing ? (
                      <input type="text" className="profile-input" value={editData.portfolioUrl} onChange={e => setEditData({ ...editData, portfolioUrl: e.target.value })} placeholder="Not set" />
                    ) : (
                      <div className="profile-value">
                        {user?.portfolioUrl ? <a href={user.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>View Portfolio ↗</a> : '—'}
                      </div>
                    )}
                  </div>
                  <div className="profile-info-group">
                    <div className="profile-label">Resume PDF</div>
                    <div className="profile-value">
                      {user?.resumeUrl ? <a href={user.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-ink)', fontWeight: 'bold' }}>Download Resume PDF ↗</a> : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
              <div className="profile-info-group">
                <div className="profile-label">Internship Certificate</div>
                <div style={{ marginTop: 'var(--space-2)' }}>
                  {!certData ? (
                    <span style={{ color: 'var(--color-text-secondary)' }}>Checking eligibility...</span>
                  ) : certData.isEligible || certData.alreadyIssued ? (
                    <button
                      className="intern-btn intern-btn--assign"
                      onClick={handleDownloadCertificate}
                      disabled={isGeneratingCert}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                    >
                      <Download size={16} /> {isGeneratingCert ? 'Generating...' : 'Download Certificate'}
                    </button>
                  ) : (
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Complete all assigned tasks and get all project submissions approved to unlock your certificate.
                    </span>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
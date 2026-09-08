import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ArrowLeft, Award, Pencil, Check, X } from 'lucide-react';
import './MentorInternDetail.css';

export default function MentorInternDetail() {
  const { internId } = useParams();
  const navigate = useNavigate();
  const { interns, tasks, checkEligibility, generateCertificate, updateIntern } = useWorkspace();
  const [certData, setCertData] = useState(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', email: '', track: '', phone: '', location: '',
    college: '', degree: '', specialization: '', currentYear: '', graduationYear: '',
    skills: '', githubUrl: '', linkedinUrl: '', portfolioUrl: ''
  });

  useEffect(() => {
    const fetchEligibility = async () => {
      if (internId) {
        const data = await checkEligibility(internId);
        setCertData(data);
      }
    };
    fetchEligibility();
  }, [internId, checkEligibility]);

  const handleIssueCertificate = async () => {
    setIsGeneratingCert(true);
    const res = await generateCertificate(internId);
    if (res.success) {
      setCertData(prev => ({ ...prev, alreadyIssued: true, certificate: res.certificate }));
      const backendUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');
      window.open(`${backendUrl}/api/certificates/${res.certificate.id}/download`, '_blank');
    } else {
      alert(res.error || 'Failed to issue certificate');
    }
    setIsGeneratingCert(false);
  };

  const intern = interns.find(i => i.id === internId);

  useEffect(() => {
    if (intern && !isEditing) {
      setFormData({
        name: intern.name || '',
        email: intern.email || '',
        track: intern.track || '',
        phone: intern.phone || '',
        location: intern.location || '',
        college: intern.college || '',
        degree: intern.degree || '',
        specialization: intern.specialization || '',
        currentYear: intern.currentYear || '',
        graduationYear: intern.graduationYear || '',
        skills: intern.skills || '',
        githubUrl: intern.githubUrl || '',
        linkedinUrl: intern.linkedinUrl || '',
        portfolioUrl: intern.portfolioUrl || ''
      });
    }
  }, [intern, isEditing]);

  const handleEditClick = () => {
    setSaveError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSaveError('');
    setIsEditing(false);
    if (intern) {
      setFormData({
        name: intern.name || '',
        email: intern.email || '',
        track: intern.track || '',
        phone: intern.phone || '',
        location: intern.location || '',
        college: intern.college || '',
        degree: intern.degree || '',
        specialization: intern.specialization || '',
        currentYear: intern.currentYear || '',
        graduationYear: intern.graduationYear || '',
        skills: intern.skills || '',
        githubUrl: intern.githubUrl || '',
        linkedinUrl: intern.linkedinUrl || '',
        portfolioUrl: intern.portfolioUrl || ''
      });
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError('');
    const res = await updateIntern(internId, formData);
    setIsSaving(false);
    if (res.success) {
      setIsEditing(false);
    } else {
      setSaveError(res.error || 'Failed to update profile');
    }
  };

  if (!intern) {
    return (
      <>
        <SEO title="Intern Not Found | Taksha Nexus Workspace" />
        <div className="mentor-intern-detail not-found">
          <div className="details-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <h2 className="profile-title" style={{ marginBottom: 'var(--space-4)' }}>Intern Not Found</h2>
            <p style={{ marginBottom: 'var(--space-6)', fontSize: '1.2rem' }}>The intern you are looking for does not exist.</p>
            <button className="intern-btn intern-btn--view" onClick={() => navigate('/mentor/interns')}>
              Back to My Interns
            </button>
          </div>
        </div>
      </>
    );
  }

  const internTasks = tasks.filter(t => t.assignee === internId);
  const taskBreakdown = {
    total: internTasks.length,
    todo: internTasks.filter(t => t.status === 'TODO').length,
    inProgress: internTasks.filter(t => t.status === 'IN_PROGRESS').length,
    review: internTasks.filter(t => t.status === 'IN_REVIEW').length,
    done: internTasks.filter(t => t.status === 'DONE').length,
  };

  return (
    <>
      <SEO title={`${intern.name}'s Profile | Taksha Nexus Workspace`} />
      <div className="mentor-intern-detail">
        <header className="intern-tasks__header" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <Link to="/mentor/interns" className="back-link">
              <ArrowLeft size={16} /> Back to My Interns
            </Link>
            <h1 className="intern-tasks__title">{intern.name}'s Profile</h1>
            <p className="intern-tasks__subtitle">Detailed view of intern progress and tasks.</p>
          </div>
        </header>

        <div className="details-card">
          <div className="profile-header">
            <div className="profile-avatar">{intern.name.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase', padding: '6px 8px', border: '2px solid var(--color-ink)', width: '100%', maxWidth: '360px', marginBottom: '4px' }}
                />
              ) : (
                <h2 className="profile-title">{intern.name}</h2>
              )}
              <div className="profile-role">{intern.track} Track Intern</div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {isEditing ? (
                <>
                  <button
                    className="intern-btn intern-btn--assign"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                  >
                    <Check size={16} /> {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="intern-btn"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                  >
                    <X size={16} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  className="intern-btn intern-btn--view"
                  onClick={handleEditClick}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  <Pencil size={16} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {saveError && (
            <div style={{ color: 'var(--color-card-pink)', fontWeight: 800, padding: 'var(--space-3) var(--space-6) 0' }}>
              {saveError}
            </div>
          )}

          <div className="profile-body">
            <div>
              <div className="profile-info-group">
                <div className="profile-label">Email Address</div>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="profile-value"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                ) : (
                  <div className="profile-value">{intern.email}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Intern ID</div>
                <div className="profile-value">{intern.id}</div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Track</div>
                {isEditing ? (
                  <select
                    value={formData.track}
                    onChange={e => setFormData({ ...formData, track: e.target.value })}
                    className="profile-value"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Design">Design</option>
                  </select>
                ) : (
                  <div className="profile-value">{intern.track}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Phone</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="profile-value"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="Not set"
                  />
                ) : (
                  <div className="profile-value">{intern.phone || '—'}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Location</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="profile-value"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="Not set"
                  />
                ) : (
                  <div className="profile-value">{intern.location || '—'}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Current Status</div>
                <div className="profile-value" style={{
                  color: intern.progress > 50 ? 'var(--color-card-mint)' : 'var(--color-card-pink)',
                  fontWeight: 900
                }}>
                  {intern.status || 'Active'}
                </div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Certificate Status</div>
                <div className="profile-value" style={{ marginTop: 'var(--space-2)' }}>
                  {!certData ? (
                    <span style={{ color: 'var(--color-text-secondary)' }}>Checking...</span>
                  ) : certData.alreadyIssued ? (
                    <div style={{ color: 'var(--color-card-mint)', fontWeight: 900 }}>
                      Issued on {new Date(certData.certificate.issuedAt).toLocaleDateString()}
                    </div>
                  ) : certData.isEligible ? (
                    <div style={{ color: 'var(--color-card-cyan)', fontWeight: 900 }}>
                      Eligible for Issuance
                    </div>
                  ) : (
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                      Not Eligible Yet
                    </div>
                  )}

                  {certData && (
                    <button
                      className="intern-btn intern-btn--assign"
                      onClick={handleIssueCertificate}
                      disabled={isGeneratingCert || (certData.alreadyIssued)}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}
                    >
                      <Award size={16} />
                      {isGeneratingCert ? 'Processing...' : certData.alreadyIssued ? 'Download Certificate' : 'Issue Certificate'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="profile-info-group">
                <div className="profile-label">Overall Progress</div>
                <div className="profile-value">{intern.progress}%</div>
              </div>

              <div className="profile-info-group">
                <div className="profile-label">Task Breakdown</div>
                <div className="task-breakdown">
                  <div className="kpi-box" style={{ background: 'var(--color-card-lilac)' }}>
                    <span className="kpi-val">{taskBreakdown.todo}</span>
                    <span className="kpi-lbl">To Do</span>
                  </div>
                  <div className="kpi-box" style={{ background: 'var(--color-card-yellow)' }}>
                    <span className="kpi-val">{taskBreakdown.inProgress}</span>
                    <span className="kpi-lbl">In Progress</span>
                  </div>
                  <div className="kpi-box" style={{ background: 'var(--color-card-cyan)' }}>
                    <span className="kpi-val">{taskBreakdown.review}</span>
                    <span className="kpi-lbl">Review</span>
                  </div>
                  <div className="kpi-box" style={{ background: 'var(--color-card-mint)' }}>
                    <span className="kpi-val">{taskBreakdown.done}</span>
                    <span className="kpi-lbl">Done</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="details-card" style={{ marginTop: 'var(--space-6)' }}>
          <h3 className="profile-title" style={{ fontSize: '1.2rem', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-ink)', paddingBottom: 'var(--space-2)' }}>
            Extended Profile Information
          </h3>
          <div className="profile-body" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <div className="profile-info-group">
                <div className="profile-label">College / University</div>
                {isEditing ? (
                  <input type="text" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                ) : (
                  <div className="profile-value">{intern.college || '—'}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Degree</div>
                {isEditing ? (
                  <input type="text" value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                ) : (
                  <div className="profile-value">{intern.degree || '—'}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Specialization</div>
                {isEditing ? (
                  <input type="text" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                ) : (
                  <div className="profile-value">{intern.specialization || '—'}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div className="profile-info-group" style={{ flex: 1 }}>
                  <div className="profile-label">Current Year</div>
                  {isEditing ? (
                    <input type="text" value={formData.currentYear} onChange={e => setFormData({ ...formData, currentYear: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                  ) : (
                    <div className="profile-value">{intern.currentYear || '—'}</div>
                  )}
                </div>
                <div className="profile-info-group" style={{ flex: 1 }}>
                  <div className="profile-label">Grad Year</div>
                  {isEditing ? (
                    <input type="text" value={formData.graduationYear} onChange={e => setFormData({ ...formData, graduationYear: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                  ) : (
                    <div className="profile-value">{intern.graduationYear || '—'}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="profile-info-group">
                <div className="profile-label">Skills</div>
                {isEditing ? (
                  <input type="text" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                ) : (
                  <div className="profile-value">{intern.skills || '—'}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">GitHub URL</div>
                {isEditing ? (
                  <input type="text" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                ) : (
                  <div className="profile-value">
                    {intern.githubUrl ? <a href={intern.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>View GitHub ↗</a> : '—'}
                  </div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">LinkedIn URL</div>
                {isEditing ? (
                  <input type="text" value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                ) : (
                  <div className="profile-value">
                    {intern.linkedinUrl ? <a href={intern.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>View LinkedIn ↗</a> : '—'}
                  </div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Portfolio URL</div>
                {isEditing ? (
                  <input type="text" value={formData.portfolioUrl} onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })} className="profile-value" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Not set" />
                ) : (
                  <div className="profile-value">
                    {intern.portfolioUrl ? <a href={intern.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>View Portfolio ↗</a> : '—'}
                  </div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Resume PDF</div>
                <div className="profile-value">
                  {intern.resumeUrl ? <a href={intern.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-ink)', fontWeight: 'bold' }}>Download Resume PDF ↗</a> : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
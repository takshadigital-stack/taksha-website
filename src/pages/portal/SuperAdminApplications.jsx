import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, Eye, XCircle, Search, X, FileText, Download, User, BookOpen, Calendar, Briefcase as BriefcaseIcon, FileSignature, Mail } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import './MentorInternDetail.css'; // Reusing some modal styles if necessary

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function SuperAdminApplications() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modal State
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
    fetchSummary();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('taksha_token');
      const response = await fetch(`${API_URL}/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        const errText = await response.text();
        setErrorMsg(`Error ${response.status}: ${errText}`);
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('taksha_token');
      const response = await fetch(`${API_URL}/reports/applications-summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Failed to fetch summary', err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('taksha_token');
      const response = await fetch(`${API_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
        fetchSummary(); // Refresh stats
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      } else {
        const errText = await response.text();
        alert(`Failed to update status: ${errText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const generateOffer = async (id) => {
    try {
      const token = localStorage.getItem('taksha_token');
      const response = await fetch(`${API_URL}/applications/${id}/generate-offer`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const updatedApp = await response.json();
        setApplications(apps => apps.map(app => app.id === id ? updatedApp : app));
        setSelectedApp(updatedApp);
        fetchSummary();
        alert('Offer letter generated successfully!');
      } else {
        const errText = await response.text();
        alert(`Failed to generate offer letter. Server response: ${errText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error generating offer letter.');
    }
  };

  const sendOffer = async (id) => {
    try {
      const token = localStorage.getItem('taksha_token');
      const response = await fetch(`${API_URL}/applications/${id}/send-offer`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const updatedApp = await response.json();
        setApplications(apps => apps.map(app => app.id === id ? updatedApp : app));
        setSelectedApp(updatedApp);
        alert('Offer sent to candidate successfully!');
      } else {
        alert('Failed to send offer.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending offer.');
    }
  };

  // Filtering logic
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.college && app.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.skills && app.skills.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesRole = roleFilter === 'All' || app.roleId === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const STATS_COLORS = {
    'Pending': 'var(--color-bg-secondary)',
    'Under Review': 'var(--color-card-lilac)',
    'Shortlisted': 'var(--color-card-purple)',
    'Interview Scheduled': 'var(--color-card-pink)',
    'Selected': 'var(--color-card-mint)',
    'Rejected': '#ffebee'
  };

  return (
    <div className="portal-page">
      <SectionHeading 
        title="Taksha HR Pipeline" 
        subtitle="Super Admin total oversight of all AI-evaluated applications."
        badge="SUPER ADMIN"
        badgeColor="purple"
      />

      {summary && (
        <div className="stats-banner" style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
          <StatCard title="Total" value={summary.total} />
          <StatCard title="Pending" value={summary.pending} color={STATS_COLORS['Pending']} />
          <StatCard title="Under Review" value={summary.underReview} color={STATS_COLORS['Under Review']} />
          <StatCard title="Shortlisted" value={summary.shortlisted} color={STATS_COLORS['Shortlisted']} />
          <StatCard title="Selected" value={summary.selected} color={STATS_COLORS['Selected']} />
          <StatCard title="Rejected" value={summary.rejected} color={STATS_COLORS['Rejected']} />
        </div>
      )}

      <div className="portal-card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        
        {/* Filters & Search */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name, email, college, skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', border: '2px solid var(--color-ink)', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '2px solid var(--color-ink)', background: 'var(--color-surface)' }}
          >
            <option value="All">All Roles</option>
            <option value="DEV001">Frontend Developer (DEV001)</option>
            <option value="DEV002">Full-Stack Developer (DEV002)</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '2px solid var(--color-ink)', background: 'var(--color-surface)' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {isLoading ? (
          <p>Loading applications...</p>
        ) : errorMsg ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'red' }}>
            <XCircle size={48} style={{ margin: '0 auto var(--space-4)' }} />
            <h3>Failed to load applications</h3>
            <p>{errorMsg}</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <Briefcase size={48} color="var(--color-text-secondary)" style={{ margin: '0 auto var(--space-4)' }} />
            <h3>No applications found</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-ink)' }}>
                  <th style={{ padding: 'var(--space-3)' }}>Applicant</th>
                  <th style={{ padding: 'var(--space-3)' }}>Role</th>
                  <th style={{ padding: 'var(--space-3)' }}>College & Year</th>
                  <th style={{ padding: 'var(--space-3)' }}>Skills</th>
                  <th style={{ padding: 'var(--space-3)' }}>Status</th>
                  <th style={{ padding: 'var(--space-3)' }}>Date</th>
                  <th style={{ padding: 'var(--space-3)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <strong>{app.name}</strong><br/>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{app.email}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>{app.roleTitle}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span style={{ fontSize: 'var(--text-sm)' }}>{app.college || 'N/A'}</span><br/>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{app.currentYear || ''}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', maxWidth: '150px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.skills || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '4px 8px', borderRadius: '4px', fontSize: 'var(--text-xs)', fontWeight: 'bold',
                        background: STATS_COLORS[app.status] || 'var(--color-bg-secondary)'
                      }}>
                        <Clock size={12} /> {app.status}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3)', whiteSpace: 'nowrap', fontSize: 'var(--text-sm)' }}>{app.date}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <button 
                        onClick={() => setSelectedApp(app)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-ink)', color: 'var(--color-bg)', border: 'none', padding: '6px 10px', fontWeight: 'bold', cursor: 'pointer', fontSize: 'var(--text-sm)' }}
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'var(--color-surface)', border: '3px solid var(--color-ink)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedApp(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            
            <div style={{ padding: '30px', borderBottom: '2px solid var(--color-ink)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', background: 'var(--color-card-mint)', padding: '4px 8px', display: 'inline-block', marginBottom: '8px', border: '1px solid var(--color-ink)' }}>
                    {selectedApp.roleTitle}
                  </div>
                  <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: '900', marginBottom: '4px' }}>{selectedApp.name}</h2>
                  <p style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <span>✉️ {selectedApp.email}</span>
                    {selectedApp.phone && <span>📞 {selectedApp.phone}</span>}
                    {selectedApp.location && <span>📍 {selectedApp.location}</span>}
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Update Status:</label>
                  <select 
                    value={selectedApp.status}
                    onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                    style={{ padding: '8px 12px', border: '2px solid var(--color-ink)', fontWeight: 'bold', background: STATS_COLORS[selectedApp.status] || 'var(--color-surface)' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ padding: '0 30px' }}>
              <div style={{ background: 'var(--color-bg-secondary)', border: '2px solid var(--color-ink)', padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: selectedApp.aiScore >= 80 ? 'var(--color-card-mint)' : selectedApp.aiScore >= 50 ? 'var(--color-card-yellow)' : 'var(--color-card-pink)' }}>
                    {selectedApp.aiScore || 0}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>AI SCORE</div>
                </div>
                <div style={{ flex: '1 1 auto' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '8px' }}>
                    Taksha HR Recommendation: <span style={{ color: 'var(--color-accent)' }}>{selectedApp.aiRecommendation || 'Pending'}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)' }}>
                    <strong>Strengths:</strong> {selectedApp.aiStrengths ? JSON.parse(selectedApp.aiStrengths).join(', ') : 'N/A'}<br/>
                    <strong>Missing:</strong> {selectedApp.aiMissingSkills ? JSON.parse(selectedApp.aiMissingSkills).join(', ') : 'None'}<br/>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              
              {/* Education */}
              <DetailSection icon={<BookOpen size={18} />} title="Education">
                <DetailRow label="College" value={selectedApp.college} />
                <DetailRow label="Degree" value={selectedApp.degree} />
                <DetailRow label="Specialization" value={selectedApp.specialization} />
                <DetailRow label="Current Year" value={selectedApp.currentYear} />
                <DetailRow label="Graduating" value={selectedApp.graduationYear} />
              </DetailSection>

              {/* Skills & Experience */}
              <DetailSection icon={<BriefcaseIcon size={18} />} title="Skills & Experience">
                <DetailRow label="Skills" value={selectedApp.skills} />
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Experience:</span>
                  <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{selectedApp.experience || 'Not provided'}</p>
                </div>
              </DetailSection>

              {/* Projects & Links */}
              <DetailSection icon={<FileText size={18} />} title="Projects & Links">
                <DetailRow label="Has Projects?" value={selectedApp.hasProjects ? 'Yes' : 'No'} />
                {selectedApp.bestProject && (
                  <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Best Project:</span>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>{selectedApp.bestProject}</p>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
                  {selectedApp.githubUrl && <a href={selectedApp.githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 'bold' }}>GitHub Profile ↗</a>}
                  {selectedApp.linkedinUrl && <a href={selectedApp.linkedinUrl} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 'bold' }}>LinkedIn Profile ↗</a>}
                  {selectedApp.portfolio && <a href={selectedApp.portfolio} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 'bold' }}>Portfolio Website ↗</a>}
                </div>
              </DetailSection>

              {/* Availability */}
              <DetailSection icon={<Calendar size={18} />} title="Availability">
                <DetailRow label="Duration" value={selectedApp.duration} />
                <DetailRow label="Type" value={selectedApp.availability} />
                <DetailRow label="Hours/Week" value={selectedApp.hoursPerWeek} />
                <DetailRow label="Start Date" value={selectedApp.startDate} />
              </DetailSection>

            </div>

            <div style={{ padding: '0 30px 30px' }}>
              <DetailSection icon={<User size={18} />} title="Motivation">
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Why do you want to join?</span>
                  <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px', padding: '10px', background: 'var(--color-bg-secondary)', borderLeft: '3px solid var(--color-ink)' }}>{selectedApp.motivation || 'N/A'}</p>
                </div>
                {selectedApp.expectations && (
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>What do you hope to learn?</span>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px', padding: '10px', background: 'var(--color-bg-secondary)', borderLeft: '3px solid var(--color-ink)' }}>{selectedApp.expectations}</p>
                  </div>
                )}
                {selectedApp.whySelectYou && (
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>Why should we select you?</span>
                    <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px', padding: '10px', background: 'var(--color-bg-secondary)', borderLeft: '3px solid var(--color-ink)' }}>{selectedApp.whySelectYou}</p>
                  </div>
                )}
              </DetailSection>
            </div>

            {/* Actions Footer */}
            <div style={{ padding: '20px 30px', background: 'var(--color-bg-secondary)', borderTop: '2px solid var(--color-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                Applied via: <strong>{selectedApp.source || 'Direct'}</strong> | On: {selectedApp.date}
              </div>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selectedApp.resumeUrl && (
                  <a 
                    href={selectedApp.resumeUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', padding: '8px 16px', fontWeight: 'bold', textDecoration: 'none' }}
                  >
                    <Download size={16} /> View Resume
                  </a>
                )}
                
                {(!selectedApp.offerUrl && (selectedApp.status === 'Shortlisted' || selectedApp.status === 'Selected')) && (
                  <button 
                    onClick={() => generateOffer(selectedApp.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-card-purple)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    <FileSignature size={16} /> Approve & Generate Offer Letter
                  </button>
                )}
                
                {selectedApp.offerUrl && (
                  <>
                    <a 
                      href={selectedApp.offerUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-card-mint)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', padding: '8px 16px', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      <Eye size={16} /> Preview Offer Letter
                    </a>
                    
                    <button 
                      onClick={() => sendOffer(selectedApp.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-ink)', color: 'var(--color-bg)', border: '2px solid var(--color-ink)', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      <Mail size={16} /> {selectedApp.offerStatus === 'Sent' ? 'Resend Offer Email' : 'Send Offer Email'}
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ title, value, color = 'var(--color-surface)' }) {
  return (
    <div style={{ flex: '1 1 120px', background: color, border: '2px solid var(--color-ink)', padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</span>
      <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: '900' }}>{value}</span>
    </div>
  );
}

function DetailSection({ icon, title, children }) {
  return (
    <div style={{ border: '2px solid var(--color-ink)', background: 'var(--color-surface)', position: 'relative', marginTop: '10px' }}>
      <div style={{ position: 'absolute', top: '-15px', left: '15px', background: 'var(--color-accent)', padding: '2px 10px', border: '2px solid var(--color-ink)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>
        {icon} {title}
      </div>
      <div style={{ padding: '25px 15px 15px' }}>
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '4px', marginBottom: '8px' }}>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', textAlign: 'right', maxWidth: '60%' }}>{value || 'N/A'}</span>
    </div>
  );
}

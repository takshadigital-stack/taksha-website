import React from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { ExternalLink, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import './InternSubmissions.css';

export default function InternSubmissions() {
  const { user } = useAuth();
  const { submissions } = useWorkspace();

  const mySubmissions = submissions.filter(s => s.internId === user?.id);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'var(--color-card-mint)';
      case 'Changes Requested': return 'var(--color-card-pink)';
      case 'Submitted': return 'var(--color-card-lilac)';
      default: return 'var(--color-ink)';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle size={14} />;
      case 'Changes Requested': return <AlertTriangle size={14} />;
      case 'Submitted': return <Clock size={14} />;
      default: return null;
    }
  };

  return (
    <>
      <SEO title="Submissions Audit | Taksha Nexus Workspace" />
      <div className="intern-submissions">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Submissions Audit</h1>
            <p className="intern-tasks__subtitle">Permanent record of your submitted work and mentor feedback.</p>
          </div>
        </header>

        <div className="timeline">
          {mySubmissions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              No submissions found. Submit work from the Tasks page.
            </div>
          )}
          {mySubmissions.map((sub) => (
            <div key={sub.id} className="timeline-item">
              <div className="timeline-item__dot" style={{ borderColor: getStatusColor(sub.status) }}></div>
              <div className="timeline-item__content">
                <div className="timeline-header">
                  <h3 className="timeline-title">Project: {sub.project?.name || 'Unknown Project'}</h3>
                  <span className="timeline-date">{new Date(sub.createdAt).toLocaleDateString()}</span>
                </div>
                
                {sub.description && (
                  <p style={{ margin: 'var(--space-2) 0', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                    "{sub.description}"
                  </p>
                )}

                <div style={{ display: 'flex', gap: 'var(--space-4)', margin: 'var(--space-2) 0' }}>
                  {sub.githubUrl && (
                    <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="timeline-link">
                      <ExternalLink size={16} /> View GitHub Repo
                    </a>
                  )}
                  {sub.liveUrl && (
                    <a href={sub.liveUrl} target="_blank" rel="noreferrer" className="timeline-link">
                      <ExternalLink size={16} /> View Live App
                    </a>
                  )}
                </div>

                <div className="timeline-feedback" style={{ borderLeftColor: getStatusColor(sub.status) }}>
                  <h4 style={{ color: getStatusColor(sub.status) }}>
                    {getStatusIcon(sub.status)} 
                    {sub.status === 'Approved' ? 'Verified / Completed' : sub.status === 'Changes Requested' ? 'Changes Requested' : 'Pending Mentor Review'}
                  </h4>
                  {sub.mentorFeedback ? (
                    <p>{sub.mentorFeedback}</p>
                  ) : (
                    <p style={{ fontStyle: 'italic' }}>Mentor has not left any remarks yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

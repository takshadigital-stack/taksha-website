import React from 'react';
import { 
  CheckSquare, Clock, AlertTriangle, 
  Search, Filter, ChevronRight, FileCheck, ArrowRight, X, Megaphone, BarChart2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import './MentorDashboard.css';

export default function MentorDashboard() {
  const { user } = useAuth();
  const { projects, tasks, interns, submissions, createTask, createAnnouncement, reviewSubmission } = useWorkspace();
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = React.useState(false);
  const [newAnnouncement, setNewAnnouncement] = React.useState({ title: '', content: '' });

  // Form state
  const [newTask, setNewTask] = React.useState({ title: '', projectId: '', assignee: interns[0]?.id, priority: 'Medium' });

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const pendingReviews = (submissions || []).filter(s => s.status === 'Submitted');
  const completedTasks = tasks.filter(t => t.status === 'DONE');
  const changesRequested = tasks.filter(t => t.status === 'CHANGES_REQUESTED');

  const onTrackInterns = interns.filter(i => i.status === 'On Track').length;
  const behindInterns = interns.filter(i => i.status === 'Behind').length;
  const atRiskInterns = interns.filter(i => i.status === 'At Risk').length;
  const totalInterns = interns.length || 1; // avoid division by zero

  const stats = [
    { label: 'Projects', value: projects.length, icon: FileCheck, color: 'var(--color-bg-alt)' },
    { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'var(--color-card-mint)' },
    { label: 'Completed', value: completedTasks.length, icon: FileCheck, color: 'var(--color-card-pink)' },
    { label: 'Pending Reviews', value: pendingReviews.length, icon: Clock, color: 'var(--color-accent)' },
    { label: 'Changes Requested', value: changesRequested.length, icon: AlertTriangle, color: 'var(--color-card-purple)' },
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    createTask({ ...newTask, date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) });
    setIsTaskModalOpen(false);
    setNewTask({ title: '', projectId: '', assignee: interns[0]?.id, priority: 'Medium' });
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    createAnnouncement(newAnnouncement);
    setIsAnnouncementModalOpen(false);
    setNewAnnouncement({ title: '', content: '' });
  };

  return (
    <div className="mentor-dashboard">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-header__title">Welcome back, {user?.name || 'Mentor'}! 👋</h1>
          <p className="dashboard-header__date">{currentDate}</p>
        </div>
        <button className="btn btn--primary dashboard-header__btn" onClick={() => setIsTaskModalOpen(true)}>
          + Create Task
        </button>
      </header>

      {/* KPI Stats Grid */}
      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card__icon" style={{ background: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className="stat-card__info">
              <span className="stat-card__label">{stat.label}</span>
              <span className="stat-card__value">{stat.value}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="dashboard-grid">
        {/* Main Column */}
        <div className="dashboard-grid__main">
          
          {/* Intern Health Widget */}
          <section className="widget widget--health">
            <div className="widget__header">
              <h2 className="widget__title">Intern Health</h2>
            </div>
            <div className="widget__body">
              <div className="health-bars">
                <div className="health-bar-row">
                  <span className="health-label">ON TRACK</span>
                  <div className="health-bar-container">
                    <div className="health-bar health-bar--mint" style={{ width: `${(onTrackInterns / totalInterns) * 100}%` }}></div>
                  </div>
                  <span className="health-value">{onTrackInterns}</span>
                </div>
                <div className="health-bar-row">
                  <span className="health-label">AT RISK</span>
                  <div className="health-bar-container">
                    <div className="health-bar health-bar--accent" style={{ width: `${(atRiskInterns / totalInterns) * 100}%` }}></div>
                  </div>
                  <span className="health-value">{atRiskInterns}</span>
                </div>
                <div className="health-bar-row">
                  <span className="health-label">BEHIND</span>
                  <div className="health-bar-container">
                    <div className="health-bar health-bar--pink" style={{ width: `${(behindInterns / totalInterns) * 100}%` }}></div>
                  </div>
                  <span className="health-value">{behindInterns}</span>
                </div>
              </div>
            </div>
          </section>

          {/* My Interns Widget */}
          <section className="widget">
            <div className="widget__header">
              <h2 className="widget__title">My Interns</h2>
              <div className="widget__actions">
                <button className="widget-btn"><Filter size={16} /> Filter</button>
                <div className="search-box">
                  <Search size={16} />
                  <input type="text" placeholder="Search interns..." />
                </div>
              </div>
            </div>
            
            <div className="widget__body widget__body--no-padding">
              <div className="intern-list">
                {interns.length === 0 && (
                  <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <p style={{ marginBottom: 'var(--space-2)' }}>You don't have any interns yet.</p>
                    <Link to="/mentor/interns" className="btn btn--outline btn--small">Add Intern</Link>
                  </div>
                )}
                {interns.map((intern, idx) => {
                  const internTasks = tasks.filter(t => t.assignee === intern.id);
                  const completed = internTasks.filter(t => t.status === 'DONE').length;
                  const total = internTasks.length;
                  const pending = internTasks.filter(t => t.status === 'REVIEW').length;
                  
                  return (
                  <div key={idx} className="intern-card">
                    <div className="intern-card__main">
                      <div className="intern-card__avatar">{intern.name.charAt(0)}</div>
                      <div className="intern-card__info">
                        <h3>{intern.name}</h3>
                        <p>{intern.track}</p>
                      </div>
                    </div>
                    
                    <div className="intern-card__stats">
                      <div className="intern-stat">
                        <span>Progress</span>
                        <strong>{intern.progress}%</strong>
                      </div>
                      <div className="intern-stat">
                        <span>Tasks</span>
                        <strong>{completed} / {total}</strong>
                      </div>
                      <div className="intern-stat">
                        <span>Pending Review</span>
                        <strong>{pending}</strong>
                      </div>
                    </div>
                    
                    <div className="intern-card__status">
                      <span className="status-badge" style={{ background: intern.progress > 70 ? 'var(--color-card-mint)' : intern.progress > 40 ? 'var(--color-accent)' : 'var(--color-card-pink)' }}>
                        {intern.status}
                      </span>
                    </div>

                    <button className="intern-card__action">
                      View Profile <ChevronRight size={16} />
                    </button>
                  </div>
                  );
                })}
              </div>
              <div className="widget__footer">
                <Link to="/mentor/interns" className="view-all-link">View all {interns.length} interns <ArrowRight size={16}/></Link>
              </div>
            </div>
          </section>
        </div>

        {/* Side Column */}
        <div className="dashboard-grid__side">
          
          {/* Pending Reviews Widget */}
          <section className="widget widget--reviews">
            <div className="widget__header">
              <h2 className="widget__title">Pending Reviews</h2>
              {pendingReviews.length > 0 && <span className="badge badge--small badge--lilac">{pendingReviews.length} NEW</span>}
            </div>
            <div className="widget__body widget__body--no-padding">
              <ul className="review-list">
                {pendingReviews.length === 0 && (
                  <li className="review-item" style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    No pending reviews!
                  </li>
                )}
                {pendingReviews.map(sub => (
                  <li key={sub.id} className="review-item">
                    <div className="review-item__header">
                      <span className="review-task">Project Submission</span>
                      <span className="review-time">{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="review-item__meta">
                      <span className="review-intern">{sub.intern?.name || 'Unknown Intern'}</span>
                      <span className="dot">•</span>
                      <span className="review-project">{sub.project?.name || 'Unknown Project'}</span>
                    </div>
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <a href={sub.githubUrl || sub.fileUrl || sub.liveUrl || '#'} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: 'var(--color-accent-hover)', textDecoration: 'underline' }}>View Submission</a>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button className="btn btn--outline btn--small review-item__btn" onClick={() => reviewSubmission(sub.id, { status: 'Approved', mentorFeedback: 'Great work!' })} style={{ flex: 1, borderColor: 'var(--color-card-mint)', color: 'var(--color-ink)' }}>
                        Approve
                      </button>
                      <button className="btn btn--outline btn--small review-item__btn" onClick={() => reviewSubmission(sub.id, { status: 'Changes Requested', mentorFeedback: 'Please make updates and resubmit.' })} style={{ flex: 1, borderColor: 'var(--color-card-pink)', color: 'var(--color-ink)' }}>
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="widget__footer">
                <Link to="/mentor/reviews" className="view-all-link">Go to Reviews <ArrowRight size={16}/></Link>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="widget">
            <div className="widget__header">
              <h2 className="widget__title">Quick Actions</h2>
            </div>
            <div className="widget__body quick-actions">
              <button className="quick-action-btn" onClick={() => setIsTaskModalOpen(true)}>
                <span className="icon-wrap" style={{ background: 'var(--color-card-mint)' }}><CheckSquare size={20} /></span>
                Assign New Task
              </button>
              <button className="quick-action-btn" onClick={() => setIsAnnouncementModalOpen(true)}>
                <span className="icon-wrap" style={{ background: 'var(--color-card-lilac)' }}><Megaphone size={20} /></span>
                Post Announcement
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/mentor/reports')}>
                <span className="icon-wrap" style={{ background: 'var(--color-card-pink)' }}><BarChart2 size={20} /></span>
                Generate Report
              </button>
            </div>
          </section>
        </div>
      </div>

      {isTaskModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-surface)', border: '4px solid var(--color-ink)', boxShadow: '8px 8px 0 0 var(--color-ink)', padding: 'var(--space-6)', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem' }}>CREATE TASK</h2>
              <button onClick={() => setIsTaskModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}>TASK TITLE</label>
                <input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}>PROJECT</label>
                <select required value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                  <option value="" disabled>Select a project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}>ASSIGNEE</label>
                <select required value={newTask.assignee || ''} onChange={e => setNewTask({...newTask, assignee: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                  <option value="" disabled>Select an intern...</option>
                  {interns.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                {interns.length === 0 && <span style={{ fontSize: '12px', color: 'var(--color-card-pink)', display: 'block', marginTop: '4px' }}>Please add an intern first.</span>}
              </div>
              <button type="submit" disabled={interns.length === 0} style={{ padding: '12px', background: interns.length === 0 ? 'var(--color-bg-alt)' : 'var(--color-accent)', border: '2px solid var(--color-ink)', fontFamily: 'var(--font-display)', fontWeight: 900, marginTop: 'var(--space-2)', cursor: interns.length === 0 ? 'not-allowed' : 'pointer' }}>ASSIGN TASK</button>
            </form>
          </div>
        </div>
      )}

      {isAnnouncementModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-surface)', border: '4px solid var(--color-ink)', boxShadow: '8px 8px 0 0 var(--color-ink)', padding: 'var(--space-6)', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem' }}>POST ANNOUNCEMENT</h2>
              <button onClick={() => setIsAnnouncementModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}>TITLE</label>
                <input required value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}>MESSAGE</label>
                <textarea required rows="4" value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)', resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" style={{ padding: '12px', background: 'var(--color-card-lilac)', border: '2px solid var(--color-ink)', fontFamily: 'var(--font-display)', fontWeight: 900, marginTop: 'var(--space-2)', cursor: 'pointer' }}>POST ANNOUNCEMENT</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

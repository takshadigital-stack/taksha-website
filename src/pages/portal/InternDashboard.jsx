import React from 'react';
import { 
  ArrowRight, Calendar, Megaphone, CheckSquare, 
  Clock, Eye, Upload, MessageSquare, Info, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import './InternDashboard.css';

const QUICK_ACTIONS = [
  { title: 'View My Tasks', desc: 'See all your assigned tasks', icon: CheckSquare, color: 'var(--color-accent)', path: '/intern/tasks' },
  { title: 'Submit Work', desc: 'Upload and submit your work', icon: Upload, color: 'var(--color-card-purple)', path: '/intern/submissions' },
  { title: 'Check Feedback', desc: 'View feedback & remarks', icon: MessageSquare, color: 'var(--color-card-mint)', path: '/intern/submissions' },
  { title: 'Calendar', desc: 'View deadlines & events', icon: Calendar, color: 'var(--color-card-pink)', path: '/intern/calendar' },
  { title: 'Internship Details', desc: 'View program information', icon: Info, color: 'var(--color-surface)', path: '/intern/details' },
];

export default function InternDashboard() {
  const { user } = useAuth();
  const { tasks, updateTaskStatus, announcements } = useWorkspace();
  const navigate = useNavigate();
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false);
  const [activeTaskToSubmit, _setActiveTaskToSubmit] = React.useState(null);
  const [submissionLink, setSubmissionLink] = React.useState('');

  const myTasks = tasks.filter(t => t.assignee === user?.id);
  const todoCount = myTasks.filter(t => t.status === 'TODO').length;
  const inProgressCount = myTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'CHANGES_REQUESTED').length;
  const reviewCount = myTasks.filter(t => t.status === 'REVIEW').length;
  
  const KPI_STATS = [
    { label: 'MY TASKS', value: myTasks.length, subtext: 'Total assigned', color: 'var(--color-accent)', icon: CheckSquare, path: '/intern/tasks' },
    { label: 'FOR REVIEW', value: reviewCount, subtext: 'Awaiting mentor', color: 'var(--color-card-purple)', icon: Eye, path: '/intern/submissions' },
    { label: 'PENDING', value: todoCount + inProgressCount, subtext: 'In progress', color: 'var(--color-card-mint)', icon: Clock, path: '/intern/tasks' },
    { label: 'DUE TODAY', value: '0', subtext: 'No task due today', color: 'var(--color-card-pink)', icon: Calendar, path: '/intern/calendar' },
  ];

  const KANBAN_DATA = {
    TODO: { color: 'var(--color-accent)', tasks: myTasks.filter(t => t.status === 'TODO') },
    DONE: { color: 'var(--color-card-pink)', tasks: myTasks.filter(t => t.status === 'DONE') }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTaskToSubmit) {
      updateTaskStatus(activeTaskToSubmit.id, 'REVIEW', { submissionLink });
      setSubmitModalOpen(false);
      setSubmissionLink('');
    }
  };
  return (
    <>
      <SEO title="Dashboard | Intern Portal" />
      
      <div className="intern-dashboard">
        
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="dashboard-header__content">
            <h1 className="dashboard-header__title">Welcome back, {user?.name || 'Intern'}! 👋</h1>
            <p className="dashboard-header__subtitle">Here's what's happening with your internship today.</p>
          </div>
          
          <div className="dashboard-header__deco">
            <div className="deco-dots"></div>
            <div className="deco-zigzag">
              <svg width="40" height="15" viewBox="0 0 40 15" fill="none">
                <path d="M0 7.5 L10 2 L20 12 L30 2 L40 7.5" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="deco-circle"></div>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="dashboard-kpis">
          {KPI_STATS.map((stat, i) => (
            <div key={i} className="kpi-card" style={{ borderBottomColor: stat.color }} onClick={() => navigate(stat.path)}>
              <div className="kpi-card__top">
                <div className="kpi-card__icon" style={{ background: stat.color }}>
                  <stat.icon size={20} strokeWidth={2.5} />
                </div>
                <div className="kpi-card__header-right">
                  <span className="kpi-card__label">{stat.label}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
              <div className="kpi-card__value">{stat.value}</div>
              <div className="kpi-card__subtext">{stat.subtext}</div>
            </div>
          ))}
        </section>

        {/* Main Grid: Kanban + Quick Actions */}
        <div className="dashboard-grid-main">
          
          {/* Kanban Section */}
          <section className="dashboard-widget dashboard-widget--kanban">
            <div className="dashboard-widget__header">
              <h2 className="dashboard-widget__title">MY TASKS</h2>
              <div className="dashboard-widget__actions">
                <select className="dashboard-widget__select">
                  <option>All Tasks</option>
                </select>
                <button className="dashboard-widget__more">⋮</button>
              </div>
            </div>
            
            <div className="kanban-board">
              {Object.entries(KANBAN_DATA).map(([key, col], i) => (
                <div key={i} className="kanban-col">
                  <div className="kanban-col__header" style={{ background: col.color }}>
                    <span className="kanban-col__title">{key.replace('_', ' ')}</span>
                    <span className="kanban-col__count">{col.tasks.length}</span>
                  </div>
                  <div className="kanban-col__body">
                    {col.tasks.map((task, j) => (
                      <div key={j} className="kanban-task">
                        <div className="kanban-task__top">
                          <h4 className="kanban-task__title">{task.title}</h4>
                          {task.status === 'CHANGES_REQUESTED' && <span style={{fontSize: '9px', background: 'var(--color-card-pink)', padding: '2px', border: '1px solid black'}}>CHANGES REQ</span>}
                        </div>
                        <p className="kanban-task__project">{task.project?.name || 'No Project'}</p>
                        <div className="kanban-task__bottom">
                          <span className="kanban-task__priority" style={{ color: task.priority === 'High' ? 'var(--color-card-pink)' : 'var(--color-ink)', borderColor: 'var(--color-ink)', background: 'var(--color-bg)' }}>
                            {task.priority || 'Medium'}
                          </span>
                          {task.status === 'DONE' ? (
                            <div className="kanban-task__done-icon">
                              <CheckSquare size={16} color="var(--color-card-mint)" />
                            </div>
                          ) : (
                            <span className="kanban-task__date">
                              <Calendar size={12} /> {task.date}
                            </span>
                          )}
                        </div>
                        {task.status === 'TODO' && (
                          <button onClick={() => updateTaskStatus(task.id, 'DONE')} style={{ marginTop: '8px', width: '100%', padding: '4px', background: 'var(--color-accent)', border: '2px solid var(--color-ink)', cursor: 'pointer', fontWeight: 800, fontSize: '10px' }}>MARK DONE</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="kanban-col__add">+ Add / View All</button>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="dashboard-widget dashboard-widget--actions">
            <div className="dashboard-widget__header">
              <h2 className="dashboard-widget__title">QUICK ACTIONS</h2>
            </div>
            <div className="quick-actions-list">
              {QUICK_ACTIONS.map((action, i) => (
                <button key={i} className="quick-action-card" onClick={() => navigate(action.path)}>
                  <div className="quick-action-card__icon" style={{ background: action.color }}>
                    <action.icon size={20} />
                  </div>
                  <div className="quick-action-card__text">
                    <h4>{action.title}</h4>
                    <p>{action.desc}</p>
                  </div>
                  <ArrowRight size={16} className="quick-action-card__arrow" />
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Grid: Progress + Announcements */}
        <div className="dashboard-grid-bottom">
          
          {/* Progress Widget */}
          <section className="dashboard-widget dashboard-widget--progress">
            <div className="progress-widget-inner">
              <div className="progress-left">
                <div className="progress-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
                <div className="progress-info">
                  <h3>INTERNSHIP PROGRESS</h3>
                  <div className="progress-percent">75%</div>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill"></div>
                </div>
              </div>
              <div className="progress-right">
                <div className="progress-stat">
                  <span className="stat-dot stat-dot--purple"></span>
                  <span className="stat-label">Projects Completed</span>
                  <span className="stat-value">2 / 3</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-dot stat-dot--mint"></span>
                  <span className="stat-label">Tasks Completed</span>
                  <span className="stat-value">9 / 12</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-dot stat-dot--accent"></span>
                  <span className="stat-label">Days Remaining</span>
                  <span className="stat-value">18 Days</span>
                </div>
              </div>
              <div className="progress-deco">
                <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                  <path d="M0 10 L10 2 L20 10 L30 2 L40 10" stroke="var(--color-card-pink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </section>

          {/* Announcements Widget */}
          <section className="dashboard-widget dashboard-widget--announcements">
            <div className="dashboard-widget__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="announcement-icon-box">
                  <Megaphone size={20} />
                </div>
                <h2 className="dashboard-widget__title">TAKSHA NEXUS ANNOUNCEMENTS</h2>
              </div>
              <Link to="/intern/dashboard" className="view-all-link">View All</Link>
            </div>
            <div className="announcement-content" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {announcements && announcements.length > 0 ? announcements.map(ann => (
                <div key={ann.id} style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '2px dashed var(--color-ink)' }}>
                  <h4>{ann.title}</h4>
                  <p>{ann.content}</p>
                  <div className="announcement-date">
                    <Calendar size={14} /> Posted on {ann.date}
                  </div>
                </div>
              )) : (
                <p>No new announcements.</p>
              )}
              <div className="announcement-deco-dots"></div>
            </div>
          </section>

        </div>
      </div>

      {submitModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-surface)', border: '4px solid var(--color-ink)', boxShadow: '8px 8px 0 0 var(--color-ink)', padding: 'var(--space-6)', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem' }}>SUBMIT TASK</h2>
              <button onClick={() => setSubmitModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <p style={{ fontSize: '12px', marginBottom: 'var(--space-4)' }}>Submitting: <strong>{activeTaskToSubmit?.title}</strong></p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}>GITHUB / LIVE URL</label>
                <input required type="url" value={submissionLink} onChange={e => setSubmissionLink(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
              </div>
              <button type="submit" style={{ padding: '12px', background: 'var(--color-card-purple)', border: '2px solid var(--color-ink)', fontFamily: 'var(--font-display)', fontWeight: 900, marginTop: 'var(--space-2)', cursor: 'pointer' }}>SUBMIT FOR REVIEW</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

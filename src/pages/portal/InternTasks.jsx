import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import './InternTasks.css';

export default function InternTasks() {
  const { user } = useAuth();
  const { projects, tasks, submissions, updateTaskStatus, submitProjectWork } = useWorkspace();
  const [filter, setFilter] = useState('ALL');
  const [expandedProjects, setExpandedProjects] = useState({});
  
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [submissionData, setSubmissionData] = useState({ githubUrl: '', liveUrl: '', description: '', file: null });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myTasks = tasks.filter(t => t.assignee === user?.id);
  
  const filteredTasks = myTasks.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return t.status === 'TODO' || t.status === 'IN_PROGRESS' || t.status === 'CHANGES_REQUESTED';
    if (filter === 'COMPLETED') return t.status === 'DONE';
    return true;
  });

  const _getStatusLabel = (status) => {
    switch(status) {
      case 'IN_PROGRESS': return 'In Progress';
      case 'CHANGES_REQUESTED': return 'Changes Req';
      case 'REVIEW': return 'In Review';
      case 'TODO': return 'To Do';
      case 'DONE': return 'Completed';
      default: return status;
    }
  };

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleOpenSubmit = (e, project) => {
    e.stopPropagation();
    setActiveProject(project);
    setSubmissionData({ githubUrl: '', liveUrl: '', description: '', file: null });
    setSubmitError('');
    setSubmitModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!submissionData.githubUrl.includes('github.com')) {
      setSubmitError('Please provide a valid GitHub repository URL.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    const res = await submitProjectWork({
      projectId: activeProject.id,
      ...submissionData
    });
    
    setIsSubmitting(false);
    
    if (res.success) {
      setSubmitModalOpen(false);
      setActiveProject(null);
    } else {
      setSubmitError(res.error || 'Failed to submit work. Please try again.');
    }
  };

  return (
    <>
      <SEO title="My Tasks | Taksha Nexus Workspace" />
      <div className="intern-tasks">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">My Tasks</h1>
            <p className="intern-tasks__subtitle">Detailed view of all your assigned items.</p>
          </div>
          <div className="intern-tasks__actions">
            <select className="task-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">All Tasks</option>
              <option value="PENDING">Pending Action</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </header>

        {submitModalOpen && activeProject && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <button className="modal-close" onClick={() => setSubmitModalOpen(false)}><X /></button>
              <h2>Submit Project: {activeProject.name}</h2>
              <p style={{ marginBottom: 'var(--space-4)' }}>Submit your GitHub repository link to mark this project as completed.</p>
              
              {submitError && (
                <div style={{ padding: 'var(--space-2)', background: 'var(--color-card-pink)', color: 'var(--color-bg)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>GitHub Repository URL *</label>
                  <input 
                    required 
                    type="url" 
                    placeholder="https://github.com/username/repo" 
                    value={submissionData.githubUrl} 
                    onChange={e => setSubmissionData({...submissionData, githubUrl: e.target.value})} 
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)' }} 
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Live/Deployed Project URL (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://myproject.vercel.app" 
                    value={submissionData.liveUrl} 
                    onChange={e => setSubmissionData({...submissionData, liveUrl: e.target.value})} 
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)' }} 
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Description/Updates (Optional)</label>
                  <textarea 
                    rows="4"
                    placeholder="Briefly describe what you completed or any challenges faced..." 
                    value={submissionData.description} 
                    onChange={e => setSubmissionData({...submissionData, description: e.target.value})} 
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)' }} 
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Attachment (Optional, max 10MB)</label>
                  <input 
                    type="file" 
                    onChange={e => setSubmissionData({...submissionData, file: e.target.files[0]})} 
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)' }}
                    accept=".pdf,.zip,.png,.jpg,.jpeg,.fig"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="intern-btn intern-btn--assign" 
                  style={{ width: '100%' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Work'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="task-table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Project / Task</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map(project => {
                  const projectTasks = filteredTasks.filter(t => t.projectId === project.id);
                  if (projectTasks.length === 0 && filter !== 'ALL') return null; // Don't show empty projects if filtering
                  
                  // For intern, only show projects they have tasks in
                  const internProjectTasks = myTasks.filter(t => t.projectId === project.id);
                  if (internProjectTasks.length === 0) return null;

                  const isExpanded = expandedProjects[project.id];
                  const projectSub = submissions?.find(s => s.projectId === project.id && s.internId === user?.id);
                  const allTasksDone = internProjectTasks.length > 0 && internProjectTasks.every(t => t.status === 'DONE');

                  return (
                    <React.Fragment key={project.id}>
                      {/* Project Header Row */}
                      <tr className="project-row" onClick={() => toggleProject(project.id)} style={{ cursor: 'pointer', background: 'var(--color-bg-alt)' }}>
                        <td colSpan="5" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 900 }}>
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              <span style={{ fontSize: '1.1rem' }}>{project.name}</span>
                            </div>
                            <div style={{ fontWeight: 800, color: 'var(--color-text-secondary)' }}>
                              {internProjectTasks.length} {internProjectTasks.length === 1 ? 'Task' : 'Tasks'}
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Task Rows (if expanded) */}
                      {isExpanded && internProjectTasks.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-4)', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                            No tasks found matching filter in this project.
                          </td>
                        </tr>
                      ) : isExpanded && internProjectTasks.map(task => (
                        <tr key={task.id} className="task-row">
                          <td colSpan="3" style={{ paddingLeft: 'var(--space-8)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                checked={task.status === 'DONE'}
                                onChange={() => updateTaskStatus(task.id, task.status === 'DONE' ? 'TODO' : 'DONE')}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--color-ink)' }}
                              />
                              <span className="task-table__title" style={{ textDecoration: task.status === 'DONE' ? 'line-through' : 'none', color: task.status === 'DONE' ? 'var(--color-text-secondary)' : 'inherit' }}>
                                ↳ {task.title}
                              </span>
                            </label>
                          </td>
                          <td colSpan="2" style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 800, color: task.priority === 'High' ? 'var(--color-card-pink)' : 'inherit' }}>
                              {task.priority || 'Medium'}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {/* Project Submission Row */}
                      {isExpanded && internProjectTasks.length > 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'right', padding: 'var(--space-4)', background: 'var(--color-bg)' }}>
                            {projectSub ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
                                {projectSub.status === 'Changes Requested' && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    {!allTasksDone && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Complete all tasks to resubmit</span>}
                                    <button 
                                      className="intern-btn intern-btn--assign" 
                                      style={{ background: 'var(--color-card-purple)', padding: '6px 16px', fontSize: '14px', ...(!allTasksDone ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }} 
                                      onClick={(e) => handleOpenSubmit(e, project)}
                                      disabled={!allTasksDone}
                                    >
                                      Resubmit Project
                                    </button>
                                  </div>
                                )}
                                <span className={`task-badge`} style={{ background: projectSub.status === 'Approved' ? 'var(--color-card-mint)' : (projectSub.status === 'Changes Requested' ? 'var(--color-card-pink)' : 'var(--color-ink)'), color: 'var(--color-bg)' }}>
                                  Status: {projectSub.status}
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                                {!allTasksDone && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Complete all tasks to submit</span>}
                                <button 
                                  className="intern-btn intern-btn--assign" 
                                  style={{ background: 'var(--color-card-purple)', ...(!allTasksDone ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }} 
                                  onClick={(e) => handleOpenSubmit(e, project)}
                                  disabled={!allTasksDone}
                                >
                                  Submit Project
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

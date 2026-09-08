import React, { useState } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Plus, X, ChevronRight, ChevronDown, FolderPlus } from 'lucide-react';
import './InternTasks.css';
import './MentorTasks.css';

export default function MentorTasks() {
  const { projects, tasks, interns, createProject, assignProjectTemplate, createTask, updateTaskDetails, deleteTask } = useWorkspace();
  const [filter, setFilter] = useState('ALL');
  const [expandedProjects, setExpandedProjects] = useState({});
  
  // Modals state
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null); // If not null, edit modal is open
  const [newTask, setNewTask] = useState({ title: '', projectId: '', priority: 'Medium', status: 'TODO', assignee: '' });
  const [error, setError] = useState('');
  
  const [isAssignTemplateOpen, setAssignTemplateOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templateAssignData, setTemplateAssignData] = useState({ templateKey: '', internId: '' });

  const fetchTemplates = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const token = localStorage.getItem('taksha_token');
      const res = await axios.get(`${API_URL}/project-templates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTemplates(res.data);
      setAssignTemplateOpen(true);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'TODO': return 'var(--color-accent)';
      case 'IN_PROGRESS': return 'var(--color-card-purple)';
      case 'REVIEW': return 'var(--color-card-mint)';
      case 'DONE': return 'var(--color-card-pink)';
      case 'CHANGES_REQUESTED': return 'var(--color-card-pink)';
      default: return 'var(--color-ink)';
    }
  };

  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;
    setError('');
    const res = await createProject(newProject);
    if (res.success) {
      setCreateProjectOpen(false);
      setNewProject({ name: '', description: '' });
      // auto expand new project
      setExpandedProjects(prev => ({ ...prev, [res.project.id]: true }));
    } else {
      setError(res.error || 'Failed to create project');
    }
  };

  const _handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.assignee) {
      setError('Please select an intern to assign this task to.');
      return;
    }
    setError('');
    await createTask(newTask);
    setCreateTaskOpen(false);
    setNewTask({ title: '', projectId: '', priority: 'Medium', status: 'TODO', assignee: '' });
    // auto expand the project
    if (newTask.projectId) {
      setExpandedProjects(prev => ({ ...prev, [newTask.projectId]: true }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await updateTaskDetails(editTaskData.id, editTaskData);
    if (res.success) {
      setEditTaskData(null);
    } else {
      setError(res.error || 'Failed to update task');
    }
  };

  const handleDropTask = async (taskId) => {
    if (confirm('Are you sure you want to permanently delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleAssignTemplateSubmit = async (e) => {
    e.preventDefault();
    if (!templateAssignData.templateKey || !templateAssignData.internId) {
      setError('Please select both a template and an intern.');
      return;
    }
    setError('');
    const res = await assignProjectTemplate(templateAssignData.templateKey, templateAssignData.internId);
    if (res.success) {
      setAssignTemplateOpen(false);
      setTemplateAssignData({ templateKey: '', internId: '' });
      setExpandedProjects(prev => ({ ...prev, [res.project.id]: true }));
    } else {
      setError(res.error || 'Failed to assign project template');
    }
  };

  return (
    <>
      <SEO title="Task Masterlist | Taksha Nexus Workspace" />
      <div className="mentor-tasks">
        <header className="intern-tasks__header" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="intern-tasks__title">Task Masterlist</h1>
            <p className="intern-tasks__subtitle">Global view of all assigned tasks.</p>
          </div>
          
          <div className="intern-tasks__filters" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <button className="task-filter" style={filter === 'ALL' ? {background:'var(--color-ink)', color:'var(--color-bg)'} : {}} onClick={() => setFilter('ALL')}>All Tasks</button>
            <button className="task-filter" style={filter === 'TODO' ? {background:'var(--color-ink)', color:'var(--color-bg)'} : {}} onClick={() => setFilter('TODO')}>To Do</button>
            <button className="task-filter" style={filter === 'REVIEW' ? {background:'var(--color-ink)', color:'var(--color-bg)'} : {}} onClick={() => setFilter('REVIEW')}>Needs Review</button>
            <button className="task-filter" style={filter === 'DONE' ? {background:'var(--color-ink)', color:'var(--color-bg)'} : {}} onClick={() => setFilter('DONE')}>Completed</button>
            
            {/* Added Create Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button 
                className="intern-btn intern-btn--view" 
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-bg-alt)' }}
                onClick={() => setCreateProjectOpen(true)}
              >
                <FolderPlus size={16} /> Custom Project
              </button>
              <button 
                className="intern-btn intern-btn--assign" 
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                onClick={fetchTemplates}
              >
                <FolderPlus size={16} /> Official Project
              </button>
              <button 
                className="intern-btn intern-btn--assign" 
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                onClick={() => setCreateTaskOpen(true)}
              >
                <Plus size={16} /> Assign Task
              </button>
            </div>
          </div>
        </header>

        {/* CREATE PROJECT MODAL */}
        {isCreateProjectOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <button className="modal-close" onClick={() => setCreateProjectOpen(false)}><X /></button>
              <h2>Create New Project</h2>
              {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}
              
              <form onSubmit={handleCreateProjectSubmit}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Project Name</label>
                  <input required type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Description</label>
                  <textarea rows="3" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <button type="submit" className="intern-btn intern-btn--assign" style={{ width: '100%' }}>Create Project</button>
              </form>
            </div>
          </div>
        )}

        {/* ASSIGN TEMPLATE MODAL */}
        {isAssignTemplateOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <button className="modal-close" onClick={() => setAssignTemplateOpen(false)}><X /></button>
              <h2>Assign Official Project</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Select an official Taksha Nexus template to automatically generate the project and its complete checklist of tasks.
              </p>
              
              {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}
              
              <form onSubmit={handleAssignTemplateSubmit}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Assign To Intern</label>
                  <select 
                    required 
                    className="intern-select"
                    value={templateAssignData.internId} 
                    onChange={e => setTemplateAssignData({...templateAssignData, internId: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}
                  >
                    <option value="">-- Select Intern --</option>
                    {interns.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Select Template</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {templates.map(t => (
                      <label key={t.key} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3)', border: '2px solid var(--color-ink)', borderRadius: '4px', cursor: 'pointer', background: templateAssignData.templateKey === t.key ? 'var(--color-card-yellow)' : 'var(--color-bg-primary)' }}>
                        <input 
                          type="radio" 
                          name="template" 
                          value={t.key}
                          checked={templateAssignData.templateKey === t.key}
                          onChange={e => setTemplateAssignData({...templateAssignData, templateKey: e.target.value})}
                          style={{ marginTop: '4px' }}
                          required
                        />
                        <div>
                          <div style={{ fontWeight: 800 }}>{t.name}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{t.description}</div>
                          <div style={{ fontSize: '0.8rem', marginTop: '6px', fontWeight: 600 }}>Stack: {t.stack}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button type="submit" className="intern-btn intern-btn--assign" style={{ width: '100%' }}>Assign Project & Generate Tasks</button>
              </form>
            </div>
          </div>
        )}

        {/* CREATE TASK MODAL */}
        {isCreateTaskOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <button className="modal-close" onClick={() => setCreateTaskOpen(false)}><X /></button>
              <h2>Assign New Task</h2>
              {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}
              
              <form onSubmit={handleCreateSubmit}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Task Title</label>
                  <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Project</label>
                  <select required value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                    <option value="" disabled>Select Project...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Priority</label>
                    <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Assignee</label>
                    <select required value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                      <option value="" disabled>Select Intern...</option>
                      {interns.map(intern => (
                        <option key={intern.id} value={intern.id}>{intern.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="intern-btn intern-btn--assign" style={{ width: '100%' }}>Create Task</button>
              </form>
            </div>
          </div>
        )}

        {/* EDIT TASK MODAL */}
        {editTaskData && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <button className="modal-close" onClick={() => setEditTaskData(null)}><X /></button>
              <h2>Edit Task</h2>
              {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}
              
              <form onSubmit={handleEditSubmit}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Task Title</label>
                  <input required type="text" value={editTaskData.title} onChange={e => setEditTaskData({...editTaskData, title: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Project</label>
                  <select required value={editTaskData.projectId} onChange={e => setEditTaskData({...editTaskData, projectId: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                    <option value="" disabled>Select Project...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Status</label>
                    <select value={editTaskData.status} onChange={e => setEditTaskData({...editTaskData, status: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="CHANGES_REQUESTED">Changes Req.</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Priority</label>
                    <select value={editTaskData.priority} onChange={e => setEditTaskData({...editTaskData, priority: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="intern-btn intern-btn--view" style={{ width: '100%' }}>Save Changes</button>
              </form>
            </div>
          </div>
        )}

        <div className="task-table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Project / Task</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    <h3>No Projects Created</h3>
                    <p>Create a project first before assigning tasks.</p>
                  </td>
                </tr>
              ) : (
                projects.map(project => {
                  const projectTasks = filteredTasks.filter(t => t.projectId === project.id);
                  const isExpanded = expandedProjects[project.id];
                  
                  return (
                    <React.Fragment key={project.id}>
                      {/* Project Header Row */}
                      <tr className="project-row" onClick={() => toggleProject(project.id)} style={{ cursor: 'pointer', background: 'var(--color-bg-alt)' }}>
                        <td colSpan="6" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 900 }}>
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              <span style={{ fontSize: '1.1rem' }}>{project.name}</span>
                            </div>
                            <div style={{ fontWeight: 800, color: 'var(--color-text-secondary)' }}>
                              {projectTasks.length} {projectTasks.length === 1 ? 'Task' : 'Tasks'}
                            </div>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Task Rows (if expanded) */}
                      {isExpanded && projectTasks.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-4)', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                            No tasks found in this project.
                          </td>
                        </tr>
                      ) : isExpanded && projectTasks.map(task => {
                        const assigneeName = interns.find(i => i.id === task.assignee)?.name || task.assignee;
                        return (
                          <tr key={task.id} className="task-row">
                            <td className="task-table__title" style={{ paddingLeft: 'var(--space-8)' }}>
                              ↳ {task.title}
                            </td>
                            <td style={{ fontWeight: 800 }}>{assigneeName}</td>
                            <td>
                              <span className="task-badge" style={{ background: getStatusColor(task.status) }}>
                                {task.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              <span className="task-badge" style={{ 
                                color: task.priority === 'High' ? 'var(--color-card-pink)' : 'var(--color-ink)' 
                              }}>
                                {task.priority || 'Medium'}
                              </span>
                            </td>
                            <td>{task.date}</td>
                            <td>
                              <div className="mentor-task-actions">
                                <button className="mentor-task-btn" onClick={(e) => { e.stopPropagation(); setEditTaskData(task); }}>Edit</button>
                                <button className="mentor-task-btn mentor-task-btn--delete" onClick={(e) => { e.stopPropagation(); handleDropTask(task.id); }}>Drop</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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

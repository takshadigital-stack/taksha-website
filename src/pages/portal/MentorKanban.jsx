import React from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { MoreHorizontal } from 'lucide-react';

export default function MentorKanban() {
  const { tasks, interns } = useWorkspace();

  // Similar logic to InternDashboard Kanban, but without filtering by assignee.
  const KANBAN_DATA = {
    TODO: { title: 'To Do', items: tasks.filter(t => t.status === 'TODO'), color: 'var(--color-accent)' },
    DONE: { title: 'Done', items: tasks.filter(t => t.status === 'DONE'), color: 'var(--color-card-pink)' }
  };

  return (
    <>
      <SEO title="Kanban Board | Taksha Nexus Workspace" />
      <div style={{ padding: 'var(--space-6)', maxWidth: '1400px', margin: '0 auto' }}>
        <header className="intern-tasks__header" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="intern-tasks__title">Global Kanban Board</h1>
            <p className="intern-tasks__subtitle">Track progress across all interns.</p>
          </div>
        </header>

        <section className="dashboard-widget">
          <div className="kanban-board">
            {Object.keys(KANBAN_DATA).map(status => {
              const col = KANBAN_DATA[status];
              return (
                <div key={status} className="kanban-col">
                  <div className="kanban-col__header" style={{ backgroundColor: col.color }}>
                    <span className="kanban-col__title">{col.title}</span>
                    <span className="kanban-col__count">{col.items.length}</span>
                  </div>
                  <div className="kanban-col__body">
                    {col.items.map(task => {
                       const assigneeName = interns.find(i => i.id === task.assignee)?.name || task.assignee;
                       return (
                        <div key={task.id} className="kanban-task">
                          <div className="kanban-task__top">
                            <h4 className="kanban-task__title">{task.title}</h4>
                            <button className="kanban-task__more"><MoreHorizontal size={16} /></button>
                          </div>
                          <span className="kanban-task__project">{task.project?.name || 'No Project'}</span>
                          <span className="kanban-task__project" style={{ fontWeight: 800 }}>Assigned to: {assigneeName}</span>
                          <div className="kanban-task__bottom">
                            <span className="kanban-task__priority" style={{ 
                              background: task.priority === 'High' ? 'var(--color-card-pink)' : 'transparent',
                              borderColor: 'var(--color-ink)'
                            }}>
                              {task.priority || 'Medium'}
                            </span>
                            <span className="kanban-task__date">
                              📅 {task.date}
                            </span>
                          </div>
                          

                        </div>
                       );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

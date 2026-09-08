import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import { Download, Loader } from 'lucide-react';
import './MentorReports.css';

export default function MentorReports() {
  const [summary, setSummary] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('taksha_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [sumRes, weekRes] = await Promise.all([
          axios.get(`${API_URL}/reports/summary`, { headers }),
          axios.get(`${API_URL}/reports/weekly-progress`, { headers })
        ]);
        
        setSummary(sumRes.data);
        setWeeklyProgress(weekRes.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  const handleExportCSV = () => {
    if (!summary) return;
    
    const rows = [
      ['Category', 'Metric', 'Value'],
      ['Tasks', 'Total', summary.tasks.total],
      ['Tasks', 'To Do', summary.tasks.todo],
      ['Tasks', 'In Progress', summary.tasks.inProgress],
      ['Tasks', 'Review', summary.tasks.review],
      ['Tasks', 'Done', summary.tasks.done],
      ['Interns', 'Total', summary.interns.total],
      ['Interns', 'On Track', summary.interns.onTrack],
      ['Interns', 'Behind', summary.interns.behind],
      ['Interns', 'At Risk', summary.interns.atRisk],
      ['Submissions', 'Total', summary.submissions.total],
      ['Submissions', 'Approved', summary.submissions.approved],
      ['Submissions', 'Pending', summary.submissions.pending],
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "taksha-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !summary) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader className="spin" size={40} />
      </div>
    );
  }

  const { tasks, interns } = summary;
  
  const onTrackPct = Math.round((interns.onTrack / interns.total) * 100) || 0;
  const behindPct = Math.round((interns.behind / interns.total) * 100) || 0;
  const atRiskPct = Math.round((interns.atRisk / interns.total) * 100) || 0;

  const maxWeeklyTasks = weeklyProgress ? Math.max(...weeklyProgress.map(w => w.count), 1) : 1;

  return (
    <>
      <SEO title="Reports & Analytics | Taksha Nexus Workspace" />
      <div className="mentor-reports">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Performance Reports</h1>
            <p className="intern-tasks__subtitle">Analytics and insights on intern progress.</p>
          </div>
          
          <div>
            <button 
              className="intern-btn intern-btn--assign" 
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              onClick={handleExportCSV}
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </header>

        <div className="reports-grid">
          <div className="report-card">
            <div className="report-card__header">
              <h2 className="report-card__title">Task Distribution</h2>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>All Time</span>
            </div>
            
            <div className="mock-bar-chart">
              <div className="mock-bar" style={{ height: `${(tasks.todo / tasks.total) * 100}%` }}><strong>{tasks.todo}</strong><span>To Do</span></div>
              <div className="mock-bar" style={{ height: `${(tasks.inProgress / tasks.total) * 100}%`, background: 'var(--color-card-purple)' }}><strong>{tasks.inProgress}</strong><span>Working</span></div>
              <div className="mock-bar" style={{ height: `${(tasks.review / tasks.total) * 100}%`, background: 'var(--color-accent)' }}><strong>{tasks.review}</strong><span>Review</span></div>
              <div className="mock-bar" style={{ height: `${(tasks.done / tasks.total) * 100}%`, background: 'var(--color-card-pink)' }}><strong>{tasks.done}</strong><span>Done</span></div>
            </div>
          </div>

          <div className="report-card">
            <div className="report-card__header">
              <h2 className="report-card__title">Intern Progress Status</h2>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Current Cohort</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 800 }}>
                  <span>On Track</span>
                  <span>{onTrackPct}%</span>
                </div>
                <div style={{ width: '100%', height: '16px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)' }}>
                  <div style={{ width: `${onTrackPct}%`, height: '100%', background: 'var(--color-card-mint)', borderRight: '2px solid var(--color-ink)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 800 }}>
                  <span>Behind</span>
                  <span>{behindPct}%</span>
                </div>
                <div style={{ width: '100%', height: '16px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)' }}>
                  <div style={{ width: `${behindPct}%`, height: '100%', background: 'var(--color-card-pink)', borderRight: '2px solid var(--color-ink)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 800 }}>
                  <span>At Risk</span>
                  <span>{atRiskPct}%</span>
                </div>
                <div style={{ width: '100%', height: '16px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)' }}>
                  <div style={{ width: `${atRiskPct}%`, height: '100%', background: 'var(--color-card-purple)', borderRight: '2px solid var(--color-ink)' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="report-card" style={{ gridColumn: '1 / -1' }}>
            <div className="report-card__header">
              <h2 className="report-card__title">Completed Tasks Velocity</h2>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Last 8 Weeks</span>
            </div>
            
            <div className="mock-bar-chart" style={{ height: '200px' }}>
              {weeklyProgress && weeklyProgress.map((week, idx) => (
                <div 
                  key={idx} 
                  className="mock-bar" 
                  style={{ 
                    height: `${(week.count / maxWeeklyTasks) * 100}%`, 
                    background: 'var(--color-card-cyan)',
                    minHeight: week.count > 0 ? '20px' : '0px'
                  }}
                >
                  <strong>{week.count}</strong>
                  <span>{week.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

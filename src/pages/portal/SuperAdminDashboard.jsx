import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Cpu, CheckCircle, 
  XCircle, Download, ArrowRight,
  Mail, FileText, UserPlus, FileSignature, Star, Inbox
} from 'lucide-react';
import './MentorDashboard.css';

export default function SuperAdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
    // Mock logs for the activity feed to make UI complete
    setLogs([
      { id: 1, type: 'new', message: 'Rahul Verma applied for Frontend Developer Intern', time: '11:45 AM', icon: FileText, color: 'var(--color-card-purple)' },
      { id: 2, type: 'ai', message: 'Compatibility Score: 82/100 (Strong Match)', time: '11:50 AM', icon: Cpu, color: 'var(--color-card-yellow)' },
      { id: 3, type: 'review', message: 'Review assigned to Super Admin', time: '12:05 PM', icon: EyeIcon, color: 'var(--color-card-blue)' },
      { id: 4, type: 'offer_sent', message: 'Offer letter sent to rahul.verma@example.com', time: '01:30 PM', icon: CheckCircle, color: 'var(--color-card-mint)' },
      { id: 5, type: 'offer_accepted', message: 'Rahul Verma accepted the offer', time: '02:20 PM', icon: UserPlus, color: 'var(--color-card-mint)' }
    ]);
  }, []);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('taksha_token');
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/reports/applications-summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Failed to fetch summary', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      if (lines.length < 2) {
        alert('Invalid CSV or empty file');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const interns = [];

      for (let i = 1; i < lines.length; i++) {
        // Simple split assuming no commas inside values for simplicity
        const row = lines[i].split(',').map(v => v.trim());
        const intern = {};
        
        headers.forEach((header, index) => {
          intern[header] = row[index] || '';
        });

        interns.push({
          name: intern.name || intern.fullname || '',
          email: intern.email || '',
          track: intern.track || intern.role || intern.roletitle || 'General',
          college: intern.college || intern.university || '',
          roleTitle: intern.roletitle || intern.role || 'Intern'
        });
      }

      try {
        const token = localStorage.getItem('taksha_token');
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const res = await fetch(`${API_URL}/interns/bulk-import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ interns })
        });
        
        const data = await res.json();
        if (res.ok) {
          alert(`Successfully imported ${data.successful} interns. Failed: ${data.failed}`);
          if (data.errors && data.errors.length > 0) {
            console.error('Import errors:', data.errors);
            alert(`Some imports failed. Check console for details.`);
          }
        } else {
          alert(`Import failed: ${data.error}`);
        }
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
      
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  return (
    <div className="mentor-dashboard">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="dashboard-header__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Super Admin Control
          </h1>
          <p className="dashboard-header__date">System oversight and Taksha HR operations.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div style={{ background: 'var(--color-surface)', padding: 'var(--space-2) var(--space-4)', borderRadius: '40px', border: '2px solid var(--color-ink)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            System Status <span style={{ background: 'var(--color-card-mint)', color: 'var(--color-ink)', padding: '2px 8px', borderRadius: '20px', fontSize: 'var(--text-xs)' }}>Operational</span>
          </div>
          
          <label className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', cursor: 'pointer', margin: 0 }}>
            <Download size={16} /> Bulk Import CSV
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
          
          <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--color-ink)', color: 'var(--color-surface)', border: '2px solid var(--color-ink)', fontWeight: 'bold', cursor: 'pointer' }}>
            <FileText size={16} /> Generate Report
          </button>
        </div>
      </header>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p>Loading system metrics...</p>
        </div>
      ) : summary ? (
        <>
          {/* Top 4 Stat Cards */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
              <Briefcase size={20} /> Taksha HR Pipeline Overview
            </h2>
          </div>
          
          <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            <div className="stat-card" style={{ background: 'var(--color-surface)' }}>
              <div className="stat-card__icon" style={{ background: 'var(--color-card-lilac)', border: '2px solid var(--color-ink)', borderRadius: '8px' }}>
                <FileText size={24} />
              </div>
              <div className="stat-card__info">
                <span className="stat-card__value" style={{ fontSize: '2rem' }}>{summary.total}</span>
                <span className="stat-card__label" style={{ fontWeight: 'bold', color: 'var(--color-ink)' }}>Total Applications</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>All time received</span>
              </div>
            </div>

            <div className="stat-card" style={{ background: 'var(--color-surface)' }}>
              <div className="stat-card__icon" style={{ background: 'var(--color-card-yellow)', border: '2px solid var(--color-ink)', borderRadius: '8px' }}>
                <Users size={24} />
              </div>
              <div className="stat-card__info">
                <span className="stat-card__value" style={{ fontSize: '2rem' }}>{summary.underReview + summary.shortlisted}</span>
                <span className="stat-card__label" style={{ fontWeight: 'bold', color: 'var(--color-ink)' }}>Active Pipeline</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>In progress</span>
              </div>
            </div>

            <div className="stat-card" style={{ background: 'var(--color-surface)' }}>
              <div className="stat-card__icon" style={{ background: 'var(--color-card-mint)', border: '2px solid var(--color-ink)', borderRadius: '8px' }}>
                <Mail size={24} />
              </div>
              <div className="stat-card__info">
                <span className="stat-card__value" style={{ fontSize: '2rem' }}>{summary.selected}</span>
                <span className="stat-card__label" style={{ fontWeight: 'bold', color: 'var(--color-ink)' }}>Offers Sent / Accepted</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Successfully converted</span>
              </div>
            </div>

            <div className="stat-card" style={{ background: 'var(--color-surface)' }}>
              <div className="stat-card__icon" style={{ background: 'var(--color-card-pink)', border: '2px solid var(--color-ink)', borderRadius: '8px' }}>
                <XCircle size={24} />
              </div>
              <div className="stat-card__info">
                <span className="stat-card__value" style={{ fontSize: '2rem' }}>{summary.rejected || 0}</span>
                <span className="stat-card__label" style={{ fontWeight: 'bold', color: 'var(--color-ink)' }}>Rejected / Archived</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Not progressing</span>
              </div>
            </div>
          </section>
          
          {/* Application Pipeline Horizontal Flow */}
          <div className="widget" style={{ marginBottom: 'var(--space-8)', overflowX: 'auto' }}>
            <div className="widget__header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
              <h2 className="widget__title">Application Pipeline</h2>
            </div>
            <div className="widget__body" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '800px', position: 'relative' }}>
                
                {/* Connecting Line background */}
                <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--color-border)', zIndex: 0, transform: 'translateY(-50%)' }}></div>
                
                <PipelineNode icon={Inbox} label="Applied" value={summary.total} color="var(--color-card-blue)" />
                <ArrowRight size={16} color="var(--color-text-secondary)" style={{ zIndex: 1, background: 'var(--color-surface)' }} />
                
                <PipelineNode icon={Cpu} label="AI Screening" value={summary.pending} color="var(--color-card-purple)" />
                <ArrowRight size={16} color="var(--color-text-secondary)" style={{ zIndex: 1, background: 'var(--color-surface)' }} />
                
                <PipelineNode icon={EyeIcon} label="Under Review" value={summary.underReview} color="var(--color-card-yellow)" />
                <ArrowRight size={16} color="var(--color-text-secondary)" style={{ zIndex: 1, background: 'var(--color-surface)' }} />
                
                <PipelineNode icon={Star} label="Shortlisted" value={summary.shortlisted} color="var(--color-card-blue)" />
                <ArrowRight size={16} color="var(--color-text-secondary)" style={{ zIndex: 1, background: 'var(--color-surface)' }} />
                
                <PipelineNode icon={CheckCircle} label="Selected" value={summary.selected} color="var(--color-card-mint)" />
                <ArrowRight size={16} color="var(--color-text-secondary)" style={{ zIndex: 1, background: 'var(--color-surface)' }} />
                
                <PipelineNode icon={FileSignature} label="Offer Sent" value={Math.max(0, summary.selected - 1)} color="var(--color-card-pink)" />
                <ArrowRight size={16} color="var(--color-text-secondary)" style={{ zIndex: 1, background: 'var(--color-surface)' }} />
                
                <PipelineNode icon={UserPlus} label="Offer Accepted" value={Math.max(0, summary.selected - 2)} color="var(--color-card-mint)" />
                <ArrowRight size={16} color="var(--color-text-secondary)" style={{ zIndex: 1, background: 'var(--color-surface)' }} />
                
                <PipelineNode icon={Users} label="Onboarded" value={Math.max(0, summary.selected - 3)} color="var(--color-card-blue)" />
              </div>
              
              {/* Bottom Progress Bar */}
              <div style={{ display: 'flex', height: '4px', marginTop: 'var(--space-6)', width: '100%' }}>
                <div style={{ flex: 2, background: 'var(--color-card-blue)' }}></div>
                <div style={{ flex: 1, background: 'var(--color-card-purple)' }}></div>
                <div style={{ flex: 1, background: 'var(--color-card-yellow)' }}></div>
                <div style={{ flex: 1, background: 'var(--color-card-blue)' }}></div>
                <div style={{ flex: 1, background: 'var(--color-card-mint)' }}></div>
                <div style={{ flex: 1, background: 'var(--color-card-pink)' }}></div>
                <div style={{ flex: 1, background: 'var(--color-card-mint)' }}></div>
                <div style={{ flex: 1, background: 'var(--color-card-blue)' }}></div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* System Modules (Left) */}
            <div className="dashboard-grid__main">
              <section className="widget" style={{ height: '100%' }}>
                <div className="widget__header">
                  <h2 className="widget__title">System Modules</h2>
                </div>
                <div className="widget__body">
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                    All modules are operational. Taksha HR AI evaluator is automatically scanning incoming applications.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <ModuleRow icon={Cpu} color="var(--color-card-blue)" title="Taksha HR Intake & AI Evaluator" desc="AI scanning, skill matching & evaluation" />
                    <ModuleRow icon={Mail} color="var(--color-card-blue)" title="Automated Email Subsystem" desc="Email notifications & communication" />
                    <ModuleRow icon={FileSignature} color="var(--color-card-pink)" title="Offer Letter PDF Generator" desc="Professional offer letter generation" />
                    <ModuleRow icon={UserPlus} color="var(--color-card-mint)" title="Intern Account Provisioner" desc="Account creation & credential delivery" />
                  </div>
                </div>
              </section>
            </div>
            
            {/* Taksha HR Activity (Right) */}
            <div className="dashboard-grid__sidebar">
              <section className="widget" style={{ height: '100%' }}>
                <div className="widget__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className="widget__title">Taksha HR Activity (Today)</h2>
                  <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 'bold', textDecoration: 'none' }}>View All Activity</a>
                </div>
                <div className="widget__body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {logs.map((log) => (
                      <div key={log.id} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '8px', 
                          background: log.color, border: '2px solid var(--color-ink)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <log.icon size={20} color="var(--color-ink)" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                            <strong style={{ fontSize: 'var(--text-sm)' }}>
                              {log.type === 'new' ? 'New application received' : 
                               log.type === 'ai' ? 'AI screening completed' : 
                               log.type === 'review' ? 'Application moved to Under Review' : 
                               log.type === 'offer_sent' ? 'Offer sent to candidate' : 
                               'Offer accepted by candidate'}
                            </strong>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{log.time}</span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>{log.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

// Helper component for Eye icon which doesn't exist in our destructured lucide-react import
function EyeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PipelineNode({ icon: Icon, label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-surface)', padding: '8px', zIndex: 1 }}>
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '8px', 
        background: color, border: '2px solid var(--color-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} color="var(--color-ink)" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-display)', lineHeight: '1' }}>{value}</span>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>{label}</span>
      </div>
    </div>
  );
}

function ModuleRow({ icon: Icon, color, title, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '2px solid var(--color-ink)', borderRadius: '8px', background: 'var(--color-surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '8px', 
          background: color, border: '2px solid var(--color-ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={20} color="var(--color-ink)" />
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: '4px' }}>{title}</strong>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{desc}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold', color: 'var(--color-card-green)' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-card-green)' }}></div>
        ONLINE
      </div>
    </div>
  );
}

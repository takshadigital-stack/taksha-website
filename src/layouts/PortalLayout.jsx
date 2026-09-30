import React, { useState, useEffect } from 'react';
import { Outlet, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, Calendar, Info, User, Settings,
  Bell, Menu, X, LayoutDashboard, FolderKanban,
  UploadCloud, Clock, Users, FileCheck, BarChart2, Briefcase, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './PortalLayout.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const INTERN_NAV_LINKS = [
  { path: '/intern/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/intern/tasks', label: 'My Tasks', icon: CheckSquare },
  { path: '/intern/projects', label: 'My Projects', icon: FolderKanban },
  { path: '/intern/submissions', label: 'Submissions', icon: UploadCloud },
  { path: '/intern/calendar', label: 'Calendar', icon: Calendar },
  { path: '/intern/leave', label: 'Leave', icon: Clock },
  { path: '/intern/messages', label: 'Messages', icon: MessageSquare }
];

const MENTOR_NAV_LINKS = [
  { path: '/mentor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/mentor/interns', label: 'My Interns', icon: Users },
  { path: '/mentor/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/mentor/kanban', label: 'Kanban Board', icon: FolderKanban },
  { path: '/mentor/submissions', label: 'Submissions', icon: UploadCloud },
  { path: '/mentor/reviews', label: 'Reviews', icon: FileCheck },
  { path: '/mentor/leave', label: 'Leave Requests', icon: Clock },
  { path: '/mentor/messages', label: 'Messages', icon: MessageSquare },
  { path: '/mentor/reports', label: 'Reports', icon: BarChart2 }
];

const SUPERADMIN_NAV_LINKS = [
  { path: '/superadmin/dashboard', label: 'Taksha HR', icon: BarChart2 },
  { path: '/superadmin/applications', label: 'Applications Pipeline', icon: Briefcase },
  { path: '/mentor/dashboard', label: 'Mentor Portal View', icon: LayoutDashboard },
];

const INTERN_BOTTOM_LINKS = [
  { label: 'Internship Details', path: '/intern/details', icon: Info },
  { label: 'Profile', path: '/intern/profile', icon: User },
  { label: 'Settings', path: '/intern/settings', icon: Settings },
];

export default function PortalLayout({ role = 'intern' }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const allowed = user && (user.role === 'SUPER_ADMIN' ||
    user.role === (role === 'mentor' ? 'MENTOR' : role === 'superadmin' ? 'SUPER_ADMIN' : 'INTERN'));

  useEffect(() => {
    if (!allowed) return;
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('taksha_token');
        if (!token) return;
        const res = await fetch(`${API_URL}/messages/unread-count`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadMessages(data.unreadCount || 0);
        }
      } catch (e) {
        console.error("Failed to fetch unread messages", e);
      }
    };
    fetchUnread();

    if (role === 'mentor') {
      const fetchApps = async () => {
        try {
          const token = localStorage.getItem('taksha_token');
          const res = await fetch(`${API_URL}/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setApplications(data);
          }
        } catch (e) {
          console.error("Failed to fetch applications for notifications", e);
        }
      };
      fetchApps();
    }
  }, [role, location.pathname, allowed]); // Refresh when navigating


  const NAV_LINKS = role === 'superadmin' ? SUPERADMIN_NAV_LINKS : role === 'mentor' ? MENTOR_NAV_LINKS : INTERN_NAV_LINKS;
  
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setSidebarOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [location]);

  if (isLoading) return <div role="status">Loading workspace...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed) {
    const destination = user.role === 'MENTOR' ? 'mentor' : user.role === 'SUPER_ADMIN' ? 'superadmin' : 'intern';
    return <Navigate to={`/${destination}/dashboard`} replace />;
  }

  return (
    <div className="portal-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="portal-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Left Sidebar */}
      <aside className={`portal-sidebar ${isSidebarOpen ? 'portal-sidebar--open' : ''}`}>
        <div className="portal-sidebar__header">
          <Link to="/" className="portal-sidebar__logo-link">
            <div className="portal-sidebar__logo-box">T</div>
            <div className="portal-sidebar__logo-text">
              <span className="logo-taksha">taksha</span>
              <span className="logo-workspace">INTERNSHIP WORKSPACE</span>
            </div>
          </Link>
          <button className="portal-sidebar__close-mobile" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="portal-sidebar__nav">
          <ul className="portal-sidebar__list">
            {NAV_LINKS.map((link, index) => {
              const isActive = location.pathname === link.path;
              const linkNum = (index + 1).toString().padStart(2, '0');
              return (
                <li key={link.path} className="portal-sidebar__item">
                  <Link 
                    to={link.path} 
                    className={`portal-sidebar__link ${isActive ? 'portal-sidebar__link--active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="portal-sidebar__link-left">
                      <link.icon size={20} className="portal-sidebar__icon" />
                      <span className="portal-sidebar__label">{link.label}</span>
                    </div>
                    <span className="portal-sidebar__link-num">{linkNum}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="portal-sidebar__divider"></div>

          {role === 'intern' && (
            <ul className="portal-sidebar__list">
              {INTERN_BOTTOM_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path} className="portal-sidebar__item">
                    <Link 
                      to={link.path} 
                      className={`portal-sidebar__link ${isActive ? 'portal-sidebar__link--active' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <link.icon size={20} className="portal-sidebar__icon" />
                      <span className="portal-sidebar__label">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        {/* Decorative corner element based on mockup */}
        <div className="portal-sidebar__bottom-deco">
          <div className="dot-pattern"></div>
          <div className="purple-circle">
            <div className="yellow-cross">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4 L20 20 M20 4 L4 20" stroke="#f2c94c" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="portal-sidebar__footer">
          <div className="portal-sidebar__user">
            <div className="portal-user__avatar" style={{ background: 'var(--color-card-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', border: '2px solid var(--color-ink)' }}>
              {user?.initials || (role === 'mentor' ? 'MK' : 'KA')}
            </div>
            <div className="portal-user__info">
              <span className="portal-user__name">
                {user?.name || (role === 'superadmin' ? 'Super Admin' : role === 'mentor' ? 'Mentor Kamana' : 'Kamana Agrawal')}
              </span>
              <span className="portal-user__role">
                {role === 'superadmin' ? 'Super Admin' : role === 'mentor' ? 'Lead Mentor' : 'Frontend Intern'}
              </span>
            </div>
          </div>
          <button className="portal-logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="portal-main">
        {/* Top Header */}
        <header className="portal-header">
          <button className="portal-header__hamburger" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          
          <div className="portal-header__actions">
            <div style={{ position: 'relative' }}>
              <button 
                className="portal-header__btn portal-header__btn--bell"
                onClick={() => { setNotifOpen(!isNotifOpen); setProfileOpen(false); }}
              >
                <Bell size={20} strokeWidth={2.5} />
                <span className="portal-header__badge">{role === 'mentor' ? applications.length + unreadMessages : 3 + unreadMessages}</span>
              </button>
              
              {isNotifOpen && (
                <div className="portal-dropdown">
                  <div className="portal-dropdown__header">Notifications</div>
                  
                  {role === 'mentor' ? (
                    <>
                      {unreadMessages > 0 && (
                        <Link to="/mentor/messages" className="portal-dropdown__item" style={{ textDecoration: 'none' }}>
                          <span className="portal-dropdown__title">New Messages</span>
                          <span className="portal-dropdown__desc">You have {unreadMessages} unread messages</span>
                        </Link>
                      )}
                      {applications.length === 0 ? (
                        <div className="portal-dropdown__item"><span className="portal-dropdown__desc">No new applications.</span></div>
                      ) : (
                        applications.slice(0, 5).map(app => (
                          <div className="portal-dropdown__item" key={app.id}>
                            <span className="portal-dropdown__title">New Application</span>
                            <span className="portal-dropdown__desc">{app.name} applied for {app.roleTitle}</span>
                          </div>
                        ))
                      )}
                    </>
                  ) : (
                    <>
                      {unreadMessages > 0 && (
                        <Link to="/intern/messages" className="portal-dropdown__item" style={{ textDecoration: 'none' }}>
                          <span className="portal-dropdown__title">New Messages</span>
                          <span className="portal-dropdown__desc">You have {unreadMessages} unread messages</span>
                        </Link>
                      )}
                      <div className="portal-dropdown__item">
                        <span className="portal-dropdown__title">New Task Assigned</span>
                        <span className="portal-dropdown__desc">Mentor Kamana assigned you "Responsive Navbar"</span>
                      </div>
                      <div className="portal-dropdown__item">
                        <span className="portal-dropdown__title">Leave Approved</span>
                        <span className="portal-dropdown__desc">Your sick leave for May 15 was approved.</span>
                      </div>
                      <div className="portal-dropdown__item">
                        <span className="portal-dropdown__title">Company Meeting</span>
                        <span className="portal-dropdown__desc">All hands meeting starts in 15 mins.</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button 
                className="portal-header__btn portal-header__btn--bell"
                onClick={() => { setProfileOpen(!isProfileOpen); setNotifOpen(false); }}
              >
                <User size={20} strokeWidth={2.5} />
              </button>
              
              {isProfileOpen && (
                <div className="portal-dropdown">
                  <div className="portal-dropdown__header" style={{ background: 'var(--color-card-mint)' }}>Profile & Settings</div>
                  <Link to={`/${role}/profile`} className="portal-dropdown__item">
                    <span className="portal-dropdown__title">My Profile</span>
                    <span className="portal-dropdown__desc">View your official record</span>
                  </Link>
                  <Link to={`/${role}/settings`} className="portal-dropdown__item">
                    <span className="portal-dropdown__title">Settings</span>
                    <span className="portal-dropdown__desc">Change password & notifications</span>
                  </Link>
                  <div className="portal-dropdown__item" onClick={handleLogout} style={{ borderTop: '2px solid var(--color-ink)' }}>
                    <span className="portal-dropdown__title" style={{ color: 'var(--color-card-pink)' }}>Log Out</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

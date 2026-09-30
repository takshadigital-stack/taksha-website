/**
 * Router — React Router v6 data router configuration
 * PRD §5.3 — All routes with React.lazy() code splitting
 */
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RouteError from './pages/RouteError';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import PortalLayout from './layouts/PortalLayout';

// Lazy-loaded page components for route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const ServicesIndex = lazy(() => import('./pages/ServicesIndex'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Process = lazy(() => import('./pages/Process'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const JournalIndex = lazy(() => import('./pages/JournalIndex'));
const Article = lazy(() => import('./pages/Article'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Careers = lazy(() => import('./pages/Careers'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const ChangePassword = lazy(() => import('./pages/auth/ChangePassword'));

// Portal Pages
const InternDashboard = lazy(() => import('./pages/portal/InternDashboard'));
const InternTasks = lazy(() => import('./pages/portal/InternTasks'));
const InternProjects = lazy(() => import('./pages/portal/InternProjects'));
const InternSubmissions = lazy(() => import('./pages/portal/InternSubmissions'));
const InternCalendar = lazy(() => import('./pages/portal/InternCalendar'));
const InternLeave = lazy(() => import('./pages/portal/InternLeave'));
const InternDetails = lazy(() => import('./pages/portal/InternDetails'));
const InternProfile = lazy(() => import('./pages/portal/InternProfile'));
const InternSettings = lazy(() => import('./pages/portal/InternSettings'));
const InternMessages = lazy(() => import('./pages/portal/InternMessages'));

const MentorDashboard = lazy(() => import('./pages/portal/MentorDashboard'));
const MentorInterns = lazy(() => import('./pages/portal/MentorInterns'));
const MentorInternDetail = lazy(() => import('./pages/portal/MentorInternDetail'));
const MentorTasks = lazy(() => import('./pages/portal/MentorTasks'));
const MentorKanban = lazy(() => import('./pages/portal/MentorKanban'));
const MentorSubmissions = lazy(() => import('./pages/portal/MentorSubmissions'));
const MentorReviews = lazy(() => import('./pages/portal/MentorReviews'));
const MentorReports = lazy(() => import('./pages/portal/MentorReports'));
const MentorProfile = lazy(() => import('./pages/portal/MentorProfile'));
const MentorSettings = lazy(() => import('./pages/portal/MentorSettings'));
const MentorMessages = lazy(() => import('./pages/portal/MentorMessages'));

const SuperAdminDashboard = lazy(() => import('./pages/portal/SuperAdminDashboard'));
const SuperAdminApplications = lazy(() => import('./pages/portal/SuperAdminApplications'));
const OfferResponse = lazy(() => import('./pages/OfferResponse'));

// Suspense wrapper with minimal loading state
function SuspenseWrapper({ children }) {
  return (
    <Suspense
      fallback={
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="loader-line" aria-label="Loading page" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <SuspenseWrapper><Login /></SuspenseWrapper>,
      },
      {
        path: '/change-password',
        element: <SuspenseWrapper><ChangePassword /></SuspenseWrapper>,
      },
    ],
  },
  {
    errorElement: <RouteError />,
    element: <PortalLayout role="intern" />,
    children: [
      {
        path: '/intern/dashboard',
        element: <SuspenseWrapper><InternDashboard /></SuspenseWrapper>,
      },
      { path: '/intern/tasks', element: <SuspenseWrapper><InternTasks /></SuspenseWrapper> },
      { path: '/intern/projects', element: <SuspenseWrapper><InternProjects /></SuspenseWrapper> },
      { path: '/intern/submissions', element: <SuspenseWrapper><InternSubmissions /></SuspenseWrapper> },
      { path: '/intern/calendar', element: <SuspenseWrapper><InternCalendar /></SuspenseWrapper> },
      { path: '/intern/leave', element: <SuspenseWrapper><InternLeave /></SuspenseWrapper> },
      { path: '/intern/details', element: <SuspenseWrapper><InternDetails /></SuspenseWrapper> },
      { path: '/intern/profile', element: <SuspenseWrapper><InternProfile /></SuspenseWrapper> },
      { path: '/intern/settings', element: <SuspenseWrapper><InternSettings /></SuspenseWrapper> },
      { path: '/intern/messages', element: <SuspenseWrapper><InternMessages /></SuspenseWrapper> },
    ],
  },
  {
    errorElement: <RouteError />,
    element: <PortalLayout role="mentor" />,
    children: [
      {
        path: '/mentor/dashboard',
        element: <SuspenseWrapper><MentorDashboard /></SuspenseWrapper>,
      },
      { path: '/mentor/interns', element: <SuspenseWrapper><MentorInterns /></SuspenseWrapper> },
      { path: '/mentor/interns/:internId', element: <SuspenseWrapper><MentorInternDetail /></SuspenseWrapper> },
      { path: '/mentor/tasks', element: <SuspenseWrapper><MentorTasks /></SuspenseWrapper> },
      { path: '/mentor/kanban', element: <SuspenseWrapper><MentorKanban /></SuspenseWrapper> },
      { path: '/mentor/submissions', element: <SuspenseWrapper><MentorSubmissions /></SuspenseWrapper> },
      { path: '/mentor/reviews', element: <SuspenseWrapper><MentorReviews /></SuspenseWrapper> },
      { path: '/mentor/leave', element: <SuspenseWrapper><InternLeave /></SuspenseWrapper> },
      { path: '/mentor/reports', element: <SuspenseWrapper><MentorReports /></SuspenseWrapper> },
      { path: '/mentor/profile', element: <SuspenseWrapper><MentorProfile /></SuspenseWrapper> },
      { path: '/mentor/settings', element: <SuspenseWrapper><MentorSettings /></SuspenseWrapper> },
      { path: '/mentor/messages', element: <SuspenseWrapper><MentorMessages /></SuspenseWrapper> },
    ],
  },
  {
    errorElement: <RouteError />,
    element: <PortalLayout role="superadmin" />,
    children: [
      {
        path: '/superadmin/dashboard',
        element: <SuspenseWrapper><SuperAdminDashboard /></SuspenseWrapper>,
      },
      { path: '/superadmin/applications', element: <SuspenseWrapper><SuperAdminApplications /></SuspenseWrapper> },
    ],
  },
  {
    errorElement: <RouteError />,
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SuspenseWrapper><Home /></SuspenseWrapper>,
      },
      {
        path: '/work',
        element: <SuspenseWrapper><Work /></SuspenseWrapper>,
      },
      {
        path: '/work/:slug',
        element: <SuspenseWrapper><CaseStudy /></SuspenseWrapper>,
      },
      {
        path: '/services',
        element: <SuspenseWrapper><ServicesIndex /></SuspenseWrapper>,
      },
      {
        path: '/services/:slug',
        element: <SuspenseWrapper><ServiceDetail /></SuspenseWrapper>,
      },
      {
        path: '/process',
        element: <SuspenseWrapper><Process /></SuspenseWrapper>,
      },
      {
        path: '/about',
        element: <SuspenseWrapper><About /></SuspenseWrapper>,
      },
      {
        path: '/contact',
        element: <SuspenseWrapper><Contact /></SuspenseWrapper>,
      },
      {
        path: '/journal',
        element: <SuspenseWrapper><JournalIndex /></SuspenseWrapper>,
      },
      {
        path: '/journal/:slug',
        element: <SuspenseWrapper><Article /></SuspenseWrapper>,
      },
      {
        path: '/privacy-policy',
        element: <SuspenseWrapper><PrivacyPolicy /></SuspenseWrapper>,
      },
      {
        path: '/terms-and-conditions',
        element: <SuspenseWrapper><Terms /></SuspenseWrapper>,
      },
      {
        path: '/careers',
        element: <SuspenseWrapper><Careers /></SuspenseWrapper>,
      },
      {
        path: '/verify',
        element: <SuspenseWrapper><VerifyCertificate /></SuspenseWrapper>,
      },
      {
        path: '/verify/:certificateNumber',
        element: <SuspenseWrapper><VerifyCertificate /></SuspenseWrapper>,
      },
      {
        path: '/offer-response/:id',
        element: <SuspenseWrapper><OfferResponse /></SuspenseWrapper>,
      },
      {
        path: '*',
        element: <SuspenseWrapper><NotFound /></SuspenseWrapper>,
      },
    ],
  },
]);

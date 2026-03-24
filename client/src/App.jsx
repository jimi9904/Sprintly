import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './redux/slices/authSlice';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
const Login = React.lazy(() => import('./features/auth/Login'));
const Register = React.lazy(() => import('./features/auth/Register'));
const ForgotPassword = React.lazy(() => import('./features/auth/ForgotPassword'));
const DashboardHome = React.lazy(() => import('./features/dashboard/DashboardHome'));
const LandingPage = React.lazy(() => import('./features/landing/LandingPage'));

// Components
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';

const Projects = React.lazy(() => import('./features/projects/Projects'));
const ProjectDetails = React.lazy(() => import('./features/projects/ProjectDetails'));
const Settings = React.lazy(() => import('./features/settings/Settings'));
const MyTasks = React.lazy(() => import('./features/tasks/MyTasks'));
const Team = React.lazy(() => import('./features/team/Team'));
const SpaceDetails = React.lazy(() => import('./features/projects/SpaceDetails'));
const FolderDetails = React.lazy(() => import('./features/projects/FolderDetails'));

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch]);

  // Apply theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize AOS scroll animations globally
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: false,
      offset: 60,
      delay: 0,
    });
    // Refresh AOS on route changes so newly mounted elements animate
    return () => AOS.refresh();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          loading ? (
            <div className="flex items-center justify-center h-screen bg-stone-50 dark:bg-stone-900">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <React.Suspense fallback={<PageLoader />}>
              <LandingPage />
            </React.Suspense>
          )
        } />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            <React.Suspense fallback={<PageLoader />}>
              <Login />
            </React.Suspense>
          } />
          <Route path="/register" element={
            <React.Suspense fallback={<PageLoader />}>
              <Register />
            </React.Suspense>
          } />
          <Route path="/forgot-password" element={
            <React.Suspense fallback={<PageLoader />}>
              <ForgotPassword />
            </React.Suspense>
          } />
        </Route>

        {/* Protected Routes (Dashboard) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={
            <React.Suspense fallback={<PageLoader />}>
              <DashboardHome />
            </React.Suspense>
          } />
          <Route path="projects" element={
            <React.Suspense fallback={<PageLoader />}>
              <Projects />
            </React.Suspense>
          } />
          <Route path="projects/:id" element={
            <React.Suspense fallback={<PageLoader />}>
              <ProjectDetails />
            </React.Suspense>
          } />

          <Route path="spaces/:id" element={
            <React.Suspense fallback={<PageLoader />}>
              <SpaceDetails />
            </React.Suspense>
          } />
          <Route path="folders/:id" element={
            <React.Suspense fallback={<PageLoader />}>
              <FolderDetails />
            </React.Suspense>
          } />

          <Route path="my-tasks" element={
            <React.Suspense fallback={<PageLoader />}>
              <MyTasks />
            </React.Suspense>
          } />
          <Route path="team" element={
            <React.Suspense fallback={<PageLoader />}>
              <Team />
            </React.Suspense>
          } />
          <Route path="settings" element={
            <React.Suspense fallback={<PageLoader />}>
              <Settings />
            </React.Suspense>
          } />
          {/* Add more protected routes here */}
        </Route>

        {/* Redirect unknown routes to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

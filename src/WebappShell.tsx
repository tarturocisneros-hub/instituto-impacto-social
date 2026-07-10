import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import Gamification from './pages/Gamification';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', flexDirection: 'column', gap: '1rem'
      }}>
        <div className="spinner" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/plataforma/login" replace />;
  return <>{children}</>;
}

function WebappRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="login" element={user ? <Navigate to="/plataforma/dashboard" /> : <Login />} />
      <Route path="register" element={user ? <Navigate to="/plataforma/dashboard" /> : <Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/plataforma/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<NewProject />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="gamification" element={<Gamification />} />
      </Route>
      <Route path="*" element={<Navigate to="/plataforma/dashboard" replace />} />
    </Routes>
  );
}

export default function WebappShell() {
  return (
    <AuthProvider>
      <WebappRoutes />
    </AuthProvider>
  );
}

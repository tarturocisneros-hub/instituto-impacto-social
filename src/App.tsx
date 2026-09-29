import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './pages/landing/ErrorBoundary';

const LandingPage = React.lazy(() => import('./pages/landing/LandingPage'));
const BootcampPage = React.lazy(() => import('./pages/landing/BootcampPage'));
const WebappShell = React.lazy(() => import('./WebappShell'));

function AppError() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', flexDirection: 'column', gap: '1rem',
      padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif',
    }}>
      <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Algo salió mal al cargar la página</h1>
      <p style={{ color: '#555', margin: 0 }}>
        Intenta recargar. Si el problema continúa, escríbenos a
        contacto@impactosocialmexico.org.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px',
          background: '#1e3a5f', color: '#fff', fontWeight: 600, cursor: 'pointer',
        }}
      >
        Recargar
      </button>
    </div>
  );
}

function LoadingSpinner() {
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

export default function App() {
  return (
    <ErrorBoundary fallback={<AppError />}>
      <Routes>
        {/* Public landing page — no auth context */}
        <Route path="/" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LandingPage />
          </Suspense>
        } />

        {/* Dedicated bootcamp registration landing (for ad campaigns) */}
        <Route path="/bootcamp" element={
          <Suspense fallback={<LoadingSpinner />}>
            <BootcampPage />
          </Suspense>
        } />

        {/* Webapp under /plataforma — wrapped in AuthProvider */}
        <Route path="/plataforma/*" element={
          <Suspense fallback={<LoadingSpinner />}>
            <WebappShell />
          </Suspense>
        } />

        {/* Catch-all: redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

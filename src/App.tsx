import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LandingPage = React.lazy(() => import('./pages/landing/LandingPage'));
const WebappShell = React.lazy(() => import('./WebappShell'));

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
    <Routes>
      {/* Public landing page — no auth context */}
      <Route path="/" element={
        <Suspense fallback={<LoadingSpinner />}>
          <LandingPage />
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
  );
}

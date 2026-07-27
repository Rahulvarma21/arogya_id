import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import PatientDashboard from './pages/Patient/Dashboard';
import SubmitClaim from './pages/Patient/SubmitClaim';
import ClaimDetails from './pages/Patient/ClaimDetails';
import InsurerDashboard from './pages/Insurer/Dashboard';
import ClaimReview from './pages/Insurer/ClaimReview';

// Authenticated Layout Wrapper
const DashboardLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Root index redirect router
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'insurer') {
    return <Navigate to="/insurer/dashboard" replace />;
  }

  return <Navigate to="/patient/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside Layout */}
          <Route element={<DashboardLayout />}>
            {/* Patient Portals */}
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/submit"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <SubmitClaim />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/claim/:id"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <ClaimDetails />
                </ProtectedRoute>
              }
            />

            {/* Insurer Portals */}
            <Route
              path="/insurer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['insurer']}>
                  <InsurerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insurer/claim/:id"
              element={
                <ProtectedRoute allowedRoles={['insurer']}>
                  <ClaimReview />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Root Redirect handler */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Fallback Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

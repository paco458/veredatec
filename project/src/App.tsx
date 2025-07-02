import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import FootprintPage from './pages/FootprintPage';
import BlogPage from './pages/BlogPage';
import ResourcesPage from './pages/ResourcesPage';
import CommunityPage from './pages/CommunityPage';
import FilesPage from './pages/FilesPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/footprint" element={
          <ProtectedRoute>
            <Layout>
              <FootprintPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/blog" element={
          <ProtectedRoute>
            <Layout>
              <BlogPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/resources" element={
          <ProtectedRoute>
            <Layout>
              <ResourcesPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/community" element={
          <ProtectedRoute>
            <Layout>
              <CommunityPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/files" element={
          <ProtectedRoute>
            <Layout>
              <FilesPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/stats" element={
          <ProtectedRoute>
            <Layout>
              <StatsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
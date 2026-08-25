import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import StudentDashboard from './components/student/StudentDashboard';
import UniversityDashboard from './components/university/UniversityDashboard';
import CompanyDashboard from './components/company/CompanyDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: string }> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}`} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <LoginForm />} 
      />
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/university" 
        element={
          <ProtectedRoute allowedRole="university">
            <UniversityDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/company" 
        element={
          <ProtectedRoute allowedRole="company">
            <CompanyDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to={`/${user?.role}`} replace /> : 
            <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
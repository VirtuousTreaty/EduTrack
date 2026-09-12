import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import StudentDashboard from './components/student/StudentDashboard';
import UniversityDashboard from './components/university/UniversityDashboard';
import CompanyDashboard from './components/company/CompanyDashboard';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: string }> = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}`} replace />;
  }
  
  return <>{children}</>;
};

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
      <h1 className="text-6xl font-extrabold text-indigo-500 mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-6">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-lg text-sm transition-colors">
        Return to Portal
      </Link>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
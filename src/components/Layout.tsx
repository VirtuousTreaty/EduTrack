import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, GraduationCap, Building2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'student':
        return <GraduationCap className="w-5 h-5" />;
      case 'university':
        return <Building2 className="w-5 h-5" />;
      case 'company':
        return <User className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'student':
        return 'from-blue-600 to-indigo-700';
      case 'university':
        return 'from-green-600 to-emerald-700';
      case 'company':
        return 'from-purple-600 to-violet-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`bg-gradient-to-r ${getRoleColor()} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-white text-2xl font-bold">EduTrack</h1>
              <span className="ml-4 text-white/80 text-sm capitalize">
                {user?.role} Portal
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                {getRoleIcon()}
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
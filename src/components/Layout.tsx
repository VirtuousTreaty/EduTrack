import React from 'react';
import { useAuth } from '../hooks/useAuth';
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
        return 'from-blue-600 via-indigo-600 to-indigo-700';
      case 'university':
        return 'from-emerald-600 via-teal-600 to-emerald-700';
      case 'company':
        return 'from-purple-600 via-violet-600 to-purple-700';
      default:
        return 'from-slate-700 to-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className={`bg-gradient-to-r ${getRoleColor()} shadow-md text-white border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="bg-white/20 p-2 rounded-lg text-white font-extrabold text-lg tracking-tight">
                ET
              </span>
              <div>
                <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                  EduTrack
                </h1>
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  {user?.role} Portal
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white bg-white/10 px-3 py-1.5 rounded-lg text-sm border border-white/10">
                {getRoleIcon()}
                <span className="font-semibold">{user?.name}</span>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-1.5 bg-rose-500/80 hover:bg-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
          </div>
        </div>
        {children}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 EduTrack Platform - Academic Verification & Talent Matching</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

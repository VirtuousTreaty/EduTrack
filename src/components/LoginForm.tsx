import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Building2, Briefcase, Loader2, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'student' | 'university' | 'company'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('KIET GROUP OF INSTITUTIONS');
  const [course, setCourse] = useState('Computer Science and Engineering');
  const [year, setYear] = useState('3');
  const [industry, setIndustry] = useState('Technology');
  const [size, setSize] = useState('100-500 employees');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student' as const,
      name: 'Student',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      description: 'Access your academic records, certificates & resume'
    },
    {
      id: 'university' as const,
      name: 'University',
      icon: Building2,
      color: 'from-emerald-500 to-teal-600',
      description: 'Manage student records & verify certificates'
    },
    {
      id: 'company' as const,
      name: 'Company',
      icon: Briefcase,
      color: 'from-purple-500 to-violet-600',
      description: 'Discover talents & match top candidates'
    }
  ];

  const fillDemoCredentials = (role: 'student' | 'university' | 'company') => {
    setSelectedRole(role);
    setMode('login');
    const credentials = {
      student: { email: 'alice@student.edu', password: 'password123' },
      university: { email: 'admin@techuniversity.edu', password: 'password123' },
      company: { email: 'recruiter@techcorp.com', password: 'password123' }
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const res = await login(email, password, selectedRole);
        if (res.success) {
          navigate(`/${selectedRole}`);
        } else {
          setError(res.error || 'Invalid credentials. Please try again.');
        }
      } else {
        const res = await signup({
          email,
          password,
          role: selectedRole,
          name: name || (selectedRole === 'student' ? 'Demo Student' : selectedRole === 'university' ? 'Demo University' : 'Demo Company'),
          university,
          course,
          year,
          industry,
          size
        });
        if (res.success) {
          navigate(`/${selectedRole}`);
        } else {
          setError(res.error || 'Registration failed. Please check inputs.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full space-y-6 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduTrack Platform</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome to EduTrack</h2>
          <p className="text-slate-400 text-sm">Unified Academic Record & Recruitment Verification System</p>
        </div>

        {/* Mode Toggle (Login vs Register) */}
        <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        {mode === 'login' && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Fill Demo Credentials:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="py-2 px-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-xs font-medium transition-colors text-center"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('university')}
                className="py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-medium transition-colors text-center"
              >
                🏛️ University
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('company')}
                className="py-2 px-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-medium transition-colors text-center"
              >
                💼 Company
              </button>
            </div>
          </div>
        )}

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all text-center ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-lg text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="font-semibold text-xs">{role.name}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                {selectedRole === 'student' ? 'Full Name' : selectedRole === 'university' ? 'University Name' : 'Company Name'}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                placeholder={selectedRole === 'student' ? 'e.g. Anshika Middha' : selectedRole === 'university' ? 'e.g. KIET GROUP OF INSTITUTIONS' : 'e.g. TechCorp'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              placeholder="e.g. user@edutrack.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === 'signup' && selectedRole === 'student' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Course</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Academic Year</label>
                <select
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : `Register ${selectedRole.toUpperCase()} Account`}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
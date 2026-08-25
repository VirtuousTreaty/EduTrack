import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Building2, Briefcase, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'university' | 'company'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student' as const,
      name: 'Student',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      description: 'Access your academic records and portfolio'
    },
    {
      id: 'university' as const,
      name: 'University',
      icon: Building2,
      color: 'from-green-500 to-emerald-600',
      description: 'Manage student records and certificates'
    },
    {
      id: 'company' as const,
      name: 'Company',
      icon: Briefcase,
      color: 'from-purple-500 to-violet-600',
      description: 'Discover and recruit talented students'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        navigate(`/${selectedRole}`);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoCredentials = () => {
    const credentials = {
      student: 'alice@student.edu',
      university: 'admin@techuniversity.edu',
      company: 'recruiter@techcorp.com'
    };
    return credentials[selectedRole];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">EduTrack</h2>
          <p className="text-gray-300">Choose your portal to continue</p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedRole === role.id
                    ? `border-white bg-gradient-to-r ${role.color} shadow-lg scale-105`
                    : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Icon className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <h3 className="text-white font-semibold text-lg">{role.name}</h3>
                    <p className="text-white/80 text-sm">{role.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder={`Demo: ${getDemoCredentials()}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="Demo: any password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-300 text-sm text-center bg-red-900/30 py-2 px-4 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
              selectedRole === 'student'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                : selectedRole === 'university'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
            } shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              `Sign In as ${roles.find(r => r.id === selectedRole)?.name}`
            )}
          </button>
        </form>

        <div className="text-center text-white/70 text-sm">
          <p>Demo Application - Use any email/password combination</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
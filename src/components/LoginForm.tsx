import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  GraduationCap,
  Building2,
  Briefcase,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<
    'student' | 'university' | 'company'
  >('student');
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
      description: 'Access your academic records and portfolio'
    },
    {
      id: 'university' as const,
      name: 'University',
      icon: Building2,
      description: 'Manage student records and certificates'
    },
    {
      id: 'company' as const,
      name: 'Company',
      icon: Briefcase,
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
<div
  className="relative min-h-screen bg-black bg-no-repeat flex items-center justify-start px-6 lg:px-16 py-8"
  style={{
    backgroundImage:
      "url('https://i.pinimg.com/originals/1a/71/58/1a7158689e5ce37e5d78d97c332a003f.gif')",
    backgroundSize: '100% 100%',
    backgroundPosition: 'center'
  }}
>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Login container */}
      <div className="relative z-10 w-full max-w-[520px]">
        <div className="bg-slate-100 border border-slate-300 rounded-2xl shadow-2xl p-7">

          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-300 mb-4">
              <GraduationCap className="w-5 h-5 text-slate-800" />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              EduTrack
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose your portal to continue
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3 mb-7">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-colors ${
                    selectedRole === role.id
                      ? 'border-slate-400 bg-white'
                      : 'border-slate-300 bg-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">

                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 border border-slate-300 shrink-0">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        {role.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-0.5">
                        {role.description}
                      </p>
                    </div>

                    <div className="ml-auto shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedRole === role.id
                            ? 'border-slate-900'
                            : 'border-slate-400'
                        }`}
                      >
                        {selectedRole === role.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                        )}
                      </div>
                    </div>

                  </div>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-500 transition-colors"
                placeholder={`Demo: ${getDemoCredentials()}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-500 transition-colors"
                placeholder="Demo: any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-700 text-sm text-center bg-red-50 py-3 px-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                `Sign In as ${
                  roles.find((r) => r.id === selectedRole)?.name
                }`
              )}
            </button>

          </form>

          {/* Demo Info */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Demo Application — Use any email/password combination
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/70 mt-5">
          EduTrack Academic Management Platform
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  GraduationCap,
  Loader2,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type Role = 'student' | 'university' | 'company';
type Mode = 'login' | 'signup';

const demoCredentials: Record<Role, { email: string; password: string }> = {
  student: { email: 'alice@student.edu', password: 'Password@123' },
  university: { email: 'admin@techuniversity.edu', password: 'Password@123' },
  company: { email: 'recruiter@techcorp.com', password: 'Password@123' }
};

const LoginForm: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('1');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student' as const,
      name: 'Student',
      icon: GraduationCap,
      description: 'Academic record and portfolio'
    },
    {
      id: 'university' as const,
      name: 'University',
      icon: Building2,
      description: 'Student records and certificate review'
    },
    {
      id: 'company' as const,
      name: 'Company',
      icon: Briefcase,
      description: 'Verified talent discovery'
    }
  ];

  const currentDemo = demoCredentials[selectedRole];

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
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
          name,
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
    <div
      className="relative min-h-screen overflow-hidden bg-black bg-cover bg-center bg-no-repeat px-4 py-6 sm:px-8 lg:px-16"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/originals/1a/71/58/1a7158689e5ce37e5d78d97c332a003f.gif')"
      }}
    >
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex min-h-[calc(100vh-3rem)] items-center justify-start">
        <div className="w-full max-w-[520px]">
          <div className="rounded-2xl border border-slate-300/80 bg-slate-100/95 p-6 shadow-2xl backdrop-blur-sm sm:p-7">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white shadow-sm">
                <GraduationCap className="h-5 w-5 text-slate-900" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">EduTrack</h1>
              <p className="mt-2 text-sm text-slate-500">Choose your portal to continue</p>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-slate-300 bg-slate-200 p-1.5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  mode === 'login'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  mode === 'signup'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </button>
            </div>

            <div className="mb-6 space-y-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      isSelected
                        ? 'border-slate-500 bg-white'
                        : 'border-slate-300 bg-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-slate-950">{role.name}</h2>
                        <p className="mt-0.5 text-sm text-slate-500">{role.description}</p>
                      </div>
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? 'border-slate-950' : 'border-slate-400'
                        }`}
                      >
                        {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-slate-950" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {selectedRole === 'student'
                      ? 'Full Name'
                      : selectedRole === 'university'
                        ? 'University Name'
                        : 'Company Name'}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g. Priya Sharma'
                        : selectedRole === 'university'
                          ? 'e.g. KIET GROUP OF INSTITUTIONS'
                          : 'e.g. NovaCore Systems'
                    }
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder={mode === 'login' ? currentDemo.email : 'user@edutrack.edu'}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder-slate-400 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder={mode === 'login' ? currentDemo.password : 'Minimum 8 characters'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {mode === 'signup' && selectedRole === 'student' && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      University / Institution
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      value={university}
                      onChange={(event) => setUniversity(event.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Course</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                        value={course}
                        onChange={(event) => setCourse(event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Academic Year
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'signup' && selectedRole === 'company' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Industry</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      value={industry}
                      onChange={(event) => setIndustry(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Company Size</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      value={size}
                      onChange={(event) => setSize(event.target.value)}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <span>
                    {mode === 'login'
                      ? `Sign In as ${roles.find((role) => role.id === selectedRole)?.name}`
                      : `Create ${roles.find((role) => role.id === selectedRole)?.name} Account`}
                  </span>
                )}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-xs font-medium text-white/80">
            EduTrack Academic Management Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { Student } from '../../types';
import AcademicRecords from './AcademicRecords';
import CertificateUpload from './CertificateUpload';
import ResumeGenerator from './ResumeGenerator';
import ActivityCharts from './ActivityCharts';
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Plus,
  User
} from 'lucide-react';
import { api } from '../../services/api';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ semester: 'Fall', year: '2024', gpa: '3.8' });
  const [newActivity, setNewActivity] = useState({
    type: 'co-curricular' as 'co-curricular' | 'extracurricular',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    hours: '20',
    skills: ''
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'academic', name: 'Academic Records', icon: BookOpen },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'resume', name: 'Resume', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const loadStudentProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.getStudentProfile();
      if (res.success && res.student) {
        setStudentData(res.student);
        setError('');
      } else {
        setError(res.error || 'Failed to load profile');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const handleAddAcademicRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addAcademicRecord({
        semester: newRecord.semester,
        year: parseInt(newRecord.year),
        gpa: parseFloat(newRecord.gpa),
        subjects: [
          { code: 'CS101', name: 'Core Computer Science', credits: 3, grade: 'A', points: 4.0 }
        ]
      });
      setShowAddRecordModal(false);
      loadStudentProfile();
    } catch (err: any) {
      alert(err.message || 'Failed to add record');
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addActivity({
        type: newActivity.type,
        title: newActivity.title,
        description: newActivity.description,
        date: newActivity.date,
        hours: parseInt(newActivity.hours),
        skills: newActivity.skills ? newActivity.skills.split(',').map(skill => skill.trim()) : []
      });
      setShowAddActivityModal(false);
      setNewActivity({
        type: 'co-curricular',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        hours: '20',
        skills: ''
      });
      loadStudentProfile();
    } catch (err: any) {
      alert(err.message || 'Failed to add activity');
    }
  };

  if (isLoading) {
    return (
      <Layout title="Student Dashboard">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-600" />
          <p className="font-medium text-slate-600">Loading Student Profile...</p>
        </div>
      </Layout>
    );
  }

  if (error || !studentData) {
    return (
      <Layout title="Student Dashboard">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          <h3 className="mb-2 text-xl font-bold">Failed to load student data</h3>
          <p className="text-sm">{error || 'Student profile not found.'}</p>
          <button onClick={loadStudentProfile} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <StudentOverview
            student={studentData}
            onOpenAddRecord={() => setShowAddRecordModal(true)}
            onOpenAddActivity={() => setShowAddActivityModal(true)}
          />
        );
      case 'academic':
        return <AcademicRecords records={studentData.academicRecords} />;
      case 'certificates':
        return <CertificateUpload studentId={studentData.id} certificates={studentData.certificates} onCertificateAdded={loadStudentProfile} />;
      case 'resume':
        return <ResumeGenerator student={studentData} />;
      case 'analytics':
        return <ActivityCharts student={studentData} />;
      default:
        return (
          <StudentOverview
            student={studentData}
            onOpenAddRecord={() => setShowAddRecordModal(true)}
            onOpenAddActivity={() => setShowAddActivityModal(true)}
          />
        );
    }
  };

  return (
    <Layout title="Student Dashboard">
      <div className="space-y-6">
        <div className="border-b border-slate-200">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>{renderTabContent()}</div>

        {showAddRecordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900">Add Academic Semester Record</h4>
                <button onClick={() => setShowAddRecordModal(false)} className="text-xl font-bold text-slate-400 hover:text-slate-600">x</button>
              </div>
              <form onSubmit={handleAddAcademicRecord} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">Semester</label>
                  <select className="w-full rounded-lg border px-3 py-2 text-sm" value={newRecord.semester} onChange={e => setNewRecord({ ...newRecord, semester: e.target.value })}>
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">Year</label>
                  <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" value={newRecord.year} onChange={e => setNewRecord({ ...newRecord, year: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">Semester GPA (0.0 - 4.0)</label>
                  <input type="number" step="0.01" min="0" max="4.0" className="w-full rounded-lg border px-3 py-2 text-sm" value={newRecord.gpa} onChange={e => setNewRecord({ ...newRecord, gpa: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save Record</button>
                  <button type="button" onClick={() => setShowAddRecordModal(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddActivityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900">Add Activity</h4>
                <button onClick={() => setShowAddActivityModal(false)} className="text-xl font-bold text-slate-400 hover:text-slate-600">x</button>
              </div>
              <form onSubmit={handleAddActivity} className="space-y-3">
                <select className="w-full rounded-lg border px-3 py-2 text-sm" value={newActivity.type} onChange={e => setNewActivity({ ...newActivity, type: e.target.value as any })}>
                  <option value="co-curricular">Co-curricular</option>
                  <option value="extracurricular">Extracurricular</option>
                </select>
                <input type="text" required className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Activity title" value={newActivity.title} onChange={e => setNewActivity({ ...newActivity, title: e.target.value })} />
                <textarea required rows={2} className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Describe your role and achievements" value={newActivity.description} onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" required className="w-full rounded-lg border px-3 py-2 text-sm" value={newActivity.date} onChange={e => setNewActivity({ ...newActivity, date: e.target.value })} />
                  <input type="number" required className="w-full rounded-lg border px-3 py-2 text-sm" value={newActivity.hours} onChange={e => setNewActivity({ ...newActivity, hours: e.target.value })} />
                </div>
                <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Skills, comma separated" value={newActivity.skills} onChange={e => setNewActivity({ ...newActivity, skills: e.target.value })} />
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">Add Activity</button>
                  <button type="button" onClick={() => setShowAddActivityModal(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const StudentOverview: React.FC<{
  student: Student;
  onOpenAddRecord: () => void;
  onOpenAddActivity: () => void;
}> = ({ student, onOpenAddRecord, onOpenAddActivity }) => {
  const totalActivities = student.activities.length;
  const totalCertificates = student.certificates.length;
  const approvedCertificates = student.certificates.filter(certificate => certificate.status === 'approved').length;
  const pendingCertificates = student.certificates.filter(certificate => certificate.status === 'pending').length;
  const totalHours = student.activities.reduce((sum, activity) => sum + activity.hours, 0);
  const verificationProgress = totalCertificates > 0 ? Math.round((approvedCertificates / totalCertificates) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <img
            src={student.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}
            alt={student.name}
            className="h-20 w-20 rounded-full border-2 border-slate-200 object-cover"
          />
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-blue-600">Student Profile</p>
                <h2 className="text-2xl font-semibold text-slate-900">{student.name}</h2>
                <p className="mt-1 text-slate-500">{student.course} - Year {student.year}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Active Student
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span>{student.university}</span>
              <span>{student.email}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current GPA" value={student.gpa} detail="Overall academic performance" icon={BookOpen} />
        <StatCard label="Certificates" value={approvedCertificates} detail={`${totalCertificates} total uploaded`} icon={Award} />
        <StatCard label="Activities" value={totalActivities} detail="Academic and extracurricular" icon={BarChart3} />
        <StatCard label="Activity Hours" value={totalHours} detail="Total recorded hours" icon={Clock3} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Recent Activities</h3>
              <p className="mt-1 text-sm text-slate-500">Your latest academic and extracurricular activities</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onOpenAddRecord} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
                <Plus className="h-3.5 w-3.5" />
                Add Record
              </button>
              <button onClick={onOpenAddActivity} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                <Plus className="h-3.5 w-3.5" />
                Add Activity
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {student.activities.slice(0, 4).map(activity => (
              <div key={activity.id} className="px-6 py-5 transition-colors hover:bg-slate-50">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{activity.title}</h4>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{activity.description}</p>
                      </div>
                      <span className="whitespace-nowrap text-xs text-slate-400">{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>{activity.type.replace('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase())}</span>
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {activity.hours} hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {student.activities.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-slate-500">No activities recorded yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Skills</h3>
                <p className="mt-1 text-sm text-slate-500">Your current skill set</p>
              </div>
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill, index) => (
                <span key={index} className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{skill}</span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Certificate Status</h3>
                <p className="text-sm text-slate-500">Verification overview</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Approved</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {approvedCertificates}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pending</span>
                <span className="text-sm font-medium text-amber-600">{pendingCertificates}</span>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Verification progress</span>
                  <span className="font-medium text-slate-700">{verificationProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${verificationProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: number | string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}> = ({ label, value, detail, icon: Icon }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="rounded-lg bg-blue-50 p-2.5">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
    </div>
    <p className="mt-3 text-xs text-slate-400">{detail}</p>
  </div>
);

export default StudentDashboard;

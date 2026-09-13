import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { Student } from '../../types';
import StudentList from './StudentList';
import CertificateApproval from './CertificateApproval';
import UniversityReports from './UniversityReports';
import UniversityAnalytics from './UniversityAnalytics';
import { Users, Award, FileText, BarChart3, GraduationCap, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const UniversityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: GraduationCap },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <UniversityOverview />;
      case 'students':
        return <StudentList />;
      case 'certificates':
        return <CertificateApproval />;
      case 'reports':
        return <UniversityReports />;
      case 'analytics':
        return <UniversityAnalytics />;
      default:
        return <UniversityOverview />;
    }
  };

  return (
    <Layout title="University Dashboard">
      <div className="space-y-6">
        <div className="border-b border-slate-200">
          <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
          </div>
        </div>

        <div>
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
};

const UniversityOverview: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true);
        setError('');
        const [studentsRes, analyticsRes] = await Promise.all([
          api.getUniversityStudents(),
          api.getUniversityAnalytics()
        ]);

        if (studentsRes.success && studentsRes.students) {
          setStudents(studentsRes.students);
        }
        if (analyticsRes.success && analyticsRes.analytics) {
          setAnalytics(analyticsRes.analytics);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load university overview');
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
        <p className="text-slate-600 text-sm font-medium">Loading university data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium">
        {error}
      </div>
    );
  }

  const totalStudents = analytics?.totalStudents ?? students.length;
  const averageGPA = analytics?.averageGpa ?? (
    students.length > 0
      ? students.reduce((sum, student) => sum + student.gpa, 0) / students.length
      : 0
  );
  const totalCertificates = analytics?.totalCertificates ?? students.reduce((sum, student) => sum + student.certificates.length, 0);
  const pendingCertificates = analytics?.pendingCertificates ?? students.reduce(
    (sum, student) => sum + student.certificates.filter(cert => cert.status === 'pending').length,
    0
  );
  const totalActivities = students.reduce((sum, student) => sum + student.activities.length, 0);

  const topStudents = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);
  const pendingSubmissions = students
    .flatMap(student =>
      student.certificates.map(cert => ({ ...cert, studentName: student.name, studentAvatar: student.avatar }))
    )
    .filter(cert => cert.status === 'pending')
    .sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">University Overview</h3>
        <p className="text-gray-600">Monitor student performance and manage university operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Average GPA</p>
              <p className="text-3xl font-bold">{Number(averageGPA).toFixed(2)}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Certificates</p>
              <p className="text-3xl font-bold">{totalCertificates}</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Pending Reviews</p>
              <p className="text-3xl font-bold">{pendingCertificates}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Total Activities</p>
              <p className="text-3xl font-bold">{totalActivities}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-indigo-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Students</h4>
          <div className="space-y-3">
            {topStudents.length === 0 ? (
              <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4">No student records found yet.</p>
            ) : (
              topStudents.map((student, index) => (
                <div key={student.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">#{index + 1}</span>
                  </div>
                  <img
                    src={student.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.course}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      GPA: {student.gpa}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Certificate Submissions</h4>
          <div className="space-y-3">
            {pendingSubmissions.length === 0 ? (
              <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4">No pending certificate submissions.</p>
            ) : (
              pendingSubmissions.map((cert) => (
                <div key={cert.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={cert.studentAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}
                    alt={cert.studentName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{cert.title}</p>
                    <p className="text-sm text-gray-600">by {cert.studentName}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;

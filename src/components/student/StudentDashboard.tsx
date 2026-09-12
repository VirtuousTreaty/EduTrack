import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { useAuth } from '../../contexts/AuthContext';
import { Student } from '../../types';
import AcademicRecords from './AcademicRecords';
import CertificateUpload from './CertificateUpload';
import ResumeGenerator from './ResumeGenerator';
import ActivityCharts from './ActivityCharts';
import { BookOpen, Award, FileText, BarChart3, Upload, User, Loader2, Plus, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals for adding Academic Record & Activity
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

  const loadStudentProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.getStudentProfile();
      if (res.success && res.student) {
        setStudentData(res.student);
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
        skills: newActivity.skills ? newActivity.skills.split(',').map(s => s.trim()) : []
      });
      setShowAddActivityModal(false);
      setNewActivity({ type: 'co-curricular', title: '', description: '', date: new Date().toISOString().split('T')[0], hours: '20', skills: '' });
      loadStudentProfile();
    } catch (err: any) {
      alert(err.message || 'Failed to add activity');
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'academic', name: 'Academic Records', icon: BookOpen },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'resume', name: 'Resume', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const getTabColor = (tabId: string) => {
    return activeTab === tabId
      ? 'bg-blue-600 text-white shadow-sm'
      : 'bg-white text-gray-700 hover:bg-gray-100';
  };

  if (isLoading) {
    return (
      <Layout title="Student Dashboard">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-600 font-medium">Loading Student Profile...</p>
        </div>
      </Layout>
    );
  }

  if (error || !studentData) {
    return (
      <Layout title="Student Dashboard">
        <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-200 text-rose-700">
          <h3 className="text-xl font-bold mb-2">Failed to load student data</h3>
          <p className="text-sm">{error || 'Student profile not found.'}</p>
          <button onClick={loadStudentProfile} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm">
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
        {/* Tab Navigation */}
        <div className="flex space-x-1.5 bg-slate-200/70 p-1.5 rounded-xl overflow-x-auto border border-slate-300">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${getTabColor(tab.id)}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {renderTabContent()}
        </div>

        {/* Modal: Add Academic Record */}
        {showAddRecordModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-slate-900">Add Academic Semester Record</h4>
                <button onClick={() => setShowAddRecordModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">×</button>
              </div>
              <form onSubmit={handleAddAcademicRecord} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Semester</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={newRecord.semester}
                    onChange={(e) => setNewRecord({ ...newRecord, semester: e.target.value })}
                  >
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Year</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={newRecord.year}
                    onChange={(e) => setNewRecord({ ...newRecord, year: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Semester GPA (0.0 - 4.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={newRecord.gpa}
                    onChange={(e) => setNewRecord({ ...newRecord, gpa: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700">Save Record</button>
                  <button type="button" onClick={() => setShowAddRecordModal(false)} className="px-4 py-2 border rounded-lg text-sm font-semibold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Activity */}
        {showAddActivityModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-slate-900">Add Co-Curricular / Extracurricular Activity</h4>
                <button onClick={() => setShowAddActivityModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">×</button>
              </div>
              <form onSubmit={handleAddActivity} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Activity Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as any })}
                  >
                    <option value="co-curricular">Co-curricular</option>
                    <option value="extracurricular">Extracurricular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="e.g. Programming Club President"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Describe your role & achievements..."
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Hours</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      value={newActivity.hours}
                      onChange={(e) => setNewActivity({ ...newActivity, hours: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Leadership, Python, Event Management"
                    value={newActivity.skills}
                    onChange={(e) => setNewActivity({ ...newActivity, skills: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-purple-700">Add Activity</button>
                  <button type="button" onClick={() => setShowAddActivityModal(false)} className="px-4 py-2 border rounded-lg text-sm font-semibold">Cancel</button>
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
  const approvedCertificates = student.certificates.filter(c => c.status === 'approved').length;
  const totalHours = student.activities.reduce((sum, activity) => sum + activity.hours, 0);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <img
          src={student.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'}
          alt={student.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-2xl font-black text-slate-900">{student.name}</h3>
            <span className="bg-emerald-500/10 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Verified Student
            </span>
          </div>
          <p className="text-slate-600 font-medium mt-1">{student.course} • Year {student.year}</p>
          <p className="text-slate-500 text-sm">{student.university}</p>
          <div className="mt-3 flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              GPA: {student.gpa} / 4.0
            </span>
            <span className="text-slate-500 text-xs font-mono">{student.email}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Current GPA</p>
              <p className="text-3xl font-extrabold mt-1">{student.gpa}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Approved Certificates</p>
              <p className="text-3xl font-extrabold mt-1">{approvedCertificates}/{totalCertificates}</p>
            </div>
            <Award className="w-8 h-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs font-semibold uppercase tracking-wider">Activities Logged</p>
              <p className="text-3xl font-extrabold mt-1">{totalActivities}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">Activity Hours</p>
              <p className="text-3xl font-extrabold mt-1">{totalHours}</p>
            </div>
            <Upload className="w-8 h-8 text-amber-200" />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Verified Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons & Recent Activities */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-bold text-slate-900">Recent Activities</h4>
          <div className="flex space-x-2">
            <button
              onClick={onOpenAddRecord}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Record</span>
            </button>
            <button
              onClick={onOpenAddActivity}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {student.activities.length === 0 ? (
            <p className="text-slate-500 text-sm">No activities logged yet.</p>
          ) : (
            student.activities.map((activity) => (
              <div key={activity.id} className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900">{activity.title}</h5>
                    <p className="text-xs text-slate-600 mt-0.5">{activity.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 capitalize">Type: {activity.type.replace('-', ' ')}</span>
                      <span>Hours: {activity.hours} hrs</span>
                      <span>Date: {new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
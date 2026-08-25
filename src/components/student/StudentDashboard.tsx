import React, { useState } from 'react';
import Layout from '../Layout';
import { useAuth } from '../../contexts/AuthContext';
import { mockStudents } from '../../data/mockData';
import { Student } from '../../types';
import AcademicRecords from './AcademicRecords';
import CertificateUpload from './CertificateUpload';
import ResumeGenerator from './ResumeGenerator';
import ActivityCharts from './ActivityCharts';
import { BookOpen, Award, FileText, BarChart3, Upload, User } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, this would come from the authenticated user's data
  const studentData: Student = mockStudents.find(s => s.email === user?.email) || mockStudents[0];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'academic', name: 'Academic Records', icon: BookOpen },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'resume', name: 'Resume', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const getTabColor = (tabId: string) => {
    return activeTab === tabId
      ? 'bg-blue-500 text-white'
      : 'bg-white text-gray-700 hover:bg-gray-50';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StudentOverview student={studentData} />;
      case 'academic':
        return <AcademicRecords records={studentData.academicRecords} />;
      case 'certificates':
        return <CertificateUpload studentId={studentData.id} certificates={studentData.certificates} />;
      case 'resume':
        return <ResumeGenerator student={studentData} />;
      case 'analytics':
        return <ActivityCharts student={studentData} />;
      default:
        return <StudentOverview student={studentData} />;
    }
  };

  return (
    <Layout title="Student Dashboard">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${getTabColor(tab.id)}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
};

const StudentOverview: React.FC<{ student: Student }> = ({ student }) => {
  const totalActivities = student.activities.length;
  const totalCertificates = student.certificates.length;
  const approvedCertificates = student.certificates.filter(c => c.status === 'approved').length;
  const totalHours = student.activities.reduce((sum, activity) => sum + activity.hours, 0);

  return (
    <div className="p-6">
      <div className="flex items-start space-x-6 mb-8">
        <div className="flex-shrink-0">
          <img
            src={student.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
          <p className="text-lg text-gray-600">{student.course} - Year {student.year}</p>
          <p className="text-gray-500">{student.university}</p>
          <div className="mt-2 flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              GPA: {student.gpa}
            </span>
            <span className="text-gray-500">{student.email}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Current GPA</p>
              <p className="text-3xl font-bold">{student.gpa}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Certificates</p>
              <p className="text-3xl font-bold">{approvedCertificates}/{totalCertificates}</p>
            </div>
            <Award className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Activities</p>
              <p className="text-3xl font-bold">{totalActivities}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Activity Hours</p>
              <p className="text-3xl font-bold">{totalHours}</p>
            </div>
            <Upload className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h4>
        <div className="space-y-4">
          {student.activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{activity.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Type: {activity.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span>Hours: {activity.hours}</span>
                    <span>Date: {new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
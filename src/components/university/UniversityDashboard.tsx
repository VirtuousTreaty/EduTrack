import React, { useState } from 'react';
import Layout from '../Layout';
import { mockStudents } from '../../data/mockData';
import { Student, Certificate } from '../../types';
import StudentList from './StudentList';
import CertificateApproval from './CertificateApproval';
import UniversityReports from './UniversityReports';
import UniversityAnalytics from './UniversityAnalytics';
import { Users, Award, FileText, BarChart3, GraduationCap } from 'lucide-react';

const UniversityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students] = useState<Student[]>(mockStudents);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: GraduationCap },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const getTabColor = (tabId: string) => {
    return activeTab === tabId
      ? 'bg-green-500 text-white'
      : 'bg-white text-gray-700 hover:bg-gray-50';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <UniversityOverview students={students} />;
      case 'students':
        return <StudentList students={students} />;
      case 'certificates':
        return <CertificateApproval students={students} />;
      case 'reports':
        return <UniversityReports students={students} />;
      case 'analytics':
        return <UniversityAnalytics students={students} />;
      default:
        return <UniversityOverview students={students} />;
    }
  };

  return (
    <Layout title="University Dashboard">
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

const UniversityOverview: React.FC<{ students: Student[] }> = ({ students }) => {
  const totalStudents = students.length;
  const averageGPA = students.reduce((sum, student) => sum + student.gpa, 0) / totalStudents;
  const totalCertificates = students.reduce((sum, student) => sum + student.certificates.length, 0);
  const pendingCertificates = students.reduce((sum, student) => 
    sum + student.certificates.filter(cert => cert.status === 'pending').length, 0
  );
  const totalActivities = students.reduce((sum, student) => sum + student.activities.length, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">University Overview</h3>
        <p className="text-gray-600">Monitor student performance and manage university operations</p>
      </div>

      {/* Stats Cards */}
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
              <p className="text-3xl font-bold">{averageGPA.toFixed(2)}</p>
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

      {/* Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Students</h4>
          <div className="space-y-3">
            {students
              .sort((a, b) => b.gpa - a.gpa)
              .slice(0, 5)
              .map((student, index) => (
                <div key={student.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">#{index + 1}</span>
                  </div>
                  <img
                    src={student.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
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
              ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Certificate Submissions</h4>
          <div className="space-y-3">
            {students
              .flatMap(student => 
                student.certificates.map(cert => ({ ...cert, studentName: student.name, studentAvatar: student.avatar }))
              )
              .filter(cert => cert.status === 'pending')
              .sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime())
              .slice(0, 5)
              .map((cert) => (
                <div key={cert.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={cert.studentAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
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
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;
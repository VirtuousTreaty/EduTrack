import React, { useState } from 'react';
import Layout from '../Layout';
import { mockStudents } from '../../data/mockData';
import { Student } from '../../types';
import StudentList from './StudentList';
import CertificateApproval from './CertificateApproval';
import UniversityReports from './UniversityReports';
import UniversityAnalytics from './UniversityAnalytics';
import {
  Users,
  Award,
  FileText,
  BarChart3,
  GraduationCap
} from 'lucide-react';

const UniversityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students] = useState<Student[]>(mockStudents);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: GraduationCap },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const getTabColor = (tabId: string) => {
    return activeTab === tabId
      ? 'bg-blue-600 text-white shadow-sm'
      : 'bg-white text-slate-600 hover:bg-slate-50';
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
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${getTabColor(
                  tab.id
                )}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
};

const UniversityOverview: React.FC<{ students: Student[] }> = ({
  students
}) => {
  const totalStudents = students.length;

  const averageGPA =
    students.reduce(
      (sum, student) => sum + student.gpa,
      0
    ) / totalStudents;

  const totalCertificates = students.reduce(
    (sum, student) => sum + student.certificates.length,
    0
  );

  const pendingCertificates = students.reduce(
    (sum, student) =>
      sum +
      student.certificates.filter(
        cert => cert.status === 'pending'
      ).length,
    0
  );

  const totalActivities = students.reduce(
    (sum, student) => sum + student.activities.length,
    0
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-slate-900 mb-2">
          University Overview
        </h3>

        <p className="text-slate-500">
          Monitor student performance and manage university operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Total Students
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {totalStudents}
              </p>
            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average GPA */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Average GPA
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {averageGPA.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-50">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Certificates */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Total Certificates
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {totalCertificates}
              </p>
            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-50">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Pending Reviews
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {pendingCertificates}
              </p>
            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-slate-100">
              <FileText className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Total Activities */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Total Activities
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {totalActivities}
              </p>
            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-slate-100">
              <BarChart3 className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Top Performing Students
          </h4>

          <div className="space-y-3">
            {students
              .sort((a, b) => b.gpa - a.gpa)
              .slice(0, 5)
              .map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center space-x-4 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      #{index + 1}
                    </span>
                  </div>

                  <img
                    src={
                      student.avatar ||
                      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {student.name}
                    </p>

                    <p className="text-sm text-slate-500 truncate">
                      {student.course}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      GPA: {student.gpa}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Certificate Submissions */}
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Certificate Submissions
          </h4>

          <div className="space-y-3">
            {students
              .flatMap(student =>
                student.certificates.map(cert => ({
                  ...cert,
                  studentName: student.name,
                  studentAvatar: student.avatar
                }))
              )
              .filter(cert => cert.status === 'pending')
              .sort(
                (a, b) =>
                  new Date(b.dateIssued).getTime() -
                  new Date(a.dateIssued).getTime()
              )
              .slice(0, 5)
              .map(cert => (
                <div
                  key={cert.id}
                  className="flex items-center space-x-4 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <img
                    src={
                      cert.studentAvatar ||
                      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                    alt={cert.studentName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {cert.title}
                    </p>

                    <p className="text-sm text-slate-500 truncate">
                      by {cert.studentName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
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
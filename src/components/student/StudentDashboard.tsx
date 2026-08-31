import React, { useState } from 'react';
import Layout from '../Layout';
import { useAuth } from '../../contexts/AuthContext';
import { mockStudents } from '../../data/mockData';
import { Student } from '../../types';
import AcademicRecords from './AcademicRecords';
import CertificateUpload from './CertificateUpload';
import ResumeGenerator from './ResumeGenerator';
import ActivityCharts from './ActivityCharts';

import {
  BookOpen,
  Award,
  FileText,
  BarChart3,
  User,
  CalendarDays,
  Clock3,
  CheckCircle2,
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  

  const studentData: Student =
    mockStudents.find(s => s.email === user?.email) || mockStudents[0];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'academic', name: 'Academic Records', icon: BookOpen },
    { id: 'certificates', name: 'Certificates', icon: Award },
    { id: 'resume', name: 'Resume', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StudentOverview student={studentData} />;

      case 'academic':
        return <AcademicRecords records={studentData.academicRecords} />;

      case 'certificates':
        return (
          <CertificateUpload
            studentId={studentData.id}
            certificates={studentData.certificates}
          />
        );

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
        <div className="border-b border-slate-200">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium
                    whitespace-nowrap border-b-2 transition-colors
                    ${isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </Layout>
  );
};



const StudentOverview: React.FC<{ student: Student }> = ({ student }) => {
  const totalActivities = student.activities.length;
  const totalCertificates = student.certificates.length;
  

  const approvedCertificates = student.certificates.filter(
    certificate => certificate.status === 'approved'
  ).length;

  const totalHours = student.activities.reduce(
    (sum, activity) => sum + activity.hours,
    0
  );

  return (
    <div className="space-y-6">

      {/* Profile Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-5">

          {/* Avatar */}
          <img
            src={
              student.avatar ||
              'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
            }
            alt={student.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
          />

          {/* Student Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">
                  Student Profile
                </p>

                <h2 className="text-2xl font-semibold text-slate-900">
                  {student.name}
                </h2>

                <p className="text-slate-500 mt-1">
                  {student.course} · Year {student.year}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-500" />
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


      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* GPA */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Current GPA</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">
                {student.gpa}
              </p>
            </div>

            <div className="p-2.5 bg-blue-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Overall academic performance
          </p>
        </div>


        {/* Certificates */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Certificates</p>

              <p className="text-3xl font-semibold text-slate-900 mt-2">
                {approvedCertificates}
              </p>
            </div>

            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            {totalCertificates} total uploaded
          </p>
        </div>


        {/* Activities */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Activities</p>

              <p className="text-3xl font-semibold text-slate-900 mt-2">
                {totalActivities}
              </p>
            </div>

            <div className="p-2.5 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Academic and extracurricular
          </p>
        </div>


        {/* Hours */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Activity Hours</p>

              <p className="text-3xl font-semibold text-slate-900 mt-2">
                {totalHours}
              </p>
            </div>

            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Clock3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Total recorded hours
          </p>
        </div>

      </section>


      {/* Main Content */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Activities */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm">

          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900">
                Recent Activities
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Your latest academic and extracurricular activities
              </p>
            </div>
          </div>


          <div className="divide-y divide-slate-100">

            {student.activities.slice(0, 4).map(activity => (

              <div
                key={activity.id}
                className="px-6 py-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex gap-4">

                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                      <div>
                        <h4 className="font-medium text-slate-900">
                          {activity.title}
                        </h4>

                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {activity.description}
                        </p>
                      </div>

                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>

                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">

                      <span>
                        {activity.type
                          .replace('-', ' ')
                          .replace(/\b\w/g, letter => letter.toUpperCase())}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 className="w-3.5 h-3.5" />
                        {activity.hours} hours
                      </span>

                    </div>

                  </div>
                </div>
              </div>

            ))}

          </div>
        </div>


        {/* Right Column */}
        <div className="space-y-6">

          {/* Skills */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Skills
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Your current skill set
                </p>
              </div>

              <FileText className="w-5 h-5 text-slate-400" />
            </div>

            <div className="flex flex-wrap gap-2">

              {student.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm text-slate-700 bg-slate-100 rounded-md"
                >
                  {skill}
                </span>
              ))}

            </div>
          </div>


          {/* Certificate Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm">

            <div className="flex items-center gap-3 mb-5">

              <div className="p-2 bg-blue-50 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Certificate Status
                </h3>

                <p className="text-sm text-slate-500">
                  Verification overview
                </p>
              </div>

            </div>


            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Approved
                </span>

                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  {approvedCertificates}
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Pending
                </span>

                <span className="text-sm font-medium text-amber-600">
                  {
                    student.certificates.filter(
                      certificate => certificate.status === 'pending'
                    ).length
                  }
                </span>
              </div>


              <div className="pt-4 border-t border-slate-100">

                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500">
                    Verification progress
                  </span>

                  <span className="font-medium text-slate-700">
                    {totalCertificates > 0
                      ? Math.round(
                        (approvedCertificates / totalCertificates) * 100
                      )
                      : 0}
                    %
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{
                      width: `${totalCertificates > 0
                          ? (approvedCertificates / totalCertificates) * 100
                          : 0
                        }%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default StudentDashboard;
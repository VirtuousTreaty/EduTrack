import React, { useState } from 'react';
import Layout from '../Layout';
import { mockStudents } from '../../data/mockData';
import { Student } from '../../types';
import StudentSearch from './StudentSearch';
import StudentPortfolio from './StudentPortfolio';
import RecommendationEngine from './RecommendationEngine';
import CompanyAnalytics from './CompanyAnalytics';
import { Search, Eye, Users, TrendingUp, Briefcase } from 'lucide-react';

const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students] = useState<Student[]>(mockStudents);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Briefcase },
    { id: 'search', name: 'Find Talent', icon: Search },
    { id: 'portfolio', name: 'Portfolios', icon: Eye },
    { id: 'recommendations', name: 'AI Recommendations', icon: TrendingUp },
    { id: 'analytics', name: 'Analytics', icon: Users },
  ];

  const getTabColor = (tabId: string) => {
    return activeTab === tabId
      ? 'bg-blue-600 text-white shadow-sm'
      : 'bg-white text-slate-600 hover:bg-slate-50';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <CompanyOverview students={students} />;

      case 'search':
        return <StudentSearch students={students} />;

      case 'portfolio':
        return <StudentPortfolio students={students} />;

      case 'recommendations':
        return <RecommendationEngine students={students} />;

      case 'analytics':
        return <CompanyAnalytics students={students} />;

      default:
        return <CompanyOverview students={students} />;
    }
  };

  return (
    <Layout title="Company Dashboard">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${getTabColor(
                  tab.id
                )}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
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

const CompanyOverview: React.FC<{ students: Student[] }> = ({ students }) => {
  const topSkills = students
    .flatMap((student) => student.skills)
    .reduce((acc: { [key: string]: number }, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  const mostCommonSkills = Object.entries(topSkills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }));

  const totalActivities = students.reduce(
    (sum, student) => sum + student.activities.length,
    0
  );

  const averageGPA =
    students.length > 0
      ? students.reduce((sum, student) => sum + student.gpa, 0) /
        students.length
      : 0;

  const verifiedCertificates = students.reduce(
    (sum, student) =>
      sum +
      student.certificates.filter(
        (certificate) => certificate.status === 'approved'
      ).length,
    0
  );

  const maxSkillCount = mostCommonSkills[0]?.count || 1;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Talent Pool Overview
        </h3>

        <p className="text-slate-600">
          Discover and connect with exceptional students from top universities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Available Talent */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Available Talent
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {students.length}
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average GPA */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Average GPA
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {averageGPA.toFixed(2)}
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </div>

        {/* Verified Certificates */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Verified Certificates
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {verifiedCertificates}
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Activities */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Activities
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                {totalActivities}
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Most In-Demand Skills */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-5">
            <h4 className="text-lg font-semibold text-slate-900">
              Most In-Demand Skills
            </h4>

            <p className="text-sm text-slate-500 mt-1">
              Skills currently most represented in the talent pool
            </p>
          </div>

          <div className="space-y-4">
            {mostCommonSkills.map((item, index) => (
              <div
                key={item.skill}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold shrink-0">
                    {index + 1}
                  </span>

                  <span className="font-medium text-slate-800 truncate">
                    {item.skill}
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-24 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.count / maxSkillCount) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm text-slate-500 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Candidates */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-5">
            <h4 className="text-lg font-semibold text-slate-900">
              Featured Candidates
            </h4>

            <p className="text-sm text-slate-500 mt-1">
              Top candidates ranked by GPA
            </p>
          </div>

          <div className="space-y-3">
            {[...students]
              .sort((a, b) => b.gpa - a.gpa)
              .slice(0, 5)
              .map((student) => (
                <div
                  key={student.id}
                  className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={
                      student.avatar ||
                      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-slate-900 truncate">
                      {student.name}
                    </h5>

                    <p className="text-sm text-slate-600 truncate">
                      {student.course}
                    </p>

                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        GPA: {student.gpa}
                      </span>

                      <span className="text-xs text-slate-500">
                        {
                          student.certificates.filter(
                            (certificate) =>
                              certificate.status === 'approved'
                          ).length
                        }{' '}
                        certs
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white transition-colors shrink-0"
                    aria-label={`View ${student.name}`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Find Talent */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
              <Search className="w-5 h-5 text-blue-600" />
            </div>

            <h4 className="text-lg font-semibold text-slate-900">
              Find Talent
            </h4>
          </div>

          <p className="text-slate-600 mb-5">
            Search for students by skills, course, or GPA to find the perfect
            candidates for your roles.
          </p>

          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Start Searching
          </button>
        </div>

        {/* View Portfolios */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
              <Eye className="w-5 h-5 text-slate-700" />
            </div>

            <h4 className="text-lg font-semibold text-slate-900">
              View Portfolios
            </h4>
          </div>

          <p className="text-slate-600 mb-5">
            Browse detailed portfolios with verified achievements, projects,
            and academic records.
          </p>

          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Browse Portfolios
          </button>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>

            <h4 className="text-lg font-semibold text-slate-900">
              AI Recommendations
            </h4>
          </div>

          <p className="text-slate-600 mb-5">
            Get personalized candidate recommendations based on your hiring
            preferences and requirements.
          </p>

          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
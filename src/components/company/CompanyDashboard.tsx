import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { Student } from '../../types';
import StudentSearch from './StudentSearch';
import StudentPortfolio from './StudentPortfolio';
import RecommendationEngine from './RecommendationEngine';
import CompanyAnalytics from './CompanyAnalytics';
import { Search, Eye, Users, TrendingUp, Briefcase, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Briefcase },
    { id: 'search', name: 'Find Talent', icon: Search },
    { id: 'portfolio', name: 'Portfolios', icon: Eye },
    { id: 'recommendations', name: 'AI Recommendations', icon: TrendingUp },
    { id: 'analytics', name: 'Analytics', icon: Users },
  ];

  const getTabColor = (tabId: string) => {
    return activeTab === tabId
      ? 'bg-purple-500 text-white'
      : 'bg-white text-gray-700 hover:bg-gray-50';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <CompanyOverview onNavigate={setActiveTab} />;
      case 'search':
        return <StudentSearch />;
      case 'portfolio':
        return <StudentPortfolio />;
      case 'recommendations':
        return <RecommendationEngine />;
      case 'analytics':
        return <CompanyAnalytics />;
      default:
        return <CompanyOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout title="Company Dashboard">
      <div className="space-y-6">
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
};

const CompanyOverview: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
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
          api.searchCandidates(),
          api.getCompanyAnalytics()
        ]);

        if (studentsRes.success && studentsRes.students) {
          setStudents(studentsRes.students);
        }
        if (analyticsRes.success && analyticsRes.analytics) {
          setAnalytics(analyticsRes.analytics);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load talent pool overview');
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
        <p className="text-slate-600 text-sm font-medium">Loading company talent data...</p>
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

  const fallbackSkillCounts = students
    .flatMap(student => student.skills)
    .reduce((acc: Record<string, number>, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  const mostCommonSkills = (analytics?.topSkills || Object.entries(fallbackSkillCounts).map(([name, count]) => ({ name, count })))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 8);

  const totalActivities = students.reduce((sum, student) => sum + student.activities.length, 0);
  const averageGPA = analytics?.averageGpa ?? (
    students.length > 0
      ? students.reduce((sum, student) => sum + student.gpa, 0) / students.length
      : 0
  );
  const verifiedCertificates = students.reduce(
    (sum, student) => sum + student.certificates.filter(cert => cert.status === 'approved').length,
    0
  );
  const featuredCandidates = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);
  const highestSkillCount = mostCommonSkills[0]?.count || 1;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Talent Pool Overview</h3>
        <p className="text-gray-600">Discover and connect with verified students from the live database</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Available Talent</p>
              <p className="text-3xl font-bold">{analytics?.totalTalentPool ?? students.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Average GPA</p>
              <p className="text-3xl font-bold">{Number(averageGPA).toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Verified Certificates</p>
              <p className="text-3xl font-bold">{verifiedCertificates}</p>
            </div>
            <Eye className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Activities</p>
              <p className="text-3xl font-bold">{totalActivities}</p>
            </div>
            <Briefcase className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Most Common Skills</h4>
          <div className="space-y-3">
            {mostCommonSkills.length === 0 ? (
              <p className="text-sm text-slate-500">No skill data found yet.</p>
            ) : (
              mostCommonSkills.map((item: any, index: number) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / highestSkillCount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Featured Candidates</h4>
          <div className="space-y-4">
            {featuredCandidates.length === 0 ? (
              <p className="text-sm text-slate-500">No candidates found yet.</p>
            ) : (
              featuredCandidates.map((student) => (
                <div key={student.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <img
                    src={student.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{student.name}</h5>
                    <p className="text-sm text-gray-600">{student.course}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        GPA: {student.gpa}
                      </span>
                      <span className="text-xs text-gray-500">
                        {student.certificates.filter(cert => cert.status === 'approved').length} certs
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('portfolio')}
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                    title="Open portfolios"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Search className="w-8 h-8 text-purple-600 mr-3" />
            <h4 className="text-lg font-semibold text-gray-900">Find Talent</h4>
          </div>
          <p className="text-gray-600 mb-4">Search for students by skills, course, or GPA to find the perfect candidates for your roles.</p>
          <button
            onClick={() => onNavigate('search')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Start Searching
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Eye className="w-8 h-8 text-blue-600 mr-3" />
            <h4 className="text-lg font-semibold text-gray-900">View Portfolios</h4>
          </div>
          <p className="text-gray-600 mb-4">Browse detailed portfolios with verified achievements, projects, and academic records.</p>
          <button
            onClick={() => onNavigate('portfolio')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Browse Portfolios
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
            <h4 className="text-lg font-semibold text-gray-900">AI Recommendations</h4>
          </div>
          <p className="text-gray-600 mb-4">Get personalized candidate recommendations based on your hiring preferences and requirements.</p>
          <button
            onClick={() => onNavigate('recommendations')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

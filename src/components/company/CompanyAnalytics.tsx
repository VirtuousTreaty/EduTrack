import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Award, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const CompanyAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.getCompanyAnalytics();
        if (res.success && res.analytics) {
          setAnalytics(res.analytics);
        }
      } catch (err) {
        console.error('Failed to load company analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
        <p className="text-slate-600 text-sm font-medium">Analyzing Corporate Talent Pool Insights...</p>
      </div>
    );
  }

  const yearData = analytics?.yearBreakdown || [];
  const topSkills = analytics?.topSkills || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Talent Pool Analytics</h3>
        <p className="text-slate-600">Real-time candidate availability, skill density, and academic qualifications</p>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Talent</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{analytics?.totalTalentPool || 0}</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Average GPA</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{analytics?.averageGpa || '3.5'}</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Top Skill</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{topSkills[0]?.name || 'JavaScript'}</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Top Technical Skills Frequency</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSkills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} students`, 'Candidates']} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Talent Pool Distribution by Academic Year</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} students`, 'Candidates']} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;

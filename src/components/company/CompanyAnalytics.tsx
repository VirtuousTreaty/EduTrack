import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Star, Award, Loader2 } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
        <p className="text-slate-600 text-sm font-medium">Analyzing Corporate Talent Pool Insights...</p>
      </div>
    );
  }

  const yearData = analytics?.yearBreakdown || [];
  const topSkills = analytics?.topSkills || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-black text-slate-900 mb-1">Corporate Recruitment & Talent Pool Metrics</h3>
        <p className="text-slate-500 text-sm">Real-time candidate availability, skill density, and academic qualifications</p>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Total Talent Candidates</p>
              <p className="text-3xl font-extrabold mt-1">{analytics?.totalTalentPool || 0}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Average Candidate GPA</p>
              <p className="text-3xl font-extrabold mt-1">{analytics?.averageGpa || '3.5'}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Top In-Demand Skill</p>
              <p className="text-3xl font-extrabold mt-1">{topSkills[0]?.name || 'JavaScript'}</p>
            </div>
            <Award className="w-8 h-8 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-base font-bold text-slate-900 mb-4">Top 10 Technical Skills Frequency</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSkills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} students`, 'Candidates']} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h4 className="text-base font-bold text-slate-900 mb-4">Talent Pool Distribution by Academic Year</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} students`, 'Candidates']} />
              <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
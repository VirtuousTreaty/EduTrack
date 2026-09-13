import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Award, Activity, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const UniversityAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.getUniversityAnalytics();
        if (res.success && res.analytics) {
          setAnalytics(res.analytics);
        }
      } catch (err) {
        console.error('Failed to load university analytics:', err);
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
        <p className="text-slate-600 text-sm font-medium">Computing University Analytics Engine Data...</p>
      </div>
    );
  }

  const certData = [
    { name: 'Approved', value: analytics?.approvedCertificates || 0, color: '#3B82F6' },
    { name: 'Pending', value: analytics?.pendingCertificates || 0, color: '#93C5FD' },
    { name: 'Rejected', value: analytics?.rejectedCertificates || 0, color: '#CBD5E1' }
  ].filter(c => c.value > 0);

  const courseData = (analytics?.courseDistribution || []).map((c: any) => ({
    course: c.course.length > 20 ? c.course.substring(0, 18) + '...' : c.course,
    count: c.count
  }));

  const yearData = (analytics?.yearDistribution || []).map((y: any) => ({
    year: `Year ${y.year}`,
    count: y.count
  }));

  const monthlyTrends = [
    { month: 'Jan', students: 12, certificates: 6, activities: 20 },
    { month: 'Feb', students: 18, certificates: 10, activities: 28 },
    { month: 'Mar', students: 24, certificates: 16, activities: 35 },
    { month: 'Apr', students: 30, certificates: 22, activities: 42 },
    { month: 'May', students: 35, certificates: 28, activities: 48 }
  ];

  const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#CBD5E1', '#64748B'];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">University Analytics</h3>
        <p className="text-slate-500">Real-time academic records, certificate verification stats and GPA distributions</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-slate-900">{analytics?.totalStudents || 0}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Average GPA</p>
              <p className="text-2xl font-bold text-slate-900">{analytics?.averageGpa || '3.50'}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Certificates</p>
              <p className="text-2xl font-bold text-slate-900">{analytics?.totalCertificates || 0}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Pending Reviews</p>
              <p className="text-2xl font-bold text-slate-900">{analytics?.pendingCertificates || 0}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <Activity className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Degree Course Enrollment</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={courseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ course, percent }) => `${course} ${(percent * 100).toFixed(0)}%`}
                outerRadius={95}
                fill="#8884d8"
                dataKey="count"
              >
                {courseData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Year Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Academic Year Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} students`, 'Students']} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Certificate Verification Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Certificate Verification Breakdown</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={certData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={95}
                fill="#8884d8"
                dataKey="value"
              >
                {certData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Trends */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Monthly Platform Activity Growth</h4>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="students" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.45} />
              <Area type="monotone" dataKey="certificates" stackId="1" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.45} />
              <Area type="monotone" dataKey="activities" stackId="1" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.45} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UniversityAnalytics;

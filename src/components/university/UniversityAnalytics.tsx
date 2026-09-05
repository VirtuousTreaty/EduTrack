import React from 'react';
import { Student } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Users, Award, Activity } from 'lucide-react';

interface UniversityAnalyticsProps {
  students: Student[];
}

const UniversityAnalytics: React.FC<UniversityAnalyticsProps> = ({ students }) => {
  // GPA Distribution
  const gpaDistribution = [
    {
      range: '3.5-4.0',
      count: students.filter(s => s.gpa >= 3.5).length,
      color: '#3B82F6'
    },
    {
      range: '3.0-3.4',
      count: students.filter(s => s.gpa >= 3.0 && s.gpa < 3.5).length,
      color: '#60A5FA'
    },
    {
      range: '2.5-2.9',
      count: students.filter(s => s.gpa >= 2.5 && s.gpa < 3.0).length,
      color: '#93C5FD'
    },
    {
      range: '2.0-2.4',
      count: students.filter(s => s.gpa >= 2.0 && s.gpa < 2.5).length,
      color: '#CBD5E1'
    }
  ].filter(item => item.count > 0);

  // Course Distribution
  const courseData = students.reduce(
    (acc: { [key: string]: number }, student) => {
      acc[student.course] = (acc[student.course] || 0) + 1;
      return acc;
    },
    {}
  );

  const courseDistribution = Object.entries(courseData).map(
    ([course, count]) => ({
      course:
        course.length > 20
          ? course.substring(0, 17) + '...'
          : course,
      count
    })
  );

  // Year Distribution
  const yearData = students.reduce(
    (acc: { [key: string]: number }, student) => {
      const year = `Year ${student.year}`;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    },
    {}
  );

  const yearDistribution = Object.entries(yearData).map(
    ([year, count]) => ({
      year,
      count
    })
  );

  // Certificate Status
  const allCertificates = students.flatMap(s => s.certificates);

  const certificateStatus = [
    {
      name: 'Approved',
      value: allCertificates.filter(c => c.status === 'approved').length,
      color: '#3B82F6'
    },
    {
      name: 'Pending',
      value: allCertificates.filter(c => c.status === 'pending').length,
      color: '#93C5FD'
    },
    {
      name: 'Rejected',
      value: allCertificates.filter(c => c.status === 'rejected').length,
      color: '#CBD5E1'
    }
  ].filter(item => item.value > 0);

  // Activity Types
  const allActivities = students.flatMap(s => s.activities);

  const activityTypes = [
    {
      type: 'Co-curricular',
      count: allActivities.filter(
        a => a.type === 'co-curricular'
      ).length,
      hours: allActivities
        .filter(a => a.type === 'co-curricular')
        .reduce((sum, a) => sum + a.hours, 0)
    },
    {
      type: 'Extracurricular',
      count: allActivities.filter(
        a => a.type === 'extracurricular'
      ).length,
      hours: allActivities
        .filter(a => a.type === 'extracurricular')
        .reduce((sum, a) => sum + a.hours, 0)
    }
  ];

  // Skills Analysis
  const skillsFrequency = allActivities
    .flatMap(activity => activity.skills)
    .reduce(
      (acc: { [key: string]: number }, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      },
      {}
    );

  const topSkills = Object.entries(skillsFrequency)
    .map(([skill, count]) => ({
      skill,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Monthly trends (simulated data)
  const monthlyTrends = [
    { month: 'Jan', students: 15, certificates: 8, activities: 25 },
    { month: 'Feb', students: 18, certificates: 12, activities: 32 },
    { month: 'Mar', students: 22, certificates: 15, activities: 28 },
    { month: 'Apr', students: 20, certificates: 18, activities: 35 },
    { month: 'May', students: 25, certificates: 22, activities: 40 },
    { month: 'Jun', students: 28, certificates: 25, activities: 38 }
  ];

  const COLORS = [
    '#3B82F6',
    '#60A5FA',
    '#93C5FD',
    '#CBD5E1',
    '#64748B',
    '#94A3B8'
  ];

  const totalStats = {
    students: students.length,
    avgGPA:
      students.reduce((sum, s) => sum + s.gpa, 0) /
      students.length,
    certificates: allCertificates.length,
    activities: allActivities.length,
    totalHours: allActivities.reduce(
      (sum, a) => sum + a.hours,
      0
    )
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          University Analytics
        </h3>

        <p className="text-slate-500">
          Comprehensive insights and trends across the university
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Total Students
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {totalStats.students}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average GPA */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Average GPA
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {totalStats.avgGPA.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Certificates
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {totalStats.certificates}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Activities
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {totalStats.activities}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <Activity className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">
                Total Hours
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {totalStats.totalHours}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <TrendingUp className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* GPA Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            GPA Distribution
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gpaDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="range"
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={{ stroke: '#CBD5E1' }}
              />

              <YAxis
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={{ stroke: '#CBD5E1' }}
              />

              <Tooltip
                formatter={(value: number) => [
                  `${value} students`,
                  'Count'
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />

              <Bar
                dataKey="count"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              >
                {gpaDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Students by Course
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ course, percent }) =>
                  `${course} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#3B82F6"
                dataKey="count"
              >
                {courseDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Year Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Students by Year
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="year"
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={{ stroke: '#CBD5E1' }}
              />

              <YAxis
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={{ stroke: '#CBD5E1' }}
              />

              <Tooltip
                formatter={(value: number) => [
                  `${value} students`,
                  'Count'
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />

              <Bar
                dataKey="count"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Certificate Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Certificate Status
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={certificateStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#3B82F6"
                dataKey="value"
              >
                {certificateStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">
          Monthly Trends
        </h4>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrends}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
            />

            <YAxis
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px'
              }}
            />

            <Area
              type="monotone"
              dataKey="students"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.45}
            />

            <Area
              type="monotone"
              dataKey="certificates"
              stackId="1"
              stroke="#60A5FA"
              fill="#60A5FA"
              fillOpacity={0.45}
            />

            <Area
              type="monotone"
              dataKey="activities"
              stackId="1"
              stroke="#94A3B8"
              fill="#94A3B8"
              fillOpacity={0.45}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Analysis and Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Types */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Activity Analysis
          </h4>

          <div className="space-y-4">
            {activityTypes.map((activity, index) => (
              <div
                key={activity.type}
                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <div>
                  <h5 className="font-medium text-slate-900">
                    {activity.type}
                  </h5>

                  <p className="text-sm text-slate-500">
                    {activity.count} activities •{' '}
                    {activity.hours} total hours
                  </p>
                </div>

                <div className="text-right">
                  <div className="w-20 h-20">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={[{ value: activity.count }]}
                          cx="50%"
                          cy="50%"
                          outerRadius={30}
                          fill={
                            index === 0
                              ? '#3B82F6'
                              : '#94A3B8'
                          }
                          dataKey="value"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Most Popular Skills
          </h4>

          <div className="space-y-3">
            {topSkills.slice(0, 8).map((skill, index) => (
              <div
                key={skill.skill}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium text-slate-900">
                  {skill.skill}
                </span>

                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (skill.count /
                            topSkills[0].count) *
                          100
                        }%`
                      }}
                    ></div>
                  </div>

                  <span className="text-sm text-slate-500 w-8">
                    {skill.count}
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

export default UniversityAnalytics;
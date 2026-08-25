import React from 'react';
import { Student } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, Award, Activity } from 'lucide-react';

interface UniversityAnalyticsProps {
  students: Student[];
}

const UniversityAnalytics: React.FC<UniversityAnalyticsProps> = ({ students }) => {
  // GPA Distribution
  const gpaDistribution = [
    { range: '3.5-4.0', count: students.filter(s => s.gpa >= 3.5).length, color: '#10B981' },
    { range: '3.0-3.4', count: students.filter(s => s.gpa >= 3.0 && s.gpa < 3.5).length, color: '#3B82F6' },
    { range: '2.5-2.9', count: students.filter(s => s.gpa >= 2.5 && s.gpa < 3.0).length, color: '#F59E0B' },
    { range: '2.0-2.4', count: students.filter(s => s.gpa >= 2.0 && s.gpa < 2.5).length, color: '#EF4444' },
  ].filter(item => item.count > 0);

  // Course Distribution
  const courseData = students.reduce((acc: { [key: string]: number }, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {});

  const courseDistribution = Object.entries(courseData).map(([course, count]) => ({
    course: course.length > 20 ? course.substring(0, 17) + '...' : course,
    count
  }));

  // Year Distribution
  const yearData = students.reduce((acc: { [key: string]: number }, student) => {
    const year = `Year ${student.year}`;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const yearDistribution = Object.entries(yearData).map(([year, count]) => ({ year, count }));

  // Certificate Status
  const allCertificates = students.flatMap(s => s.certificates);
  const certificateStatus = [
    { name: 'Approved', value: allCertificates.filter(c => c.status === 'approved').length, color: '#10B981' },
    { name: 'Pending', value: allCertificates.filter(c => c.status === 'pending').length, color: '#F59E0B' },
    { name: 'Rejected', value: allCertificates.filter(c => c.status === 'rejected').length, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Activity Types
  const allActivities = students.flatMap(s => s.activities);
  const activityTypes = [
    { 
      type: 'Co-curricular', 
      count: allActivities.filter(a => a.type === 'co-curricular').length,
      hours: allActivities.filter(a => a.type === 'co-curricular').reduce((sum, a) => sum + a.hours, 0)
    },
    { 
      type: 'Extracurricular', 
      count: allActivities.filter(a => a.type === 'extracurricular').length,
      hours: allActivities.filter(a => a.type === 'extracurricular').reduce((sum, a) => sum + a.hours, 0)
    }
  ];

  // Skills Analysis
  const skillsFrequency = allActivities
    .flatMap(activity => activity.skills)
    .reduce((acc: { [key: string]: number }, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  const topSkills = Object.entries(skillsFrequency)
    .map(([skill, count]) => ({ skill, count }))
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  const totalStats = {
    students: students.length,
    avgGPA: (students.reduce((sum, s) => sum + s.gpa, 0) / students.length),
    certificates: allCertificates.length,
    activities: allActivities.length,
    totalHours: allActivities.reduce((sum, a) => sum + a.hours, 0)
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">University Analytics</h3>
        <p className="text-gray-600">Comprehensive insights and trends across the university</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Students</p>
              <p className="text-2xl font-bold">{totalStats.students}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Average GPA</p>
              <p className="text-2xl font-bold">{totalStats.avgGPA.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Certificates</p>
              <p className="text-2xl font-bold">{totalStats.certificates}</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Activities</p>
              <p className="text-2xl font-bold">{totalStats.activities}</p>
            </div>
            <Activity className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Hours</p>
              <p className="text-2xl font-bold">{totalStats.totalHours}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* GPA Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">GPA Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gpaDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} students`, 'Count']} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                {gpaDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Students by Course</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ course, percent }) => `${course} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {courseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Year Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Students by Year</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} students`, 'Count']} />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Certificate Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Certificate Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={certificateStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {certificateStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="students" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            <Area type="monotone" dataKey="certificates" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="activities" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Analysis and Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Types */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Analysis</h4>
          <div className="space-y-4">
            {activityTypes.map((activity, index) => (
              <div key={activity.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{activity.type}</h5>
                  <p className="text-sm text-gray-600">{activity.count} activities • {activity.hours} total hours</p>
                </div>
                <div className="text-right">
                  <div className="w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{ value: activity.count }]}
                          cx="50%"
                          cy="50%"
                          outerRadius={30}
                          fill={index === 0 ? '#3B82F6' : '#10B981'}
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
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Skills</h4>
          <div className="space-y-2">
            {topSkills.slice(0, 8).map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(skill.count / topSkills[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{skill.count}</span>
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
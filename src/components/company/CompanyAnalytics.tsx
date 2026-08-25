import React from 'react';
import { Student } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Users, TrendingUp, Star, Award, BookOpen, Activity } from 'lucide-react';

interface CompanyAnalyticsProps {
  students: Student[];
}

const CompanyAnalytics: React.FC<CompanyAnalyticsProps> = ({ students }) => {
  // Talent Pool Distribution by Course
  const courseData = students.reduce((acc: { [key: string]: number }, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {});

  const courseDistribution = Object.entries(courseData).map(([course, count]) => ({
    course: course.length > 15 ? course.substring(0, 12) + '...' : course,
    count,
    fullName: course
  }));

  // GPA Distribution Analysis
  const gpaRanges = [
    { range: '3.7-4.0', count: students.filter(s => s.gpa >= 3.7).length, color: '#10B981', label: 'Exceptional' },
    { range: '3.3-3.6', count: students.filter(s => s.gpa >= 3.3 && s.gpa < 3.7).length, color: '#3B82F6', label: 'High Performers' },
    { range: '3.0-3.2', count: students.filter(s => s.gpa >= 3.0 && s.gpa < 3.3).length, color: '#F59E0B', label: 'Good' },
    { range: '2.5-2.9', count: students.filter(s => s.gpa >= 2.5 && s.gpa < 3.0).length, color: '#EF4444', label: 'Developing' }
  ].filter(item => item.count > 0);

  // Skills Analysis
  const skillsFrequency = students
    .flatMap(student => student.skills)
    .reduce((acc: { [key: string]: number }, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  const topSkills = Object.entries(skillsFrequency)
    .map(([skill, count]) => ({ skill, count, percentage: ((count / students.length) * 100).toFixed(1) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Experience Level Analysis
  const experienceData = students.map(student => {
    const totalHours = student.activities.reduce((sum, a) => sum + a.hours, 0);
    const certifications = student.certificates.filter(c => c.status === 'approved').length;
    let level = 'Entry';
    
    if (totalHours > 200 && certifications > 2) level = 'Advanced';
    else if (totalHours > 100 || certifications > 1) level = 'Intermediate';
    
    return level;
  });

  const experienceLevels = [
    { level: 'Entry', count: experienceData.filter(l => l === 'Entry').length, color: '#F59E0B' },
    { level: 'Intermediate', count: experienceData.filter(l => l === 'Intermediate').length, color: '#3B82F6' },
    { level: 'Advanced', count: experienceData.filter(l => l === 'Advanced').length, color: '#10B981' }
  ];

  // Activity Engagement
  const activityTypes = [
    {
      type: 'Co-curricular',
      participants: new Set(students.filter(s => s.activities.some(a => a.type === 'co-curricular')).map(s => s.id)).size,
      totalHours: students.flatMap(s => s.activities.filter(a => a.type === 'co-curricular')).reduce((sum, a) => sum + a.hours, 0)
    },
    {
      type: 'Extracurricular',
      participants: new Set(students.filter(s => s.activities.some(a => a.type === 'extracurricular')).map(s => s.id)).size,
      totalHours: students.flatMap(s => s.activities.filter(a => a.type === 'extracurricular')).reduce((sum, a) => sum + a.hours, 0)
    }
  ];

  // University Ranking (by average GPA and certifications)
  const universityData = students.reduce((acc: { [key: string]: { students: Student[], totalGPA: number, totalCerts: number } }, student) => {
    if (!acc[student.university]) {
      acc[student.university] = { students: [], totalGPA: 0, totalCerts: 0 };
    }
    acc[student.university].students.push(student);
    acc[student.university].totalGPA += student.gpa;
    acc[student.university].totalCerts += student.certificates.filter(c => c.status === 'approved').length;
    return acc;
  }, {});

  const universityRanking = Object.entries(universityData).map(([university, data]) => ({
    university: university.length > 20 ? university.substring(0, 17) + '...' : university,
    avgGPA: (data.totalGPA / data.students.length).toFixed(2),
    studentCount: data.students.length,
    avgCerts: (data.totalCerts / data.students.length).toFixed(1),
    fullName: university
  })).sort((a, b) => parseFloat(b.avgGPA) - parseFloat(a.avgGPA));

  // Talent Quality Metrics
  const qualityMetrics = {
    avgGPA: (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2),
    topPerformers: students.filter(s => s.gpa >= 3.5).length,
    certificationRate: ((students.filter(s => s.certificates.some(c => c.status === 'approved')).length / students.length) * 100).toFixed(1),
    activeParticipants: students.filter(s => s.activities.length > 0).length,
    avgActivityHours: Math.round(students.reduce((sum, s) => sum + s.activities.reduce((hours, a) => hours + a.hours, 0), 0) / students.length),
    leadershipExperience: students.filter(s => 
      s.activities.some(a => 
        a.title.toLowerCase().includes('president') ||
        a.title.toLowerCase().includes('leader') ||
        a.skills.some(skill => skill.toLowerCase().includes('leadership'))
      )
    ).length
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Talent Pool Analytics</h3>
        <p className="text-gray-600">Comprehensive insights into available talent across universities</p>
      </div>

      {/* Quality Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Talent</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg GPA</p>
              <p className="text-2xl font-bold">{qualityMetrics.avgGPA}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Top Performers</p>
              <p className="text-2xl font-bold">{qualityMetrics.topPerformers}</p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Certified %</p>
              <p className="text-2xl font-bold">{qualityMetrics.certificationRate}%</p>
            </div>
            <Award className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Active</p>
              <p className="text-2xl font-bold">{qualityMetrics.activeParticipants}</p>
            </div>
            <Activity className="w-8 h-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Leaders</p>
              <p className="text-2xl font-bold">{qualityMetrics.leadershipExperience}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Talent by Field of Study</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `${value} students`, 
                  'Count'
                ]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.fullName || label;
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GPA Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gpaRanges}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count, percent }) => `${range} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {gpaRanges.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string, props: any) => [
                `${value} students`,
                props.payload.label
              ]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Experience Levels */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Experience Levels</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={experienceLevels} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="level" type="category" width={100} />
              <Tooltip formatter={(value: number) => [`${value} students`, 'Count']} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {experienceLevels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Engagement */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Engagement</h4>
          <div className="space-y-4">
            {activityTypes.map((activity, index) => (
              <div key={activity.type} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">{activity.type}</h5>
                  <span className="text-sm font-semibold text-gray-600">
                    {activity.participants} students
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total Hours: {activity.totalHours}</span>
                  <span>Avg: {Math.round(activity.totalHours / activity.participants)} hrs/student</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                    style={{ width: `${(activity.participants / students.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((activity.participants / students.length) * 100).toFixed(1)}% participation rate
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Skills and Universities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Most In-Demand Skills</h4>
          <div className="space-y-3">
            {topSkills.map((item, index) => (
              <div key={item.skill} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{item.skill}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / topSkills[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  <span className="text-xs text-gray-500 w-10">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* University Rankings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Universities by Performance</h4>
          <div className="space-y-3">
            {universityRanking.slice(0, 8).map((uni, index) => (
              <div key={uni.university} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900" title={uni.fullName}>{uni.university}</p>
                    <p className="text-xs text-gray-600">{uni.studentCount} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      GPA: {uni.avgGPA}
                    </span>
                    <span className="text-xs text-gray-500">
                      {uni.avgCerts} certs
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
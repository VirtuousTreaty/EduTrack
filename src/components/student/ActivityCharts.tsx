import React from 'react';
import { Student } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Award, BookOpen } from 'lucide-react';

interface ActivityChartsProps {
  student: Student;
}

const ActivityCharts: React.FC<ActivityChartsProps> = ({ student }) => {
  // Prepare data for activity hours by type
  const activityData = [
    {
      type: 'Co-curricular',
      hours: student.activities.filter(a => a.type === 'co-curricular').reduce((sum, a) => sum + a.hours, 0),
      count: student.activities.filter(a => a.type === 'co-curricular').length
    },
    {
      type: 'Extracurricular',
      hours: student.activities.filter(a => a.type === 'extracurricular').reduce((sum, a) => sum + a.hours, 0),
      count: student.activities.filter(a => a.type === 'extracurricular').length
    }
  ];

  // Skills frequency data
  const skillsFrequency = student.activities
    .flatMap(activity => activity.skills)
    .reduce((acc: { [key: string]: number }, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  const skillsData = Object.entries(skillsFrequency)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // GPA trend data
  const gpaData = student.academicRecords.map(record => ({
    semester: `${record.semester.slice(0, 3)} ${record.year}`,
    gpa: record.gpa
  }));

  // Certificate status data
  const certificateData = [
    { name: 'Approved', value: student.certificates.filter(c => c.status === 'approved').length, color: '#10B981' },
    { name: 'Pending', value: student.certificates.filter(c => c.status === 'pending').length, color: '#F59E0B' },
    { name: 'Rejected', value: student.certificates.filter(c => c.status === 'rejected').length, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  const totalHours = student.activities.reduce((sum, activity) => sum + activity.hours, 0);
  const avgGPA = student.academicRecords.length > 0 
    ? student.academicRecords.reduce((sum, record) => sum + record.gpa, 0) / student.academicRecords.length
    : student.gpa;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-600">Visual insights into your academic and extracurricular activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Activities</p>
              <p className="text-2xl font-bold">{student.activities.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Hours</p>
              <p className="text-2xl font-bold">{totalHours}</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Average GPA</p>
              <p className="text-2xl font-bold">{avgGPA.toFixed(2)}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Certificates</p>
              <p className="text-2xl font-bold">{student.certificates.length}</p>
            </div>
            <Award className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Hours Bar Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Hours by Type</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} ${name === 'hours' ? 'hours' : 'activities'}`, 
                  name === 'hours' ? 'Hours' : 'Count'
                ]}
              />
              <Bar dataKey="hours" fill="#3B82F6" name="hours" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Frequency Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="skill" type="category" width={100} />
              <Tooltip formatter={(value: number) => [`${value} activities`, 'Count']} />
              <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GPA Trend Line Chart */}
        {gpaData.length > 1 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">GPA Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gpaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                <Tooltip formatter={(value: number) => [`${value}`, 'GPA']} />
                <Line 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Certificate Status Pie Chart */}
        {certificateData.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Certificate Status</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={certificateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {certificateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Individual Activity Details */}
      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h4>
        <div className="space-y-4">
          {student.activities
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{activity.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="capitalize">{activity.type.replace('-', ' ')}</span>
                        <span>{activity.hours} hours</span>
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex flex-wrap gap-1 justify-end">
                        {activity.skills.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityCharts;
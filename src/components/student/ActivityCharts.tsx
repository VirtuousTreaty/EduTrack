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
  Line
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';

interface ActivityChartsProps {
  student: Student;
}

const ActivityCharts: React.FC<ActivityChartsProps> = ({ student }) => {
  
  const activityData = [
    {
      type: 'Co-curricular',
      hours: student.activities
        .filter(a => a.type === 'co-curricular')
        .reduce((sum, a) => sum + a.hours, 0),
      count: student.activities.filter(a => a.type === 'co-curricular').length
    },
    {
      type: 'Extracurricular',
      hours: student.activities
        .filter(a => a.type === 'extracurricular')
        .reduce((sum, a) => sum + a.hours, 0),
      count: student.activities.filter(a => a.type === 'extracurricular').length
    }
  ];

  

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

  const gpaData = student.academicRecords.map(record => ({
    semester: `${record.semester.slice(0, 3)} ${record.year}`,
    gpa: record.gpa
  }));

  const certificateData = [
    {
      name: 'Approved',
      value: student.certificates.filter(c => c.status === 'approved').length,
      color: '#16A34A'
    },
    {
      name: 'Pending',
      value: student.certificates.filter(c => c.status === 'pending').length,
      color: '#D97706'
    },
    {
      name: 'Rejected',
      value: student.certificates.filter(c => c.status === 'rejected').length,
      color: '#DC2626'
    }
  ].filter(item => item.value > 0);

  const totalHours = student.activities.reduce(
    (sum, activity) => sum + activity.hours,
    0
  );

  const avgGPA =
    student.academicRecords.length > 0
      ? student.academicRecords.reduce(
        (sum, record) => sum + record.gpa,
        0
      ) / student.academicRecords.length
      : student.gpa;

  const statCards = [
    {
      label: 'Total Activities',
      value: student.activities.length,
      icon: TrendingUp,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Total Hours',
      value: totalHours,
      icon: Clock,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Average GPA',
      value: avgGPA.toFixed(2),
      icon: BookOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Certificates',
      value: student.certificates.length,
      icon: Award,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900">
          Analytics
        </h3>
        <p className="text-gray-500 mt-1">
          Track your academic and extracurricular progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-xl p-5
                         transition-all duration-200
                         hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.label}
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`w-11 h-11 rounded-lg ${stat.iconBg}
                              flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Activity Hours */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm">
          <div className="mb-5">
            <h4 className="text-base font-semibold text-gray-900">
              Activity Hours
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Hours spent across different activity types
            </p>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={activityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="type"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: '#F3F4F6' }}
                formatter={(value: number) => [
                  `${value} hours`,
                  'Hours'
                ]}
              />

              <Bar
                dataKey="hours"
                fill="#3B82F6"
                radius={[5, 5, 0, 0]}
                barSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm">
          <div className="mb-5">
            <h4 className="text-base font-semibold text-gray-900">
              Top Skills
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Skills developed through your activities
            </p>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={skillsData}
              layout="vertical"
              margin={{ left: 10, right: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#E5E7EB"
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />

              <YAxis
                dataKey="skill"
                type="category"
                width={100}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#4B5563', fontSize: 12 }}
              />

              <Tooltip
                formatter={(value: number) => [
                  `${value} activities`,
                  'Count'
                ]}
              />

              <Bar
                dataKey="count"
                fill="#3B82F6"
                radius={[0, 5, 5, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GPA Trend */}
        {gpaData.length > 1 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm">
            <div className="mb-5">
              <h4 className="text-base font-semibold text-gray-900">
                GPA Trend
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Your academic performance over time
              </p>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={gpaData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="semester"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />

                <YAxis
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value: number) => [
                    value.toFixed(2),
                    'GPA'
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={{
                    fill: '#3B82F6',
                    strokeWidth: 2,
                    r: 5
                  }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Certificate Status */}
        {certificateData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm">
            <div className="mb-5">
              <h4 className="text-base font-semibold text-gray-900">
                Certificate Status
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Current status of your certificates
              </p>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={certificateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {certificateData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm">
        <div className="mb-5">
          <h4 className="text-base font-semibold text-gray-900">
            Activity Timeline
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Your recent academic and extracurricular activities
          </p>
        </div>

        <div className="space-y-3">
          {[...student.activities]
            .sort(
              (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
            )
            .map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4
                           border border-gray-100 rounded-lg
                           hover:border-blue-200 hover:bg-blue-50/30
                           transition-colors"
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full
                             bg-blue-50 flex items-center justify-center"
                >
                  <span className="text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {activity.title}
                      </h5>

                      <p className="text-sm text-gray-500 mt-1">
                        {activity.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                        <span className="capitalize">
                          {activity.type.replace('-', ' ')}
                        </span>

                        <span>
                          {activity.hours} hours
                        </span>

                        <span>
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 justify-end">
                      {activity.skills.slice(0, 3).map(
                        (skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 rounded-md
                                       text-xs font-medium
                                       bg-blue-50 text-blue-700"
                          >
                            {skill}
                          </span>
                        )
                      )}
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
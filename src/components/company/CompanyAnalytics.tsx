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
} from 'recharts';
import {
  Users,
  TrendingUp,
  Star,
  Award,
  BookOpen,
  Activity,
} from 'lucide-react';

interface CompanyAnalyticsProps {
  students: Student[];
}

const CompanyAnalytics: React.FC<CompanyAnalyticsProps> = ({ students }) => {
  // Talent Pool Distribution by Course
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
        course.length > 15 ? course.substring(0, 12) + '...' : course,
      count,
      fullName: course,
    })
  );

  // GPA Distribution Analysis
  const gpaRanges = [
    {
      range: '3.7-4.0',
      count: students.filter((s) => s.gpa >= 3.7).length,
      color: '#3B82F6',
      label: 'Exceptional',
    },
    {
      range: '3.3-3.6',
      count: students.filter((s) => s.gpa >= 3.3 && s.gpa < 3.7).length,
      color: '#60A5FA',
      label: 'High Performers',
    },
    {
      range: '3.0-3.2',
      count: students.filter((s) => s.gpa >= 3.0 && s.gpa < 3.3).length,
      color: '#93C5FD',
      label: 'Good',
    },
    {
      range: '2.5-2.9',
      count: students.filter((s) => s.gpa >= 2.5 && s.gpa < 3.0).length,
      color: '#CBD5E1',
      label: 'Developing',
    },
  ].filter((item) => item.count > 0);

  // Skills Analysis
  const skillsFrequency = students
    .flatMap((student) => student.skills)
    .reduce((acc: { [key: string]: number }, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  const topSkills = Object.entries(skillsFrequency)
    .map(([skill, count]) => ({
      skill,
      count,
      percentage:
        students.length > 0
          ? ((count / students.length) * 100).toFixed(1)
          : '0.0',
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Experience Level Analysis
  const experienceData = students.map((student) => {
    const totalHours = student.activities.reduce(
      (sum, activity) => sum + activity.hours,
      0
    );

    const certifications = student.certificates.filter(
      (certificate) => certificate.status === 'approved'
    ).length;

    let level = 'Entry';

    if (totalHours > 200 && certifications > 2) {
      level = 'Advanced';
    } else if (totalHours > 100 || certifications > 1) {
      level = 'Intermediate';
    }

    return level;
  });

  const experienceLevels = [
    {
      level: 'Entry',
      count: experienceData.filter((level) => level === 'Entry').length,
      color: '#CBD5E1',
    },
    {
      level: 'Intermediate',
      count: experienceData.filter(
        (level) => level === 'Intermediate'
      ).length,
      color: '#60A5FA',
    },
    {
      level: 'Advanced',
      count: experienceData.filter((level) => level === 'Advanced').length,
      color: '#3B82F6',
    },
  ];

  // Activity Engagement
  const activityTypes = [
    {
      type: 'Co-curricular',
      participants: new Set(
        students
          .filter((student) =>
            student.activities.some(
              (activity) => activity.type === 'co-curricular'
            )
          )
          .map((student) => student.id)
      ).size,
      totalHours: students
        .flatMap((student) =>
          student.activities.filter(
            (activity) => activity.type === 'co-curricular'
          )
        )
        .reduce((sum, activity) => sum + activity.hours, 0),
    },
    {
      type: 'Extracurricular',
      participants: new Set(
        students
          .filter((student) =>
            student.activities.some(
              (activity) => activity.type === 'extracurricular'
            )
          )
          .map((student) => student.id)
      ).size,
      totalHours: students
        .flatMap((student) =>
          student.activities.filter(
            (activity) => activity.type === 'extracurricular'
          )
        )
        .reduce((sum, activity) => sum + activity.hours, 0),
    },
  ];

  // University Ranking
  const universityData = students.reduce(
    (
      acc: {
        [key: string]: {
          students: Student[];
          totalGPA: number;
          totalCerts: number;
        };
      },
      student
    ) => {
      if (!acc[student.university]) {
        acc[student.university] = {
          students: [],
          totalGPA: 0,
          totalCerts: 0,
        };
      }

      acc[student.university].students.push(student);
      acc[student.university].totalGPA += student.gpa;
      acc[student.university].totalCerts += student.certificates.filter(
        (certificate) => certificate.status === 'approved'
      ).length;

      return acc;
    },
    {}
  );

  const universityRanking = Object.entries(universityData)
    .map(([university, data]) => ({
      university:
        university.length > 20
          ? university.substring(0, 17) + '...'
          : university,
      avgGPA: (data.totalGPA / data.students.length).toFixed(2),
      studentCount: data.students.length,
      avgCerts: (data.totalCerts / data.students.length).toFixed(1),
      fullName: university,
    }))
    .sort((a, b) => parseFloat(b.avgGPA) - parseFloat(a.avgGPA));

  // Talent Quality Metrics
  const qualityMetrics = {
    avgGPA:
      students.length > 0
        ? (
            students.reduce((sum, student) => sum + student.gpa, 0) /
            students.length
          ).toFixed(2)
        : '0.00',

    topPerformers: students.filter((student) => student.gpa >= 3.5).length,

    certificationRate:
      students.length > 0
        ? (
            (students.filter((student) =>
              student.certificates.some(
                (certificate) => certificate.status === 'approved'
              )
            ).length /
              students.length) *
            100
          ).toFixed(1)
        : '0.0',

    activeParticipants: students.filter(
      (student) => student.activities.length > 0
    ).length,

    avgActivityHours:
      students.length > 0
        ? Math.round(
            students.reduce(
              (sum, student) =>
                sum +
                student.activities.reduce(
                  (hours, activity) => hours + activity.hours,
                  0
                ),
              0
            ) / students.length
          )
        : 0,

    leadershipExperience: students.filter((student) =>
      student.activities.some(
        (activity) =>
          activity.title.toLowerCase().includes('president') ||
          activity.title.toLowerCase().includes('leader') ||
          activity.skills.some((skill) =>
            skill.toLowerCase().includes('leadership')
          )
      )
    ).length,
  };

  const COLORS = [
    '#3B82F6',
    '#60A5FA',
    '#93C5FD',
    '#CBD5E1',
    '#2563EB',
    '#64748B',
    '#94A3B8',
    '#1D4ED8',
  ];

  const maxTopSkillCount = topSkills[0]?.count || 1;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Talent Pool Analytics
        </h3>

        <p className="text-slate-600">
          Comprehensive insights into available talent across universities
        </p>
      </div>

      {/* Quality Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {/* Total Talent */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Talent</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {students.length}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average GPA */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Avg GPA</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {qualityMetrics.avgGPA}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-700" />
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Top Performers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {qualityMetrics.topPerformers}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Certified */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Certified %</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {qualityMetrics.certificationRate}%
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-slate-700" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Active</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {qualityMetrics.activeParticipants}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Leaders */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Leaders</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {qualityMetrics.leadershipExperience}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Talent by Field of Study
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="course"
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#64748B"
              />

              <YAxis stroke="#64748B" />

              <Tooltip
                formatter={(value: number) => [
                  `${value} students`,
                  'Count',
                ]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.fullName || label;
                }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
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

        {/* GPA Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Performance Distribution
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gpaRanges}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percent }) =>
                  `${range} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#3B82F6"
                dataKey="count"
              >
                {gpaRanges.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(
                  value: number,
                  name: string,
                  props: any
                ) => [
                  `${value} students`,
                  props.payload.label,
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Experience Levels */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Experience Levels
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={experienceLevels}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
              />

              <XAxis
                type="number"
                stroke="#64748B"
              />

              <YAxis
                dataKey="level"
                type="category"
                width={100}
                stroke="#64748B"
              />

              <Tooltip
                formatter={(value: number) => [
                  `${value} students`,
                  'Count',
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                }}
              />

              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
              >
                {experienceLevels.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Engagement */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Activity Engagement
          </h4>

          <div className="space-y-4">
            {activityTypes.map((activity) => {
              const participationRate =
                students.length > 0
                  ? (activity.participants / students.length) * 100
                  : 0;

              const averageHours =
                activity.participants > 0
                  ? Math.round(
                      activity.totalHours / activity.participants
                    )
                  : 0;

              return (
                <div
                  key={activity.type}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-slate-900">
                      {activity.type}
                    </h5>

                    <span className="text-sm font-semibold text-slate-600">
                      {activity.participants} students
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>
                      Total Hours: {activity.totalHours}
                    </span>

                    <span>
                      Avg: {averageHours} hrs/student
                    </span>
                  </div>

                  <div className="mt-3 bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${participationRate}%`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {participationRate.toFixed(1)}% participation rate
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Skills and Universities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Most In-Demand Skills
          </h4>

          <div className="space-y-4">
            {topSkills.map((item, index) => (
              <div
                key={item.skill}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold shrink-0">
                    {index + 1}
                  </span>

                  <span className="font-medium text-slate-800 truncate">
                    {item.skill}
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-20 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.count / maxTopSkillCount) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm text-slate-600 w-8">
                    {item.count}
                  </span>

                  <span className="text-xs text-slate-500 w-10">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* University Rankings */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Top Universities by Performance
          </h4>

          <div className="space-y-3">
            {universityRanking.slice(0, 8).map((uni, index) => (
              <div
                key={uni.university}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold shrink-0">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p
                      className="font-medium text-slate-900 truncate"
                      title={uni.fullName}
                    >
                      {uni.university}
                    </p>

                    <p className="text-xs text-slate-500">
                      {uni.studentCount} students
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                      GPA: {uni.avgGPA}
                    </span>

                    <span className="text-xs text-slate-500">
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
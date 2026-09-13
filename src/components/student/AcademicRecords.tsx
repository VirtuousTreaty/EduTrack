import React from 'react';
import { AcademicRecord } from '../../types';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

interface AcademicRecordsProps {
  records: AcademicRecord[];
}

const AcademicRecords: React.FC<AcademicRecordsProps> = ({ records }) => {
  const calculateOverallGPA = () => {
    if (records.length === 0) return '0.00';

    const total = records.reduce((sum, record) => sum + record.gpa, 0);
    return (total / records.length).toFixed(2);
  };

  const getTotalCredits = () => {
    return records.reduce(
      (total, record) =>
        total +
        record.subjects.reduce((sum, subject) => sum + subject.credits, 0),
      0
    );
  };

  const getGradeColor = (grade: string) => {
    const gradeColors: { [key: string]: string } = {
      A: 'bg-green-50 text-green-700 border-green-200',
      'A-': 'bg-green-50 text-green-700 border-green-200',
      'B+': 'bg-blue-50 text-blue-700 border-blue-200',
      B: 'bg-blue-50 text-blue-700 border-blue-200',
      'B-': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'C+': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      C: 'bg-orange-50 text-orange-700 border-orange-200',
      D: 'bg-red-50 text-red-700 border-red-200',
      F: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      gradeColors[grade] ||
      'bg-gray-50 text-gray-700 border-gray-200'
    );
  };

  return (
    <div className="p-6">
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Academic Records
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Track your academic performance and semester-wise results
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Overall GPA */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Overall GPA
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {calculateOverallGPA()}
              </p>
            </div>
          </div>
        </div>

        {/* Total Credits */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Credits
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {getTotalCredits()}
              </p>
            </div>
          </div>
        </div>

        {/* Semesters */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Semesters
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {records.length}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Semester Records */}
      <div className="space-y-5">

        {records.map((record) => {
          const totalCredits = record.subjects.reduce(
            (sum, subject) => sum + subject.credits,
            0
          );

          return (
            <div
              key={record.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-sm"
            >
              {/* Semester Header */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {record.semester} {record.year}
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      {record.subjects.length} subjects
                      <span className="mx-2">•</span>
                      {totalCredits} credits
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      Semester GPA
                    </span>

                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-sm font-semibold">
                      {record.gpa.toFixed(2)}
                    </span>
                  </div>

                </div>
              </div>

              {/* Subjects Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">

                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Course Code
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>

                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>

                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>

                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {record.subjects.map((subject, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {subject.code}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {subject.name}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700 text-center">
                          {subject.credits}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-[38px] px-2.5 py-1 rounded-md border text-xs font-semibold ${getGradeColor(
                              subject.grade
                            )}`}
                          >
                            {subject.grade}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">
                          {subject.points.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default AcademicRecords;
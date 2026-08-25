import React from 'react';
import { AcademicRecord } from '../../types';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

interface AcademicRecordsProps {
  records: AcademicRecord[];
}

const AcademicRecords: React.FC<AcademicRecordsProps> = ({ records }) => {
  const calculateOverallGPA = () => {
    if (records.length === 0) return 0;
    const total = records.reduce((sum, record) => sum + record.gpa, 0);
    return (total / records.length).toFixed(2);
  };

  const getTotalCredits = () => {
    return records.reduce((total, record) => 
      total + record.subjects.reduce((sum, subject) => sum + subject.credits, 0), 0
    );
  };

  const getGradeColor = (grade: string) => {
    const gradeColors: { [key: string]: string } = {
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-700',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-700',
      'B-': 'bg-yellow-100 text-yellow-800',
      'C+': 'bg-yellow-100 text-yellow-700',
      'C': 'bg-orange-100 text-orange-800',
      'D': 'bg-red-100 text-red-800',
      'F': 'bg-red-200 text-red-900'
    };
    return gradeColors[grade] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-600">Overall GPA</p>
              <p className="text-2xl font-bold text-blue-900">{calculateOverallGPA()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Total Credits</p>
              <p className="text-2xl font-bold text-green-900">{getTotalCredits()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-600">Semesters</p>
              <p className="text-2xl font-bold text-purple-900">{records.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Records */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Academic Records</h3>
        
        {records.map((record) => (
          <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {record.semester} {record.year}
                </h4>
                <p className="text-sm text-gray-600">
                  {record.subjects.length} subjects • {record.subjects.reduce((sum, s) => sum + s.credits, 0)} credits
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Semester GPA:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {record.gpa.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {record.subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {subject.code}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {subject.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-center">
                        {subject.credits}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-center font-medium">
                        {subject.points.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicRecords;
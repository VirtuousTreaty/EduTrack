import React, { useState } from 'react';
import { Student } from '../../types';
import {
  Search,
  Eye,
  Download,
  Filter,
  GraduationCap,
  Award,
  Activity
} from 'lucide-react';

interface StudentListProps {
  students: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const courses = Array.from(new Set(students.map(s => s.course)));
  const years = Array.from(new Set(students.map(s => s.year))).sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      !selectedCourse || student.course === selectedCourse;

    const matchesYear =
      !selectedYear || student.year.toString() === selectedYear;

    return matchesSearch && matchesCourse && matchesYear;
  });

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Students
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Course
              </label>

              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Courses</option>

                {courses.map(course => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year
              </label>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>

                {years.map(year => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Student Count */}
      <div className="mb-4">
        <p className="text-sm text-slate-500">
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition-all duration-300"
          >
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={
                  student.avatar ||
                  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                }
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">
                  {student.name}
                </h3>

                <p className="text-sm text-blue-600 truncate">
                  {student.course}
                </p>

                <p className="text-sm text-slate-500">
                  Year {student.year}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 border border-blue-100 rounded-full mx-auto mb-1">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>

                <p className="text-xs text-slate-500">
                  GPA
                </p>

                <p className="font-semibold text-slate-900">
                  {student.gpa}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 border border-blue-100 rounded-full mx-auto mb-1">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>

                <p className="text-xs text-slate-500">
                  Certificates
                </p>

                <p className="font-semibold text-slate-900">
                  {
                    student.certificates.filter(
                      c => c.status === 'approved'
                    ).length
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 border border-slate-200 rounded-full mx-auto mb-1">
                  <Activity className="w-4 h-4 text-slate-600" />
                </div>

                <p className="text-xs text-slate-500">
                  Activities
                </p>

                <p className="font-semibold text-slate-900">
                  {student.activities.length}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {student.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                  >
                    {skill}
                  </span>
                ))}

                {student.skills.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                    +{student.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewStudent(student)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Eye className="w-4 h-4" />

                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Student Details
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Student academic information and achievements
                </p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      selectedStudent.avatar ||
                      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                    alt={selectedStudent.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                  />

                  <div>
                    <h4 className="text-xl font-semibold text-slate-900">
                      {selectedStudent.name}
                    </h4>

                    <p className="text-blue-600">
                      {selectedStudent.course}
                    </p>

                    <p className="text-slate-500">
                      {selectedStudent.email}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h5 className="font-semibold text-slate-900 mb-3">
                    Academic Info
                  </h5>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">
                        University:
                      </span>

                      <p className="font-medium text-slate-900">
                        {selectedStudent.university}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Year:
                      </span>

                      <p className="font-medium text-slate-900">
                        Year {selectedStudent.year}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500">
                        GPA:
                      </span>

                      <p className="font-medium text-slate-900">
                        {selectedStudent.gpa}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">
                    Skills
                  </h5>

                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activities & Certificates */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">
                    Recent Activities
                  </h5>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedStudent.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-white border border-slate-200 rounded-lg p-3"
                      >
                        <p className="font-medium text-sm text-slate-900">
                          {activity.title}
                        </p>

                        <p className="text-xs text-slate-600">
                          {activity.description}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {activity.hours} hours •{' '}
                          {new Date(
                            activity.date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">
                    Certificates
                  </h5>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedStudent.certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-slate-900">
                            {cert.title}
                          </p>

                          <p className="text-xs text-slate-600">
                            {cert.issuer}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(
                              cert.dateIssued
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            cert.status === 'approved'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : cert.status === 'rejected'
                              ? 'bg-slate-50 text-slate-600 border-slate-200'
                              : 'bg-blue-50 text-blue-600 border-blue-200'
                          }`}
                        >
                          {cert.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
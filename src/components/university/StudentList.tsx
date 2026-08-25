import React, { useState } from 'react';
import { Student } from '../../types';
import { Search, Eye, Download, Filter, GraduationCap, Award, Activity } from 'lucide-react';

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
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !selectedCourse || student.course === selectedCourse;
    const matchesYear = !selectedYear || student.year.toString() === selectedYear;
    
    return matchesSearch && matchesCourse && matchesYear;
  });

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={student.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.course}</p>
                <p className="text-sm text-gray-500">Year {student.year}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">GPA</p>
                <p className="font-semibold text-gray-900">{student.gpa}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Certificates</p>
                <p className="font-semibold text-gray-900">{student.certificates.filter(c => c.status === 'approved').length}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600">Activities</p>
                <p className="font-semibold text-gray-900">{student.activities.length}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {student.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {skill}
                  </span>
                ))}
                {student.skills.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                    +{student.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewStudent(student)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Student Details</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedStudent.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={selectedStudent.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h4>
                    <p className="text-gray-600">{selectedStudent.course}</p>
                    <p className="text-gray-500">{selectedStudent.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Academic Info</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">University:</span>
                      <p className="font-medium">{selectedStudent.university}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Year:</span>
                      <p className="font-medium">Year {selectedStudent.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">GPA:</span>
                      <p className="font-medium">{selectedStudent.gpa}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activities & Certificates */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Recent Activities</h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedStudent.activities.map((activity) => (
                      <div key={activity.id} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.hours} hours • {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Certificates</h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedStudent.certificates.map((cert) => (
                      <div key={cert.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{cert.title}</p>
                          <p className="text-xs text-gray-600">{cert.issuer}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(cert.dateIssued).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          cert.status === 'approved' ? 'bg-green-100 text-green-800' :
                          cert.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
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
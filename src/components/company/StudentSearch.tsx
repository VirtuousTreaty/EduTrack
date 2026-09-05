import React, { useState } from 'react';
import { Student } from '../../types';
import {
  Search,
  Star,
  Download,
  Eye,
  Award,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import jsPDF from 'jspdf';

interface StudentSearchProps {
  students: Student[];
}

const StudentSearch: React.FC<StudentSearchProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [minGPA, setMinGPA] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Get unique values for filters
  const courses = Array.from(new Set(students.map((s) => s.course)));
  const years = Array.from(new Set(students.map((s) => s.year))).sort();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkill =
      !skillFilter ||
      student.skills.some((skill) =>
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );

    const matchesCourse =
      !courseFilter || student.course === courseFilter;

    const matchesGPA =
      !minGPA || student.gpa >= parseFloat(minGPA);

    const matchesYear =
      !yearFilter || student.year.toString() === yearFilter;

    return (
      matchesSearch &&
      matchesSkill &&
      matchesCourse &&
      matchesGPA &&
      matchesYear
    );
  });

  const downloadStudentResume = (student: Student) => {
    const pdf = new jsPDF();

    // Header
    pdf.setFontSize(20);
    pdf.text(student.name, 20, 30);

    pdf.setFontSize(12);
    pdf.text(`${student.course} - Year ${student.year}`, 20, 40);
    pdf.text(student.email, 20, 50);
    pdf.text(`GPA: ${student.gpa}`, 20, 60);

    // Skills
    pdf.setFontSize(16);
    pdf.text('Skills', 20, 80);

    pdf.setFontSize(10);
    const skillsText = student.skills.join(', ');
    pdf.text(skillsText, 20, 90);

    // Activities
    pdf.setFontSize(16);
    pdf.text('Activities', 20, 110);

    pdf.setFontSize(10);

    let yPos = 120;

    student.activities.forEach((activity, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }

      pdf.text(`${index + 1}. ${activity.title}`, 20, yPos);
      pdf.text(`   ${activity.description}`, 20, yPos + 8);
      pdf.text(
        `   ${activity.hours} hours - ${activity.type}`,
        20,
        yPos + 16
      );

      yPos += 30;
    });

    pdf.save(`${student.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) {
      return 'text-blue-700 bg-blue-50 border border-blue-200';
    }

    if (gpa >= 3.0) {
      return 'text-blue-600 bg-blue-50 border border-blue-200';
    }

    if (gpa >= 2.5) {
      return 'text-slate-700 bg-slate-100 border border-slate-200';
    }

    return 'text-slate-700 bg-slate-100 border border-slate-300';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Find Talent
        </h3>

        <p className="text-slate-600">
          Search and filter students by skills, academic performance, and
          experience
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Search
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Skills
            </label>

            <input
              type="text"
              placeholder="Enter skill name..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Course
            </label>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Courses</option>

              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* GPA Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Minimum GPA
            </label>

            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              placeholder="3.0"
              value={minGPA}
              onChange={(e) => setMinGPA(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Year
            </label>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Years</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-slate-600">
          Found {filteredStudents.length} student
          {filteredStudents.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            {/* Student Header */}
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
                <h4 className="font-semibold text-slate-900 truncate">
                  {student.name}
                </h4>

                <p className="text-sm text-blue-600 font-medium">
                  {student.course}
                </p>

                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />

                  <span className="text-xs text-slate-500 truncate">
                    {student.university}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGPAColor(
                    student.gpa
                  )}`}
                >
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {student.gpa}
                </div>

                <p className="text-xs text-slate-500 mt-1">GPA</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Award className="w-3 h-3 mr-1" />

                  {
                    student.certificates.filter(
                      (c) => c.status === 'approved'
                    ).length
                  }
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  Certificates
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <Star className="w-3 h-3 mr-1" />
                  {student.activities.length}
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  Activities
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {student.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}

                {student.skills.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    +{student.skills.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedStudent(student)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Profile</span>
              </button>

              <button
                onClick={() => downloadStudentResume(student)}
                className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                title="Download Resume"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />

          <h4 className="text-lg font-medium text-slate-900 mb-2">
            No students found
          </h4>

          <p className="text-slate-600">
            Try adjusting your search criteria to find more candidates.
          </p>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Student Profile
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  View academic performance, skills, activities, and
                  certificates
                </p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-start space-x-4">
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

                    <p className="text-blue-600 font-medium">
                      {selectedStudent.course}
                    </p>

                    <p className="text-slate-500">
                      {selectedStudent.email}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGPAColor(
                          selectedStudent.gpa
                        )}`}
                      >
                        GPA: {selectedStudent.gpa}
                      </span>

                      <span className="text-sm text-slate-500">
                        Year {selectedStudent.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h5 className="font-semibold text-slate-900 mb-3">
                    Technical Skills
                  </h5>

                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Academic Records */}
                <div>
                  <h5 className="font-semibold text-slate-900 mb-3">
                    Academic Performance
                  </h5>

                  <div className="space-y-2">
                    {selectedStudent.academicRecords
                      .slice(0, 3)
                      .map((record) => (
                        <div
                          key={record.id}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-900">
                              {record.semester} {record.year}
                            </span>

                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGPAColor(
                                record.gpa
                              )}`}
                            >
                              {record.gpa.toFixed(2)}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 mt-1">
                            {record.subjects.length} courses •{' '}
                            {record.subjects.reduce(
                              (sum, s) => sum + s.credits,
                              0
                            )}{' '}
                            credits
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Activities */}
                <div>
                  <h5 className="font-semibold text-slate-900 mb-3">
                    Activities & Experience
                  </h5>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedStudent.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-white border border-slate-200 rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-9 h-9 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-blue-600" />
                          </div>

                          <div className="flex-1">
                            <h6 className="font-medium text-slate-900">
                              {activity.title}
                            </h6>

                            <p className="text-sm text-slate-600 mt-1">
                              {activity.description}
                            </p>

                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                              <span className="capitalize">
                                {activity.type.replace('-', ' ')}
                              </span>

                              <span>{activity.hours} hours</span>

                              <span>
                                {new Date(
                                  activity.date
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                              {activity.skills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                  >
                                    {skill}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates */}
                <div>
                  <h5 className="font-semibold text-slate-900 mb-3">
                    Verified Certificates
                  </h5>

                  <div className="space-y-2">
                    {selectedStudent.certificates
                      .filter((cert) => cert.status === 'approved')
                      .map((cert) => (
                        <div
                          key={cert.id}
                          className="bg-white border border-slate-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <Award className="w-4 h-4 text-blue-600" />
                              </div>

                              <div>
                                <p className="font-medium text-slate-900">
                                  {cert.title}
                                </p>

                                <p className="text-sm text-slate-600">
                                  {cert.issuer}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(
                                    cert.dateIssued
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              Verified
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() =>
                      downloadStudentResume(selectedStudent)
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
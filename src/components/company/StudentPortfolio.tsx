import React, { useState } from 'react';
import { Student } from '../../types';
import {
  Eye,
  Download,
  Star,
  Award,
  MapPin,
  Calendar,
  Briefcase,
} from 'lucide-react';
import jsPDF from 'jspdf';

interface StudentPortfolioProps {
  students: Student[];
}

const StudentPortfolio: React.FC<StudentPortfolioProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sortBy, setSortBy] = useState<'gpa' | 'certificates' | 'activities'>(
    'gpa'
  );

  const sortedStudents = [...students].sort((a, b) => {
    switch (sortBy) {
      case 'gpa':
        return b.gpa - a.gpa;
      case 'certificates':
        return (
          b.certificates.filter((c) => c.status === 'approved').length -
          a.certificates.filter((c) => c.status === 'approved').length
        );
      case 'activities':
        return b.activities.length - a.activities.length;
      default:
        return 0;
    }
  });

  const downloadPortfolio = async (student: Student) => {
    const pdf = new jsPDF();

    // Header
    pdf.setFontSize(24);
    pdf.text(`${student.name} - Portfolio`, 20, 30);

    pdf.setFontSize(12);
    pdf.text(`${student.course} | ${student.university}`, 20, 45);
    pdf.text(
      `Email: ${student.email} | Year: ${student.year} | GPA: ${student.gpa}`,
      20,
      55
    );

    // Skills Section
    pdf.setFontSize(16);
    pdf.text('Technical Skills', 20, 75);
    pdf.setFontSize(10);

    const skillsText = student.skills.join(' • ');
    pdf.text(skillsText, 20, 85, { maxWidth: 170 });

    // Academic Performance
    pdf.setFontSize(16);
    pdf.text('Academic Performance', 20, 105);
    pdf.setFontSize(10);

    let yPos = 115;

    student.academicRecords.forEach((record) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }

      pdf.text(
        `${record.semester} ${record.year} - GPA: ${record.gpa.toFixed(2)}`,
        20,
        yPos
      );

      pdf.text(
        `Courses: ${record.subjects.length} | Credits: ${record.subjects.reduce(
          (sum, s) => sum + s.credits,
          0
        )}`,
        25,
        yPos + 8
      );

      yPos += 20;
    });

    // Verified Certificates
    if (yPos > 200) {
      pdf.addPage();
      yPos = 30;
    }

    pdf.setFontSize(16);
    pdf.text('Verified Certificates', 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);

    student.certificates
      .filter((cert) => cert.status === 'approved')
      .forEach((cert) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 30;
        }

        pdf.text(`• ${cert.title} - ${cert.issuer}`, 25, yPos);
        pdf.text(
          `  Issued: ${new Date(cert.dateIssued).toLocaleDateString()}`,
          25,
          yPos + 8
        );

        yPos += 20;
      });

    // Activities
    if (yPos > 200) {
      pdf.addPage();
      yPos = 30;
    }

    pdf.setFontSize(16);
    pdf.text('Activities & Experience', 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);

    student.activities.forEach((activity) => {
      if (yPos > 230) {
        pdf.addPage();
        yPos = 30;
      }

      pdf.text(`• ${activity.title}`, 25, yPos);

      pdf.text(`  ${activity.description}`, 25, yPos + 8, {
        maxWidth: 160,
      });

      pdf.text(
        `  Type: ${activity.type} | Hours: ${activity.hours} | Skills: ${activity.skills
          .slice(0, 3)
          .join(', ')}`,
        25,
        yPos + 16
      );

      yPos += 30;
    });

    pdf.save(`${student.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    }

    if (gpa >= 3.0) {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    }

    if (gpa >= 2.5) {
      return 'text-slate-700 bg-slate-100 border-slate-200';
    }

    return 'text-slate-700 bg-slate-100 border-slate-300';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Student Portfolios
          </h3>
          <p className="text-slate-600 mt-1">
            Browse comprehensive verified portfolios of talented students
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">
            Sort by:
          </label>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as 'gpa' | 'certificates' | 'activities'
              )
            }
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="gpa">Highest GPA</option>
            <option value="certificates">Most Certificates</option>
            <option value="activities">Most Activities</option>
          </select>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    student.avatar ||
                    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                  }
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg text-slate-900 truncate">
                    {student.name}
                  </h4>

                  <p className="text-blue-600 text-sm font-medium">
                    {student.course}
                  </p>

                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500 truncate">
                      {student.university}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getGPAColor(
                      student.gpa
                    )}`}
                  >
                    {student.gpa}
                  </div>

                  <p className="text-xs text-slate-500 mt-1">GPA</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200">
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
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {student.activities.length}
                  </div>

                  <p className="text-xs text-slate-500 mt-1">Activities</p>
                </div>
              </div>

              {/* Top Skills */}
              <div className="mb-5">
                <h5 className="text-sm font-semibold text-slate-900 mb-2">
                  Top Skills
                </h5>

                <div className="flex flex-wrap gap-1">
                  {student.skills.slice(0, 6).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Achievement */}
              {student.certificates.filter(
                (c) => c.status === 'approved'
              ).length > 0 && (
                <div className="mb-5">
                  <h5 className="text-sm font-semibold text-slate-900 mb-2">
                    Latest Achievement
                  </h5>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Award className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-blue-900 truncate">
                          {
                            student.certificates.filter(
                              (c) => c.status === 'approved'
                            )[0]?.title
                          }
                        </p>

                        <p className="text-xs text-blue-700">
                          {
                            student.certificates.filter(
                              (c) => c.status === 'approved'
                            )[0]?.issuer
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Highlight */}
              {student.activities.length > 0 && (
                <div className="mb-5">
                  <h5 className="text-sm font-semibold text-slate-900 mb-2">
                    Featured Activity
                  </h5>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Briefcase className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {student.activities[0].title}
                        </p>

                        <p className="text-xs text-slate-600">
                          {student.activities[0].hours} hours •{' '}
                          {student.activities[0].type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Portfolio</span>
                </button>

                <button
                  onClick={() => downloadPortfolio(student)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Download Portfolio PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Portfolio Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-xl z-10">
              <div className="flex justify-between items-start">
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
                    <h3 className="text-2xl font-bold text-slate-900">
                      {selectedStudent.name}
                    </h3>

                    <p className="text-blue-600 font-medium">
                      {selectedStudent.course} • Year {selectedStudent.year}
                    </p>

                    <p className="text-slate-500">
                      {selectedStudent.email}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {selectedStudent.university}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadPortfolio(selectedStudent)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-slate-400 hover:text-slate-700 text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Performance Overview
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Current GPA
                        </span>

                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border ${getGPAColor(
                            selectedStudent.gpa
                          )}`}
                        >
                          {selectedStudent.gpa}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Verified Certificates
                        </span>

                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {
                            selectedStudent.certificates.filter(
                              (c) => c.status === 'approved'
                            ).length
                          }
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Total Activities
                        </span>

                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {selectedStudent.activities.length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Activity Hours
                        </span>

                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {selectedStudent.activities.reduce(
                            (sum, a) => sum + a.hours,
                            0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Technical Skills
                    </h4>

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
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Academic Records */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">
                      Academic Performance
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedStudent.academicRecords.map((record) => (
                        <div
                          key={record.id}
                          className="bg-white border border-slate-200 rounded-xl p-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-medium text-slate-900">
                                {record.semester} {record.year}
                              </h5>

                              <p className="text-sm text-slate-500">
                                {record.subjects.length} courses •{' '}
                                {record.subjects.reduce(
                                  (sum, s) => sum + s.credits,
                                  0
                                )}{' '}
                                credits
                              </p>
                            </div>

                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border ${getGPAColor(
                                record.gpa
                              )}`}
                            >
                              {record.gpa.toFixed(2)}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {record.subjects
                              .slice(0, 3)
                              .map((subject, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-slate-600 truncate">
                                    {subject.name}
                                  </span>

                                  <span className="font-medium text-slate-900 ml-2">
                                    {subject.grade}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certificates */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">
                      Verified Certificates
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedStudent.certificates
                        .filter((cert) => cert.status === 'approved')
                        .map((cert) => (
                          <div
                            key={cert.id}
                            className="bg-white border border-slate-200 rounded-xl p-4"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                                <Award className="w-5 h-5 text-blue-600" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-slate-900 truncate">
                                  {cert.title}
                                </h5>

                                <p className="text-sm text-slate-600">
                                  {cert.issuer}
                                </p>

                                <div className="flex items-center space-x-2 mt-1">
                                  <Calendar className="w-3 h-3 text-slate-400" />

                                  <span className="text-xs text-slate-500">
                                    {new Date(
                                      cert.dateIssued
                                    ).toLocaleDateString()}
                                  </span>
                                </div>

                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mt-2">
                                  {cert.type
                                    .replace('-', ' ')
                                    .replace(/\b\w/g, (l) =>
                                      l.toUpperCase()
                                    )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">
                      Activities & Experience
                    </h4>

                    <div className="space-y-4">
                      {selectedStudent.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="bg-white border border-slate-200 rounded-xl p-4"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                              <Star className="w-5 h-5 text-blue-600" />
                            </div>

                            <div className="flex-1">
                              <h5 className="font-medium text-slate-900">
                                {activity.title}
                              </h5>

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

                              <div className="flex flex-wrap gap-1 mt-3">
                                {activity.skills.map((skill, index) => (
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortfolio;
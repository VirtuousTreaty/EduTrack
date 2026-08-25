import React, { useState } from 'react';
import { Student } from '../../types';
import { Eye, Download, Star, Award, GraduationCap, MapPin, Calendar, Briefcase } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface StudentPortfolioProps {
  students: Student[];
}

const StudentPortfolio: React.FC<StudentPortfolioProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sortBy, setSortBy] = useState<'gpa' | 'certificates' | 'activities'>('gpa');

  const sortedStudents = [...students].sort((a, b) => {
    switch (sortBy) {
      case 'gpa':
        return b.gpa - a.gpa;
      case 'certificates':
        return b.certificates.filter(c => c.status === 'approved').length - a.certificates.filter(c => c.status === 'approved').length;
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
    pdf.text(`Email: ${student.email} | Year: ${student.year} | GPA: ${student.gpa}`, 20, 55);
    
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
    student.academicRecords.forEach((record, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }
      
      pdf.text(`${record.semester} ${record.year} - GPA: ${record.gpa.toFixed(2)}`, 20, yPos);
      pdf.text(`Courses: ${record.subjects.length} | Credits: ${record.subjects.reduce((sum, s) => sum + s.credits, 0)}`, 25, yPos + 8);
      
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
      .filter(cert => cert.status === 'approved')
      .forEach((cert) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 30;
        }
        
        pdf.text(`• ${cert.title} - ${cert.issuer}`, 25, yPos);
        pdf.text(`  Issued: ${new Date(cert.dateIssued).toLocaleDateString()}`, 25, yPos + 8);
        
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
      pdf.text(`  ${activity.description}`, 25, yPos + 8, { maxWidth: 160 });
      pdf.text(`  Type: ${activity.type} | Hours: ${activity.hours} | Skills: ${activity.skills.slice(0, 3).join(', ')}`, 25, yPos + 16);
      
      yPos += 30;
    });
    
    pdf.save(`${student.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600 bg-green-100 border-green-200';
    if (gpa >= 3.0) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (gpa >= 2.5) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Student Portfolios</h3>
          <p className="text-gray-600">Browse comprehensive verified portfolios of talented students</p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          <div key={student.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center space-x-4">
                <img
                  src={student.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg truncate">{student.name}</h4>
                  <p className="text-purple-100">{student.course}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-4 h-4 text-purple-200" />
                    <span className="text-sm text-purple-100">{student.university}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getGPAColor(student.gpa)}`}>
                    {student.gpa}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">GPA</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    {student.certificates.filter(c => c.status === 'approved').length}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Certificates</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                    {student.activities.length}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Activities</p>
                </div>
              </div>

              {/* Top Skills */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Top Skills</h5>
                <div className="flex flex-wrap gap-1">
                  {student.skills.slice(0, 6).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Achievement */}
              {student.certificates.filter(c => c.status === 'approved').length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Latest Achievement</h5>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Award className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-green-900 truncate">
                          {student.certificates.filter(c => c.status === 'approved')[0]?.title}
                        </p>
                        <p className="text-xs text-green-700">
                          {student.certificates.filter(c => c.status === 'approved')[0]?.issuer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Highlight */}
              {student.activities.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Featured Activity</h5>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Briefcase className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-blue-900 truncate">
                          {student.activities[0].title}
                        </p>
                        <p className="text-xs text-blue-700">
                          {student.activities[0].hours} hours • {student.activities[0].type}
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Portfolio</span>
                </button>
                <button
                  onClick={() => downloadPortfolio(student)}
                  className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedStudent.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={selectedStudent.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                  />
                  <div>
                    <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                    <p className="text-purple-100">{selectedStudent.course} • Year {selectedStudent.year}</p>
                    <p className="text-purple-200">{selectedStudent.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-purple-100">{selectedStudent.university}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadPortfolio(selectedStudent)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-white/80 hover:text-white text-2xl w-10 h-10 flex items-center justify-center"
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
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Performance Overview</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Current GPA</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getGPAColor(selectedStudent.gpa).replace('border-', 'border ')}`}>
                          {selectedStudent.gpa}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Verified Certificates</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {selectedStudent.certificates.filter(c => c.status === 'approved').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Activities</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {selectedStudent.activities.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Activity Hours</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {selectedStudent.activities.reduce((sum, a) => sum + a.hours, 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
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
                    <h4 className="font-semibold text-gray-900 mb-4">Academic Performance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedStudent.academicRecords.map((record) => (
                        <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-medium text-gray-900">{record.semester} {record.year}</h5>
                              <p className="text-sm text-gray-600">
                                {record.subjects.length} courses • {record.subjects.reduce((sum, s) => sum + s.credits, 0)} credits
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getGPAColor(record.gpa)}`}>
                              {record.gpa.toFixed(2)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {record.subjects.slice(0, 3).map((subject, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600 truncate">{subject.name}</span>
                                <span className="font-medium ml-2">{subject.grade}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certificates */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Verified Certificates</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedStudent.certificates
                        .filter(cert => cert.status === 'approved')
                        .map((cert) => (
                          <div key={cert.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Award className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-green-900 truncate">{cert.title}</h5>
                                <p className="text-sm text-green-700">{cert.issuer}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Calendar className="w-3 h-3 text-green-600" />
                                  <span className="text-xs text-green-600">
                                    {new Date(cert.dateIssued).toLocaleDateString()}
                                  </span>
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                  {cert.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Activities & Experience</h4>
                    <div className="space-y-4">
                      {selectedStudent.activities.map((activity) => (
                        <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Star className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{activity.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="capitalize">{activity.type.replace('-', ' ')}</span>
                                <span>{activity.hours} hours</span>
                                <span>{new Date(activity.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-3">
                                {activity.skills.map((skill, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
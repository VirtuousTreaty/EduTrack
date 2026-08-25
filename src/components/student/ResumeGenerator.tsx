import React, { useRef } from 'react';
import { Student } from '../../types';
import { Download, FileText, Mail, Phone, MapPin, Calendar, Award, BookOpen } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeGeneratorProps {
  student: Student;
}

const ResumeGenerator: React.FC<ResumeGeneratorProps> = ({ student }) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (resumeRef.current) {
      try {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${student.name.replace(/\s+/g, '_')}_Resume.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  const approvedCertificates = student.certificates.filter(cert => cert.status === 'approved');
  const totalActivityHours = student.activities.reduce((sum, activity) => sum + activity.hours, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Resume Generator</h3>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Resume Preview */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div ref={resumeRef} className="max-w-4xl mx-auto bg-white p-8" style={{ minHeight: '1123px' }}>
          {/* Header */}
          <div className="border-b-4 border-blue-600 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h1>
                <p className="text-lg text-blue-600 font-medium mb-3">{student.course} Student</p>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{student.university}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Current GPA</p>
                  <p className="text-2xl font-bold text-blue-900">{student.gpa}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {student.course} student at {student.university} with a strong academic record (GPA: {student.gpa}) 
              and {totalActivityHours}+ hours of co-curricular and extracurricular activities. 
              Demonstrated expertise in {student.skills.slice(0, 3).join(', ')} with proven leadership experience 
              through various student organizations and academic projects.
            </p>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Education
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{student.course}</h3>
                  <p className="text-gray-600">{student.university}</p>
                  <p className="text-sm text-gray-500">Year {student.year}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">GPA: {student.gpa}/4.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Technical Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {student.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium text-center"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {approvedCertificates.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-600" />
                Certifications
              </h2>
              <div className="space-y-3">
                {approvedCertificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{cert.title}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(cert.dateIssued).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Activities */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Experience & Activities</h2>
            <div className="space-y-4">
              {student.activities.map((activity) => (
                <div key={activity.id} className="border-l-4 border-blue-600 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{activity.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="capitalize">{activity.type.replace('-', ' ')}</span>
                    <span>{activity.hours} hours</span>
                    <div className="flex space-x-1">
                      {activity.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance */}
          {student.academicRecords.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Academic Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.academicRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{record.semester} {record.year}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        GPA: {record.gpa.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {record.subjects.length} courses • {record.subjects.reduce((sum, s) => sum + s.credits, 0)} credits
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 mt-8 text-center text-sm text-gray-500">
            <p>Generated by EduTrack • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGenerator;
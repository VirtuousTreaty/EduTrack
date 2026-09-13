import React, { useRef } from 'react';
import { Student } from '../../types';
import { Download, Mail, MapPin, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeGeneratorProps {
  student: Student;
}

const ResumeGenerator: React.FC<ResumeGeneratorProps> = ({ student }) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
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

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${student.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const approvedCertificates = student.certificates.filter(
    cert => cert.status === 'approved'
  );

  const totalActivityHours = student.activities.reduce(
    (sum, activity) => sum + activity.hours,
    0
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Resume
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Preview and download your resume
          </p>
        </div>

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Resume Preview */}
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 overflow-x-auto">
        <div
          ref={resumeRef}
          className="mx-auto bg-white shadow-sm border border-gray-200"
          style={{
            width: '794px',
            minHeight: '1123px',
            padding: '52px 58px',
          }}
        >
          {/* Resume Header */}
          <div className="pb-5 border-b-2 border-blue-600">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {student.name}
            </h1>

            <p className="text-base font-medium text-blue-600 mt-1">
              {student.course} Student
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>{student.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{student.university}</span>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <section className="mt-6">
            <ResumeSectionTitle title="PROFILE" />

            <p className="text-sm leading-6 text-gray-700">
              {student.course} student at {student.university} with a
              strong academic record and a GPA of {student.gpa}. Experienced
              in academic, co-curricular and extracurricular activities
              with {totalActivityHours}+ hours of involvement. Skilled in{' '}
              {student.skills.slice(0, 4).join(', ')}.
            </p>
          </section>

          {/* Education */}
          <section className="mt-6">
            <ResumeSectionTitle title="EDUCATION" />

            <div className="flex justify-between gap-6">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {student.course}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {student.university}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  Year {student.year}
                </p>

                <p className="text-sm text-blue-600 mt-1">
                  GPA: {student.gpa}
                </p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="mt-6">
            <ResumeSectionTitle title="SKILLS" />

            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {student.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          {approvedCertificates.length > 0 && (
            <section className="mt-6">
              <ResumeSectionTitle title="CERTIFICATIONS" />

              <div className="space-y-3">
                {approvedCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex justify-between gap-6"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {cert.title}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        {cert.issuer}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(cert.dateIssued).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Activities */}
          <section className="mt-6">
            <ResumeSectionTitle title="EXPERIENCE & ACTIVITIES" />

            <div className="space-y-5">
              {student.activities.map((activity) => (
                <div key={activity.id}>
                  <div className="flex justify-between gap-6">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {activity.title}
                    </h4>

                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-5 mt-1">
                    {activity.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <span className="capitalize">
                      {activity.type.replace('-', ' ')}
                    </span>

                    <span>
                      {activity.hours} hours
                    </span>

                    {activity.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="text-blue-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Academic Performance */}
          {student.academicRecords.length > 0 && (
            <section className="mt-6">
              <ResumeSectionTitle title="ACADEMIC PERFORMANCE" />

              <div className="space-y-3">
                {student.academicRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {record.semester} {record.year}
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        {record.subjects.length} courses ·{' '}
                        {record.subjects.reduce(
                          (sum, subject) => sum + subject.credits,
                          0
                        )}{' '}
                        credits
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-blue-600">
                      GPA: {record.gpa.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              Generated by EduTrack · {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeSectionTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-sm font-bold tracking-wider text-gray-900">
        {title}
      </h2>

      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
};

export default ResumeGenerator;
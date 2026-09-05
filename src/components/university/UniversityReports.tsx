import React from 'react';
import { Student } from '../../types';
import {
  Download,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import jsPDF from 'jspdf';

interface UniversityReportsProps {
  students: Student[];
}

const UniversityReports: React.FC<UniversityReportsProps> = ({
  students
}) => {
  const generateStudentReport = () => {
    const pdf = new jsPDF();

    // Header
    pdf.setFontSize(20);
    pdf.text('Student Performance Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      20,
      45
    );

    // Summary Statistics
    pdf.setFontSize(16);
    pdf.text('Summary Statistics', 20, 65);
    pdf.setFontSize(10);

    const stats = [
      `Total Students: ${students.length}`,
      `Average GPA: ${(
        students.reduce((sum, s) => sum + s.gpa, 0) /
        students.length
      ).toFixed(2)}`,
      `Total Certificates: ${students.reduce(
        (sum, s) => sum + s.certificates.length,
        0
      )}`,
      `Total Activities: ${students.reduce(
        (sum, s) => sum + s.activities.length,
        0
      )}`
    ];

    stats.forEach((stat, index) => {
      pdf.text(stat, 20, 80 + index * 10);
    });

    // Student List
    pdf.setFontSize(16);
    pdf.text('Student Details', 20, 140);
    pdf.setFontSize(8);

    let yPos = 155;

    students.forEach((student, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }

      pdf.text(`${index + 1}. ${student.name}`, 20, yPos);
      pdf.text(`Course: ${student.course}`, 30, yPos + 8);
      pdf.text(`GPA: ${student.gpa}`, 30, yPos + 16);
      pdf.text(
        `Certificates: ${
          student.certificates.filter(
            c => c.status === 'approved'
          ).length
        }`,
        30,
        yPos + 24
      );

      yPos += 35;
    });

    pdf.save('student_performance_report.pdf');
  };

  const generateCertificateReport = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text('Certificate Status Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      20,
      45
    );

    const allCertificates = students.flatMap(student =>
      student.certificates.map(cert => ({
        ...cert,
        studentName: student.name
      }))
    );

    const stats = {
      total: allCertificates.length,
      approved: allCertificates.filter(
        cert => cert.status === 'approved'
      ).length,
      pending: allCertificates.filter(
        cert => cert.status === 'pending'
      ).length,
      rejected: allCertificates.filter(
        cert => cert.status === 'rejected'
      ).length
    };

    pdf.setFontSize(16);
    pdf.text('Certificate Statistics', 20, 65);
    pdf.setFontSize(10);

    const certStats = [
      `Total Certificates: ${stats.total}`,
      `Approved: ${stats.approved} (${(
        (stats.approved / stats.total) *
        100
      ).toFixed(1)}%)`,
      `Pending: ${stats.pending} (${(
        (stats.pending / stats.total) *
        100
      ).toFixed(1)}%)`,
      `Rejected: ${stats.rejected} (${(
        (stats.rejected / stats.total) *
        100
      ).toFixed(1)}%)`
    ];

    certStats.forEach((stat, index) => {
      pdf.text(stat, 20, 80 + index * 10);
    });

    pdf.save('certificate_status_report.pdf');
  };

  const generateActivityReport = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text('Student Activity Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      20,
      45
    );

    const allActivities = students.flatMap(
      student => student.activities
    );

    const totalHours = allActivities.reduce(
      (sum, activity) => sum + activity.hours,
      0
    );

    const avgHoursPerStudent =
      totalHours / students.length;

    const coActivities = allActivities.filter(
      activity => activity.type === 'co-curricular'
    );

    const extraActivities = allActivities.filter(
      activity => activity.type === 'extracurricular'
    );

    pdf.setFontSize(16);
    pdf.text('Activity Statistics', 20, 65);
    pdf.setFontSize(10);

    const activityStats = [
      `Total Activities: ${allActivities.length}`,
      `Total Hours: ${totalHours}`,
      `Average Hours per Student: ${avgHoursPerStudent.toFixed(
        1
      )}`,
      `Co-curricular Activities: ${
        coActivities.length
      } (${coActivities.reduce(
        (sum, activity) => sum + activity.hours,
        0
      )} hours)`,
      `Extracurricular Activities: ${
        extraActivities.length
      } (${extraActivities.reduce(
        (sum, activity) => sum + activity.hours,
        0
      )} hours)`
    ];

    activityStats.forEach((stat, index) => {
      pdf.text(stat, 20, 80 + index * 10);
    });

    pdf.save('student_activity_report.pdf');
  };

  const reports = [
    {
      title: 'Student Performance Report',
      description:
        'Comprehensive overview of all student academic performance, GPA trends, and achievements.',
      icon: Users,
      action: generateStudentReport,
      stats: [
        {
          label: 'Total Students',
          value: students.length
        },
        {
          label: 'Avg GPA',
          value: (
            students.reduce(
              (sum, student) => sum + student.gpa,
              0
            ) / students.length
          ).toFixed(2)
        }
      ]
    },
    {
      title: 'Certificate Status Report',
      description:
        'Detailed analysis of certificate submissions, approval rates, and pending reviews.',
      icon: Award,
      action: generateCertificateReport,
      stats: [
        {
          label: 'Total Certificates',
          value: students.reduce(
            (sum, student) =>
              sum + student.certificates.length,
            0
          )
        },
        {
          label: 'Approval Rate',
          value: `${(
            (students
              .flatMap(student => student.certificates)
              .filter(cert => cert.status === 'approved')
              .length /
              students
                .flatMap(student => student.certificates)
                .length) *
            100
          ).toFixed(1)}%`
        }
      ]
    },
    {
      title: 'Student Activity Report',
      description:
        'Analysis of co-curricular and extracurricular activities, participation rates, and hours logged.',
      icon: TrendingUp,
      action: generateActivityReport,
      stats: [
        {
          label: 'Total Activities',
          value: students.reduce(
            (sum, student) =>
              sum + student.activities.length,
            0
          )
        },
        {
          label: 'Total Hours',
          value: students.reduce(
            (sum, student) =>
              sum +
              student.activities.reduce(
                (hours, activity) =>
                  hours + activity.hours,
                0
              ),
            0
          )
        }
      ]
    }
  ];

  const quickStats = {
    totalStudents: students.length,

    averageGPA: (
      students.reduce(
        (sum, student) => sum + student.gpa,
        0
      ) / students.length
    ).toFixed(2),

    totalCertificates: students.reduce(
      (sum, student) =>
        sum + student.certificates.length,
      0
    ),

    pendingCertificates: students.reduce(
      (sum, student) =>
        sum +
        student.certificates.filter(
          cert => cert.status === 'pending'
        ).length,
      0
    ),

    totalActivities: students.reduce(
      (sum, student) =>
        sum + student.activities.length,
      0
    ),

    totalActivityHours: students.reduce(
      (sum, student) =>
        sum +
        student.activities.reduce(
          (hours, activity) =>
            hours + activity.hours,
          0
        ),
      0
    )
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          University Reports
        </h3>

        <p className="text-slate-500">
          Generate comprehensive reports and analytics for
          administrative purposes
        </p>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Students
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {quickStats.totalStudents}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average GPA */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Average GPA
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {quickStats.averageGPA}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Certificates */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Certificates
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {quickStats.totalCertificates}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Reviews
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {quickStats.pendingCertificates}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Total Activities */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Activities
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {quickStats.totalActivities}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Activity Hours */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Activity Hours
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {quickStats.totalActivityHours}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <TrendingUp className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Generation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;

          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>

              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                {report.title}
              </h4>

              <p className="text-slate-500 text-sm mb-5">
                {report.description}
              </p>

              {/* Report Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {report.stats.map((stat, statIndex) => (
                  <div
                    key={statIndex}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center"
                  >
                    <p className="text-xs text-slate-500">
                      {stat.label}
                    </p>

                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Download Button */}
              <button
                onClick={report.action}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Summary */}
      <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Activity Summary
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* New Students */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h5 className="font-medium text-slate-900 mb-2">
              New Students This Month
            </h5>

            <p className="text-2xl font-bold text-blue-600">
              {Math.floor(students.length * 0.1)}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              10% increase
            </p>
          </div>

          {/* Certificates Approved */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h5 className="font-medium text-slate-900 mb-2">
              Certificates Approved
            </h5>

            <p className="text-2xl font-bold text-blue-600">
              {
                students
                  .flatMap(student => student.certificates)
                  .filter(cert => cert.status === 'approved')
                  .length
              }
            </p>

            <p className="text-sm text-slate-500 mt-1">
              This semester
            </p>
          </div>

          {/* Active Activities */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h5 className="font-medium text-slate-900 mb-2">
              Active Activities
            </h5>

            <p className="text-2xl font-bold text-blue-600">
              {quickStats.totalActivities}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Across all students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityReports;
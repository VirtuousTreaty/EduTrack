import React from 'react';
import { Student } from '../../types';
import { Download, FileText, Calendar, Users, TrendingUp, Award } from 'lucide-react';
import jsPDF from 'jspdf';

interface UniversityReportsProps {
  students: Student[];
}

const UniversityReports: React.FC<UniversityReportsProps> = ({ students }) => {
  const generateStudentReport = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Student Performance Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Summary Statistics
    pdf.setFontSize(16);
    pdf.text('Summary Statistics', 20, 65);
    pdf.setFontSize(10);
    
    const stats = [
      `Total Students: ${students.length}`,
      `Average GPA: ${(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)}`,
      `Total Certificates: ${students.reduce((sum, s) => sum + s.certificates.length, 0)}`,
      `Total Activities: ${students.reduce((sum, s) => sum + s.activities.length, 0)}`
    ];
    
    stats.forEach((stat, index) => {
      pdf.text(stat, 20, 80 + (index * 10));
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
      pdf.text(`Certificates: ${student.certificates.filter(c => c.status === 'approved').length}`, 30, yPos + 24);
      
      yPos += 35;
    });
    
    pdf.save('student_performance_report.pdf');
  };

  const generateCertificateReport = () => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('Certificate Status Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    const allCertificates = students.flatMap(s => s.certificates.map(c => ({ ...c, studentName: s.name })));
    const stats = {
      total: allCertificates.length,
      approved: allCertificates.filter(c => c.status === 'approved').length,
      pending: allCertificates.filter(c => c.status === 'pending').length,
      rejected: allCertificates.filter(c => c.status === 'rejected').length
    };
    
    pdf.setFontSize(16);
    pdf.text('Certificate Statistics', 20, 65);
    pdf.setFontSize(10);
    
    const certStats = [
      `Total Certificates: ${stats.total}`,
      `Approved: ${stats.approved} (${((stats.approved / stats.total) * 100).toFixed(1)}%)`,
      `Pending: ${stats.pending} (${((stats.pending / stats.total) * 100).toFixed(1)}%)`,
      `Rejected: ${stats.rejected} (${((stats.rejected / stats.total) * 100).toFixed(1)}%)`
    ];
    
    certStats.forEach((stat, index) => {
      pdf.text(stat, 20, 80 + (index * 10));
    });
    
    pdf.save('certificate_status_report.pdf');
  };

  const generateActivityReport = () => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('Student Activity Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    const allActivities = students.flatMap(s => s.activities);
    const totalHours = allActivities.reduce((sum, a) => sum + a.hours, 0);
    const avgHoursPerStudent = totalHours / students.length;
    
    const coActivities = allActivities.filter(a => a.type === 'co-curricular');
    const extraActivities = allActivities.filter(a => a.type === 'extracurricular');
    
    pdf.setFontSize(16);
    pdf.text('Activity Statistics', 20, 65);
    pdf.setFontSize(10);
    
    const activityStats = [
      `Total Activities: ${allActivities.length}`,
      `Total Hours: ${totalHours}`,
      `Average Hours per Student: ${avgHoursPerStudent.toFixed(1)}`,
      `Co-curricular Activities: ${coActivities.length} (${coActivities.reduce((sum, a) => sum + a.hours, 0)} hours)`,
      `Extracurricular Activities: ${extraActivities.length} (${extraActivities.reduce((sum, a) => sum + a.hours, 0)} hours)`
    ];
    
    activityStats.forEach((stat, index) => {
      pdf.text(stat, 20, 80 + (index * 10));
    });
    
    pdf.save('student_activity_report.pdf');
  };

  const reports = [
    {
      title: 'Student Performance Report',
      description: 'Comprehensive overview of all student academic performance, GPA trends, and achievements.',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      action: generateStudentReport,
      stats: [
        { label: 'Total Students', value: students.length },
        { label: 'Avg GPA', value: (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2) }
      ]
    },
    {
      title: 'Certificate Status Report',
      description: 'Detailed analysis of certificate submissions, approval rates, and pending reviews.',
      icon: Award,
      color: 'from-green-500 to-green-600',
      action: generateCertificateReport,
      stats: [
        { label: 'Total Certificates', value: students.reduce((sum, s) => sum + s.certificates.length, 0) },
        { label: 'Approval Rate', value: `${((students.flatMap(s => s.certificates).filter(c => c.status === 'approved').length / students.flatMap(s => s.certificates).length) * 100).toFixed(1)}%` }
      ]
    },
    {
      title: 'Student Activity Report',
      description: 'Analysis of co-curricular and extracurricular activities, participation rates, and hours logged.',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      action: generateActivityReport,
      stats: [
        { label: 'Total Activities', value: students.reduce((sum, s) => sum + s.activities.length, 0) },
        { label: 'Total Hours', value: students.reduce((sum, s) => sum + s.activities.reduce((hours, a) => hours + a.hours, 0), 0) }
      ]
    }
  ];

  const quickStats = {
    totalStudents: students.length,
    averageGPA: (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2),
    totalCertificates: students.reduce((sum, s) => sum + s.certificates.length, 0),
    pendingCertificates: students.reduce((sum, s) => sum + s.certificates.filter(c => c.status === 'pending').length, 0),
    totalActivities: students.reduce((sum, s) => sum + s.activities.length, 0),
    totalActivityHours: students.reduce((sum, s) => sum + s.activities.reduce((hours, a) => hours + a.hours, 0), 0)
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">University Reports</h3>
        <p className="text-gray-600">Generate comprehensive reports and analytics for administrative purposes</p>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-900">{quickStats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Average GPA</p>
              <p className="text-2xl font-bold text-green-900">{quickStats.averageGPA}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Certificates</p>
              <p className="text-2xl font-bold text-purple-900">{quickStats.totalCertificates}</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-yellow-900">{quickStats.pendingCertificates}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Total Activities</p>
              <p className="text-2xl font-bold text-indigo-900">{quickStats.totalActivities}</p>
            </div>
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-600">Activity Hours</p>
              <p className="text-2xl font-bold text-pink-900">{quickStats.totalActivityHours}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Report Generation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${report.color} mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{report.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {report.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={report.action}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r ${report.color} text-white rounded-lg hover:shadow-md transition-all font-medium`}
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Summary */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">New Students This Month</h5>
            <p className="text-2xl font-bold text-blue-600">{Math.floor(students.length * 0.1)}</p>
            <p className="text-sm text-blue-600">10% increase</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h5 className="font-medium text-green-900 mb-2">Certificates Approved</h5>
            <p className="text-2xl font-bold text-green-600">{students.flatMap(s => s.certificates).filter(c => c.status === 'approved').length}</p>
            <p className="text-sm text-green-600">This semester</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h5 className="font-medium text-purple-900 mb-2">Active Activities</h5>
            <p className="text-2xl font-bold text-purple-600">{quickStats.totalActivities}</p>
            <p className="text-sm text-purple-600">Across all students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityReports;
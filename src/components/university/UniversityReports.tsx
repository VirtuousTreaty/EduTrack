import React, { useEffect, useState } from 'react';
import { Download, Users, TrendingUp, Award, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { api } from '../../services/api';

const UniversityReports: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const res = await api.getUniversityReports();
        if (res.success && res.report) {
          setReportData(res.report);
        }
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const generatePDFReport = (title: string) => {
    const pdf = new jsPDF();
    pdf.setFontSize(22);
    pdf.text(`EduTrack - ${title}`, 20, 25);
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 35);

    pdf.setFontSize(14);
    pdf.text('Executive Summary', 20, 50);

    pdf.setFontSize(10);
    pdf.text(`Total Registered Students: ${reportData?.totalStudents || 0}`, 25, 60);
    pdf.text('Report Certification: Verified by EduTrack Academic Registrar', 25, 70);

    if (reportData?.topPerformers) {
      pdf.setFontSize(14);
      pdf.text('Top Performing Students', 20, 90);
      let y = 102;
      reportData.topPerformers.forEach((s: any, idx: number) => {
        pdf.setFontSize(10);
        pdf.text(`${idx + 1}. ${s.name} - ${s.course} (GPA: ${s.gpa})`, 25, y);
        y += 10;
      });
    }

    pdf.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
        <p className="text-slate-600 text-sm font-medium">Generating Report Engine Datasets...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">University Reports</h3>
        <p className="text-slate-500">Download official PDF performance reports and verification summaries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{reportData?.totalStudents || 0}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Top Performers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{reportData?.topPerformers?.length || 0}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Report Types</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
              <Award className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-slate-900 text-lg mb-2">Student Performance Report</h4>
          <p className="text-slate-500 text-sm mb-5">Official transcript summary of top performing students, GPA distribution, and course performance.</p>
          <button
            onClick={() => generatePDFReport('Student Performance Report')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Performance PDF</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-slate-900 text-lg mb-2">Certificate Verification Report</h4>
          <p className="text-slate-500 text-sm mb-5">Comprehensive breakdown of approved, pending, and rejected certificate credentials across departments.</p>
          <button
            onClick={() => generatePDFReport('Certificate Status Report')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Verification PDF</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-slate-900 text-lg mb-2">Co-Curricular Activity Audit</h4>
          <p className="text-slate-500 text-sm mb-5">Summary of student community hours, club leadership roles, and extracurricular participations.</p>
          <button
            onClick={() => generatePDFReport('Activity Audit Report')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Activity Audit PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityReports;

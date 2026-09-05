import React, { useState } from 'react';
import { Student, Certificate } from '../../types';
import { Check, X, Eye, Clock, Award, Filter } from 'lucide-react';

interface CertificateApprovalProps {
  students: Student[];
}

const CertificateApproval: React.FC<CertificateApprovalProps> = ({ students }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedCertificate, setSelectedCertificate] = useState<
    Certificate & { studentName: string }
  | null>(null);

  // Flatten all certificates with student info
  const allCertificates = students.flatMap(student =>
    student.certificates.map(cert => ({
      ...cert,
      studentName: student.name,
      studentAvatar: student.avatar,
      studentEmail: student.email
    }))
  );

  const filteredCertificates = allCertificates.filter(
    cert => filter === 'all' || cert.status === filter
  );

  const stats = {
    total: allCertificates.length,
    pending: allCertificates.filter(c => c.status === 'pending').length,
    approved: allCertificates.filter(c => c.status === 'approved').length,
    rejected: allCertificates.filter(c => c.status === 'rejected').length
  };

  const handleApprove = (certId: string) => {
    // In a real app, this would update the database
    console.log('Approving certificate:', certId);
  };

  const handleReject = (certId: string) => {
    // In a real app, this would update the database
    console.log('Rejecting certificate:', certId);
  };

  const getStatusColor = (status: Certificate['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'rejected':
        return 'bg-slate-50 text-slate-600 border-slate-200';

      default:
        return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  const getTypeIcon = (type: Certificate['type']) => {
    switch (type) {
      case 'academic':
        return '🎓';

      case 'co-curricular':
        return '🏆';

      case 'extracurricular':
        return '🌟';

      default:
        return '📄';
    }
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {stats.total}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {stats.pending}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Approved
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {stats.approved}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Check className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Rejected
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {stats.rejected}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <X className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Certificate Management
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Review and manage student certificates
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Certificates</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {filteredCertificates.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />

            <h4 className="text-lg font-medium text-slate-900 mb-2">
              No certificates found
            </h4>

            <p className="text-slate-500">
              No certificates match the current filter.
            </p>
          </div>
        ) : (
          filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                    {getTypeIcon(cert.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-slate-900">
                        {cert.title}
                      </h4>

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          cert.status
                        )}`}
                      >
                        {cert.status.charAt(0).toUpperCase() +
                          cert.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-slate-600 mb-1">
                      {cert.issuer}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>
                        Student: {cert.studentName}
                      </span>

                      <span>
                        Issued:{' '}
                        {new Date(
                          cert.dateIssued
                        ).toLocaleDateString()}
                      </span>

                      <span className="capitalize">
                        {cert.type.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="flex items-center space-x-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />

                    <span className="text-sm">
                      View
                    </span>
                  </button>

                  {cert.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(cert.id)}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />

                        <span className="text-sm">
                          Approve
                        </span>
                      </button>

                      <button
                        onClick={() => handleReject(cert.id)}
                        className="flex items-center space-x-2 px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />

                        <span className="text-sm">
                          Reject
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Certificate Details
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Review certificate information
                </p>
              </div>

              <button
                onClick={() => setSelectedCertificate(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center text-3xl">
                  {getTypeIcon(selectedCertificate.type)}
                </div>

                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-slate-900 mb-3">
                    {selectedCertificate.title}
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <span className="text-slate-500">
                        Issuer:
                      </span>

                      <p className="font-medium text-slate-900">
                        {selectedCertificate.issuer}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <span className="text-slate-500">
                        Student:
                      </span>

                      <p className="font-medium text-slate-900">
                        {selectedCertificate.studentName}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <span className="text-slate-500">
                        Date Issued:
                      </span>

                      <p className="font-medium text-slate-900">
                        {new Date(
                          selectedCertificate.dateIssued
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <span className="text-slate-500">
                        Type:
                      </span>

                      <p className="font-medium text-slate-900 capitalize">
                        {selectedCertificate.type.replace(
                          '-',
                          ' '
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    selectedCertificate.status
                  )}`}
                >
                  {selectedCertificate.status.charAt(0).toUpperCase() +
                    selectedCertificate.status.slice(1)}
                </span>

                {selectedCertificate.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        handleReject(selectedCertificate.id);
                        setSelectedCertificate(null);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />

                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => {
                        handleApprove(selectedCertificate.id);
                        setSelectedCertificate(null);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />

                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateApproval;
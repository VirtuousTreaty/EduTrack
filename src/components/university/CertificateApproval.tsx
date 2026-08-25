import React, { useState } from 'react';
import { Student, Certificate } from '../../types';
import { Check, X, Eye, Clock, Award, Filter } from 'lucide-react';

interface CertificateApprovalProps {
  students: Student[];
}

const CertificateApproval: React.FC<CertificateApprovalProps> = ({ students }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate & { studentName: string } | null>(null);

  // Flatten all certificates with student info
  const allCertificates = students.flatMap(student =>
    student.certificates.map(cert => ({
      ...cert,
      studentName: student.name,
      studentAvatar: student.avatar,
      studentEmail: student.email
    }))
  );

  const filteredCertificates = allCertificates.filter(cert => 
    filter === 'all' || cert.status === filter
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Award className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
            <X className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Certificate Management</h3>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Certificates</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {filteredCertificates.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h4>
            <p className="text-gray-600">No certificates match the current filter.</p>
          </div>
        ) : (
          filteredCertificates.map((cert) => (
            <div key={cert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getTypeIcon(cert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(cert.status)}`}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{cert.issuer}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Student: {cert.studentName}</span>
                      <span>Issued: {new Date(cert.dateIssued).toLocaleDateString()}</span>
                      <span className="capitalize">{cert.type.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                  
                  {cert.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(cert.id)}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(cert.id)}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span className="text-sm">Reject</span>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Certificate Details</h3>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{getTypeIcon(selectedCertificate.type)}</div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedCertificate.title}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Issuer:</span>
                      <p className="font-medium">{selectedCertificate.issuer}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Student:</span>
                      <p className="font-medium">{selectedCertificate.studentName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date Issued:</span>
                      <p className="font-medium">{new Date(selectedCertificate.dateIssued).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium capitalize">{selectedCertificate.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedCertificate.status)}`}>
                  {selectedCertificate.status.charAt(0).toUpperCase() + selectedCertificate.status.slice(1)}
                </span>
                
                {selectedCertificate.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        handleReject(selectedCertificate.id);
                        setSelectedCertificate(null);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedCertificate.id);
                        setSelectedCertificate(null);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
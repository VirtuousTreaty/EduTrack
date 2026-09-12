import React, { useState, useEffect } from 'react';
import { Certificate } from '../../types';
import { Check, X, Eye, Clock, Award, Filter, ExternalLink, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface ExtendedCert extends Certificate {
  studentName?: string;
  studentEmail?: string;
  studentAvatar?: string;
}

const CertificateApproval: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [certificates, setCertificates] = useState<ExtendedCert[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<ExtendedCert | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.getAllCertificates(filter === 'all' ? undefined : filter);
      if (res.success && res.certificates) {
        setCertificates(res.certificates);
      }
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [filter]);

  const handleApprove = async (certId: string) => {
    try {
      setProcessingId(certId);
      await api.updateCertificateStatus(certId, 'approved');
      fetchCertificates();
      if (selectedCertificate?.id === certId) setSelectedCertificate(null);
    } catch (err: any) {
      alert(err.message || 'Failed to approve certificate');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (certId: string) => {
    try {
      setProcessingId(certId);
      await api.updateCertificateStatus(certId, 'rejected');
      fetchCertificates();
      if (selectedCertificate?.id === certId) setSelectedCertificate(null);
    } catch (err: any) {
      alert(err.message || 'Failed to reject certificate');
    } finally {
      setProcessingId(null);
    }
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

  const stats = {
    total: certificates.length,
    pending: certificates.filter(c => c.status === 'pending').length,
    approved: certificates.filter(c => c.status === 'approved').length,
    rejected: certificates.filter(c => c.status === 'rejected').length
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Loaded</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Award className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Review</p>
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
        <h3 className="text-xl font-bold text-slate-900">Certificate Verification Queue</h3>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value="pending">Pending Review</option>
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Certificates List */}
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-slate-800 mb-1">No certificates in queue</h4>
          <p className="text-slate-500 text-sm">No certificates match the selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="border border-slate-200 bg-white rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getTypeIcon(cert.type)}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-base">{cert.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(cert.status)}`}>
                        {cert.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm font-medium">{cert.issuer}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="font-semibold text-slate-700">Student: {cert.studentName || 'Student'}</span>
                      <span>Issued: {new Date(cert.dateIssued).toLocaleDateString()}</span>
                      <span className="capitalize bg-slate-100 px-2 py-0.5 rounded">{cert.type.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                  
                  {cert.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(cert.id)}
                        disabled={processingId === cert.id}
                        className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(cert.id)}
                        disabled={processingId === cert.id}
                        className="flex items-center space-x-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-extrabold text-slate-900">Certificate Verification Review</h3>
              <button onClick={() => setSelectedCertificate(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">×</button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-4xl">{getTypeIcon(selectedCertificate.type)}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900">{selectedCertificate.title}</h4>
                  <p className="text-sm font-medium text-slate-600">{selectedCertificate.issuer}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                    <div>
                      <span className="text-slate-500">Student Name:</span>
                      <p className="font-semibold text-slate-800">{selectedCertificate.studentName || 'Student'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Date Issued:</span>
                      <p className="font-semibold text-slate-800">{new Date(selectedCertificate.dateIssued).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCertificate.fileUrl && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-900">Attached Certificate Document</span>
                  <a
                    href={selectedCertificate.fileUrl.startsWith('http') ? selectedCertificate.fileUrl : `http://localhost:5000${selectedCertificate.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold flex items-center gap-1 hover:bg-indigo-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View File</span>
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedCertificate.status)}`}>
                  Status: {selectedCertificate.status.toUpperCase()}
                </span>
                
                {selectedCertificate.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReject(selectedCertificate.id)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(selectedCertificate.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Certificate</span>
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
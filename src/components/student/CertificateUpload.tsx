import React, { useState } from 'react';
import { Certificate } from '../../types';
import { Upload, File, Check, X, Clock, Award, AlertCircle, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';

interface CertificateUploadProps {
  studentId: string;
  certificates: Certificate[];
  onCertificateAdded?: () => void;
}

const CertificateUpload: React.FC<CertificateUploadProps> = ({ certificates: initialCertificates, onCertificateAdded }) => {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    dateIssued: '',
    type: 'academic' as Certificate['type']
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit');
        setSelectedFile(null);
        return;
      }
      setUploadError('');
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('issuer', formData.issuer);
      data.append('dateIssued', formData.dateIssued);
      data.append('type', formData.type);
      if (selectedFile) {
        data.append('file', selectedFile);
      }

      const res = await api.uploadCertificate(data);
      if (res.success && res.certificate) {
        setCertificates([res.certificate, ...certificates]);
        setFormData({ title: '', issuer: '', dateIssued: '', type: 'academic' });
        setSelectedFile(null);
        setShowUploadForm(false);
        if (onCertificateAdded) onCertificateAdded();
      } else {
        setUploadError(res.error || 'Failed to upload certificate');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: Certificate['status']) => {
    switch (status) {
      case 'approved':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
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
    approved: certificates.filter(c => c.status === 'approved').length,
    pending: certificates.filter(c => c.status === 'pending').length,
    rejected: certificates.filter(c => c.status === 'rejected').length
  };

  return (
    <div className="p-6">
      {/* Stats */}
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
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
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

      {/* Upload Section */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Certificates</h3>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Certificate</span>
        </button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">Upload Certificate Document</h4>
              <button onClick={() => setShowUploadForm(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g. AWS Cloud Practitioner"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
                  <input
                    type="date"
                    required
                    value={formData.dateIssued}
                    onChange={(e) => setFormData({ ...formData, dateIssued: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Certificate['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="academic">Academic</option>
                    <option value="co-curricular">Co-curricular</option>
                    <option value="extracurricular">Extracurricular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate File (PDF, PNG, JPG &lt; 5MB)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-slate-50">
                  <div className="space-y-1 text-center">
                    <File className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white px-2 py-1 border border-gray-300 rounded-md font-medium text-blue-600 hover:text-blue-500 shadow-sm">
                        <span>Select Certificate File</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                    {selectedFile && (
                      <p className="text-xs text-emerald-600 font-semibold mt-1">Selected: {selectedFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-medium">
                  {uploadError}
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isUploading ? 'Uploading & Saving...' : 'Submit Certificate'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificates List */}
      <div className="space-y-4">
        {certificates.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No certificates uploaded</h4>
            <p className="text-gray-600">Start by uploading your first certificate.</p>
          </div>
        ) : (
          certificates.map((cert) => (
            <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(cert.type)}</div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{cert.title}</h5>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Issued: {new Date(cert.dateIssued).toLocaleDateString()}</p>
                    <div className="mt-2 flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {cert.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      {cert.fileUrl && (
                        <a
                          href={cert.fileUrl.startsWith('http') ? cert.fileUrl : `http://localhost:5000${cert.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Attachment</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(cert.status)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(cert.status)}`}>
                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CertificateUpload;
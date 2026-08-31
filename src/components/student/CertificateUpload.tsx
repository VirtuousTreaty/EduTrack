import React, { useState } from 'react';
import { Certificate } from '../../types';
import {
  Upload,
  File,
  Check,
  X,
  Clock,
  Award,
} from 'lucide-react';

interface CertificateUploadProps {
  studentId: string;
  certificates: Certificate[];
}

const CertificateUpload: React.FC<CertificateUploadProps> = ({
  studentId,
  certificates: initialCertificates,
}) => {
  const [certificates, setCertificates] =
    useState<Certificate[]>(initialCertificates);

  const [showUploadForm, setShowUploadForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    dateIssued: '',
    type: 'academic' as Certificate['type'],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newCertificate: Certificate = {
      id: `cert_${Date.now()}`,
      studentId,
      title: formData.title,
      issuer: formData.issuer,
      dateIssued: formData.dateIssued,
      status: 'pending',
      type: formData.type,
      fileUrl: selectedFile
        ? URL.createObjectURL(selectedFile)
        : undefined,
    };

    setCertificates([...certificates, newCertificate]);

    setFormData({
      title: '',
      issuer: '',
      dateIssued: '',
      type: 'academic',
    });

    setSelectedFile(null);
    setShowUploadForm(false);
    setIsUploading(false);
  };

  const getStatusIcon = (status: Certificate['status']) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Certificate['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';

      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';

      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
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
    approved: certificates.filter(
      (c) => c.status === 'approved'
    ).length,
    pending: certificates.filter(
      (c) => c.status === 'pending'
    ).length,
    rejected: certificates.filter(
      (c) => c.status === 'rejected'
    ).length,
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Certificates
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Upload and manage your academic and extracurricular certificates
          </p>
        </div>

        <button
          onClick={() => setShowUploadForm(true)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Certificate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* Total */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:border-blue-300 hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:border-green-300 hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Approved
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {stats.approved}
              </p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:border-yellow-300 hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:border-red-300 hover:shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Rejected
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Certificates List */}
      <div className="space-y-4">

        {certificates.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl text-center py-14">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              No certificates yet
            </h4>

            <p className="text-sm text-gray-500 mb-5">
              Upload your first certificate to get started.
            </p>

            <button
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Certificate
            </button>
          </div>
        ) : (
          certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* Certificate Info */}
                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                    {getTypeIcon(cert.type)}
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {cert.title}
                    </h5>

                    <p className="text-sm text-gray-600 mt-1">
                      {cert.issuer}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>
                        Issued:{' '}
                        {new Date(
                          cert.dateIssued
                        ).toLocaleDateString()}
                      </span>

                      <span>•</span>

                      <span>
                        {cert.type
                          .replace('-', ' ')
                          .replace(/\b\w/g, (l) =>
                            l.toUpperCase()
                          )}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Status */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold self-start sm:self-center ${getStatusColor(
                    cert.status
                  )}`}
                >
                  {getStatusIcon(cert.status)}

                  {cert.status.charAt(0).toUpperCase() +
                    cert.status.slice(1)}
                </div>

              </div>
            </div>
          ))
        )}

      </div>

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white shadow-xl rounded-xl w-full max-w-xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Upload Certificate
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  Add certificate details below
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Certificate Title
                </label>

                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Web Development Certification"
                />
              </div>

              {/* Issuer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Issuing Organization
                </label>

                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issuer: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Coursera"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date Issued
                </label>

                <input
                  type="date"
                  required
                  value={formData.dateIssued}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dateIssued: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Certificate Type
                </label>

                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Certificate['type'],
                    })
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="academic">Academic</option>
                  <option value="co-curricular">
                    Co-curricular
                  </option>
                  <option value="extracurricular">
                    Extracurricular
                  </option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Certificate File
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">

                  <File className="w-9 h-9 text-gray-400 mx-auto mb-3" />

                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Choose a file
                    </span>

                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>

                  <p className="text-xs text-gray-500 mt-2">
                    PDF, PNG or JPG up to 10MB
                  </p>

                  {selectedFile && (
                    <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium truncate">
                        {selectedFile.name}
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading
                    ? 'Uploading...'
                    : 'Upload Certificate'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CertificateUpload;
import React, { useState } from 'react';
import { Certificate } from '../../types';
import { Award, Check, Clock, ExternalLink, File, Upload, X } from 'lucide-react';
import { api, resolveAssetUrl } from '../../services/api';

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
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      setSelectedFile(null);
      return;
    }

    setUploadError('');
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        onCertificateAdded?.();
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
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  const getTypeLabel = (type: Certificate['type']) =>
    type.replace('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase());

  const stats = {
    total: certificates.length,
    approved: certificates.filter(certificate => certificate.status === 'approved').length,
    pending: certificates.filter(certificate => certificate.status === 'pending').length,
    rejected: certificates.filter(certificate => certificate.status === 'rejected').length
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Certificates</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload and manage your academic and extracurricular certificates
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          Upload Certificate
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <CertStat label="Total" value={stats.total} icon={Award} color="blue" />
        <CertStat label="Approved" value={stats.approved} icon={Check} color="green" />
        <CertStat label="Pending" value={stats.pending} icon={Clock} color="yellow" />
        <CertStat label="Rejected" value={stats.rejected} icon={X} color="red" />
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900">Upload Certificate Document</h4>
              <button onClick={() => setShowUploadForm(false)} className="text-xl font-bold text-gray-400 hover:text-gray-600">x</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={event => setFormData({ ...formData, title: event.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. AWS Cloud Practitioner"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Issuer</label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={event => setFormData({ ...formData, issuer: event.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Date Issued</label>
                  <input
                    type="date"
                    required
                    value={formData.dateIssued}
                    onChange={event => setFormData({ ...formData, dateIssued: event.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={event => setFormData({ ...formData, type: event.target.value as Certificate['type'] })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="academic">Academic</option>
                    <option value="co-curricular">Co-curricular</option>
                    <option value="extracurricular">Extracurricular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Certificate File (PDF, PNG, JPG under 5MB)</label>
                <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 bg-slate-50 px-6 pb-6 pt-5 transition-colors hover:border-blue-400">
                  <div className="space-y-2 text-center">
                    <File className="mx-auto h-10 w-10 text-gray-400" />
                    <label className="relative cursor-pointer rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-blue-600 shadow-sm hover:text-blue-500">
                      <span>Select Certificate File</span>
                      <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleFileSelect} />
                    </label>
                    {selectedFile && (
                      <p className="text-xs font-semibold text-emerald-600">Selected: {selectedFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="rounded border border-rose-200 bg-rose-50 p-2.5 text-center text-xs font-medium text-rose-600">
                  {uploadError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading and Saving...' : 'Submit Certificate'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {certificates.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="mb-1 text-lg font-semibold text-gray-900">No certificates yet</h4>
            <p className="mb-5 text-sm text-gray-500">Upload your first certificate to get started.</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              Upload Certificate
            </button>
          </div>
        ) : (
          certificates.map(cert => (
            <div key={cert.id} className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-blue-300 hover:shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-semibold text-gray-900">{cert.title}</h5>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="mt-0.5 text-xs text-gray-500">Issued: {new Date(cert.dateIssued).toLocaleDateString()}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {getTypeLabel(cert.type)}
                      </span>
                      {cert.fileUrl && (
                        <a
                          href={resolveAssetUrl(cert.fileUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Attachment
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(cert.status)}`}>
                  {getStatusIcon(cert.status)}
                  {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const CertStat: React.FC<{
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red';
}> = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:border-blue-300',
    green: 'bg-green-50 text-green-600 hover:border-green-300',
    yellow: 'bg-yellow-50 text-yellow-600 hover:border-yellow-300',
    red: 'bg-red-50 text-red-600 hover:border-red-300'
  };

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-sm ${colorClasses[color]}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[color].split(' ')[0]}`}>
          <Icon className={`h-5 w-5 ${colorClasses[color].split(' ')[1]}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default CertificateUpload;

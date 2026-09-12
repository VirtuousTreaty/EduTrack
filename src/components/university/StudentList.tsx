import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Search, Eye, GraduationCap, Award, Activity, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const StudentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getUniversityStudents({
        course: selectedCourse,
        year: selectedYear,
        search: searchTerm
      });
      if (res.success && res.students) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error('Error fetching university students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCourse, selectedYear]);

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students by name, email or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Degree Courses</option>
            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Academic Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>
      </div>

      {/* Student Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Enrolled Student Directory ({students.length} Students)
        </p>
      </div>

      {/* Loading state or Grid */}
      {loading ? (
        <div className="py-16 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-800">No students matching criteria</h4>
          <p className="text-slate-500 text-sm">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={student.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'}
                  alt={student.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base">{student.name}</h3>
                  <p className="text-xs font-medium text-slate-600">{student.course}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Year {student.year} • {student.university}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">GPA</p>
                  <p className="font-extrabold text-slate-900 text-sm">{student.gpa}</p>
                </div>
                <div className="text-center border-x border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Certs</p>
                  <p className="font-extrabold text-emerald-700 text-sm">
                    {student.certificates.filter(c => c.status === 'approved').length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Activities</p>
                  <p className="font-extrabold text-purple-700 text-sm">{student.activities.length}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {student.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {skill}
                    </span>
                  ))}
                  {student.skills.length > 3 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      +{student.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => setSelectedStudent(student)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View Full Record</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-extrabold text-slate-900">Student Profile & Transcripts</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">×</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <img
                  src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h4>
                  <p className="text-xs font-semibold text-slate-600">{selectedStudent.course} • Year {selectedStudent.year}</p>
                  <p className="text-xs text-slate-500">{selectedStudent.university} ({selectedStudent.email})</p>
                  <span className="inline-block mt-2 px-3 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                    Overall GPA: {selectedStudent.gpa} / 4.0
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm mb-2">Verified Skill Set</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.skills.map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm mb-2">Academic Semester Records</h5>
                <div className="space-y-2">
                  {selectedStudent.academicRecords.length === 0 ? (
                    <p className="text-xs text-slate-500">No records filed.</p>
                  ) : (
                    selectedStudent.academicRecords.map(rec => (
                      <div key={rec.id} className="p-3 bg-slate-50 border rounded-lg text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{rec.semester} {rec.year}</p>
                          <p className="text-slate-500">{rec.subjects?.length || 0} enrolled courses</p>
                        </div>
                        <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                          GPA: {rec.gpa}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm mb-2">Certificates</h5>
                <div className="space-y-2">
                  {selectedStudent.certificates.map((cert) => (
                    <div key={cert.id} className="p-3 bg-slate-50 border rounded-lg text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{cert.title}</p>
                        <p className="text-slate-500">{cert.issuer} • Issued {new Date(cert.dateIssued).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        cert.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cert.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Search, GraduationCap, Award, MapPin, Eye, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { api } from '../../services/api';

const StudentSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [minGPA, setMinGPA] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.searchCandidates({
        skills: skillFilter,
        minGpa: minGPA,
        course: courseFilter,
        year: yearFilter,
        search: searchTerm
      });
      if (res.success && res.students) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error('Candidate search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCandidates();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, skillFilter, courseFilter, minGPA, yearFilter]);

  const downloadStudentResume = (student: Student) => {
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text(student.name, 20, 25);
    pdf.setFontSize(11);
    pdf.text(`Course: ${student.course} (Year ${student.year})`, 20, 35);
    pdf.text(`Email: ${student.email}`, 20, 42);
    pdf.text(`University: ${student.university}`, 20, 49);
    pdf.text(`GPA: ${student.gpa} / 4.0`, 20, 56);

    pdf.setFontSize(14);
    pdf.text('Technical Skills', 20, 70);
    pdf.setFontSize(10);
    pdf.text(student.skills.join(', '), 25, 78);

    pdf.setFontSize(14);
    pdf.text('Verified Certificates', 20, 95);
    let y = 105;
    student.certificates.filter(c => c.status === 'approved').forEach((c, idx) => {
      pdf.setFontSize(10);
      pdf.text(`${idx + 1}. ${c.title} (${c.issuer})`, 25, y);
      y += 8;
    });

    pdf.save(`${student.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900 mb-1">Corporate Talent Discovery</h3>
        <p className="text-slate-500 text-sm">Search and filter verified student candidates by technical stack, GPA & accomplishments</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Keyword</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Name, course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 w-full border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Skill Filter</label>
            <input
              type="text"
              placeholder="e.g. React, Python"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-3 py-2 w-full border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Degree Course</label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 w-full border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Degree Courses</option>
              <option value="Computer Science and Engineering">Computer Science</option>
              <option value="Electrical Engineering">Electrical Eng.</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Min GPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              placeholder="e.g. 3.5"
              value={minGPA}
              onChange={(e) => setMinGPA(e.target.value)}
              className="px-3 py-2 w-full border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Academic Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 w-full border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing {students.length} matching candidate{students.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-16 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-800">No candidates match search filters</h4>
          <p className="text-slate-500 text-sm">Try broadening your skill or GPA parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all border-t-4 border-t-purple-600">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={student.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'}
                  alt={student.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-base truncate">{student.name}</h4>
                  <p className="text-xs font-medium text-slate-600 truncate">{student.course}</p>
                  <div className="flex items-center space-x-1 text-slate-500 text-xs mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{student.university}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">GPA</p>
                  <span className="font-extrabold text-blue-700 text-sm">{student.gpa}</span>
                </div>
                <div className="text-center border-x border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Certs</p>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {student.certificates.filter(c => c.status === 'approved').length}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Year</p>
                  <span className="font-extrabold text-purple-700 text-sm">Y{student.year}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {student.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {skill}
                    </span>
                  ))}
                  {student.skills.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      +{student.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Candidate</span>
                </button>
                <button
                  onClick={() => downloadStudentResume(student)}
                  className="px-3 py-2 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                  title="Download PDF Resume"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-extrabold text-slate-900">Candidate Portfolio Overview</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">×</button>
            </div>

            <div className="space-y-5">
              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <img
                  src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h4>
                  <p className="text-xs font-semibold text-slate-600">{selectedStudent.course} • Year {selectedStudent.year}</p>
                  <p className="text-xs text-slate-500">{selectedStudent.university} ({selectedStudent.email})</p>
                  <span className="inline-block mt-2 px-3 py-0.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                    GPA: {selectedStudent.gpa} / 4.0
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm mb-2">Technical Skills & Competencies</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.skills.map((skill, index) => (
                    <span key={index} className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm mb-2">Verified University Certificates</h5>
                <div className="space-y-2">
                  {selectedStudent.certificates.filter(c => c.status === 'approved').length === 0 ? (
                    <p className="text-xs text-slate-500">No verified certificates uploaded yet.</p>
                  ) : (
                    selectedStudent.certificates.filter(c => c.status === 'approved').map(c => (
                      <div key={c.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-emerald-900">{c.title}</p>
                          <p className="text-emerald-700">{c.issuer} • Issued {new Date(c.dateIssued).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          VERIFIED
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => downloadStudentResume(selectedStudent)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete Resume PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
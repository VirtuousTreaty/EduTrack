import React, { useState } from 'react';
import { Bot, Sparkles, Target, Eye, Download, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import jsPDF from 'jspdf';

const RecommendationEngine: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['JavaScript', 'React', 'Python']);
  const [minGPA, setMinGPA] = useState('3.0');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const jobRoles = [
    'Software Engineer',
    'Data Scientist',
    'Full Stack Developer',
    'Machine Learning Engineer',
    'Cloud Architect'
  ];

  const availableSkills = ['JavaScript', 'React', 'Python', 'Machine Learning', 'Data Analysis', 'MERN', 'AI', 'Leadership', 'MATLAB'];

  const generateRecommendations = async () => {
    try {
      setIsGenerating(true);
      const res = await api.getRecommendations({
        requiredSkills,
        minGpa: parseFloat(minGPA),
        preferredCourse: selectedRole.includes('Engineer') ? 'Computer Science' : undefined
      });
      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (err) {
      console.error('Recommendation engine error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setRequiredSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const downloadStudentResume = (student: any) => {
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text(student.name, 20, 25);
    pdf.setFontSize(11);
    pdf.text(`Course: ${student.course} - Year ${student.year}`, 20, 35);
    pdf.text(`Email: ${student.email}`, 20, 42);
    pdf.text(`University: ${student.university}`, 20, 49);
    pdf.text(`GPA: ${student.gpa} / 4.0`, 20, 56);

    pdf.setFontSize(14);
    pdf.text('Technical Skills', 20, 70);
    pdf.setFontSize(10);
    pdf.text(student.skills.join(', '), 25, 78);

    pdf.save(`${student.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-1">
          <Bot className="w-7 h-7 text-purple-600" />
          <h3 className="text-xl font-black text-slate-900">AI Candidate Recommendation Engine</h3>
        </div>
        <p className="text-slate-500 text-sm">Automated match scoring algorithm assessing verified skills, GPA & academic history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Target className="w-4 h-4 text-purple-600" />
              Target Role Criteria
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
              >
                {jobRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Required Core Skills</label>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2.5 space-y-1">
                {availableSkills.map(skill => (
                  <label key={skill} className="flex items-center space-x-2 text-xs text-slate-700 hover:bg-slate-50 p-1 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requiredSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-medium">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum GPA Threshold</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={minGPA}
                onChange={(e) => setMinGPA(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={generateRecommendations}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculating Scores...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Recommendation Engine</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recommendations Output */}
        <div className="lg:col-span-2">
          {recommendations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
              <Bot className="w-16 h-16 text-purple-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-800 mb-1">AI Recommendation Engine Ready</h4>
              <p className="text-slate-500 text-sm mb-4">Click "Run Recommendation Engine" to calculate candidate match scores across the talent pool.</p>
              <button
                onClick={generateRecommendations}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-xs hover:bg-purple-700"
              >
                Run Default Scoring
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Top Recommended Candidates for {selectedRole}
                </h4>
              </div>

              {recommendations.map((item, index) => {
                const s = item.student;
                return (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={s.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'}
                          alt={s.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                        />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
                          #{index + 1}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-slate-900 text-base">{s.name}</h5>
                            <p className="text-xs font-medium text-slate-600">{s.course} • Year {s.year}</p>
                            <p className="text-xs text-slate-500">{s.university}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-purple-100 text-purple-800 font-extrabold text-sm px-3 py-1 rounded-full border border-purple-200">
                              {item.matchPercentage}% Match
                            </span>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="mt-3 bg-purple-50/60 border border-purple-100 p-2.5 rounded-lg space-y-1">
                          <p className="text-[11px] font-bold text-purple-900 uppercase">Match Rationale:</p>
                          {item.reasons.map((r: string, idx: number) => (
                            <p key={idx} className="text-xs text-purple-800 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                              <span>{r}</span>
                            </p>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => downloadStudentResume(s)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Resume PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;
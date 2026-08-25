import React, { useState } from 'react';
import { Student } from '../../types';
import { Bot, Star, TrendingUp, Users, Sparkles, Target, Eye, Download } from 'lucide-react';

interface RecommendationEngineProps {
  students: Student[];
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ students }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [minGPA, setMinGPA] = useState('3.0');
  const [preferences, setPreferences] = useState({
    experience: 'any',
    certificates: false,
    activities: false
  });
  const [recommendations, setRecommendations] = useState<Array<Student & { score: number; reasons: string[] }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const jobRoles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'Marketing Analyst',
    'Business Analyst',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer'
  ];

  const availableSkills = Array.from(
    new Set(students.flatMap(s => s.skills))
  ).sort();

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scoredStudents = students.map(student => {
      let score = 0;
      const reasons: string[] = [];
      
      // GPA scoring (0-30 points)
      const gpaScore = Math.min(30, (student.gpa / 4.0) * 30);
      score += gpaScore;
      if (student.gpa >= 3.5) reasons.push(`Excellent GPA of ${student.gpa}`);
      else if (student.gpa >= 3.0) reasons.push(`Strong GPA of ${student.gpa}`);
      
      // Skills matching (0-40 points)
      const matchingSkills = student.skills.filter(skill => 
        requiredSkills.some(reqSkill => 
          skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
          reqSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      const skillScore = Math.min(40, (matchingSkills.length / Math.max(1, requiredSkills.length)) * 40);
      score += skillScore;
      if (matchingSkills.length > 0) {
        reasons.push(`Has ${matchingSkills.length} relevant skills: ${matchingSkills.slice(0, 3).join(', ')}`);
      }
      
      // Certificates (0-15 points)
      const approvedCerts = student.certificates.filter(c => c.status === 'approved');
      if (preferences.certificates) {
        const certScore = Math.min(15, approvedCerts.length * 3);
        score += certScore;
        if (approvedCerts.length > 0) {
          reasons.push(`${approvedCerts.length} verified certifications`);
        }
      }
      
      // Activities (0-15 points)
      if (preferences.activities) {
        const activityScore = Math.min(15, student.activities.length * 2);
        score += activityScore;
        const totalHours = student.activities.reduce((sum, a) => sum + a.hours, 0);
        if (student.activities.length > 0) {
          reasons.push(`${student.activities.length} activities with ${totalHours} total hours`);
        }
      }
      
      // Leadership bonus (0-10 points)
      const hasLeadership = student.activities.some(a => 
        a.title.toLowerCase().includes('president') ||
        a.title.toLowerCase().includes('leader') ||
        a.title.toLowerCase().includes('captain') ||
        a.skills.some(s => s.toLowerCase().includes('leadership'))
      );
      if (hasLeadership) {
        score += 10;
        reasons.push('Demonstrated leadership experience');
      }
      
      // Diversity of experience (0-10 points)
      const hasCoActivities = student.activities.some(a => a.type === 'co-curricular');
      const hasExtraActivities = student.activities.some(a => a.type === 'extracurricular');
      if (hasCoActivities && hasExtraActivities) {
        score += 10;
        reasons.push('Well-rounded with diverse activities');
      }
      
      return {
        ...student,
        score: Math.round(score),
        reasons
      };
    })
    .filter(student => student.gpa >= parseFloat(minGPA))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
    
    setRecommendations(scoredStudents);
    setIsGenerating(false);
  };

  const toggleSkill = (skill: string) => {
    setRequiredSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Basic Match';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Bot className="w-8 h-8 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h3>
        </div>
        <p className="text-gray-600">Get intelligent candidate recommendations based on your specific requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Job Requirements
            </h4>

            {/* Job Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position/Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a role...</option>
                {jobRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills ({requiredSkills.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                <div className="grid grid-cols-1 gap-1">
                  {availableSkills.map(skill => (
                    <label key={skill} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={requiredSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Minimum GPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum GPA
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={minGPA}
                onChange={(e) => setMinGPA(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.certificates}
                    onChange={(e) => setPreferences(prev => ({ ...prev, certificates: e.target.checked }))}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Prioritize certified candidates</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.activities}
                    onChange={(e) => setPreferences(prev => ({ ...prev, activities: e.target.checked }))}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Value extracurricular involvement</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateRecommendations}
              disabled={isGenerating || requiredSkills.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Recommendations</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500">
              Select at least one required skill to generate recommendations.
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2">
          {recommendations.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                AI Recommendations Ready
              </h4>
              <p className="text-gray-600 mb-6">
                Configure your requirements on the left and click "Generate Recommendations" to get personalized candidate suggestions.
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex flex-col items-center space-y-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  <span>Skills Matching</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <span>Performance Analysis</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Users className="w-6 h-6 text-green-400" />
                  <span>Cultural Fit</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-900">
                  Top {recommendations.length} Recommendations
                </h4>
                <div className="text-sm text-gray-600">
                  Based on {requiredSkills.length} skill{requiredSkills.length !== 1 ? 's' : ''}
                  {selectedRole && ` for ${selectedRole}`}
                </div>
              </div>

              {recommendations.map((student, index) => (
                <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 relative">
                      <img
                        src={student.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={student.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-900">{student.name}</h5>
                          <p className="text-gray-600">{student.course} • Year {student.year}</p>
                          <p className="text-sm text-gray-500">{student.university}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(student.score)}`}>
                            {student.score}% Match
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{getScoreLabel(student.score)}</p>
                        </div>
                      </div>

                      {/* Why this candidate */}
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-900 mb-1">Why this candidate:</h6>
                        <div className="space-y-1">
                          {student.reasons.slice(0, 3).map((reason, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills match */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {student.skills.filter(skill => 
                            requiredSkills.some(reqSkill => 
                              skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                              reqSkill.toLowerCase().includes(skill.toLowerCase())
                            )
                          ).slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ {skill}
                            </span>
                          ))}
                          {student.skills.filter(skill => 
                            !requiredSkills.some(reqSkill => 
                              skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                              reqSkill.toLowerCase().includes(skill.toLowerCase())
                            )
                          ).slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View Profile</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 text-sm font-medium transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download Resume</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional insights */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6 mt-6">
                <h5 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Insights
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-purple-900">
                      {recommendations.filter(r => r.score >= 70).length}
                    </div>
                    <div className="text-purple-700">Strong Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-900">
                      {recommendations.reduce((sum, r) => sum + r.gpa, 0) / recommendations.length / 1 || 0}
                    </div>
                    <div className="text-purple-700">Avg GPA</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-purple-900">
                      {Math.round(recommendations.reduce((sum, r) => sum + r.certificates.filter(c => c.status === 'approved').length, 0) / recommendations.length * 10) / 10}
                    </div>
                    <div className="text-purple-700">Avg Certificates</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;
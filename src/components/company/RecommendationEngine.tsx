import React, { useState } from 'react';
import { Student } from '../../types';
import {
  Bot,
  Star,
  TrendingUp,
  Users,
  Sparkles,
  Target,
  Eye,
  Download,
} from 'lucide-react';

interface RecommendationEngineProps {
  students: Student[];
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  students,
}) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [minGPA, setMinGPA] = useState('3.0');

  const [preferences, setPreferences] = useState({
    experience: 'any',
    certificates: false,
    activities: false,
  });

  const [
    recommendations,
    setRecommendations,
  ] = useState<Array<Student & { score: number; reasons: string[] }>>([]);

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
    'Full Stack Developer',
  ];

  const availableSkills = Array.from(
    new Set(students.flatMap((student) => student.skills))
  ).sort();

  const generateRecommendations = async () => {
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const scoredStudents = students
      .map((student) => {
        let score = 0;
        const reasons: string[] = [];

        // GPA scoring (0-30 points)
        const gpaScore = Math.min(30, (student.gpa / 4.0) * 30);
        score += gpaScore;

        if (student.gpa >= 3.5) {
          reasons.push(`Excellent GPA of ${student.gpa}`);
        } else if (student.gpa >= 3.0) {
          reasons.push(`Strong GPA of ${student.gpa}`);
        }

        // Skills matching (0-40 points)
        const matchingSkills = student.skills.filter((skill) =>
          requiredSkills.some(
            (reqSkill) =>
              skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
              reqSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

        const skillScore = Math.min(
          40,
          (matchingSkills.length / Math.max(1, requiredSkills.length)) * 40
        );

        score += skillScore;

        if (matchingSkills.length > 0) {
          reasons.push(
            `Has ${matchingSkills.length} relevant skills: ${matchingSkills
              .slice(0, 3)
              .join(', ')}`
          );
        }

        // Certificates (0-15 points)
        const approvedCerts = student.certificates.filter(
          (certificate) => certificate.status === 'approved'
        );

        if (preferences.certificates) {
          const certScore = Math.min(15, approvedCerts.length * 3);
          score += certScore;

          if (approvedCerts.length > 0) {
            reasons.push(
              `${approvedCerts.length} verified certifications`
            );
          }
        }

        // Activities (0-15 points)
        if (preferences.activities) {
          const activityScore = Math.min(
            15,
            student.activities.length * 2
          );

          score += activityScore;

          const totalHours = student.activities.reduce(
            (sum, activity) => sum + activity.hours,
            0
          );

          if (student.activities.length > 0) {
            reasons.push(
              `${student.activities.length} activities with ${totalHours} total hours`
            );
          }
        }

        // Leadership bonus (0-10 points)
        const hasLeadership = student.activities.some(
          (activity) =>
            activity.title.toLowerCase().includes('president') ||
            activity.title.toLowerCase().includes('leader') ||
            activity.title.toLowerCase().includes('captain') ||
            activity.skills.some((skill) =>
              skill.toLowerCase().includes('leadership')
            )
        );

        if (hasLeadership) {
          score += 10;
          reasons.push('Demonstrated leadership experience');
        }

        // Diversity of experience (0-10 points)
        const hasCoActivities = student.activities.some(
          (activity) => activity.type === 'co-curricular'
        );

        const hasExtraActivities = student.activities.some(
          (activity) => activity.type === 'extracurricular'
        );

        if (hasCoActivities && hasExtraActivities) {
          score += 10;
          reasons.push('Well-rounded with diverse activities');
        }

        return {
          ...student,
          score: Math.round(score),
          reasons,
        };
      })
      .filter((student) => student.gpa >= parseFloat(minGPA))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setRecommendations(scoredStudents);
    setIsGenerating(false);
  };

  const toggleSkill = (skill: string) => {
    setRequiredSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((currentSkill) => currentSkill !== skill)
        : [...prev, skill]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    }

    if (score >= 60) {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    }

    if (score >= 40) {
      return 'text-slate-700 bg-slate-100 border-slate-200';
    }

    return 'text-slate-600 bg-slate-100 border-slate-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Basic Match';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            AI-Powered Recommendations
          </h3>
        </div>

        <p className="text-slate-600">
          Get intelligent candidate recommendations based on your specific
          requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <h4 className="text-lg font-semibold text-slate-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Job Requirements
            </h4>

            {/* Job Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Position/Role
              </label>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a role...</option>

                {jobRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Required Skills ({requiredSkills.length} selected)
              </label>

              <div className="max-h-48 overflow-y-auto border border-slate-300 rounded-lg p-3">
                <div className="grid grid-cols-1 gap-1">
                  {availableSkills.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-md cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={requiredSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span className="text-sm text-slate-700">
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Minimum GPA */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Minimum GPA
              </label>

              <input
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={minGPA}
                onChange={(e) => setMinGPA(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Preferences
              </label>

              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.certificates}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        certificates: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm text-slate-700">
                    Prioritize certified candidates
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.activities}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        activities: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm text-slate-700">
                    Value extracurricular involvement
                  </span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateRecommendations}
              disabled={
                isGenerating || requiredSkills.length === 0
              }
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Recommendations</span>
                </>
              )}
            </button>

            <p className="text-xs text-slate-500">
              Select at least one required skill to generate
              recommendations.
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2">
          {recommendations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>

              <h4 className="text-lg font-medium text-slate-900 mb-2">
                AI Recommendations Ready
              </h4>

              <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                Configure your requirements on the left and click
                "Generate Recommendations" to get personalized candidate
                suggestions.
              </p>

              <div className="grid grid-cols-3 gap-4 text-sm text-slate-500">
                <div className="flex flex-col items-center space-y-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  <span>Skills Matching</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <TrendingUp className="w-6 h-6 text-slate-600" />
                  <span>Performance Analysis</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span>Cultural Fit</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h4 className="text-lg font-semibold text-slate-900">
                  Top {recommendations.length} Recommendations
                </h4>

                <div className="text-sm text-slate-600">
                  Based on {requiredSkills.length} skill
                  {requiredSkills.length !== 1 ? 's' : ''}
                  {selectedRole && ` for ${selectedRole}`}
                </div>
              </div>

              {recommendations.map((student, index) => (
                <div
                  key={student.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative">
                      <img
                        src={
                          student.avatar ||
                          'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                        }
                        alt={student.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                      />

                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Candidate Header */}
                      <div className="flex items-start justify-between mb-3 gap-4">
                        <div>
                          <h5 className="font-semibold text-slate-900">
                            {student.name}
                          </h5>

                          <p className="text-slate-600">
                            {student.course} • Year {student.year}
                          </p>

                          <p className="text-sm text-slate-500">
                            {student.university}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(
                              student.score
                            )}`}
                          >
                            {student.score}% Match
                          </div>

                          <p className="text-xs text-slate-500 mt-1">
                            {getScoreLabel(student.score)}
                          </p>
                        </div>
                      </div>

                      {/* Why this candidate */}
                      <div className="mb-4">
                        <h6 className="text-sm font-medium text-slate-900 mb-2">
                          Why this candidate:
                        </h6>

                        <div className="space-y-1">
                          {student.reasons
                            .slice(0, 3)
                            .map((reason, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2 text-sm text-slate-600"
                              >
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                                <span>{reason}</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Skills Match */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {student.skills
                            .filter((skill) =>
                              requiredSkills.some(
                                (reqSkill) =>
                                  skill
                                    .toLowerCase()
                                    .includes(reqSkill.toLowerCase()) ||
                                  reqSkill
                                    .toLowerCase()
                                    .includes(skill.toLowerCase())
                              )
                            )
                            .slice(0, 5)
                            .map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                ✓ {skill}
                              </span>
                            ))}

                          {student.skills
                            .filter(
                              (skill) =>
                                !requiredSkills.some(
                                  (reqSkill) =>
                                    skill
                                      .toLowerCase()
                                      .includes(
                                        reqSkill.toLowerCase()
                                      ) ||
                                    reqSkill
                                      .toLowerCase()
                                      .includes(
                                        skill.toLowerCase()
                                      )
                                )
                            )
                            .slice(0, 3)
                            .map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View Profile</span>
                        </button>

                        <button className="flex items-center space-x-2 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download Resume</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional Insights */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 mt-6 shadow-sm">
                <h5 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  AI Insights
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="font-semibold text-slate-900 text-lg">
                      {
                        recommendations.filter(
                          (recommendation) =>
                            recommendation.score >= 70
                        ).length
                      }
                    </div>

                    <div className="text-slate-600">
                      Strong Matches
                    </div>
                  </div>

                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="font-semibold text-slate-900 text-lg">
                      {(
                        recommendations.reduce(
                          (sum, recommendation) =>
                            sum + recommendation.gpa,
                          0
                        ) /
                          recommendations.length /
                          1 || 0
                      ).toFixed(2)}
                    </div>

                    <div className="text-slate-600">
                      Avg GPA
                    </div>
                  </div>

                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="font-semibold text-slate-900 text-lg">
                      {Math.round(
                        (recommendations.reduce(
                          (sum, recommendation) =>
                            sum +
                            recommendation.certificates.filter(
                              (certificate) =>
                                certificate.status === 'approved'
                            ).length,
                          0
                        ) /
                          recommendations.length) *
                          10
                      ) / 10}
                    </div>

                    <div className="text-slate-600">
                      Avg Certificates
                    </div>
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
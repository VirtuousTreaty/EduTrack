export function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatStudent(student, academicRecords = [], certificates = [], activities = []) {
  return {
    id: student.id,
    userId: student.user_id,
    name: student.name,
    email: student.email,
    university: student.university,
    course: student.course,
    year: student.year,
    gpa: student.gpa,
    skills: parseJsonArray(student.skills),
    avatar: student.avatar,
    academicRecords: academicRecords.map(record => ({
      id: record.id,
      semester: record.semester,
      year: record.year,
      gpa: record.gpa,
      subjects: parseJsonArray(record.subjects)
    })),
    certificates: certificates.map(certificate => ({
      id: certificate.id,
      studentId: certificate.student_id,
      title: certificate.title,
      issuer: certificate.issuer,
      dateIssued: certificate.date_issued,
      status: certificate.status,
      type: certificate.type,
      fileUrl: certificate.file_url
    })),
    activities: activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      date: activity.date,
      hours: activity.hours,
      skills: parseJsonArray(activity.skills)
    }))
  };
}

export async function hydrateStudent(db, student) {
  const academicRecords = await db.all('SELECT * FROM academic_records WHERE student_id = ?', [student.id]);
  const certificates = await db.all('SELECT * FROM certificates WHERE student_id = ?', [student.id]);
  const activities = await db.all('SELECT * FROM activities WHERE student_id = ?', [student.id]);

  return formatStudent(student, academicRecords, certificates, activities);
}

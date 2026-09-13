import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { getDb, closeDb } from '../config/db.js';

const demoPassword = 'Password@123';
const universityName = 'KIET GROUP OF INSTITUTIONS';

async function clearTables(db) {
  await db.exec('PRAGMA foreign_keys = OFF;');
  await db.exec('DELETE FROM activities;');
  await db.exec('DELETE FROM certificates;');
  await db.exec('DELETE FROM academic_records;');
  await db.exec('DELETE FROM students;');
  await db.exec('DELETE FROM universities;');
  await db.exec('DELETE FROM companies;');
  await db.exec('DELETE FROM users;');
  await db.exec('PRAGMA foreign_keys = ON;');
}

export async function seedDemo() {
  console.log('Seeding EduTrack presentation demo data...');
  const db = await getDb();
  await clearTables(db);

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  const users = [
    {
      id: 'demo-u-university',
      email: 'registrar@kiet.edu',
      password_hash: passwordHash,
      role: 'university',
      name: universityName,
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'demo-u-company',
      email: 'talent@novacore.com',
      password_hash: passwordHash,
      role: 'company',
      name: 'NovaCore Talent Team',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'demo-u-aarav',
      email: 'aarav@student.edu',
      password_hash: passwordHash,
      role: 'student',
      name: 'Aarav Mehta',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'
    },
    {
      id: 'demo-u-nisha',
      email: 'nisha@student.edu',
      password_hash: passwordHash,
      role: 'student',
      name: 'Nisha Rao',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nisha'
    },
    {
      id: 'demo-u-kabir',
      email: 'kabir@student.edu',
      password_hash: passwordHash,
      role: 'student',
      name: 'Kabir Singh',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir'
    },
    {
      id: 'demo-u-meera',
      email: 'meera@student.edu',
      password_hash: passwordHash,
      role: 'student',
      name: 'Meera Iyer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera'
    }
  ];

  for (const user of users) {
    await db.run(
      'INSERT INTO users (id, email, password_hash, role, name, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, user.email, user.password_hash, user.role, user.name, user.avatar]
    );
  }

  await db.run(
    'INSERT INTO universities (id, user_id, name, email) VALUES (?, ?, ?, ?)',
    ['demo-university', 'demo-u-university', universityName, 'registrar@kiet.edu']
  );

  await db.run(
    'INSERT INTO companies (id, user_id, name, email, industry, size) VALUES (?, ?, ?, ?, ?, ?)',
    ['demo-company', 'demo-u-company', 'NovaCore Systems', 'talent@novacore.com', 'Enterprise Software', '500-1000 employees']
  );

  const students = [
    {
      id: 'demo-st-aarav',
      user_id: 'demo-u-aarav',
      name: 'Aarav Mehta',
      email: 'aarav@student.edu',
      course: 'Computer Science and Engineering',
      year: 4,
      gpa: 3.92,
      skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'AWS', 'System Design'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'
    },
    {
      id: 'demo-st-nisha',
      user_id: 'demo-u-nisha',
      name: 'Nisha Rao',
      email: 'nisha@student.edu',
      course: 'Computer Science and Engineering',
      year: 3,
      gpa: 3.74,
      skills: ['Java', 'Spring Boot', 'SQL', 'Data Analysis', 'Leadership'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nisha'
    },
    {
      id: 'demo-st-kabir',
      user_id: 'demo-u-kabir',
      name: 'Kabir Singh',
      email: 'kabir@student.edu',
      course: 'Information Technology',
      year: 2,
      gpa: 3.48,
      skills: ['JavaScript', 'UI Design', 'Figma', 'React', 'Public Speaking'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir'
    },
    {
      id: 'demo-st-meera',
      user_id: 'demo-u-meera',
      name: 'Meera Iyer',
      email: 'meera@student.edu',
      course: 'Computer Science and Engineering',
      year: 4,
      gpa: 3.86,
      skills: ['Python', 'Data Science', 'TensorFlow', 'MERN', 'Cloud Computing'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera'
    }
  ];

  for (const student of students) {
    await db.run(
      `INSERT INTO students (id, user_id, name, email, university, course, year, gpa, skills, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student.id,
        student.user_id,
        student.name,
        student.email,
        universityName,
        student.course,
        student.year,
        student.gpa,
        JSON.stringify(student.skills),
        student.avatar
      ]
    );
  }

  const academicRecords = [
    ['demo-ar-1', 'demo-st-aarav', 'Fall', 2024, 3.95, [
      { code: 'CS701', name: 'Distributed Systems', credits: 4, grade: 'A', points: 4.0 },
      { code: 'CS702', name: 'Cloud Architecture', credits: 3, grade: 'A', points: 4.0 },
      { code: 'CS703', name: 'AI Engineering', credits: 3, grade: 'A-', points: 3.7 }
    ]],
    ['demo-ar-2', 'demo-st-aarav', 'Spring', 2025, 3.89, [
      { code: 'CS704', name: 'Software Project Management', credits: 3, grade: 'A', points: 4.0 },
      { code: 'CS705', name: 'Advanced Web Engineering', credits: 4, grade: 'A-', points: 3.7 }
    ]],
    ['demo-ar-3', 'demo-st-nisha', 'Fall', 2024, 3.72, [
      { code: 'CS501', name: 'Database Systems', credits: 4, grade: 'A-', points: 3.7 },
      { code: 'CS502', name: 'Enterprise Java', credits: 3, grade: 'A', points: 4.0 }
    ]],
    ['demo-ar-4', 'demo-st-kabir', 'Fall', 2024, 3.48, [
      { code: 'IT301', name: 'Frontend Engineering', credits: 3, grade: 'B+', points: 3.3 },
      { code: 'IT302', name: 'Human Computer Interaction', credits: 3, grade: 'A-', points: 3.7 }
    ]],
    ['demo-ar-5', 'demo-st-meera', 'Spring', 2025, 3.86, [
      { code: 'CS801', name: 'Deep Learning', credits: 4, grade: 'A', points: 4.0 },
      { code: 'CS802', name: 'Big Data Analytics', credits: 3, grade: 'A-', points: 3.7 }
    ]]
  ];

  for (const [id, studentId, semester, year, gpa, subjects] of academicRecords) {
    await db.run(
      `INSERT INTO academic_records (id, student_id, semester, year, gpa, subjects)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, studentId, semester, year, gpa, JSON.stringify(subjects)]
    );
  }

  const certificates = [
    ['demo-cert-1', 'demo-st-aarav', 'AWS Cloud Practitioner', 'Amazon Web Services', '2025-01-18', 'approved', 'academic'],
    ['demo-cert-2', 'demo-st-aarav', 'Smart India Hackathon Finalist', 'AICTE', '2025-02-11', 'pending', 'co-curricular'],
    ['demo-cert-3', 'demo-st-nisha', 'Oracle Java Foundations', 'Oracle Academy', '2024-11-02', 'approved', 'academic'],
    ['demo-cert-4', 'demo-st-kabir', 'UX Design Sprint Winner', 'Design Club KIET', '2025-03-07', 'pending', 'co-curricular'],
    ['demo-cert-5', 'demo-st-meera', 'Google Data Analytics Professional Certificate', 'Google', '2024-12-12', 'approved', 'academic'],
    ['demo-cert-6', 'demo-st-meera', 'Community Teaching Volunteer', 'NSS KIET', '2025-01-30', 'approved', 'extracurricular']
  ];

  for (const [id, studentId, title, issuer, dateIssued, status, type] of certificates) {
    await db.run(
      `INSERT INTO certificates (id, student_id, title, issuer, date_issued, status, type, file_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, studentId, title, issuer, dateIssued, status, type, '']
    );
  }

  const activities = [
    ['demo-act-1', 'demo-st-aarav', 'co-curricular', 'Cloud Computing Workshop Lead', 'Conducted a two-day AWS deployment workshop for junior students.', '2025-02-20', 24, ['AWS', 'Teaching', 'Leadership']],
    ['demo-act-2', 'demo-st-nisha', 'co-curricular', 'Database Lab Mentor', 'Mentored second-year students on SQL optimization and schema design.', '2025-01-15', 36, ['SQL', 'Mentoring', 'Communication']],
    ['demo-act-3', 'demo-st-kabir', 'extracurricular', 'Campus Design Cell Coordinator', 'Created UI prototypes for student event registration and feedback flows.', '2025-02-01', 42, ['Figma', 'UI Design', 'Teamwork']],
    ['demo-act-4', 'demo-st-meera', 'co-curricular', 'AI Research Group Member', 'Built a prototype model for student certificate classification.', '2025-03-12', 60, ['Python', 'TensorFlow', 'Research']],
    ['demo-act-5', 'demo-st-meera', 'extracurricular', 'NSS Digital Literacy Volunteer', 'Taught basic digital tools to local school students.', '2025-01-10', 48, ['Teaching', 'Social Impact', 'Communication']]
  ];

  for (const [id, studentId, type, title, description, date, hours, skills] of activities) {
    await db.run(
      `INSERT INTO activities (id, student_id, type, title, description, date, hours, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, studentId, type, title, description, date, hours, JSON.stringify(skills)]
    );
  }

  console.log('EduTrack presentation demo data seeded successfully.');
  console.log(`Demo password for all accounts: ${demoPassword}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDemo()
    .catch(error => {
      console.error('Demo seeding failed:', error);
      process.exitCode = 1;
    })
    .finally(() => closeDb());
}

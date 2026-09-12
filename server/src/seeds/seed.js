import bcrypt from 'bcryptjs';
import { getDb } from '../config/db.js';
import { fileURLToPath } from 'url';

export async function seed() {
  console.log('🌱 Seeding EduTrack SQLite Database...');
  const db = await getDb();

  // Temporarily disable foreign keys for clean table reset
  await db.exec('PRAGMA foreign_keys = OFF;');
  await db.exec('DELETE FROM activities;');
  await db.exec('DELETE FROM certificates;');
  await db.exec('DELETE FROM academic_records;');
  await db.exec('DELETE FROM students;');
  await db.exec('DELETE FROM universities;');
  await db.exec('DELETE FROM companies;');
  await db.exec('DELETE FROM users;');
  await db.exec('PRAGMA foreign_keys = ON;');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const users = [
    {
      id: 'u-student-1',
      email: 'alice@student.edu',
      password_hash: passwordHash,
      role: 'student',
      name: 'Anshika Middha',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'u-student-2',
      email: 'bob@student.edu',
      password_hash: passwordHash,
      role: 'student',
      name: 'Gunn Kalra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'u-student-3',
      email: 'carol@student.edu',
      password_hash: passwordHash,
      role: 'student',
      name: 'Ammar Ahmad',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'u-university-1',
      email: 'admin@techuniversity.edu',
      password_hash: passwordHash,
      role: 'university',
      name: 'Tech University Admin',
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'u-company-1',
      email: 'recruiter@techcorp.com',
      password_hash: passwordHash,
      role: 'company',
      name: 'TechCorp Recruiter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
    }
  ];

  for (const u of users) {
    await db.run(
      'INSERT INTO users (id, email, password_hash, role, name, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [u.id, u.email, u.password_hash, u.role, u.name, u.avatar]
    );
  }

  // 2. Create Students
  const students = [
    {
      id: 'st-1',
      user_id: 'u-student-1',
      name: 'Anshika Middha',
      email: 'alice@student.edu',
      university: 'KIET GROUP OF INSTITUTIONS',
      course: 'Computer Science and Engineering',
      year: 3,
      gpa: 3.8,
      skills: JSON.stringify(['JavaScript', 'React', 'Python', 'Data Analysis', 'Machine Learning']),
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'st-2',
      user_id: 'u-student-2',
      name: 'Gunn Kalra',
      email: 'bob@student.edu',
      university: 'KIET GROUP OF INSTITUTIONS',
      course: 'Computer Science and Engineering',
      year: 2,
      gpa: 3.6,
      skills: JSON.stringify(['ML', 'MATLAB', 'Python', 'Project Management']),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'st-3',
      user_id: 'u-student-3',
      name: 'Ammar Ahmad',
      email: 'carol@student.edu',
      university: 'KIET GROUP OF INSTITUTIONS',
      course: 'Computer Science and Engineering',
      year: 4,
      gpa: 3.9,
      skills: JSON.stringify(['MERN', 'AI', 'Leadership', 'Data Analysis', 'Public Speaking']),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
    }
  ];

  for (const s of students) {
    await db.run(
      `INSERT INTO students (id, user_id, name, email, university, course, year, gpa, skills, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.user_id, s.name, s.email, s.university, s.course, s.year, s.gpa, s.skills, s.avatar]
    );
  }

  // 3. Create Academic Records
  const academicRecords = [
    {
      id: 'ar-1',
      student_id: 'st-1',
      semester: 'Fall',
      year: 2023,
      gpa: 3.9,
      subjects: JSON.stringify([
        { code: 'CS301', name: 'Data Structures & Algorithms', credits: 3, grade: 'A', points: 4.0 },
        { code: 'CS302', name: 'Database Management Systems', credits: 3, grade: 'A-', points: 3.7 },
        { code: 'MATH201', name: 'Linear Algebra & Statistics', credits: 3, grade: 'A', points: 4.0 }
      ])
    },
    {
      id: 'ar-2',
      student_id: 'st-1',
      semester: 'Spring',
      year: 2023,
      gpa: 3.7,
      subjects: JSON.stringify([
        { code: 'CS401', name: 'Machine Learning', credits: 3, grade: 'A', points: 4.0 },
        { code: 'CS402', name: 'Web Development', credits: 3, grade: 'B+', points: 3.3 }
      ])
    },
    {
      id: 'ar-3',
      student_id: 'st-2',
      semester: 'Fall',
      year: 2023,
      gpa: 3.6,
      subjects: JSON.stringify([
        { code: 'EE201', name: 'Circuit Analysis', credits: 4, grade: 'B+', points: 3.3 },
        { code: 'EE202', name: 'Digital Electronics', credits: 3, grade: 'A-', points: 3.7 }
      ])
    },
    {
      id: 'ar-4',
      student_id: 'st-3',
      semester: 'Fall',
      year: 2023,
      gpa: 4.0,
      subjects: JSON.stringify([
        { code: 'BUS401', name: 'Strategic Leadership', credits: 3, grade: 'A', points: 4.0 },
        { code: 'CS501', name: 'Artificial Intelligence', credits: 3, grade: 'A', points: 4.0 }
      ])
    }
  ];

  for (const ar of academicRecords) {
    await db.run(
      `INSERT INTO academic_records (id, student_id, semester, year, gpa, subjects)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ar.id, ar.student_id, ar.semester, ar.year, ar.gpa, ar.subjects]
    );
  }

  // 4. Create Certificates
  const certificates = [
    {
      id: 'c-1',
      student_id: 'st-1',
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date_issued: '2023-08-15',
      status: 'approved',
      type: 'academic',
      file_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'c-2',
      student_id: 'st-1',
      title: 'National Hackathon Winner - First Rank',
      issuer: 'Tech University',
      date_issued: '2023-09-20',
      status: 'pending',
      type: 'co-curricular',
      file_url: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'c-3',
      student_id: 'st-2',
      title: 'MATLAB Associate Certification',
      issuer: 'MathWorks',
      date_issued: '2023-07-10',
      status: 'approved',
      type: 'academic',
      file_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'c-4',
      student_id: 'st-3',
      title: 'Google Advanced Analytics Professional',
      issuer: 'Google',
      date_issued: '2023-06-15',
      status: 'approved',
      type: 'academic',
      file_url: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&q=80&w=800'
    }
  ];

  for (const c of certificates) {
    await db.run(
      `INSERT INTO certificates (id, student_id, title, issuer, date_issued, status, type, file_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.student_id, c.title, c.issuer, c.date_issued, c.status, c.type, c.file_url]
    );
  }

  // 5. Create Activities
  const activities = [
    {
      id: 'a-1',
      student_id: 'st-1',
      type: 'co-curricular',
      title: 'Programming Club President',
      description: 'Led a team of 50+ students in organizing national coding competitions and tech workshops.',
      date: '2023-01-15',
      hours: 120,
      skills: JSON.stringify(['Leadership', 'Event Management', 'Python'])
    },
    {
      id: 'a-2',
      student_id: 'st-1',
      type: 'extracurricular',
      title: 'Community Tech Mentor',
      description: 'Teaching basic programming and web skills to high school students.',
      date: '2023-03-10',
      hours: 80,
      skills: JSON.stringify(['Teaching', 'Communication', 'Social Impact'])
    },
    {
      id: 'a-3',
      student_id: 'st-2',
      type: 'co-curricular',
      title: 'Autonomous Robotics Lead',
      description: 'Designed hardware firmware for national robotics tournament.',
      date: '2023-05-20',
      hours: 100,
      skills: JSON.stringify(['Robotics', 'MATLAB', 'Problem Solving'])
    },
    {
      id: 'a-4',
      student_id: 'st-3',
      type: 'extracurricular',
      title: 'Student Body Vice President',
      description: 'Represented 5,000+ student body in academic policies and campus initiatives.',
      date: '2023-02-01',
      hours: 200,
      skills: JSON.stringify(['Leadership', 'Public Speaking', 'Policy Formulation'])
    }
  ];

  for (const a of activities) {
    await db.run(
      `INSERT INTO activities (id, student_id, type, title, description, date, hours, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.id, a.student_id, a.type, a.title, a.description, a.date, a.hours, a.skills]
    );
  }

  // 6. Create University & Company entries
  await db.run(
    'INSERT INTO universities (id, user_id, name, email) VALUES (?, ?, ?, ?)',
    ['univ-1', 'u-university-1', 'KIET GROUP OF INSTITUTIONS', 'admin@techuniversity.edu']
  );

  await db.run(
    'INSERT INTO companies (id, user_id, name, email, industry, size) VALUES (?, ?, ?, ?, ?, ?)',
    ['comp-1', 'u-company-1', 'TechCorp International', 'recruiter@techcorp.com', 'Technology', '1000+ employees']
  );

  console.log('✅ EduTrack Database Seeded Successfully!');
}

// Only execute auto-seed if file is executed directly (e.g. node src/seeds/seed.js)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seed().catch(err => {
    console.error('❌ Seeding Error:', err);
  });
}

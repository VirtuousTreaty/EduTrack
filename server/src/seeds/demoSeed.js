import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { getDb, closeDb } from '../config/db.js';

const demoPassword = 'Password@123';
const universityName = 'KIET GROUP OF INSTITUTIONS';

const friendStudents = [
  {
    id: 'demo-st-anshika',
    userId: 'demo-u-anshika',
    name: 'Anshika Middha',
    email: 'alice@student.edu',
    course: 'Computer Science and Engineering',
    year: 3,
    gpa: 3.8,
    skills: ['JavaScript', 'React', 'Python', 'Data Analysis', 'Machine Learning'],
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQH0suTL3pgmUA/profile-displayphoto-crop_800_800/B56Zp7do.6JkAI-/0/1763007961794?e=1790208000&v=beta&t=AslXXhb3wwSHQocEbTiYRpkyKEcoBvjNR1N-oHJ8aN8',
    academicRecords: [
      {
        id: 'demo-ar-anshika-1',
        semester: 'Fall',
        year: 2023,
        gpa: 3.9,
        subjects: [
          { code: 'CS301', name: 'Data Structures', credits: 3, grade: 'A', points: 4.0 },
          { code: 'CS302', name: 'Algorithms', credits: 3, grade: 'A-', points: 3.7 },
          { code: 'CS303', name: 'Database Systems', credits: 3, grade: 'B+', points: 3.3 },
          { code: 'MATH201', name: 'Statistics', credits: 3, grade: 'A', points: 4.0 }
        ]
      },
      {
        id: 'demo-ar-anshika-2',
        semester: 'Spring',
        year: 2023,
        gpa: 3.7,
        subjects: [
          { code: 'CS401', name: 'Machine Learning', credits: 3, grade: 'A', points: 4.0 },
          { code: 'CS402', name: 'Web Development', credits: 3, grade: 'B+', points: 3.3 },
          { code: 'CS403', name: 'Software Engineering', credits: 3, grade: 'A-', points: 3.7 }
        ]
      }
    ],
    certificates: [
      ['demo-cert-anshika-1', 'AWS Cloud Practitioner', 'Amazon Web Services', '2023-08-15', 'approved', 'academic'],
      ['demo-cert-anshika-2', 'Hackathon Winner', 'Tech University', '2023-09-20', 'pending', 'co-curricular']
    ],
    activities: [
      ['demo-act-anshika-1', 'co-curricular', 'Programming Club President', 'Led a team of 50+ students in organizing coding competitions and workshops', '2023-01-15', 120, ['Leadership', 'Event Management', 'Programming']],
      ['demo-act-anshika-2', 'extracurricular', 'Community Service Volunteer', 'Teaching programming to underprivileged children', '2023-03-10', 80, ['Teaching', 'Communication', 'Social Impact']]
    ]
  },
  {
    id: 'demo-st-gunn',
    userId: 'demo-u-gunn',
    name: 'Gunn Kalra',
    email: 'bob@student.edu',
    course: 'Computer Science and Engineering',
    year: 2,
    gpa: 3.6,
    skills: ['ML', 'MATLAB', 'Python', 'Project Management'],
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQGH7PSaEcS-bg/profile-displayphoto-crop_800_800/B56Zxx2dNDJAAI-/0/1771436655001?e=1790208000&v=beta&t=ttp0zqQlJt39konWKSU8hKSmsevaowmHRDSwCabcpc8',
    academicRecords: [
      {
        id: 'demo-ar-gunn-1',
        semester: 'Fall',
        year: 2023,
        gpa: 3.5,
        subjects: [
          { code: 'EE201', name: 'Circuit Analysis', credits: 4, grade: 'B+', points: 3.3 },
          { code: 'EE202', name: 'Electronics', credits: 3, grade: 'A-', points: 3.7 },
          { code: 'MATH301', name: 'Differential Equations', credits: 3, grade: 'B', points: 3.0 }
        ]
      }
    ],
    certificates: [
      ['demo-cert-gunn-1', 'MATLAB Certification', 'MathWorks', '2023-07-10', 'approved', 'academic']
    ],
    activities: [
      ['demo-act-gunn-1', 'co-curricular', 'Robotics Team Member', 'Participated in national robotics competition', '2023-05-20', 100, ['Robotics', 'Teamwork', 'Problem Solving']]
    ]
  },
  {
    id: 'demo-st-ammar',
    userId: 'demo-u-ammar',
    name: 'Ammar Ahmad',
    email: 'carol@student.edu',
    course: 'Computer Science and Engineering',
    year: 4,
    gpa: 3.9,
    skills: ['MERN', 'AI', 'Leadership', 'Data Analysis', 'Public Speaking'],
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQEhMxkSoesCmg/profile-displayphoto-scale_400_400/B56Z9v9MVqHIAg-/0/1784289743934?e=1790208000&v=beta&t=71wc4dYfQwuDR3v0tCIpWmL9ZdevTVPEfe1tK4ge-tg',
    academicRecords: [
      {
        id: 'demo-ar-ammar-1',
        semester: 'Fall',
        year: 2023,
        gpa: 4.0,
        subjects: [
          { code: 'BUS401', name: 'Strategic Management', credits: 3, grade: 'A', points: 4.0 },
          { code: 'BUS402', name: 'International Business', credits: 3, grade: 'A', points: 4.0 },
          { code: 'BUS403', name: 'Business Ethics', credits: 3, grade: 'A', points: 4.0 }
        ]
      }
    ],
    certificates: [
      ['demo-cert-ammar-1', 'Google Analytics Certified', 'Google', '2023-06-15', 'approved', 'academic']
    ],
    activities: [
      ['demo-act-ammar-1', 'extracurricular', 'Student Government Vice President', 'Represented student body in university decisions', '2023-02-01', 200, ['Leadership', 'Public Speaking', 'Policy Making']]
    ]
  },
  {
    id: 'demo-st-anmol',
    userId: 'demo-u-anmol',
    name: 'Anmol Srivastava',
    email: 'anmol@student.edu',
    course: 'Artificial Intelligence',
    year: 3,
    gpa: 3.7,
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'Data Science'],
    avatar: 'https://media.licdn.com/dms/image/v2/D5635AQFl1701p4OKhQ/profile-framedphoto-shrink_800_800/B56ZzT5yupHUAg-/0/1773081668774?e=1789254000&v=beta&t=qiosSihCE76WIxbg2D2CPis7KqnVQNjtmJ06RGCkJjU',
    academicRecords: [
      {
        id: 'demo-ar-anmol-1',
        semester: 'Fall',
        year: 2023,
        gpa: 3.8,
        subjects: [
          { code: 'AI301', name: 'Artificial Intelligence', credits: 3, grade: 'A', points: 4.0 },
          { code: 'AI302', name: 'Machine Learning', credits: 3, grade: 'A-', points: 3.7 },
          { code: 'AI303', name: 'Deep Learning', credits: 3, grade: 'B+', points: 3.3 },
          { code: 'MATH302', name: 'Probability and Statistics', credits: 3, grade: 'A', points: 4.0 }
        ]
      },
      {
        id: 'demo-ar-anmol-2',
        semester: 'Spring',
        year: 2024,
        gpa: 3.6,
        subjects: [
          { code: 'AI401', name: 'Natural Language Processing', credits: 3, grade: 'A-', points: 3.7 },
          { code: 'AI402', name: 'Computer Vision', credits: 3, grade: 'B+', points: 3.3 },
          { code: 'AI403', name: 'Data Science', credits: 3, grade: 'A', points: 4.0 }
        ]
      }
    ],
    certificates: [
      ['demo-cert-anmol-1', 'TensorFlow Developer Certificate', 'Google', '2024-02-15', 'approved', 'academic'],
      ['demo-cert-anmol-2', 'AI Hackathon Finalist', 'Tech University', '2024-04-20', 'pending', 'co-curricular']
    ],
    activities: [
      ['demo-act-anmol-1', 'co-curricular', 'AI Research Club Member', 'Worked on machine learning projects and participated in AI research workshops', '2024-01-10', 110, ['Machine Learning', 'Research', 'Python']],
      ['demo-act-anmol-2', 'extracurricular', 'AI Workshop Volunteer', 'Helped organize and conduct introductory artificial intelligence workshops for students', '2024-03-15', 60, ['Teaching', 'Communication', 'Artificial Intelligence']]
    ]
  }
];

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
  console.log('Seeding EduTrack friends demo data...');
  const db = await getDb();
  await clearTables(db);

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  const users = [
    {
      id: 'demo-u-university',
      email: 'admin@techuniversity.edu',
      password_hash: passwordHash,
      role: 'university',
      name: 'Tech University Admin',
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'demo-u-company',
      email: 'recruiter@techcorp.com',
      password_hash: passwordHash,
      role: 'company',
      name: 'TechCorp Recruiter',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=256'
    },
    ...friendStudents.map(student => ({
      id: student.userId,
      email: student.email,
      password_hash: passwordHash,
      role: 'student',
      name: student.name,
      avatar: student.avatar
    }))
  ];

  for (const user of users) {
    await db.run(
      'INSERT INTO users (id, email, password_hash, role, name, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, user.email, user.password_hash, user.role, user.name, user.avatar]
    );
  }

  await db.run(
    'INSERT INTO universities (id, user_id, name, email) VALUES (?, ?, ?, ?)',
    ['demo-university', 'demo-u-university', universityName, 'admin@techuniversity.edu']
  );

  await db.run(
    'INSERT INTO companies (id, user_id, name, email, industry, size) VALUES (?, ?, ?, ?, ?, ?)',
    ['demo-company', 'demo-u-company', 'TechCorp', 'recruiter@techcorp.com', 'Technology', '1000+ employees']
  );

  for (const student of friendStudents) {
    await db.run(
      `INSERT INTO students (id, user_id, name, email, university, course, year, gpa, skills, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student.id,
        student.userId,
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

    for (const record of student.academicRecords) {
      await db.run(
        `INSERT INTO academic_records (id, student_id, semester, year, gpa, subjects)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [record.id, student.id, record.semester, record.year, record.gpa, JSON.stringify(record.subjects)]
      );
    }

    for (const [id, title, issuer, dateIssued, status, type] of student.certificates) {
      await db.run(
        `INSERT INTO certificates (id, student_id, title, issuer, date_issued, status, type, file_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, student.id, title, issuer, dateIssued, status, type, '']
      );
    }

    for (const [id, type, title, description, date, hours, skills] of student.activities) {
      await db.run(
        `INSERT INTO activities (id, student_id, type, title, description, date, hours, skills)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, student.id, type, title, description, date, hours, JSON.stringify(skills)]
      );
    }
  }

  console.log('EduTrack friends demo data seeded successfully.');
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

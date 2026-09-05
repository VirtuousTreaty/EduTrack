import { Student, Certificate, Activity, AcademicRecord } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Anshika Middha',
    email: 'alice@student.edu',
    university: 'KIET GROUP OF INSTITUTIONS',
    course: 'Computer Science and Engineering',
    year: 3,
    gpa: 3.8,
    skills: ['JavaScript', 'React', 'Python', 'Data Analysis', 'Machine Learning'],
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQH0suTL3pgmUA/profile-displayphoto-crop_800_800/B56Zp7do.6JkAI-/0/1763007961794?e=1790208000&v=beta&t=AslXXhb3wwSHQocEbTiYRpkyKEcoBvjNR1N-oHJ8aN8',
    academicRecords: [
      {
        id: 'ar1',
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
        id: 'ar2',
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
      {
        id: 'c1',
        studentId: '1',
        title: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        dateIssued: '2023-08-15',
        status: 'approved',
        type: 'academic'
      },
      {
        id: 'c2',
        studentId: '1',
        title: 'Hackathon Winner',
        issuer: 'Tech University',
        dateIssued: '2023-09-20',
        status: 'pending',
        type: 'co-curricular'
      }
    ],
    activities: [
      {
        id: 'a1',
        type: 'co-curricular',
        title: 'Programming Club President',
        description: 'Led a team of 50+ students in organizing coding competitions and workshops',
        date: '2023-01-15',
        hours: 120,
        skills: ['Leadership', 'Event Management', 'Programming']
      },
      {
        id: 'a2',
        type: 'extracurricular',
        title: 'Community Service Volunteer',
        description: 'Teaching programming to underprivileged children',
        date: '2023-03-10',
        hours: 80,
        skills: ['Teaching', 'Communication', 'Social Impact']
      }
    ]
  },
  {
    id: '2',
    name: 'Gunn Kalra',
    email: 'bob@student.edu',
    university: 'KIET GROUP OF INSTITUTIONS',
    course: 'Computer Science and Engineering',
    year: 2,
    gpa: 3.6,
    skills: ['ML', 'MATLAB', 'Python', 'Project Management'],
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQGH7PSaEcS-bg/profile-displayphoto-crop_800_800/B56Zxx2dNDJAAI-/0/1771436655001?e=1790208000&v=beta&t=ttp0zqQlJt39konWKSU8hKSmsevaowmHRDSwCabcpc8',
    academicRecords: [
      {
        id: 'ar3',
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
      {
        id: 'c3',
        studentId: '2',
        title: 'MATLAB Certification',
        issuer: 'MathWorks',
        dateIssued: '2023-07-10',
        status: 'approved',
        type: 'academic'
      }
    ],
    activities: [
      {
        id: 'a3',
        type: 'co-curricular',
        title: 'Robotics Team Member',
        description: 'Participated in national robotics competition',
        date: '2023-05-20',
        hours: 100,
        skills: ['Robotics', 'Teamwork', 'Problem Solving']
      }
    ]
  },
  {
    id: '3',
    name: 'Ammar Ahmad',
    email: 'carol@student.edu',
    university: 'KIET GROUP OF INSTITUTIONS',
    course: 'Computer Science and Engineering',
    year: 4,
    gpa: 3.9,
    skills: ['MERN', 'AI', 'Leadership', 'Data Analysis', 'Public Speaking'],
    avatar: 'https://media.licdn.com/dms/image/v2/D5603AQEhMxkSoesCmg/profile-displayphoto-scale_400_400/B56Z9v9MVqHIAg-/0/1784289743934?e=1790208000&v=beta&t=71wc4dYfQwuDR3v0tCIpWmL9ZdevTVPEfe1tK4ge-tg',
    academicRecords: [
      {
        id: 'ar4',
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
      {
        id: 'c4',
        studentId: '3',
        title: 'Google Analytics Certified',
        issuer: 'Google',
        dateIssued: '2023-06-15',
        status: 'approved',
        type: 'academic'
      }
    ],
    activities: [
      {
        id: 'a4',
        type: 'extracurricular',
        title: 'Student Government Vice President',
        description: 'Represented student body in university decisions',
        date: '2023-02-01',
        hours: 200,
        skills: ['Leadership', 'Public Speaking', 'Policy Making']
      }
    ]
  }
];

export const currentUser = {
  student: mockStudents[0],
  university: {
    id: 'u1',
    name: 'Tech University Admin',
    email: 'admin@techuniversity.edu',
    role: 'university' as const
  },
  company: {
    id: 'co1',
    name: 'TechCorp Recruiter',
    email: 'recruiter@techcorp.com',
    role: 'company' as const,
    company: 'TechCorp',
    industry: 'Technology',
    size: '1000+ employees'
  }
};
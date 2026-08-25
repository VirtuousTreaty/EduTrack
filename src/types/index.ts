export interface User {
  id: string;
  email: string;
  role: 'student' | 'university' | 'company';
  name: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  course: string;
  year: number;
  gpa: number;
  skills: string[];
  avatar?: string;
  academicRecords: AcademicRecord[];
  certificates: Certificate[];
  activities: Activity[];
}

export interface AcademicRecord {
  id: string;
  semester: string;
  year: number;
  subjects: Subject[];
  gpa: number;
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
  grade: string;
  points: number;
}

export interface Certificate {
  id: string;
  studentId: string;
  title: string;
  issuer: string;
  dateIssued: string;
  fileUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'academic' | 'co-curricular' | 'extracurricular';
}

export interface Activity {
  id: string;
  type: 'co-curricular' | 'extracurricular';
  title: string;
  description: string;
  date: string;
  hours: number;
  skills: string[];
}

export interface Company {
  id: string;
  name: string;
  email: string;
  industry: string;
  size: string;
}
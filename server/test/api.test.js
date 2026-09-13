import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import request from 'supertest';

const tempDir = await mkdtemp(path.join(os.tmpdir(), 'edutrack-api-test-'));

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-for-api-tests';
process.env.DB_PATH = path.join(tempDir, 'edutrack.sqlite');

const { app } = await import('../src/app.js');
const { closeDb } = await import('../src/config/db.js');
const { seed } = await import('../src/seeds/seed.js');

before(async () => {
  await seed();
});

after(async () => {
  await closeDb();
  await rm(tempDir, { recursive: true, force: true });
});

async function loginAs(email, role) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'password123', role })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.ok(response.body.token);
  return response.body.token;
}

function auth(token) {
  return { Authorization: `Bearer ${token}` };
}

test('health endpoint is public', async () => {
  const response = await request(app).get('/api/health').expect(200);
  assert.equal(response.body.status, 'OK');
});

test('auth validates login role and returns the current user', async () => {
  await request(app)
    .post('/api/auth/login')
    .send({ email: 'alice@student.edu', password: 'password123', role: 'company' })
    .expect(401);

  const token = await loginAs('alice@student.edu', 'student');
  const currentUser = await request(app)
    .get('/api/auth/me')
    .set(auth(token))
    .expect(200);

  assert.equal(currentUser.body.user.role, 'student');
  assert.equal(currentUser.body.user.studentId, 'st-1');
});

test('student profile access is ownership protected', async () => {
  const studentToken = await loginAs('alice@student.edu', 'student');

  const ownProfile = await request(app)
    .get('/api/students/profile')
    .set(auth(studentToken))
    .expect(200);

  assert.equal(ownProfile.body.student.id, 'st-1');

  await request(app)
    .get('/api/students/profile/st-2')
    .set(auth(studentToken))
    .expect(403);
});

test('student and university can add academic records with proper scoping', async () => {
  const studentToken = await loginAs('alice@student.edu', 'student');
  const universityToken = await loginAs('admin@techuniversity.edu', 'university');

  await request(app)
    .post('/api/students/academic-records')
    .set(auth(studentToken))
    .send({ semester: 'Spring', year: 2024, gpa: 3.8, subjects: [] })
    .expect(201);

  await request(app)
    .post('/api/students/academic-records')
    .set(auth(universityToken))
    .send({ studentId: 'st-2', semester: 'Fall', year: 2024, gpa: 3.7, subjects: [] })
    .expect(201);

  await request(app)
    .post('/api/students/academic-records')
    .set(auth(universityToken))
    .send({ semester: 'Fall', year: 2024, gpa: 3.7, subjects: [] })
    .expect(403);
});

test('certificate flow is scoped by role', async () => {
  const studentToken = await loginAs('alice@student.edu', 'student');
  const universityToken = await loginAs('admin@techuniversity.edu', 'university');
  const companyToken = await loginAs('recruiter@techcorp.com', 'company');

  const upload = await request(app)
    .post('/api/certificates/upload')
    .set(auth(studentToken))
    .field('title', 'Backend Integration Test Certificate')
    .field('issuer', 'EduTrack QA')
    .field('dateIssued', '2024-05-01')
    .field('type', 'academic')
    .expect(201);

  assert.equal(upload.body.certificate.status, 'pending');

  const companyCertificates = await request(app)
    .get('/api/certificates/all')
    .set(auth(companyToken))
    .expect(200);

  assert.ok(companyCertificates.body.certificates.every(certificate => certificate.status === 'approved'));

  await request(app)
    .patch(`/api/certificates/${upload.body.certificate.id}/status`)
    .set(auth(universityToken))
    .send({ status: 'approved' })
    .expect(200);

  const studentCertificates = await request(app)
    .get('/api/certificates/my-certificates')
    .set(auth(studentToken))
    .expect(200);

  const approvedUpload = studentCertificates.body.certificates.find(
    certificate => certificate.id === upload.body.certificate.id
  );
  assert.equal(approvedUpload.status, 'approved');
});

test('company search and recommendations return candidates', async () => {
  const companyToken = await loginAs('recruiter@techcorp.com', 'company');

  const search = await request(app)
    .get('/api/company/students')
    .query({ skills: 'Python', minGpa: '3.5' })
    .set(auth(companyToken))
    .expect(200);

  assert.ok(search.body.students.length >= 1);
  assert.ok(search.body.students.every(student => student.certificates.every(certificate => certificate.status === 'approved')));

  const recommendations = await request(app)
    .post('/api/company/recommendations')
    .set(auth(companyToken))
    .send({ requiredSkills: ['Python', 'React'], minGpa: 3, preferredCourse: 'Computer Science' })
    .expect(200);

  assert.ok(recommendations.body.recommendations.length >= 1);
  assert.ok(recommendations.body.recommendations[0].matchPercentage >= recommendations.body.recommendations.at(-1).matchPercentage);
});

test('invalid signup payload is rejected', async () => {
  const response = await request(app)
    .post('/api/auth/signup')
    .send({ email: 'bad-email', password: 'short', role: 'student', name: '' })
    .expect(400);

  assert.equal(response.body.success, false);
});

import { getDb, closeDb } from '../config/db.js';

async function resetDb() {
  const db = await getDb();

  await db.exec('PRAGMA foreign_keys = OFF;');
  await db.exec('DELETE FROM activities;');
  await db.exec('DELETE FROM certificates;');
  await db.exec('DELETE FROM academic_records;');
  await db.exec('DELETE FROM students;');
  await db.exec('DELETE FROM universities;');
  await db.exec('DELETE FROM companies;');
  await db.exec('DELETE FROM users;');
  await db.exec('PRAGMA foreign_keys = ON;');

  await closeDb();
  console.log('EduTrack database reset complete.');
}

resetDb().catch(async error => {
  console.error('Database reset failed:', error);
  await closeDb();
  process.exit(1);
});

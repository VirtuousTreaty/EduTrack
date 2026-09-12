import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'edutrack.sqlite');

let db = null;

export async function getDb() {
  if (db) return db;
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');

  // Initialize schema
  await initSchema(db);

  return db;
}

async function initSchema(database) {
  await database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'university', 'company')),
      name TEXT NOT NULL,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      university TEXT NOT NULL,
      course TEXT NOT NULL,
      year INTEGER NOT NULL,
      gpa REAL NOT NULL,
      skills TEXT NOT NULL DEFAULT '[]',
      avatar TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS academic_records (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      semester TEXT NOT NULL,
      year INTEGER NOT NULL,
      gpa REAL NOT NULL,
      subjects TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      date_issued TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
      type TEXT NOT NULL CHECK(type IN ('academic', 'co-curricular', 'extracurricular')),
      file_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('co-curricular', 'extracurricular')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      hours INTEGER NOT NULL,
      skills TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS universities (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      industry TEXT,
      size TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

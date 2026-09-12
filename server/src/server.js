import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { getDb } from './config/db.js';
import { seed } from './seeds/seed.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import { getApiDocs } from './controllers/docsController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/company', companyRoutes);
app.get('/api/docs', getApiDocs);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'EduTrack API Server',
    time: new Date().toISOString()
  });
});

// 404 Handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: `API route ${req.originalUrl} not found` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    const db = await getDb();
    
    // Check if db needs initial seeding
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count === 0) {
      await seed();
    }

    app.listen(PORT, () => {
      console.log(`🚀 EduTrack Backend Server running on http://localhost:${PORT}`);
      console.log(`📑 Interactive API Documentation available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Failed to start EduTrack server:', error);
    process.exit(1);
  }
}

startServer();

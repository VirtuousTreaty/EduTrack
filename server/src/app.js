import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { config } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import companyRoutes from './routes/companyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = new Set([
      config.clientUrl,
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ]);
    const isLocalDevOrigin =
      config.nodeEnv !== 'production' &&
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');

    if (!origin || allowedOrigins.has(origin) || isLocalDevOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/company', companyRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'EduTrack API Server',
    time: new Date().toISOString()
  });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: `API route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

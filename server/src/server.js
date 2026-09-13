import { app } from './app.js';
import { config } from './config/env.js';
import { getDb } from './config/db.js';
import { seed } from './seeds/seed.js';

export async function startServer() {
  try {
    const db = await getDb();
    
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (config.autoSeed && userCount.count === 0) {
      await seed();
    }

    return app.listen(config.port, () => {
      console.log(`🚀 EduTrack Backend Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start EduTrack server:', error);
    process.exit(1);
  }
}

startServer();

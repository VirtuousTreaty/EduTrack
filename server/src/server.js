import { app } from './app.js';
import { config } from './config/env.js';
import { getDb } from './config/db.js';
import { seedDemo } from './seeds/demoSeed.js';
import { seed } from './seeds/seed.js';

async function getDemoSeedVersion(db) {
  const row = await db.get("SELECT value FROM seed_metadata WHERE key = 'demoSeedVersion'");
  return row?.value;
}

async function setDemoSeedVersion(db) {
  await db.run(
    `INSERT INTO seed_metadata (key, value, updated_at)
     VALUES ('demoSeedVersion', ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    [config.demoSeedVersion]
  );
}

export async function startServer() {
  try {
    const db = await getDb();

    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (config.autoSeed) {
      if (config.seedMode === 'demo') {
        const currentDemoSeedVersion = await getDemoSeedVersion(db);
        if (userCount.count === 0 || currentDemoSeedVersion !== config.demoSeedVersion) {
          await seedDemo();
          await setDemoSeedVersion(db);
        }
      } else if (userCount.count === 0) {
        await seed();
      }
    }

    return app.listen(config.port, () => {
      console.log(`EduTrack Backend Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start EduTrack server:', error);
    process.exit(1);
  }
}

startServer();

import dotenv from 'dotenv';

dotenv.config();

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }

  return 'edutrack_dev_jwt_secret_change_me';
}

export const config = {
  autoSeed: process.env.AUTO_SEED === 'true',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databasePath: process.env.DB_PATH,
  jwtSecret: getJwtSecret(),
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  seedMode: process.env.SEED_MODE || 'default'
};

import dotenv from 'dotenv';

dotenv.config();

const getEnv = <T>(key: string, defaultValue?: T): T | string => {
  const value = process.env[key] || defaultValue;

  if (value == null) {
    throw new Error('환경 변수가 없습니다.');
  }

  return value;
};

type Config = {
  db: {
    host: string;
  };
  port: number;
  bcrypt: {
    saltRound: number;
  };
  jwt: {
    secretKey: string;
    expiresIn: string;
  };
  cors: {
    allowedOrigin: string;
  };
};

const config: Config = {
  db: {
    host: getEnv('DB_HOST'),
  },
  port: Number(getEnv('PORT', 8080)),
  bcrypt: {
    saltRound: Number(getEnv('BCRYPT_SALT_ROUND', 8)),
  },
  jwt: {
    secretKey: getEnv('JWT_SECRET_KEY'),
    expiresIn: getEnv('JWT_EXPIRES_IN'),
  },
  cors: {
    allowedOrigin: getEnv('CORS_ALLOW_ORIGIN'),
  },
};

export default config;

import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE, DB_SCHEMA } = process.env;

export const APP_URL = process.env.APP_URL;

// jwt expiration time
export const EXPIRES_IN = process.env.EXPIRES_IN || '1h';

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const ENV = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/localmove',
  PG_HOST: process.env.PG_HOST || 'localhost',
  PG_PORT: Number(process.env.PG_PORT) || 5432,
  PG_USER: process.env.PG_USER || 'postgres',
  PG_PASSWORD: process.env.PG_PASSWORD || 'postgres',
  PG_DATABASE: process.env.PG_DATABASE || 'localmove',
  JWT_SECRET: process.env.JWT_SECRET || 'localmove_super_secret_jwt_key_2026',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBbyqtpPJXKzeeCMjM1uTU1m1IWxli0eeg',
}


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function createApp() {
    const app = express();
    // Security headers (allow external Google Maps & Assets)
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    // CORS configuration
    const allowedOrigins = [
        ENV.CORS_ORIGIN,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4000',
        'http://127.0.0.1:4000',
        'http://localhost:3000',
    ];
    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, Postman)
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
                return callback(null, true);
            }
            callback(null, true); // Lenient for dev
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));
    // Body parsers
    app.use(express.json({ limit: '20mb' }));
    app.use(express.urlencoded({ extended: true, limit: '20mb' }));
    // Static uploads directory
    const rootDir = path.resolve(__dirname, __dirname.endsWith('dist') || __dirname.endsWith('src') ? '../..' : '..');
    const uploadsDir = path.resolve(rootDir, 'uploads');
    const distDir = path.resolve(rootDir, 'dist');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    app.use('/uploads', express.static(uploadsDir));
    // Rate limiting for auth routes
    const authLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 60, // Limit each IP to 60 requests per windowMs
        message: {
            success: false,
            error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again shortly.' },
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api/v1/auth', authLimiter);
    // 1. Base API routes
    app.use('/api/v1', apiRouter);
    // 2. Serve static frontend files from dist (if built)
    if (fs.existsSync(distDir)) {
        app.use(express.static(distDir));
        // SPA client-side fallback for frontend routes (e.g. /receiver, /track, /customer)
        app.get('*', (req, res, next) => {
            if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
                return next();
            }
            res.sendFile(path.resolve(distDir, 'index.html'));
        });
    }
    // 3. 404 Handler for undefined API routes
    app.use('/api', (req, res) => {
        res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: `API Endpoint ${req.method} ${req.originalUrl} not found on Local Move API`,
            },
        });
    });
    // Global Error Handler
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map
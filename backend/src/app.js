import 'dotenv/config'; // Load .env file
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { prisma } from './database.js'; // This is just to initialize the client
import passportConfig from './passport.config.js'; // Import the config
import apiRouter from './routes.js';
import { startNewsletterJob } from './job/newsletter.job.js';

// --- Initialize App ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Register Passport Strategies ---
// This executes the config file and teaches Passport about the "google" strategy
passportConfig(passport);

// --- Core Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow requests from your frontend
  })
);
app.use(helmet()); // Set security-related HTTP headers
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(passport.initialize()); // Initialize Passport

// Use morgan for logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- API Routes ---
// All API routes are prefixed with /api/v1
app.use('/api/v1', apiRouter);

// --- Error Handling Middleware ---

// 404 Not Found Handler
// This catches any request that doesn't match a route
app.use((req, res, next) => {
  const error = new Error(`Resource not found on this server - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
// This catches all errors passed by next(error)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`Global Error Handler: ${err.message}`); // Log the error to the console
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    // Show stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`[Server] 🚀 Server running on http://localhost:${PORT}`);
  // Log database connection
  prisma.$connect()
    .then(() => {
      console.log('[Database] 💾 Prisma client initialized.');
    })
    .catch((err) => {
      console.error('[Database] ❌ Error connecting to database:', err);
    });
  
  // Start the scheduled newsletter jobs
  startNewsletterJob();
});


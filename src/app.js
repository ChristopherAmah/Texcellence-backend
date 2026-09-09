import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { sanitizeRequest } from './middleware/sanitizeRequest.js';
import authRoutes from './routes/auth.routes.js';
import attendeeRoutes from './routes/attendee.routes.js';
import eventRoutes from './routes/event.routes.js';
import healthRoutes from './routes/health.routes.js';
import sponsorRoutes from './routes/sponsor.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import interactionRoutes from './routes/interaction.routes.js';
import leadRoutes from './routes/lead.routes.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '100kb' }));
app.use(sanitizeRequest);

const authenticationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Try again later.' },
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authenticationLimiter, authRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/leads', leadRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;

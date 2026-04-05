import rateLimit from 'express-rate-limit';
import { _config } from '../config/config.js';

// Skip rate limiting in testing mode
const isTest = _config.NODE_ENV === 'test';

//auth limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 10,
  skip: () => isTest,
  message: {
    success: false,
    message: 'Too many attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//api limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100,
  skip: () => isTest,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

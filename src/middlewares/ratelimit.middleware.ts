import rateLimit from 'express-rate-limit';

//auth limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 10,
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
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

import { rateLimit } from 'express-rate-limit';

// to test the rate limiter, install autocannon with the following command:
// npm install -g autocannon

// then run the following command to test the rate limiter with 100 requests
// autocannon http://localhost:3000/api/products

const convertToMs = (minutes: number) => minutes * 60 * 1000;

const generalLimiterMiddleware = rateLimit({
  windowMs: convertToMs(15),
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: true,
  message: { message: 'Too many requests - please try again later.' },
});

export const strictLimiterMiddleware = rateLimit({
  windowMs: convertToMs(60),
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: true,
  message: { message: 'Too many requests - please try again later.' },
});

export default generalLimiterMiddleware;

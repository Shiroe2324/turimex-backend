import type { RateLimitRequestHandler } from 'express-rate-limit';
import { rateLimit } from 'express-rate-limit';

// to test the rate limiter, install autocannon with the following command:
// bun install -g autocannon

// then run the following command to test the rate limiter with 200 requests
// autocannon http://localhost:3000/api/products -c 200 -d 5

const convertToMs = (minutes: number) => minutes * 60 * 1000;

function rateLimitMiddleware(minutes: number, limit: number): RateLimitRequestHandler {
  return rateLimit({
    windowMs: convertToMs(minutes),
    limit,
    message: {
      status: 'limit',
      statusCode: 429,
      message: 'Too many requests - please try again later.',
    },
  });
}

export default rateLimitMiddleware;

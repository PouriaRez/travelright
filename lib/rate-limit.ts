import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = Redis.fromEnv();

// Create a new ratelimiter, that allows 10 requests per 1 minute
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'TravelRight:Chat',
});

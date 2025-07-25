import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export const rateLimit = (options?: Options) => {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500, // Max 500 unique tokens per interval
    ttl: options?.interval || 60000, // 1 minute by default
  });

  return {
    check: (req: Request, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
        } else {
          tokenCount[0] += 1;
          tokenCache.set(token, tokenCount);
        }
        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage > limit;

        const headers = {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': isRateLimited ? '0' : (limit - currentUsage).toString(),
        };

        return isRateLimited ? reject(new Error('Rate limit exceeded')) : resolve();
      }),
  };
};

// Rate limiter for public APIs (more strict)
export const publicRateLimiter = rateLimit({
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  interval: 60000, // 1 minute
});

// Rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  uniqueTokenPerInterval: 100, // More strict for auth endpoints
  interval: 60000, // 1 minute
});

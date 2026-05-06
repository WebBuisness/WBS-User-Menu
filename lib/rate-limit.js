// Simple in-memory rate limiter
const rateLimitMap = new Map();

/**
 * Rate limit requests based on IP or identifier
 * @param {string} identifier - Unique identifier for the client (e.g., IP)
 * @param {number} limit - Maximum number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{success: boolean, remaining: number, reset: number}>}
 */
export async function rateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get current record
  let record = rateLimitMap.get(identifier);
  
  if (!record) {
    record = {
      timestamps: [now],
    };
    rateLimitMap.set(identifier, record);
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }
  
  // Filter timestamps to only include those within the window
  record.timestamps = record.timestamps.filter(timestamp => timestamp > windowStart);
  
  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    return { 
      success: false, 
      remaining: 0, 
      reset: oldestTimestamp + windowMs 
    };
  }
  
  // Add current timestamp
  record.timestamps.push(now);
  return { 
    success: true, 
    remaining: limit - record.timestamps.length, 
    reset: record.timestamps[0] + windowMs 
  };
}

// Cleanup old records every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [identifier, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter(ts => ts > now - 3600000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(identifier);
      }
    }
  }, 3600000);
}

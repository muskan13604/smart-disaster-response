const Redis = require('ioredis');

// BullMQ workers use blocking Redis commands.  BullMQ requires this option to
// be disabled on a shared ioredis connection, otherwise the worker prevents
// the API process from starting.
const redisClient = new Redis(process.env.REDIS_URI || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

redisClient.on('connect', () => {
    console.log('Redis connected successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redisClient;

const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('Redis connected in Notification API');
        }
    } catch (err) {
        console.warn('Warning: Redis is NOT running. Live verification updates will be disabled.');
        // console.error('Failed to connect to Redis', err);
    }
})();

module.exports = client;

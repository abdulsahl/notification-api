const { createClient } = require('redis');

async function testRedis() {
    const client = createClient({
        url: 'redis://localhost:7000'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();
    console.log('Connected to Redis on port 7000');

    console.log('Publishing test message...');

    // Simulate a verification update event
    // Note: We are using a fake claimant_id (e.g., 1 or 6) effectively testing the flow
    await client.publish('verification_updates', JSON.stringify({
        report_id: 6,
        claimant_id: 6, // Pastikan ID ini ada di tabel users (atau gunakan user yang Anda login)
        status: 'approved'
    }));

    console.log('Message published! Check your Notification API logs.');

    await client.disconnect();
}

testRedis();

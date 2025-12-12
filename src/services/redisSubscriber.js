const client = require('../config/redisClient');
const Notification = require('../models/notification');

async function initSubscriber() {
    try {
        const subscriber = client.duplicate();
        await subscriber.connect();
        console.log('Redis Subscriber Connected');

        await subscriber.subscribe('verification_updates', async (message) => {
            try {
                console.log('Received verification update:', message);
                const data = JSON.parse(message);

                /*
                 Expected data:
                 {
                    report_id: 123,
                    claimant_id: 456,
                    status: 'approved' | 'rejected'
                 }
                */

                const { report_id, claimant_id, status } = data;

                if (!claimant_id) {
                    console.error('Missing claimant_id in verification update');
                    return;
                }

                let title = 'Status Verifikasi Diperbarui';
                let body = `Verifikasi untuk laporan #${report_id} telah diperbarui menjadi: ${status}`;
                let type = 'info';

                if (status === 'approved') {
                    title = 'Verifikasi Diterima!';
                    body = `Selamat! Verifikasi barang (ID: ${report_id}) telah diterima. Silakan cek detailnya.`;
                    type = 'success';
                } else if (status === 'rejected') {
                    title = 'Verifikasi Ditolak';
                    body = `Maaf, verifikasi untuk barang (ID: ${report_id}) ditolak.`;
                    type = 'error';
                }

                // Create Notification in Database
                await Notification.create({
                    user_id: claimant_id,
                    message: body,
                    created_at: new Date()
                });

                console.log(`Notification created for User ${claimant_id}`);

            } catch (error) {
                console.error('Error processing Redis message:', error);
            }
        });
    } catch (error) {
        console.warn('Redis Subscriber: Could not connect to Redis. Skipping live updates.');
        // console.error('Failed to initialize Redis subscriber:', error);
    }
}

module.exports = initSubscriber;

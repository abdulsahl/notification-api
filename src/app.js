const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/notifications', notificationRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Notification API is running' });
});

// Sync database (in production this might be a migration)
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Failed to sync database:', err);
});

module.exports = app;

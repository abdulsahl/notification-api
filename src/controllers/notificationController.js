const Notification = require('../models/notification');

exports.createNotification = async (req, res) => {
    try {
        const { user_id, message } = req.body;

        if (!user_id || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const notification = await Notification.create({
            user_id,
            message
        });

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id query parameter is required' });
        }

        const notifications = await Notification.findAll({
            where: { user_id },
            order: [['created_at', 'DESC']]
        });

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByPk(id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.is_read = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        await Notification.update(
            { is_read: true },
            { where: { user_id, is_read: false } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const notificationService = require("../../services/employer/notification.services");

const createNotification = async (req, res) => {
  try {
    const { sender, receivers, message, link } = req.body;

    const notification = await notificationService.createNotification({
      sender,
      receivers,
      message,
      link,
    });

    const io = req.app.get("io");

    receivers.forEach((receiverId) => {
      io.to(receiverId).emit("receive-notification", notification);
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(
      req.params.userId
    );
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const updated = await notificationService.updateNotification(id, updates);

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("PATCH notification error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  patchNotification,
};

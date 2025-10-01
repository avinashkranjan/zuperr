const Notification = require("../../model/employer/notification.model");

const createNotification = async ({ sender, receivers, message, link }) => {
  if (!receivers || receivers.length === 0) {
    throw new Error("Receivers list cannot be empty");
  }

  const notification = new Notification({
    sender,
    receivers,
    message,
    link,
  });

  return await notification.save();
};

const getUserNotifications = async (userId) => {
  return Notification.find({ receivers: userId }).sort({ createdAt: -1 });
};

/**
 * Update a notification by ID
 * @param {string} notificationId
 * @param {object} updates
 * @returns {Promise<Notification>}
 */
const updateNotification = async (notificationId, updates) => {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    updates,
    { new: true }
  );
  return notification;
};

module.exports = {
  createNotification,
  getUserNotifications,
  updateNotification,
};

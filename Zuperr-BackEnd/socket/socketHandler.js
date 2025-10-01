let onlineUsers = new Map(); // userId -> socketId

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("✅ Registered user:", userId);
    });

    socket.on("send-notification", (data) => {
      const { sender, receivers, message, link } = data;

      receivers.forEach((receiverId) => {
        const socketId = onlineUsers.get(receiverId);
        if (socketId) {
          io.to(socketId).emit("receive-notification", {
            sender,
            message,
            link,
            timestamp: new Date(),
          });
        }
      });
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

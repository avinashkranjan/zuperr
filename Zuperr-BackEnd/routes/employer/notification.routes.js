const express = require("express");
const router = express.Router();
const controller = require("../../controller/employer/notification.controller");

router.post("/", controller.createNotification);
router.get("/:userId", controller.getUserNotifications);
router.patch("/:id", controller.patchNotification);

module.exports = router;

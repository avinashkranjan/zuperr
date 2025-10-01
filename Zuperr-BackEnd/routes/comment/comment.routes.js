const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/auth");
const commentController = require("../../controller/comment/comment.controller");

// All comment routes require authentication
router.post("/", authenticateToken, commentController.createComment);
router.get("/", commentController.getComments);
router.get("/:id", commentController.getCommentById);
router.put("/:id", authenticateToken, commentController.updateComment);
router.delete("/:id", authenticateToken, commentController.deleteComment);
router.post("/:id/vote", authenticateToken, commentController.voteComment);
router.get("/:id/replies", commentController.getCommentReplies);

module.exports = router;

const commentService = require("../../services/comment/comment.service");

/**
 * POST /api/comments
 * Create a new comment or reply
 */
const createComment = async (req, res) => {
  try {
    const { resourceType, resourceId, parentId, content } = req.body;
    const authorId = req.user.userId;
    
    // Determine author type based on token
    const authorType = req.user.userType || "User"; // Default to User
    
    const comment = await commentService.createComment({
      resourceType,
      resourceId,
      parentId,
      authorId,
      authorType,
      content,
    });
    
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/comments
 * Get comments for a resource
 */
const getComments = async (req, res) => {
  try {
    const { resourceType, resourceId, page = 1, limit = 20, sortBy = "-score" } = req.query;
    
    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: "resourceType and resourceId are required",
      });
    }
    
    const result = await commentService.getComments(resourceType, resourceId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
    });
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/comments/:id
 * Get single comment
 */
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await commentService.getCommentById(id);
    
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/comments/:id
 * Update a comment
 */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user.userId;
    
    const comment = await commentService.updateComment(id, authorId, content);
    
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    if (error.message.includes("not found or unauthorized")) {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

/**
 * DELETE /api/comments/:id
 * Delete a comment (soft delete)
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    await commentService.deleteComment(id, userId);
    
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    if (error.message.includes("not found or unauthorized")) {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

/**
 * POST /api/comments/:id/vote
 * Vote on a comment (upvote/downvote)
 */
const voteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 1 for upvote, -1 for downvote
    const userId = req.user.userId;
    
    const comment = await commentService.voteComment(id, userId, vote);
    
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/comments/:id/replies
 * Get replies for a comment
 */
const getCommentReplies = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await commentService.getCommentReplies(id, {
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
  voteComment,
  getCommentReplies,
};

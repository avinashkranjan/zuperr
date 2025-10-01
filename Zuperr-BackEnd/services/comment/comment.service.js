const Comment = require("../../model/comment/comment.model");

/**
 * Create a new comment or reply
 */
const createComment = async (commentData) => {
  try {
    const { resourceType, resourceId, parentId, authorId, authorType, content } = commentData;
    
    let depth = 0;
    
    // If this is a reply, calculate depth
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }
      depth = parentComment.depth + 1;
    }
    
    const comment = new Comment({
      resourceType,
      resourceId,
      parentId: parentId || null,
      depth,
      authorId,
      authorType,
      content,
    });
    
    await comment.save();
    return comment;
  } catch (error) {
    throw new Error("Failed to create comment: " + error.message);
  }
};

/**
 * Get comments for a resource (with threading)
 */
const getComments = async (resourceType, resourceId, options = {}) => {
  try {
    const { page = 1, limit = 20, sortBy = "-score" } = options;
    
    // Get top-level comments
    const comments = await Comment.find({
      resourceType,
      resourceId,
      parentId: null,
      isDeleted: false,
    })
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Get replies for each comment (one level deep for MVP)
    for (const comment of comments) {
      comment.replies = await Comment.find({
        parentId: comment._id,
        isDeleted: false,
      })
        .sort("createdAt")
        .limit(10) // Limit replies shown
        .lean();
      
      comment.replyCount = await Comment.countDocuments({
        parentId: comment._id,
      });
    }
    
    const total = await Comment.countDocuments({
      resourceType,
      resourceId,
      parentId: null,
    });
    
    return {
      comments,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error("Failed to fetch comments: " + error.message);
  }
};

/**
 * Get comment by ID
 */
const getCommentById = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId).lean();
    
    if (!comment) {
      throw new Error("Comment not found");
    }
    
    return comment;
  } catch (error) {
    throw new Error("Failed to fetch comment: " + error.message);
  }
};

/**
 * Update comment
 */
const updateComment = async (commentId, authorId, content) => {
  try {
    const comment = await Comment.findOne({
      _id: commentId,
      authorId: authorId,
      isDeleted: false,
    });
    
    if (!comment) {
      throw new Error("Comment not found or unauthorized");
    }
    
    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    
    await comment.save();
    return comment;
  } catch (error) {
    throw new Error("Failed to update comment: " + error.message);
  }
};

/**
 * Delete comment (soft delete)
 */
const deleteComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findOne({
      _id: commentId,
      authorId: userId,
    });
    
    if (!comment) {
      throw new Error("Comment not found or unauthorized");
    }
    
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.deletedBy = userId;
    comment.content = "[deleted]";
    
    await comment.save();
    return comment;
  } catch (error) {
    throw new Error("Failed to delete comment: " + error.message);
  }
};

/**
 * Vote on a comment (Reddit-style)
 */
const voteComment = async (commentId, userId, vote) => {
  try {
    if (![1, -1].includes(vote)) {
      throw new Error("Vote must be 1 (upvote) or -1 (downvote)");
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      throw new Error("Comment not found");
    }
    
    // Check if user already voted
    const existingVoteIndex = comment.voters.findIndex(
      v => v.userId.toString() === userId.toString()
    );
    
    if (existingVoteIndex !== -1) {
      const existingVote = comment.voters[existingVoteIndex];
      
      // If same vote, remove it (toggle)
      if (existingVote.vote === vote) {
        comment.voters.splice(existingVoteIndex, 1);
        if (vote === 1) {
          comment.upvotes = Math.max(0, comment.upvotes - 1);
        } else {
          comment.downvotes = Math.max(0, comment.downvotes - 1);
        }
      } else {
        // Change vote
        comment.voters[existingVoteIndex].vote = vote;
        if (vote === 1) {
          comment.upvotes += 1;
          comment.downvotes = Math.max(0, comment.downvotes - 1);
        } else {
          comment.downvotes += 1;
          comment.upvotes = Math.max(0, comment.upvotes - 1);
        }
      }
    } else {
      // New vote
      comment.voters.push({ userId, vote });
      if (vote === 1) {
        comment.upvotes += 1;
      } else {
        comment.downvotes += 1;
      }
    }
    
    // Update score
    comment.updateScore();
    
    await comment.save();
    return comment;
  } catch (error) {
    throw new Error("Failed to vote comment: " + error.message);
  }
};

/**
 * Get replies for a comment
 */
const getCommentReplies = async (commentId, options = {}) => {
  try {
    const { page = 1, limit = 20 } = options;
    
    const replies = await Comment.find({
      parentId: commentId,
      isDeleted: false,
    })
      .sort("createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    const total = await Comment.countDocuments({
      parentId: commentId,
    });
    
    return {
      replies,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error("Failed to fetch replies: " + error.message);
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

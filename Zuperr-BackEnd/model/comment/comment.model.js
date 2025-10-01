const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // Polymorphic reference - can be attached to any resource
    resourceType: {
      type: String,
      required: true,
      enum: ["Company", "Job", "Post", "Review"], // Extensible
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    // Threading support
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    depth: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Author
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    authorType: {
      type: String,
      required: true,
      enum: ["User", "Employer"],
    },
    // Content
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    // Voting (Reddit-style)
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0, // upvotes - downvotes
    },
    // Track who voted
    voters: [{
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      vote: { type: Number, enum: [1, -1], required: true } // 1 for upvote, -1 for downvote
    }],
    // Edit tracking
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // Moderation
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
commentSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1, createdAt: 1 });
commentSchema.index({ score: -1 }); // For sorting by popularity
commentSchema.index({ authorId: 1 });

// Method to update score
commentSchema.methods.updateScore = function() {
  this.score = this.upvotes - this.downvotes;
};

module.exports = mongoose.model("Comment", commentSchema);

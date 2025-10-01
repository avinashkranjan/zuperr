const mongoose = require("mongoose");

const companyReviewSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Employee who wrote the review
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    pros: {
      type: String,
      maxlength: 500,
    },
    cons: {
      type: String,
      maxlength: 500,
    },
    // Moderation
    isApproved: {
      type: Boolean,
      default: true,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagReason: {
      type: String,
    },
    // Helpful votes (simple counter for MVP)
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reviews from same user for same company
companyReviewSchema.index({ companyId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("CompanyReview", companyReviewSchema);

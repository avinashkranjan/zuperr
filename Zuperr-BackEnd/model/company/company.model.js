const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      index: true,
    },
    companyLogo: {
      type: String, // file URL / S3 path
    },
    companyWebsite: {
      type: String,
    },
    companySize: {
      type: String, // e.g. "1-10", "11-50", etc.
    },
    industries: {
      type: [String],
      default: [],
    },
    gstNumber: {
      type: String,
      default: "",
    },
    gstDocs: {
      type: String, // file URL for GST verification doc
    },
    panDocs: {
      type: String, // file URL for PAN verification doc
    },
    isGstVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      district: { type: String },
      state: { type: String },
      country: { type: String },
      line1: { type: String },
      landmark: { type: String },
      pincode: { type: String },
    },
    description: {
      type: String,
      maxlength: 500,
    },
    // Aggregated metrics from reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // Trust score aggregated from all employers
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    trustMetrics: {
      profileCompleteness: { type: Number, default: 0, min: 0, max: 10 },
      verifiedDocuments: { type: Number, default: 0, min: 0, max: 10 },
      responseTime: { type: Number, default: 0, min: 0, max: 10 },
      jobFulfillment: { type: Number, default: 0, min: 0, max: 10 },
    },
    trustBadge: {
      theme: {
        type: String,
        enum: ["gold", "silver", "bronze", "none"],
        default: "none",
      },
      rating: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
    },
    // Preferences at company level
    preferences: {
      aboutCompany: { type: String },
      industry: { type: String },
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isDeletedReason: {
      type: String,
      default: null,
    },
    // Integration hooks for analytics (placeholders for future)
    analyticsEnabled: {
      type: Boolean,
      default: false,
    },
    sponsoredTier: {
      type: String,
      enum: ["none", "basic", "premium"],
      default: "none",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

// Index for faster queries
companySchema.index({ companyName: 1 });
companySchema.index({ isDeleted: 1 });
companySchema.index({ averageRating: -1 });

module.exports = mongoose.model("Company", companySchema);

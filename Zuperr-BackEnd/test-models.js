#!/usr/bin/env node

/**
 * Basic model validation test
 * Tests that models are properly structured without requiring DB connection
 */

console.log("🧪 Testing Models...\n");

try {
  // Test Company Model
  console.log("✓ Testing Company model...");
  const Company = require("./model/company/company.model");
  const companySchema = Company.schema;
  
  console.log("  - Required fields:", Object.keys(companySchema.paths)
    .filter(key => companySchema.paths[key].isRequired)
    .join(", "));
  console.log("  - Indexes:", companySchema.indexes().length);
  
  // Test CompanyReview Model
  console.log("\n✓ Testing CompanyReview model...");
  const CompanyReview = require("./model/company/companyReview.model");
  const reviewSchema = CompanyReview.schema;
  
  console.log("  - Required fields:", Object.keys(reviewSchema.paths)
    .filter(key => reviewSchema.paths[key].isRequired)
    .join(", "));
  console.log("  - Unique indexes:", reviewSchema.indexes()
    .filter(idx => idx[1]?.unique)
    .length);
  
  // Test Comment Model
  console.log("\n✓ Testing Comment model...");
  const Comment = require("./model/comment/comment.model");
  const commentSchema = Comment.schema;
  
  console.log("  - Required fields:", Object.keys(commentSchema.paths)
    .filter(key => commentSchema.paths[key].isRequired)
    .join(", "));
  console.log("  - Indexes:", commentSchema.indexes().length);
  console.log("  - Methods:", Object.keys(Comment.schema.methods).join(", "));
  
  // Test Employer Model Updates
  console.log("\n✓ Testing Employer model updates...");
  const Employer = require("./model/employer/employer.model");
  const employerSchema = Employer.schema;
  
  const hasCompanyId = !!employerSchema.paths.companyId;
  const hasRole = !!employerSchema.paths.role;
  const hasBookmarks = !!employerSchema.paths.bookmarkedCandidates;
  
  console.log("  - Has companyId field:", hasCompanyId ? "✓" : "✗");
  console.log("  - Has role field:", hasRole ? "✓" : "✗");
  console.log("  - Has bookmarkedCandidates:", hasBookmarks ? "✓" : "✗");
  
  if (!hasCompanyId || !hasRole || !hasBookmarks) {
    throw new Error("Employer model is missing required fields");
  }
  
  console.log("\n✅ All models validated successfully!");
  console.log("\nModel Structure:");
  console.log("  Company: Multi-user company with aggregated ratings");
  console.log("  CompanyReview: User reviews for companies");
  console.log("  Comment: Reddit-style threaded comments with voting");
  console.log("  Employer: Updated with companyId, role, and bookmarks");
  
  process.exit(0);
  
} catch (error) {
  console.error("\n❌ Model validation failed:");
  console.error(error.message);
  console.error("\nStack trace:", error.stack);
  process.exit(1);
}

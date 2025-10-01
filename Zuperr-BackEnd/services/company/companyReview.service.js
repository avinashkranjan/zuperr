const CompanyReview = require("../../model/company/companyReview.model");
const Company = require("../../model/company/company.model");

/**
 * Create a new review
 */
const createReview = async (companyId, userId, reviewData) => {
  try {
    // Check if user already reviewed this company
    const existingReview = await CompanyReview.findOne({ companyId, userId });
    
    if (existingReview) {
      throw new Error("You have already reviewed this company");
    }
    
    // Create review
    const review = new CompanyReview({
      companyId,
      userId,
      ...reviewData,
    });
    
    await review.save();
    
    // Update company aggregate rating
    await updateCompanyRating(companyId);
    
    return review;
  } catch (error) {
    throw new Error("Failed to create review: " + error.message);
  }
};

/**
 * Get reviews for a company
 */
const getCompanyReviews = async (companyId, options = {}) => {
  try {
    const { page = 1, limit = 10, sortBy = "-createdAt" } = options;
    
    const reviews = await CompanyReview.find({ 
      companyId,
      isApproved: true,
      isFlagged: false 
    })
      .populate("userId", "firstname lastname profilePicture")
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    const total = await CompanyReview.countDocuments({ 
      companyId,
      isApproved: true,
      isFlagged: false 
    });
    
    return {
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new Error("Failed to fetch reviews: " + error.message);
  }
};

/**
 * Update company aggregate rating
 */
const updateCompanyRating = async (companyId) => {
  try {
    const reviews = await CompanyReview.find({ 
      companyId,
      isApproved: true 
    });
    
    if (reviews.length === 0) {
      await Company.findByIdAndUpdate(companyId, {
        averageRating: 0,
        totalReviews: 0,
      });
      return;
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Company.findByIdAndUpdate(companyId, {
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Failed to update company rating:", error);
  }
};

/**
 * Update review
 */
const updateReview = async (reviewId, userId, updateData) => {
  try {
    const review = await CompanyReview.findOne({ _id: reviewId, userId });
    
    if (!review) {
      throw new Error("Review not found or unauthorized");
    }
    
    // Update allowed fields
    const allowedFields = ["rating", "title", "content", "pros", "cons"];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        review[field] = updateData[field];
      }
    });
    
    await review.save();
    
    // Update company aggregate rating
    await updateCompanyRating(review.companyId);
    
    return review;
  } catch (error) {
    throw new Error("Failed to update review: " + error.message);
  }
};

/**
 * Delete review
 */
const deleteReview = async (reviewId, userId) => {
  try {
    const review = await CompanyReview.findOneAndDelete({ _id: reviewId, userId });
    
    if (!review) {
      throw new Error("Review not found or unauthorized");
    }
    
    // Update company aggregate rating
    await updateCompanyRating(review.companyId);
    
    return review;
  } catch (error) {
    throw new Error("Failed to delete review: " + error.message);
  }
};

/**
 * Vote review as helpful
 */
const voteReviewHelpful = async (reviewId) => {
  try {
    const review = await CompanyReview.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    
    if (!review) {
      throw new Error("Review not found");
    }
    
    return review;
  } catch (error) {
    throw new Error("Failed to vote review: " + error.message);
  }
};

module.exports = {
  createReview,
  getCompanyReviews,
  updateReview,
  deleteReview,
  voteReviewHelpful,
  updateCompanyRating,
};

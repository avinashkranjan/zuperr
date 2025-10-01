const companyReviewService = require("../../services/company/companyReview.service");

/**
 * POST /api/company/:id/reviews
 * Create a review for a company
 */
const createReview = async (req, res) => {
  try {
    const { id: companyId } = req.params;
    const userId = req.user.userId; // From auth middleware
    const reviewData = req.body;
    
    const review = await companyReviewService.createReview(
      companyId,
      userId,
      reviewData
    );
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.message.includes("already reviewed")) {
      res.status(409).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

/**
 * GET /api/company/:id/reviews
 * Get reviews for a company
 */
const getReviews = async (req, res) => {
  try {
    const { id: companyId } = req.params;
    const { page = 1, limit = 10, sortBy = "-createdAt" } = req.query;
    
    const result = await companyReviewService.getCompanyReviews(companyId, {
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
 * PUT /api/company/reviews/:reviewId
 * Update a review
 */
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;
    
    const review = await companyReviewService.updateReview(
      reviewId,
      userId,
      updateData
    );
    
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    if (error.message.includes("not found or unauthorized")) {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

/**
 * DELETE /api/company/reviews/:reviewId
 * Delete a review
 */
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    
    await companyReviewService.deleteReview(reviewId, userId);
    
    res.status(200).json({ 
      success: true, 
      message: "Review deleted successfully" 
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
 * POST /api/company/reviews/:reviewId/helpful
 * Vote review as helpful
 */
const voteHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await companyReviewService.voteReviewHelpful(reviewId);
    
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  voteHelpful,
};

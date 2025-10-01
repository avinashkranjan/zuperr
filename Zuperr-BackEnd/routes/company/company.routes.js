const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/auth");
const companyController = require("../../controller/company/company.controller");
const companyReviewController = require("../../controller/company/companyReview.controller");

// Company routes
router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);
router.put("/:id", authenticateToken, companyController.updateCompany);
router.delete("/:id", authenticateToken, companyController.deleteCompany);
router.get("/:id/employers", companyController.getCompanyEmployers);

// Company review routes
router.post("/:id/reviews", authenticateToken, companyReviewController.createReview);
router.get("/:id/reviews", companyReviewController.getReviews);
router.put("/reviews/:reviewId", authenticateToken, companyReviewController.updateReview);
router.delete("/reviews/:reviewId", authenticateToken, companyReviewController.deleteReview);
router.post("/reviews/:reviewId/helpful", companyReviewController.voteHelpful);

module.exports = router;

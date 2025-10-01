const companyService = require("../../services/company/company.service");
const companyReviewService = require("../../services/company/companyReview.service");

/**
 * GET /api/company
 * List all companies
 */
const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/company/:id
 * Get company details with reviews
 */
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await companyService.getCompanyById(id);
    
    // Get reviews summary
    const reviewsData = await companyReviewService.getCompanyReviews(id, {
      page: 1,
      limit: 5,
    });
    
    res.status(200).json({
      success: true,
      data: {
        ...company,
        recentReviews: reviewsData.reviews,
      },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/company/:id
 * Update company (admin only)
 */
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.userId; // From auth middleware
    const updateData = req.body;
    
    const company = await companyService.updateCompany(id, updateData, employerId);
    
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    if (error.message.includes("Unauthorized")) {
      res.status(403).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

/**
 * DELETE /api/company/:id
 * Delete company (admin only)
 */
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.userId;
    const { reason } = req.body;
    
    const company = await companyService.deleteCompany(id, employerId, reason);
    
    res.status(200).json({ 
      success: true, 
      message: "Company deleted successfully",
      data: company 
    });
  } catch (error) {
    if (error.message.includes("Unauthorized")) {
      res.status(403).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

/**
 * GET /api/company/:id/employers
 * Get company team members
 */
const getCompanyEmployers = async (req, res) => {
  try {
    const { id } = req.params;
    const employers = await companyService.getCompanyEmployers(id);
    
    res.status(200).json({ success: true, data: employers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompanyEmployers,
};

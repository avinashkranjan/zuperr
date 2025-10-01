const Company = require("../../model/company/company.model");
const Employer = require("../../model/employer/employer.model");

/**
 * Get all companies (with optional filters)
 */
const getAllCompanies = async (filters = {}) => {
  try {
    const query = { isDeleted: false, ...filters };
    const companies = await Company.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return companies;
  } catch (error) {
    throw new Error("Failed to fetch companies: " + error.message);
  }
};

/**
 * Get company by ID with aggregated data
 */
const getCompanyById = async (companyId) => {
  try {
    const company = await Company.findOne({ 
      _id: companyId, 
      isDeleted: false 
    }).lean();
    
    if (!company) {
      throw new Error("Company not found");
    }
    
    return company;
  } catch (error) {
    throw new Error("Failed to fetch company: " + error.message);
  }
};

/**
 * Get company team (employers)
 */
const getCompanyEmployers = async (companyId) => {
  try {
    const employers = await Employer.find({ 
      companyId: companyId,
      isDeletedPermanently: false 
    })
      .select("-password -otp")
      .lean();
    
    return employers;
  } catch (error) {
    throw new Error("Failed to fetch company team: " + error.message);
  }
};

/**
 * Update company (admin only)
 */
const updateCompany = async (companyId, updateData, employerId) => {
  try {
    // Check if employer has admin role
    const employer = await Employer.findOne({
      _id: employerId,
      companyId: companyId,
      role: "admin"
    });
    
    if (!employer) {
      throw new Error("Unauthorized: Only company admins can update company details");
    }
    
    // Prevent updating certain fields
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.averageRating;
    delete updateData.totalReviews;
    
    const company = await Company.findOneAndUpdate(
      { _id: companyId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!company) {
      throw new Error("Company not found");
    }
    
    return company;
  } catch (error) {
    throw new Error("Failed to update company: " + error.message);
  }
};

/**
 * Delete company (soft delete, admin only)
 */
const deleteCompany = async (companyId, employerId, reason) => {
  try {
    // Check if employer has admin role
    const employer = await Employer.findOne({
      _id: employerId,
      companyId: companyId,
      role: "admin"
    });
    
    if (!employer) {
      throw new Error("Unauthorized: Only company admins can delete company");
    }
    
    const company = await Company.findOneAndUpdate(
      { _id: companyId },
      { 
        $set: { 
          isDeleted: true,
          isDeletedReason: reason || "Deleted by admin"
        }
      },
      { new: true }
    );
    
    if (!company) {
      throw new Error("Company not found");
    }
    
    return company;
  } catch (error) {
    throw new Error("Failed to delete company: " + error.message);
  }
};

/**
 * Check if employer is admin of company
 */
const isCompanyAdmin = async (employerId, companyId) => {
  try {
    const employer = await Employer.findOne({
      _id: employerId,
      companyId: companyId,
      role: "admin"
    });
    return !!employer;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  getCompanyEmployers,
  updateCompany,
  deleteCompany,
  isCompanyAdmin,
};

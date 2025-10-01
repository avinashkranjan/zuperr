const mongoose = require("mongoose");
const Employer = require("../model/employer/employer.model");
const Company = require("../model/company/company.model");
require("dotenv").config();

/**
 * Idempotent migration to extract Company data from Employer model
 * and link employers to their companies via companyId.
 * 
 * Run with: node migrations/migrate-employer-to-company.js
 */

async function migrateEmployersToCompanies() {
  try {
    console.log("🚀 Starting migration: Employer → Company");
    
    // Connect to database
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI or MONGODB_URI not found in environment variables");
    }
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to database");
    
    // Get all employers
    const employers = await Employer.find({});
    console.log(`📊 Found ${employers.length} employers to process`);
    
    let companiesCreated = 0;
    let employersUpdated = 0;
    let skipped = 0;
    
    // Group employers by company name
    const companyGroups = {};
    
    for (const employer of employers) {
      // Skip if already migrated (has companyId)
      if (employer.companyId) {
        skipped++;
        continue;
      }
      
      const companyKey = employer.companyName || `${employer.firstname}_${employer.lastname}_company`;
      
      if (!companyGroups[companyKey]) {
        companyGroups[companyKey] = [];
      }
      
      companyGroups[companyKey].push(employer);
    }
    
    console.log(`📦 Grouped into ${Object.keys(companyGroups).length} companies`);
    
    // Process each company group
    for (const [companyKey, employerGroup] of Object.entries(companyGroups)) {
      // Use the first employer's data to create the company
      const firstEmployer = employerGroup[0];
      
      // Check if company already exists with this name
      let company = await Company.findOne({ 
        companyName: firstEmployer.companyName || companyKey 
      });
      
      if (!company) {
        // Create new company
        company = new Company({
          companyName: firstEmployer.companyName || companyKey,
          companyLogo: firstEmployer.companyLogo,
          companyWebsite: firstEmployer.companyWebsite,
          companySize: firstEmployer.companySize,
          industries: firstEmployer.industries || [],
          gstNumber: firstEmployer.gstNumber,
          gstDocs: firstEmployer.gstDocs,
          panDocs: firstEmployer.panDocs,
          isGstVerified: firstEmployer.isGstVerified || false,
          address: firstEmployer.address || {},
          description: firstEmployer.preferences?.aboutCompany || firstEmployer.description,
          trustScore: firstEmployer.trustScore || 0,
          trustMetrics: firstEmployer.trustMetrics || {},
          trustBadge: firstEmployer.trustBadge || {},
          preferences: {
            aboutCompany: firstEmployer.preferences?.aboutCompany,
            industry: firstEmployer.preferences?.industry,
          },
        });
        
        await company.save();
        companiesCreated++;
        console.log(`  ✨ Created company: ${company.companyName}`);
      }
      
      // Link all employers in this group to the company
      for (let i = 0; i < employerGroup.length; i++) {
        const employer = employerGroup[i];
        
        // First employer becomes admin, others are members
        const role = i === 0 ? "admin" : "member";
        
        employer.companyId = company._id;
        employer.role = role;
        
        await employer.save();
        employersUpdated++;
        
        console.log(`    👤 Linked employer ${employer.email} as ${role}`);
      }
    }
    
    console.log("\n✅ Migration completed successfully!");
    console.log(`   Companies created: ${companiesCreated}`);
    console.log(`   Employers updated: ${employersUpdated}`);
    console.log(`   Employers skipped (already migrated): ${skipped}`);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateEmployersToCompanies()
    .then(() => {
      console.log("🎉 Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration script failed:", error);
      process.exit(1);
    });
}

module.exports = { migrateEmployersToCompanies };

const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  getAllEmployers,
  signUp,
  signIn,
  getSingleEmployer,
  verifyOtp,
  updateEmployer,
  googleAuthCallback,
  getJobsWithApplicants,
  updateApplicantsStatus,
  getUniqueSkills,
  resendOtpCode,
  getPacificUser,
  getAllSkillsFromMaster,
  downloadCV,
  uploadCompanyLogo,
  validateUserForUpdateEmployerEmail,
  verifyOtpForEmployerEmailUpdate,
  validateUserForEmployerPasswordUpdate,
  updateEmployerPassword,
  deactivateEmployerAccount,
  deleteEmployerAccountPermanently,
} = require("../../controller/employer/employer.controller");
const jobPostController = require("../../controller/jobs/jobs.controller");
const {
  authenticateToken,
  validateUserId,
  uploadImage,
} = require("../../middleware/auth");
const {
  googleSignInCallback,
  googleSignUpCallback,
} = require("../../controller/googleauth/googleAuth.controller");
const {
  validateGSTController,
} = require("../../controller/employer/gst.controller");

// Route to initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    //scope: ['profile', 'email']
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
    ],
  })
);

// Google OAuth callback route
// router.get('/google/callback',
//     // First middleware: Passport authentication
//     passport.authenticate('google', {
//         failureRedirect: '/signin',
//         session: true,
//         failureMessage: true
//     }),
//     // Second middleware: Our callback handler
//     googleAuthCallback
// );

router.get("/", getAllEmployers);
router.patch("/:id", updateEmployer);
router.get("/skills/get-all-skill", jobPostController.getAllSkills);
router.get("/:userId", getSingleEmployer);
router.post("/download-cv/:userId", validateUserId, downloadCV);

router.post("/google/signup", googleSignUpCallback);
router.post("/google/callback", googleSignInCallback);

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/verifyotp", authenticateToken, verifyOtp);

router.post("/create-jobs", jobPostController.createJobPost);
router.get("/get-jobs/:id", jobPostController.getJobPosts);
router.get("/get-jobs/deleted/:id", jobPostController.getAllDeletedJobs);
router.get("/get-jobs/active", jobPostController.getAllActiveJobs);
router.get("/get-job/:id", jobPostController.getJobPostById);
router.put("/update-jobs/:id", jobPostController.updateJobPost);
router.patch("/patch-jobs/:id", jobPostController.patchJobPost);
router.delete("/delete-jobs/:id", jobPostController.deleteJobPost);

router.post("/add-skill", jobPostController.addSkill);

// Get all jobs with applicants
router.get("/jobs/get-jobs-with-applicants/:userId", getJobsWithApplicants);

router.post(
  "/upload-logo/:userId",
  uploadImage.single("logo"),
  uploadCompanyLogo
);
router.put(
  "/jobs/:jobId/applicants/:applicantId/status",
  updateApplicantsStatus
);

router.get("/jobs/unique-skills", getUniqueSkills);
router.post("/resendOtp", resendOtpCode);
router.post(
  "/llm/generate-job-description",
  authenticateToken,
  jobPostController.generateJobDescription
);

router.post("/getpacificuser", authenticateToken, getPacificUser);
router.get(
  "/getAllSkillsFromMaster",
  authenticateToken,
  getAllSkillsFromMaster
);

router.post("/validate-gst", validateGSTController);

router.post(
  "/validateuserforupdateemployeremail",
  authenticateToken,
  validateUserForUpdateEmployerEmail
);
router.post(
  "/verifyotpforupdateemployeremail",
  authenticateToken,
  verifyOtpForEmployerEmailUpdate
);
router.post(
  "/validateuserforemployerpasswordupdate",
  authenticateToken,
  validateUserForEmployerPasswordUpdate
);
router.post(
  "/updateemployerpassword",
  authenticateToken,
  updateEmployerPassword
);
router.post(
  "/deactivateemployeraccount",
  authenticateToken,
  deactivateEmployerAccount
);
router.post(
  "/deleteemployeraccountpermanently",
  authenticateToken,
  deleteEmployerAccountPermanently
);

module.exports = router;

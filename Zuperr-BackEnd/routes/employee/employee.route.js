const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  verifyOtp,
  parseResume,
  getCandidateData,
  getLandingPageData,
  searchJobsController,
  applyForJob,
  getDashboardStats,
  jobApplicationStatus,
  incrementJobViewCount,
  uploadCV,
  updateCandidateDataResume,
  uploadProfilePic,
  uploadMediaCertification,
  analyzeCandidate,
  incrementJobViewCountAll,
  validateUserForUpdateCandidateEmail,
  verifyOtpForCandidateEmailUpdate,
  validateUserForCandidateProfileUpdate,
  updateCandidatePassword,
  deactivateCandidateAccount,
  deleteCandidateAccountPermanently,
  updateJobPreference,
  saveUserJob,
  getUserSavedJobs,
  getUserAppliedJobs,
  updateCandidateProfileVisibility
} = require("../../controller/employee/employee.controller");
const {
  resendOtpCode,
} = require("../../controller/employee/employee.controller");
const {
  updateCandidateData,
} = require("../../controller/employee/employee.controller");
const passport = require("passport");
const {
  authenticateToken,
  upload,
  uploadImage,
  uploadCertification,
} = require("../../middleware/auth");
const {
  saveUserExperienceLevel,
} = require("../../controller/employee/employee.controller");
const {
  googleSignUpCallback,
  googleSignInCallback,
} = require("../../controller/googleauth/googleAuth.controller");

// Route to initiate Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
    ],
  })
);

// Google OAuth callback route
// router.post('/google/callback',
//     // First middleware: Passport authentication
//     passport.authenticate('google', {
//         failureRedirect: '/signin',
//         session: true,
//         failureMessage: true
//     }),
//     // Second middleware: Our callback handler
//     googleAuthCallback
// );

router.post("/google/signup", googleSignUpCallback);
router.post("/google/callback", googleSignInCallback);

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/verifyotp", authenticateToken, verifyOtp);
router.post("/updatecandidatedata", authenticateToken, updateCandidateData);
router.post(
  "/updatecandidatedata/resume",
  authenticateToken,
  updateCandidateDataResume
);
router.get("/getcandidatedata", authenticateToken, getCandidateData);
router.get("/landing", authenticateToken, getLandingPageData);
router.post("/jobs/search", searchJobsController);
router.post("/saveuserexperiencelevel", saveUserExperienceLevel);
router.post("/jobs/applyforJobs", applyForJob);
router.get(
  "/getcandidateactivity/:selectedDays",
  authenticateToken,
  getDashboardStats
);
router.post("/resendOtp", authenticateToken, resendOtpCode);
router.post("/jobapplicationstatus", authenticateToken, jobApplicationStatus);
router.post("/jobviewed", incrementJobViewCount);
router.post("/jobviewed/all", incrementJobViewCountAll);
// router.post("/resume/upload/:userId", upload.single("resume"), parseResume);

router.post("/upload-cv/:userId", upload.single("cv"), uploadCV);
router.post(
  "/upload-profile/:userId",
  uploadImage.single("profile"),
  uploadProfilePic
);
router.post(
  "/upload-certification/:userId",
  uploadCertification.single("certificate"),
  uploadMediaCertification
);
router.post("/analyze-candidate", analyzeCandidate);

router.post("/validateuserforupdatecandidateemail", authenticateToken, validateUserForUpdateCandidateEmail);
router.post("/verifyotpforemailupdate", authenticateToken, verifyOtpForCandidateEmailUpdate);
router.post("/validateuserforcandidateprofileupdate", authenticateToken, validateUserForCandidateProfileUpdate);
router.post("/updatecandidatepassword", authenticateToken, updateCandidatePassword);
router.post("/deactivatecandidateaccount", authenticateToken, deactivateCandidateAccount);
router.post("/deletecandidateaccountpermanently", authenticateToken, deleteCandidateAccountPermanently);
router.post("/updatejobpreference", authenticateToken, updateJobPreference);
router.post("/savejob", authenticateToken, saveUserJob);
router.post("/getusersavedjobs", authenticateToken, getUserSavedJobs);
router.post("/getuserappliedjobs", authenticateToken, getUserAppliedJobs);
router.post("/updatecandidateprofilevisibility", authenticateToken, updateCandidateProfileVisibility);

module.exports = router;

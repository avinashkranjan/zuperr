const express = require('express');
const router = express.Router();
const { getDashboardJobsData, getDashboardJobsTitle, getTotalJobs, getJobsByCategory, getJobApplicants, getApplicantStatus, getApplicationsTrend, getTopSkills, getTotalApplicantTrend, getApplicationStatusBreakdown, getUniqueJobtitles } = require('../../controller/dashboard/employer.dashboard');

router.get('/', getDashboardJobsData);
router.get('/getJobsTitle', getDashboardJobsTitle);
router.get("/total-jobs/:userId", getTotalJobs);

router.get("/jobs-by-category/:userId", getJobsByCategory);

router.get("/job-applicants/:userId", getJobApplicants);
router.get("/applicant-status/:userId", getApplicantStatus)
router.get("/top-skills/:userId", getTopSkills);
router.get("/applications-trend/:userId", getApplicationsTrend);

router.get("/application-status-breakdown/:userId", getApplicationStatusBreakdown)

router.get("/total-applicant-trend/:userId", getTotalApplicantTrend)
router.get("/getUniqueJobtitles/:userId", getUniqueJobtitles)


module.exports = router;
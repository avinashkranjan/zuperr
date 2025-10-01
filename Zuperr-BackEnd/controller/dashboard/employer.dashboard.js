const { default: mongoose } = require("mongoose");
const Job = require("../../model/job/job");

// 🟢 Get Dashboard Jobs Data
const getDashboardJobsData = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { period, jobTitle } = req.query;
        let dateFilter = {};

        if (period) {
            const now = new Date();
            switch (period) {
                case 'last_7_days':
                    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
                    break;
                case 'last_30_days':
                    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 30)) } };
                    break;
                case 'last_90_days':
                    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 90)) } };
                    break;
            }
        }

        // Include the createdBy filter along with other conditions
        let jobFilter = {
            ...dateFilter,
            isDeleted: false,
            isActive: true,
            createdBy: new mongoose.Types.ObjectId(userId)
        };

        if (jobTitle) {
            jobFilter.title = new RegExp(jobTitle, 'i');
        }

        // Fetch jobs with applicants expanded
        const jobs = await Job.find(jobFilter)
            .populate("applicants.id")
            .lean();

        let totalJobViews = jobs.length;
        let totalApplicants = 0;
        let statusCounts = {};

        jobs.forEach(job => {
            if (Array.isArray(job.applicants)) {
                totalApplicants += job.applicants.length;
                statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
            }
        });

        res.json({
            jobViews: totalJobViews,
            totalApplicants,
            statusCounts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 🟢 Get Dashboard Jobs Title
const getDashboardJobsTitle = async (req, res) => {
    try {
        console.log(req.params.userId, "userId")
        const userId = req.params.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // Only return titles from jobs created by the current user
        const allJobsTitle = await Job.distinct("title", { createdBy: new mongoose.Types.ObjectId(userId), isDeleted: false, isActive: true });
        res.json({ allJobsTitle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * 🟢 Get Total Job Count
 */
const getTotalJobs = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const totalJobs = await Job.countDocuments({ createdBy: new mongoose.Types.ObjectId(userId), isDeleted: false, isActive: true });
        res.json({ totalJobs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * 🟢 Get Job Count by Category
 */
const getJobsByCategory = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const jobCategories = await Job.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId), isDeleted: false, isActive: true } },
            { $group: { _id: "$jobCategory", count: { $sum: 1 } } }
        ]);
        res.json(jobCategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * 🟢 Get Applicants Count for Each Job
 */
const getJobApplicants = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const jobApplicants = await Job.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId), isDeleted: false, isActive: true } },
            {
                $project: {
                    title: 1,
                    applicantsCount: { $size: { $ifNull: ["$applicants", []] } }
                }
            }
        ]);
        res.json(jobApplicants);
    } catch (error) {
        console.error("Error fetching job applicants:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * 🟢 Get Applicant Status Distribution
 */
const getApplicantStatus = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const applicantStatus = await Job.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId), isDeleted: false, isActive: true } },
            { $unwind: "$applicants" },
            { $group: { _id: "$applicants.status", count: { $sum: 1 } } }
        ]);
        res.json(applicantStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**
 * 🟢 Get Applications Trend Over Time
 */
const getApplicationsTrend = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const applicationsTrend = await Job.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId), isDeleted: false, isActive: true } },
            { $unwind: "$applicants" },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$applicants.appliedDate" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(applicationsTrend);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// GET /dashboard/application-status-breakdown/:userId
const getApplicationStatusBreakdown = async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate, jobTitle } = req.query;

    const matchConditions = {
        createdBy: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        isActive: true,
    };

    if (jobTitle && jobTitle !== 'all') {
        matchConditions.title = { $regex: jobTitle, $options: 'i' };
    }

    let applicantDateFilter = {};
    if (startDate) {
        const start = new Date(startDate + 'T00:00:00Z'); // Start of day in UTC
        let end;
        if (endDate) {
            end = new Date(endDate + 'T00:00:00Z');
            end.setUTCDate(end.getUTCDate() + 1); // Start of next day in UTC
        } else {
            end = new Date(start);
            end.setUTCDate(end.getUTCDate() + 1); // Next day from start
        }
        applicantDateFilter = {
            "applicants.appliedDate": { $gte: start, $lt: end },
        };
    }

    try {
        const data = await Job.aggregate([
            { $match: matchConditions },
            { $unwind: "$applicants" },
            { $match: { "applicants.appliedDate": { $exists: true } } },
            ...(Object.keys(applicantDateFilter).length > 0 ? [{ $match: applicantDateFilter }] : []),
            {
                $group: {
                    _id: "$applicants.status",
                    count: { $sum: 1 },
                },
            },
            { $project: { _id: 1, count: 1 } },
        ]);

        res.json(data);
    } catch (error) {
        console.error("Error in application-status-breakdown:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// --------------------------
// GET /dashboard/total-applicant-trend/:userId
// --------------------------
const getTotalApplicantTrend = async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate, jobTitle } = req.query;

    const matchConditions = {
        createdBy: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        isActive: true,
    };

    if (jobTitle && jobTitle !== 'all') {
        matchConditions.title = { $regex: jobTitle, $options: 'i' };
    }

    let applicantDateFilter = {};
    if (startDate) {
        const start = new Date(startDate + 'T00:00:00Z'); // Start of day in UTC
        let end;
        if (endDate) {
            end = new Date(endDate + 'T00:00:00Z');
            end.setUTCDate(end.getUTCDate() + 1); // Start of next day in UTC
        } else {
            end = new Date(start);
            end.setUTCDate(end.getUTCDate() + 1); // Next day from start
        }
        applicantDateFilter = {
            "applicants.appliedDate": { $gte: start, $lt: end },
        };
    }

    try {
        const aggregatedData = await Job.aggregate([
            { $match: matchConditions },
            { $unwind: "$applicants" },
            { $match: { "applicants.appliedDate": { $exists: true } } },
            ...(Object.keys(applicantDateFilter).length > 0 ? [{ $match: applicantDateFilter }] : []),
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$applicants.appliedDate" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json(aggregatedData);
    } catch (error) {
        console.error("Error in total-applicant-trend:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// --------------------------
// GET /dashboard/top-skills/:userId
// --------------------------
const getTopSkills = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const topSkills = await Job.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                    isDeleted: false,
                    isActive: true,
                },
            },
            { $unwind: "$skills" },
            {
                $group: {
                    _id: "$skills", // Group by the ObjectId of the skill
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "skills", // Ensure this matches your Skill collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "skillInfo",
                },
            },
            { $unwind: "$skillInfo" },
            { $project: { _id: "$skillInfo.Name", count: 1, } },
        ]);

        res.json(topSkills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



const getUniqueJobtitles = async (req, res) => {
    try {
        const userId = req.params.userId;
      
        // Get unique skills from active & non-deleted jobs
        const jobTitle = await Job.distinct('title', { isDeleted: false, isActive: true, createdBy: new mongoose.Types.ObjectId(userId) });
        console.log('jobTitle', jobTitle)
        res.status(200).json({ jobTitle });
    } catch (error) {
        console.error('Error fetching jobTitle:', error);
        res.status(500).json({ error: 'Failed to fetch unique jobTitle' });
    }
};



module.exports = {
    getDashboardJobsData,
    getUniqueJobtitles,
    getDashboardJobsTitle,
    getJobApplicants,
    getApplicationsTrend,
    getTopSkills,
    getApplicantStatus,
    getJobsByCategory,
    getTotalJobs,
    getTotalApplicantTrend,
    getApplicationStatusBreakdown
};

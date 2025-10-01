const { default: mongoose } = require("mongoose");
const JobPost = require("../../model/job/job");
const skill = require("../../model/skill/skill");
const {
  generateJobDescriptionLlm,
} = require("../../services/employer/llmJdService");
const { evaluateJobPost } = require("../../services/job-status");
const Employer = require("../../model/employer/employer.model");

// Create a job post
exports.createJobPost = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: new mongoose.Types.ObjectId(req.body.createdBy),
    };

    const employer = await Employer.findById(req.body.createdBy);
    if (!employer) {
      return res.status(400).json({ error: "Employer not found" });
    }

    const evaluationResult = evaluateJobPost(jobData, employer);

    const jobPost = await JobPost.create({
      ...jobData,
      status: evaluationResult.status,
      jobStatusReason: evaluationResult.reason || "",
    });

    if (evaluationResult.status === JOB_STATUS.REJECTED) {
      return res.status(200).json({
        status: "rejected",
        message: "Job post was automatically rejected",
        reason: evaluationResult.reason,
        jobId: jobPost._id,
      });
    } else if (evaluationResult.status === JOB_STATUS.PENDING) {
      return res.status(200).json({
        status: "pending",
        message: "Job post requires manual review",
        reason: evaluationResult.reason,
        jobId: jobPost._id,
      });
    } else {
      return res.status(201).json({
        status: "approved",
        message: "Job post was automatically approved",
        jobId: jobPost._id,
        job: jobPost,
      });
    }
  } catch (error) {
    console.error("Error creating job post:", error);
    res.status(400).json({
      error: error.message,
      details: error.errors,
    });
  }
};

// Get all job posts (isActive = true, isDeleted = false)
exports.getJobPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const jobPosts = await JobPost.find({
      isActive: true,
      isDeleted: false,
      createdBy: new mongoose.Types.ObjectId(userId),
    }).populate("skills");
    res.status(200).json(jobPosts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all active job posts
exports.getAllActiveJobs = async (req, res) => {
  try {
    const activeJobs = await JobPost.find({ isActive: true, isDeleted: false });
    res.status(200).json(activeJobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all active job posts
exports.generateJobDescription = async (req, res) => {
  try {
    const {
      title,
      jobCategory,
      jobType,
      workMode,
      location,
      minimumExperienceInYears,
      maximumExperienceInYears,
      salaryRange,
      skills,
      education,
      industry,
      degree,
    } = req.body;

    const response = await generateJobDescriptionLlm({
      title,
      jobCategory,
      jobType,
      workMode,
      location,
      minimumExperienceInYears,
      maximumExperienceInYears,
      salaryRange,
      skills,
      education,
      industry,
      degree,
    });

    res.status(200).json({
      message: "Job description generated successfully",
      jobDescription: response,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all deleted job posts
exports.getAllDeletedJobs = async (req, res) => {
  try {
    const deletedJobs = await JobPost.find({
      createdBy: req.params.id,
      isDeleted: true,
    });
    res.status(200).json(deletedJobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single job post by ID (isActive = true, isDeleted = false)
exports.getJobPostById = async (req, res) => {
  try {
    const jobPost = await JobPost.findOne({
      _id: req.params.id,
      isActive: true,
      isDeleted: false,
    }).populate("skills");
    if (!jobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }
    res.status(200).json(jobPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a job post
exports.updateJobPost = async (req, res) => {
  try {
    const updatedJobPost = await JobPost.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!updatedJobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }
    res.status(200).json(updatedJobPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.patchJobPost = async (req, res) => {
  try {
    const updatedJobPost = await JobPost.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedJobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }

    res.status(200).json(updatedJobPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a job post (Soft delete: set isDeleted = true and isActive = false)
exports.deleteJobPost = async (req, res) => {
  try {
    const deletedJobPost = await JobPost.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, isActive: false },
      { new: true }
    );
    if (!deletedJobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }
    res.status(200).json({
      message: "Job post deleted successfully",
      jobPost: deletedJobPost,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addSkill = async (req, res) => {
  try {
    // const jobPost = new JobPost(req.body);
    // console.log('job',jobPost)
    // const savedJobPost = await jobPost.save();
    // res.status(201).json(savedJobPost);

    const job = await skill.create({
      ...req.body,
    });
    res.status(201).send("success");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    // const skills = await skill.distinct('Name');
    // const skills = await skill.find({}, { _id: 1, Name: 1 });
    const skills = await skill.aggregate([
      {
        $group: {
          _id: "$Name", // Group by Name (unique)
          objectId: { $first: "$_id" }, // Get the first _id for each unique Name
        },
      },
      {
        $project: {
          Name: "$_id",
          _id: "$objectId",
        },
      },
    ]);
    res.status(200).json({ skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch unique skills" });
  }
};

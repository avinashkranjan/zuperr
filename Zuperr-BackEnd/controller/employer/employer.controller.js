const { default: mongoose } = require("mongoose");
const User = require("../../model/employee/employee");
const Employer = require("../../model/employer/employer.model");
const Job = require("../../model/job/job");
const {
  getAllEmployersService,
  saveUserInDb,
  checkUserInDb,
  validateOtp,
  getSingleEmployerService,
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getPacificUserService,
  validatePasswordForUpdateEmployerEmailService,
  validateOtpForEmployerEmailUpdate,
} = require("../../services/employer/employer.services");
const { resendOtp } = require("../../services/employee/employee.service");
const skill = require("../../model/skill/skill");
const s3 = require("../../config/spaces.config");
const { uploadS3 } = require("../../config/spaces.config");
const notificationService = require("../../services/employer/notification.services");
const Notification = require("../../model/employer/notification.model");

require("dotenv").config();

const getAllEmployers = async (req, res) => {
  try {
    const employers = await getAllEmployersService();
    res.status(200).json({ success: true, data: employers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmployer = async (req, res) => {
  try {
    const updatedEmployer = await Employer.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedEmployer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    res.status(200).json(updatedEmployer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSingleEmployer = async (req, res) => {
  try {
    const userId = req.params.userId;
    const employers = await getSingleEmployerService(userId);
    res.status(200).json({ success: true, data: employers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const signUp = async (req, res) => {
  try {
    const user = req.body;
    const result = await saveUserInDb(
      user,
      req.body.email,
      req.body.mobilenumber
    );
    if (typeof result === "string") {
      return res.status(400).json({ message: result });
    }
    const { savedUserObject, token, otp } = result;
    if (token != null && savedUserObject != null && otp != 0) {
      return res.status(201).json({
        SignupUser: savedUserObject,
        message: "OTP sent to provided email",
        OTP: otp,
        SignupToken: token,
      });
    } else {
      return res.status(400).json({ errormessage: "User Already Exists" });
    }
  } catch (error) {
    return res.status(400).json({ errormessaged: error.message });
  }
};

const googleAuthCallback = async (req, res) => {
  try {
    const profile = req.user;
    console.log(profile, "profile");
    if (!profile) {
      return res.redirect("http://localhost:9000/signin?error=no_profile");
    }
    const token = profile.token;
    const userID = profile.user._id || profile.user.userID;
    const userExperienceLevel = profile.userExperienceLevel || "";

    const redirectUrl = `http://localhost:9000/signin?token=${encodeURIComponent(
      token
    )}&userID=${encodeURIComponent(
      userID
    )}&userExperienceLevel=${encodeURIComponent(userExperienceLevel)} `;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in Google auth callback:", error);
    return res.redirect("http://localhost:9000/signin?error=server_error");
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await checkUserInDb(email, password);
    if (typeof result === "string") {
      return res.status(401).json({ message: result });
    }
    const { otp, newToken, id } = result;
    return res.status(200).json({
      message: "Sign In successful",
      signInToken: newToken,
      userID: id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occured while signing in ", error });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    const token = req.user.token;
    const result = await validateOtp(otp, token);
    if (typeof result === "string") {
      return res.status(400).json({
        message: result,
      });
    }
    const { userSavedObject, newToken } = result;

    return res.status(201).json({
      message: "OTP verified successfully",
      UserSaved: userSavedObject,
      OtpVerifiedToken: newToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getJobsWithApplicants = async (req, res) => {
  try {
    const userId = req.params?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await Job.find({
      createdBy: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
      isActive: true,
      applicants: { $exists: true, $ne: null },
      "applicants.0": { $exists: true },
    })
      .populate({ path: "applicants.id", model: "User" })
      .populate({
        path: "applicants.id.keySkills",
        model: "Skill",
        select: "Name",
      });

    const finalJobs = await User.populate(jobs, {
      path: "applicants.id.keySkills",
      model: "Skill",
    });

    // Notification logic
    for (const job of finalJobs) {
      const jobId = job._id;
      const applicants = job.applicants || [];

      for (const applicant of applicants) {
        const receiverId = applicant?.id?._id?.toString();
        if (!receiverId) continue;

        // Check if notification already exists
        const existing = await Notification.findOne({
          sender: userId,
          receivers: [receiverId],
          link: `analytics?tab=activity&activityTab=job-application-status&selected=${jobId}`,
          message: `Your profile was recently viewed for the position of ${job.title}.`,
        });

        if (!existing) {
          await notificationService.createNotification({
            sender: userId,
            receivers: [receiverId],
            message: `Your profile was recently viewed for the position of ${job.title}.`,
            link: `analytics?tab=activity&activityTab=job-application-status&selected=${jobId}`,
          });

          const io = req.app.get("io");
          io.to(receiverId).emit("receive-notification", {
            sender: userId,
            message: `Your profile was recently viewed for the position of ${job.title}.`,
            link: `analytics?tab=activity&activityTab=job-application-status&selected=${jobId}`,
          });
        }
      }
    }

    res.status(200).json(finalJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateApplicantsStatus = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;
    const { status, userId } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const job = await Job.findOne({
      _id: new mongoose.Types.ObjectId(jobId),
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    const applicant = job.applicants.find(
      (i) => i._id.toString() === applicantId
    );
    if (!applicant)
      return res.status(404).json({ message: "Applicant not found" });

    applicant.status = status;
    await job.save();

    const receiverId = applicant.id;
    const senderId = userId;
    const message = `Your application is now marked as "${status}" for ${job.title}. Please check for more details."`;
    const link = `/analytics?tab=activity&activityTab=job-application-status&selected=${jobId}`;

    const existing = await Notification.findOne({
      sender: senderId,
      receivers: [receiverId],
      message,
      link,
    });

    if (!existing) {
      await Notification.create({
        sender: senderId,
        receivers: [receiverId],
        message,
        link,
      });

      const io = req.app.get("io");
      io.to(receiverId).emit("receive-notification", {
        sender: senderId,
        receivers: [receiverId],
        message,
        link,
      });
    }

    res.status(200).json({
      message: "Applicant status updated successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUniqueSkills = async (req, res) => {
  try {
    const jobs = await Job.find({ isDeleted: false, isActive: true }).populate(
      "skills"
    );

    const allSkills = jobs.flatMap((job) => job.skills);

    const uniqueSkillsMap = new Map();
    allSkills.forEach((skill) => {
      if (skill && !uniqueSkillsMap.has(skill._id.toString())) {
        uniqueSkillsMap.set(skill._id.toString(), skill);
      }
    });

    const uniqueSkills = Array.from(uniqueSkillsMap.values());

    res.status(200).json({ skills: uniqueSkills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch unique skills" });
  }
};

const getJobsByEmployerId = async (req, res) => {
  try {
    const userId = req.body.userId;
    const jobs = await Job.find({
      createdBy: new mongoose.Types.ObjectId(userId),
    });
    console.log(jobs, "jobs");
    const jobOptions = jobs.map((job) => ({ id: job._id, title: job.title }));
    res.status(200).json(jobOptions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resendOtpCode = async (req, res) => {
  try {
    const { email } = req.body;
    const message = await resendOtp(email);
    if (typeof message != "string") {
      const { token, otp } = message;
      if (token != null && otp != 0) {
        return res.status(200).json({
          message: "OTP Resent to provided email",
          OTP: otp,
          SignupToken: token,
        });
      }
    } else {
      return res.status(400).json({
        message: "There was an error while Resending OTP ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getcandidatesData = async (req, res) => {
  try {
    const jobId = req.query.jobId;
    const jobs = await Job.find({ _id: jobId, isActive: true }).populate(
      "applicants.id"
    );
    console.log(jobs);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPacificUser = async (req, res) => {
  try {
    const searchCriteria = req.body;
    const results = await getPacificUserService(searchCriteria);
    console.log(results);
    return res.status(200).json({ results });
  } catch (error) {
    console.error("Error getting pacific users:", error);
    return res.status(500).json({ error: "Failed to get pacific users" });
  }
};

const getAllSkillsFromMaster = async (req, res) => {
  try {
    const results = await skill.aggregate([
      { $project: { label: "$Name", value: "$Name", _id: 0 } },
    ]);
    console.log(results);
    return res.status(200).json({ results });
  } catch (error) {
    console.error("Error getting All Skills From Master:", error);
    return res
      .status(500)
      .json({ error: "Failed to get All Skills From Master" });
  }
};

// Download user's CV
const downloadCV = async (req, res) => {
  try {
    const { userId } = req.params;

    const userInDb = await User.findById(userId);

    // Basic validation
    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
        message: "Please provide a valid user ID",
      });
    }

    //const fileName = 'SagarBaleCV.pdf';
    const fileName = userInDb.resume;

    console.log(`Attempting to download CV for user: ${userId}`);

    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
    };

    // Download the entire file to memory
    const data = await s3.getObject(params).promise();

    console.log(`File downloaded to buffer. Size: ${data.Body.length} bytes`);

    // Set headers and send file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${userInDb?.firstname}_${userInDb.lastname}_cv.pdf"`
    );
    res.setHeader("Content-Length", data.Body.length);
    res.setHeader("Cache-Control", "no-cache");

    res.send(data.Body);

    console.log(`CV download completed for user: ${userId}`);
  } catch (error) {
    console.error("Download error:", error);

    // Handle specific AWS errors
    if (error.code === "NoSuchKey" || error.code === "NotFound") {
      return res.status(404).json({
        error: "CV not found",
        message: `No CV found for user ID: ${userId}`,
      });
    }

    if (error.code === "AccessDenied") {
      return res.status(403).json({
        error: "Access denied",
        message: "Unable to access the requested file",
      });
    }

    // Generic server error
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to download CV. Please try again later.",
    });
  }
};

const uploadCompanyLogo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await Employer.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let fileKey;
    if (!user.companyLogo) {
      fileKey = `employers/${user?.firstname}_${user.lastname}_${
        user._id
      }/CompanyLogo/${Date.now()}_${file.originalname}`;
    } else {
      fileKey = user.companyLogo;
    }

    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileKey,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    await uploadS3.upload(params).promise();

    if (!user.companyLogo) {
      user.companyLogo = fileKey;
      await user.save({ validateBeforeSave: false });
    }

    const logoUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${fileKey}`;

    return res.status(200).json({
      message: "Company Logo uploaded successfully",
      url: logoUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const validateUserForUpdateEmployerEmail = async (req, res) => {
  try {
    const oldEmail = req.body.oldEmail;
    const newEmail = req.body.newEmail;
    const password = req.body.password;
    if (oldEmail == newEmail) {
      return res.status(400).json({ message: "New and Old email are same" });
    }
    const result = await validatePasswordForUpdateEmployerEmailService(
      oldEmail,
      newEmail,
      password
    );
    if (typeof result == "string") {
      return res.status(400).json({ message: result });
    }
    const { token, otp } = result;
    if (token != null && otp != null) {
      return res
        .status(200)
        .json({ EmailUpdateOtp: otp, EmailUpdatetoken: token });
    }
  } catch (error) {
    console.error("validateUserForUpdateEmployerEmail:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const verifyOtpForEmployerEmailUpdate = async (req, res) => {
  try {
    const otp = req.body.otp;
    const token = req.user.token;
    const result = await validateOtpForEmployerEmailUpdate(otp, token);
    if (typeof result == "string") {
      return res.status(404).json({ message: result });
    }
    return res
      .status(200)
      .json({ message: "Email updated successfully", result });
  } catch (error) {
    console.error("verifyOtpForEmployerEmailUpdate:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const validateUserForEmployerPasswordUpdate = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await checkUserInDb(email, password);
    if (typeof result == "string") {
      return res.status(400).json({ message: result });
    }
    return res.status(200).json({ message: "User validated successfully" });
  } catch (error) {
    console.error("validateUserForEmployerPasswordUpdate:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const updateEmployerPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(req.body);
    const userInDb = await Employer.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (userInDb) {
      userInDb.password = newPassword;
      console.log(userInDb.password);
      const updatedUser = await userInDb.save();
      //const updatedUser = await User.updateOne({ email: email }, { $set: { password: newPassword } });
      if (updatedUser) {
        return res
          .status(201)
          .json({ message: "Password updated successfully" });
      } else {
        return res.status(400).json({ message: "Update password failed" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("updateEmployerPassword:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ errors: messages });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const deactivateEmployerAccount = async (req, res) => {
  try {
    const { email, deactivateReason } = req.body;
    const userInDb = await Employer.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (userInDb) {
      const updatedUser = await Employer.findOneAndUpdate(
        { email: email },
        { $set: { isDeactivated: true, isDeactivatedReason: deactivateReason } }
      );
      if (updatedUser) {
        return res
          .status(200)
          .json({ message: "User deactivated successfully" });
      } else {
        return res.status(500).json({ message: "User deactivation failed" });
      }
    } else {
      return res.status(400).json({ message: "Invalid User" });
    }
  } catch (error) {
    console.error("deactivateEmployerAccount:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const deleteEmployerAccountPermanently = async (req, res) => {
  try {
    const { email, deleteAccountReason } = req.body;
    const userInDb = await Employer.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (userInDb) {
      const updatedUser = await Employer.findOneAndUpdate(
        { email: email },
        {
          $set: {
            isDeletedPermanently: true,
            isDeletedPermanentlyReason: deleteAccountReason,
          },
        }
      );
      if (updatedUser) {
        return res.status(200).json({ message: "User deleted successfully" });
      } else {
        return res.status(500).json({ message: "User deletion failed" });
      }
    } else {
      return res.status(400).json({ message: "Invalid User" });
    }
  } catch (error) {
    console.error("deleteEmployerAccountPermanently:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = {
  getAllEmployers,
  signUp,
  updateEmployer,
  signIn,
  getSingleEmployer,
  resendOtpCode,
  googleAuthCallback,
  verifyOtp,
  getcandidatesData,
  getJobsWithApplicants,
  updateApplicantsStatus,
  getUniqueSkills,
  getJobsByEmployerId,
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
};

// // Employer Registration
// app.post('/api/employer/register', async (req, res) => {
//     try {
//         const user = req.body;
//         const result = await saveUserInDb(user, user.email);
//         if (typeof result === 'string') {
//             return res.status(400).json({ message: result });
//         }
//         const { savedUserObject, token, otp } = result;
//         return res.status(201).json({
//             SignupUser: savedUserObject,
//             message: 'OTP sent to provided email',
//             OTP: otp,
//             SignupToken: token
//         });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

// // Employer Sign-In
// app.post('/api/employer/signin', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const result = await checkUserInDb(email, password);
//         if (typeof result === 'string') {
//             return res.status(401).json({ message: result });
//         }
//         const { otp, newToken } = result;
//         return res.status(200).json({
//             message: 'Sign In successful',
//             SignInOTP: otp,
//             signInToken: newToken
//         });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

// // OTP Verification
// app.post('/api/employer/verify-otp', async (req, res) => {
//     try {
//         const token = req.header('Authorization')?.split(' ')[1];
//         const { otp } = req.body;
//         const result = await validateOtp(otp, token);
//         if (typeof result === 'string') {
//             return res.status(400).json({ message: result });
//         }
//         const { userSavedObject, newToken } = result;
//         return res.status(200).json({
//             message: 'OTP verified successfully',
//             UserSaved: userSavedObject,
//             OtpVerifiedToken: newToken
//         });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

// // Create Job Post
// app.post('/api/employer/job', async (req, res) => {
//     try {
//         const jobData = req.body;
//         const result = await createJob(jobData);
//         return res.status(201).json({ message: 'Job created successfully', job: result });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

// // Get All Job Posts
// app.get('/api/employer/jobs', async (req, res) => {
//     try {
//         const jobs = await getJobs();
//         return res.status(200).json({ jobs });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

// // Update Job Post
// app.put('/api/employer/job/:id', async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         const updates = req.body;
//         const result = await updateJob(jobId, updates);
//         return res.status(200).json({ message: 'Job updated successfully', job: result });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

// // Delete Job Post
// app.delete('/api/employer/job/:id', async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         await deleteJob(jobId);
//         return res.status(200).json({ message: 'Job deleted successfully' });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

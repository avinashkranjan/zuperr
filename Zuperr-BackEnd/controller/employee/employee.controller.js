const User = require("../../model/employee/employee");
const Job = require("../../model/job/job");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const {
  saveUserInDb,
  updateUserExperinceLevel,
} = require("../../services/employee/employee.service");
const { checkUserInDb } = require("../../services/employee/employee.service");
const { validateOtp } = require("../../services/employee/employee.service");
const {
  updateCandidateDataInDb,
} = require("../../services/employee/employee.service");
const { getRandomJobs } = require("../../services/employee/employee.service");
const {
  searchJobs,
  searchCompanies,
} = require("../../services/employee/employee.service");
const {
  getCandidateStats,
  resendOtp,
  validatePasswordForUpdateCandidateEmailService,
  validateOtpForEmailUpdate
} = require("../../services/employee/employee.service");
const {
  getJobApplicationStatus,
} = require("../../services/employee/employee.service");
const { calculateScore } = require("../../services/employee/employee.service");
const resumeParsingService = require("../../services/employee/resume-parser.service");
const fs = require("fs");
const { uploadS3 } = require("../../config/spaces.config");
const llmService = require("../../services/llmService");
const mongoose = require("mongoose");

require("dotenv").config();

const pdfParse = require("pdf-parse");
const s3 = require("../../config/spaces.config");

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
      return res.status(400).json({ errormessage: "Some error occured" });
    }
  } catch (error) {
    return res.status(400).json({ errormessaged: error.message });
  }
};

const parseResume = async (file, tempFilePath) => {
  let text = "";

  try {
    console.log(
      `Processing file: ${file.originalname}, mimetype: ${file.mimetype}`
    );

    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(tempFilePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
      console.log("Successfully parsed PDF.");
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const data = await mammoth.extractRawText({ path: tempFilePath });
      text = data.value;
      console.log("Successfully parsed DOCX.");
    } else if (file.mimetype === "text/plain") {
      text = fs.readFileSync(tempFilePath, "utf-8");
      console.log("Successfully read TXT file.");
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    if (!text || text.trim() === "") {
      throw new Error(
        "Could not extract text from the file or the file is empty."
      );
    }

    console.log("Extracted text length:", text.length);
    const parsedResume = await resumeParsingService.parseWithLLM(text);
    console.log("Resume parsed successfully by LLM.");
    return parsedResume;
  } catch (error) {
    console.error("Error in parseResume function:", error.message, error.stack);
    throw error;
  } finally {
    if (tempFilePath) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`Successfully deleted temp file: ${tempFilePath}`);
      } catch (unlinkError) {
        console.error(`Error deleting temp file ${tempFilePath}:`, unlinkError);
      }
    }
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
    const { otp, newToken, id, userExperienceLevel } = result;
    return res.status(200).json({
      message: "Sign In successful",
      signInToken: newToken,
      userID: id,
      userExperienceLevel,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occured while signing in ", error });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const token = req.user.token;
    console.log(token, "verifyToken");
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

const resendOtpCode = async (req, res) => {
  try {
    const { email } = req.body;
    const message = await resendOtp(email);
    if (typeof message != "string") {
      const { token, otp } = message;
      console.log(token, "tokenResend");
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

const getLandingPageData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobs = await getRandomJobs(userId);
    if (jobs == null) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error loading landing page" });
  }
};

const getCandidateData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("keySkills");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCandidateDataResume = async (req, res) => {
  try {
    let { updatedFields } = req.body;

    if (
      updatedFields.keySkills &&
      (!Array.isArray(updatedFields.keySkills) ||
        updatedFields.keySkills.some(
          (id) => typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)
        ))
    ) {
      console.warn("Skipping invalid keySkills");
      delete updatedFields.keySkills;
    }

    const sanitizeMobileNumber = (mobileNumber) => {
      if (!mobileNumber || typeof mobileNumber !== "string") {
        return null;
      }

      const digitsOnly = mobileNumber.replace(/\D/g, "");

      if (digitsOnly.length >= 10) {
        const last10Digits = digitsOnly.slice(-10);
        console.log(
          `Mobile number sanitized: ${mobileNumber} -> ${last10Digits}`
        );
        return last10Digits;
      } else if (digitsOnly.length > 0) {
        console.warn(
          `Mobile number has only ${digitsOnly.length} digits, cannot extract 10 digits`
        );
        return null;
      }

      return null;
    };

    if (updatedFields.mobilenumber) {
      updatedFields.mobilenumber = sanitizeMobileNumber(
        updatedFields.mobilenumber
      );
      if (!updatedFields.mobilenumber) {
        console.warn("Invalid mobile number format, removing field");
        delete updatedFields.mobilenumber;
      }
    }

    const convertToDate = (dateValue) => {
      if (!dateValue) return null;
      if (dateValue instanceof Date) return dateValue;

      if (typeof dateValue === "string") {
        if (/^\d{4}$/.test(dateValue)) {
          return new Date(`${dateValue}-01-01`);
        }

        const parsedDate = new Date(dateValue);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
      }

      return null;
    };

    const sanitizeEducationData = (educationItem) => {
      const sanitized = { ...educationItem };

      if (sanitized.courseDuration) {
        sanitized.courseDuration = {
          from: convertToDate(sanitized.courseDuration.from),
          to: convertToDate(sanitized.courseDuration.to),
        };
      }

      if (sanitized.skills !== undefined) {
        if (Array.isArray(sanitized.skills)) {
          sanitized.skills =
            sanitized.skills.length > 0 ? sanitized.skills.join(", ") : null;
        } else if (typeof sanitized.skills !== "string") {
          sanitized.skills = null;
        }
      }

      return sanitized;
    };

    const sanitizeEmploymentHistory = (item) => {
      const sanitized = {};

      sanitized.companyName = item.companyName || null;
      sanitized.description = item.description || null;
      sanitized.isCurrentJob =
        typeof item.isCurrentJob === "boolean" ? item.isCurrentJob : null;
      sanitized.annualSalary = item.annualSalary || null;

      if (item.workExperience) {
        sanitized.workExperience = {
          years:
            typeof item.workExperience.years === "number"
              ? item.workExperience.years
              : null,
          months:
            typeof item.workExperience.months === "number"
              ? item.workExperience.months
              : null,
        };
      } else {
        sanitized.workExperience = { years: null, months: null };
      }

      if (item.duration) {
        sanitized.duration = {
          from: convertToDate(item.duration.from),
          to: convertToDate(item.duration.to),
        };
      } else {
        sanitized.duration = { from: null, to: null };
      }

      if (item.keyAchievements !== undefined) {
        if (Array.isArray(item.keyAchievements)) {
          sanitized.keyAchievements =
            item.keyAchievements.length > 0
              ? item.keyAchievements.join(", ")
              : null;
        } else if (typeof item.keyAchievements === "string") {
          sanitized.keyAchievements = item.keyAchievements;
        } else {
          sanitized.keyAchievements = null;
        }
      } else {
        sanitized.keyAchievements = null;
      }

      if (item.title) {
        console.warn(
          `Field 'title' not in employmentHistory schema, ignoring value: ${item.title}`
        );
      }
      if (item.location) {
        console.warn(
          `Field 'location' not in employmentHistory schema, ignoring value: ${item.location}`
        );
      }

      return sanitized;
    };

    const sanitizeWithDuration = (item) => {
      const sanitized = { ...item };

      if (sanitized.duration) {
        sanitized.duration = {
          from: convertToDate(sanitized.duration.from),
          to: convertToDate(sanitized.duration.to),
        };
      }

      return sanitized;
    };

    const processArrayField = (
      fieldName,
      sanitizeFunction = (item) => item
    ) => {
      const value = updatedFields[fieldName];

      if (!value) return;

      try {
        if (Array.isArray(value)) {
          updatedFields[fieldName] = value.map(sanitizeFunction);
        } else if (typeof value === "object" && value !== null) {
          updatedFields[fieldName] = [sanitizeFunction(value)];
        } else {
          delete updatedFields[fieldName];
        }
      } catch (error) {
        delete updatedFields[fieldName];
      }
    };

    processArrayField("educationAfter12th", sanitizeEducationData);
    processArrayField("educationTill12th");
    processArrayField("employmentHistory", sanitizeEmploymentHistory);
    processArrayField("internships", sanitizeWithDuration);
    processArrayField("projects", sanitizeWithDuration);
    processArrayField("accomplishments", sanitizeWithDuration);
    processArrayField("competitiveExams");
    processArrayField("academicAchievements");
    processArrayField("languages");

    console.log(
      "Processed updatedFields:",
      JSON.stringify(updatedFields, null, 2)
    );

    const updatedCandidate = await updateCandidateDataInDb(
      req.user.userId,
      updatedFields
    );

    if (!updatedCandidate) {
      return res.status(400).json({ message: "Candidate profile not found" });
    }

    return res.status(201).json({
      message: "Candidate updated successfully",
      updatedCandidate,
    });
  } catch (error) {
    console.error("Error while updating candidate data:", error.message);
    console.error("Error stack:", error.stack);

    if (error.name === "CastError") {
      console.error("Cast Error Details:", {
        path: error.path,
        value: error.value,
        kind: error.kind,
        valueType: typeof error.value,
      });

      return res.status(400).json({
        message: "Data format error",
        details: `Cannot convert ${typeof error.value} to ${
          error.kind
        } for field ${error.path}`,
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to update candidate data",
      error: error.message,
    });
  }
};

const updateCandidateData = async (req, res) => {
  try {
    const { updatedFields } = req.body;

    const updatedCandidate = await updateCandidateDataInDb(
      req.user.userId,
      updatedFields
    );
    if (!updatedCandidate) {
      return res.status(400).json({ message: "Candidate profile not found" });
    }
    return res
      .status(200)
      .json({ message: "Candidate updated successfully", updatedCandidate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const saveUserExperienceLevel = async (req, res) => {
  try {
    const { userId, updatedFields } = req.body;

    if (
      updatedFields.userExperienceLevel == "ExpereincedUnemployed" ||
      updatedFields.userExperienceLevel == "ExperiencedEmployed"
    ) {
      updatedFields.userExperienceLevel = "Senior-Level";
    } else if (updatedFields.userExperienceLevel == "Fresher") {
      updatedFields.userExperienceLevel = "Entry-Level";
    } else {
      return res.status(400).json({ message: "Bad request" });
    }

    const userLevelSaved = await updateUserExperinceLevel(
      userId,
      updatedFields
    );
    if (userLevelSaved) {
      return res.status(201).json({ message: "Data updated successfully" });
    } else {
      return res.status(500).json({ message: "server error" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchJobsController = async (req, res) => {
  try {
    const { searchText } = req.body;

    if (!searchText) {
      return res.status(400).json({
        success: false,
        message: "Search text is required",
      });
    }

    const searchKeywords = searchText.trim().split(/\s+/);

    // Search jobs
    const jobs = await searchJobs({ searchKeywords });

    // Search companies
    // const companies = await searchCompanies({ searchKeywords });

    return res.status(200).json({
      success: true,
      jobs: jobs,
      companies: [],
    });
  } catch (error) {
    console.error("Search jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching jobs",
      error: error.message,
    });
  }
};

// Controller function for applying to a job
const applyForJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    // Validate required fields
    if (!jobId || !userId) {
      return res
        .status(400)
        .json({ error: "Job ID and User ID are required." });
    }

    // Find the job by its ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    const candidate = await User.findById(userId);
    if (!candidate) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user has already applied
    const alreadyApplied = job.applicants.some(
      (applicant) => applicant.id.toString() === userId
    );
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: "User has already applied for this job." });
    }

    const calculatedScore = await calculateScore(job, candidate);

    //console.log(score);

    //Add the applicant to the job's applicants array
    job.applicants.push({
      id: userId,
      // Set a default status (e.g., 'pending', 'applied', etc.)
      status: "Under Review",
      // appliedDate will be set automatically by the default value
      score: calculatedScore,
    });

    // Save the job document
    await job.save();

    return res
      .status(200)
      .json({ message: "Application submitted successfully.", job });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId; // Get from authentication
    const selectedDays = parseInt(req.params.selectedDays, 10); // convert to number

    // Call service layer
    const results = await getCandidateStats(userId);

    // Create daysData for selectedDays (0-based indexing: 0 means today)
    const daysData = Array.from({ length: selectedDays }, (_, i) => ({
      day: i + 1, // display day as 1-indexed
      applied: 0,
      statusChanged: 0,
    }));

    // Use daysAgo directly as index (0 for today, 1 for yesterday, etc.)
    results.forEach((item) => {
      const index = item._id; // Do not subtract 1
      if (index >= 0 && index < selectedDays) {
        daysData[index].applied = item.totalApplications;
        daysData[index].statusChanged = item.statusChanges;
      }
    });

    res.status(200).json({
      success: true,
      data: daysData,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const jobApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobsApplied = await getJobApplicationStatus(userId);
    if (jobsApplied) {
      res.status(200).json(jobsApplied);
    } else {
      res.status(200).json({ message: "No data found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const incrementJobViewCount = async (req, res) => {
  try {
    const jobId = req.body.jobId;
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $inc: { jobViewsCount: 1 } },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "View count incremented",
      jobViewsCount: updatedJob.jobViewsCount,
    });
  } catch (error) {
    console.error("Error updating job views:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const incrementJobViewCountAll = async (req, res) => {
  try {
    const jobIds = req.body.jobIds;

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res
        .status(400)
        .json({ message: "jobIds must be a non-empty array" });
    }

    const result = await Job.updateMany(
      { _id: { $in: jobIds } },
      { $inc: { jobViewsCount: 1 } }
    );

    res.status(200).json({
      message: "View counts incremented",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error incrementing job views:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadCV = async (req, res) => {
  const userId = req.params.userId;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const tempFilePath = `./temp/${Date.now()}_${file.originalname}`;
  const fs = require("fs");
  const path = require("path");

  try {
    fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
    fs.writeFileSync(tempFilePath, file.buffer);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let filePath;
    if (!user.resume) {
      filePath = `candidates/${user?.firstname}_${user.lastname}_${
        user._id
      }/CV/${Date.now()}_${file.originalname}`;
      await User.findByIdAndUpdate(
        user._id,
        { resume: filePath },
        { new: true, runValidators: false }
      );
    } else {
      filePath = user.resume;
    }

    const uploadParams = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: filePath,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };
    const uploadResult = await uploadS3.upload(uploadParams).promise();

    const parsedResume = await parseResume(file, tempFilePath);

    res.status(200).json({
      message: "CV uploaded and parsed successfully",
      url: uploadResult.Location,
      parsedData: parsedResume,
    });
  } catch (error) {
    console.error("Upload/Parsing error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  } finally {
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (err) {
      console.error("Error deleting temp file:", err);
    }
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.params.userId;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Sanitize filename
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");

    // Always generate a new unique fileKey
    const fileKey = `candidates/${user?.firstname}_${user.lastname}_${
      user._id
    }/Profile/${Date.now()}_${safeFileName}`;

    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileKey,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    await uploadS3.upload(params).promise();

    user.profilePicture = fileKey;
    await user.save({ validateBeforeSave: false });

    const imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${fileKey}`;

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const uploadMediaCertification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { certificationID } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No certificate uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let accomplishment = user.accomplishments.find(
      (cert) => cert.certificationID === certificationID
    );

    if (accomplishment != null && accomplishment.mediaUpload) {
      const urlParts = new URL(accomplishment.mediaUpload);
      fileKey = decodeURIComponent(urlParts.pathname.slice(1));
    } else {
      fileKey = `candidates/${user?.firstname}_${user.lastname}_${user._id}/Certificates/${certificationID}_${file.originalname}`;
    }

    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileKey,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    await uploadS3.upload(params).promise();

    const fileURL = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${fileKey}`;

    // Update mediaUpload field
    if (!accomplishment) {
      accomplishment = {
        certificationID,
        mediaUpload: fileKey,
      };
      user.accomplishments.push(accomplishment);
    } else {
      accomplishment.mediaUpload = fileKey;
    }

    return res.status(200).json({
      message: "Certificate uploaded successfully",
      fileURL,
      fileKey,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

async function analyzeCandidate(req, res) {
  const { jobDescription, candidateProfile } = req.body;

  // Basic input validation
  if (!jobDescription || !candidateProfile) {
    return res.status(400).json({
      error: "Both jobDescription and candidateProfile are required.",
    });
  }

  try {
    const analysis = await llmService.getLlmAnalysis(
      jobDescription,
      candidateProfile
    );
    res.status(200).json(analysis);
  } catch (error) {
    console.error("Error in analyzeCandidate controller:", error.message);
    // Send a more generic error message to the client for security
    res.status(500).json({
      error: "Failed to analyze candidate. Please try again later.",
      details: error.message,
    });
  }
}

const validateUserForUpdateCandidateEmail = async (req, res) => {
    try {
        //console.log(req);
        const oldEmail = req.body.oldEmail;
        const newEmail = req.body.newEmail;
        const password = req.body.password;
        if (oldEmail == newEmail) {
            return res.status(400).json({ message: "New and Old email are same" });
        }
        const result = await validatePasswordForUpdateCandidateEmailService(oldEmail, newEmail, password);
        if (typeof result == "string") {
            return res.status(400).json({ message: result });
        }
        const { token, otp } = result;
        if (token != null && otp != null) {
            return res.status(200).json({ EmailUpdateOtp: otp, EmailUpdatetoken: token });
        }

    }
    catch (error) {
        console.error("validateUserForUpdateCandidateEmail:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const verifyOtpForCandidateEmailUpdate = async (req, res) => {
    try {
        const otp = req.body.otp;
        const token = req.user.token;
        const result = await validateOtpForEmailUpdate(otp, token);
        if (typeof result == "string") {
            return res.status(404).json({ message: result });
        }
        return res.status(200).json({ message: "Email updated successfully", result })
    } 
    catch (error) {
        console.error("verifyOtpForEmailUpdate:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const validateUserForCandidateProfileUpdate = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await checkUserInDb(email, password);
        if (typeof result == "string") {
            return res.status(400).json({ message: result });
        }
        return res.status(200).json({ message: "User validated successfully" });
    } catch (error) {
        console.error("validateUserForCandidatePasswordUpdate:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const updateCandidatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const userInDb = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
        });
        if (userInDb) {
            userInDb.password = newPassword;
            const updatedUser = await userInDb.save();
            //const updatedUser = await User.updateOne({ email: email }, { $set: { password: newPassword } });
            if (updatedUser) {
                return res.status(201).json({ message: "Password updated successfully" });
            } else {
                return res.status(500).json({ message: "Update password failed" });
            }
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("updateCandidatePassword:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ errors: messages });
        }
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const deactivateCandidateAccount = async (req, res) => {
    try {
        const { email, deactivateReason } = req.body;
        console.log(req.body);
        const userInDb = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
        });
        console.log(userInDb);
        if (userInDb) {
            const updatedUser = await User.findOneAndUpdate({ email: email }, { $set: { isDeactivated: true, isDeactivatedReason: deactivateReason } });
            if (updatedUser) {
                return res.status(200).json({ message: "User deactivated successfully" });
            } else {
                return res.status(500).json({ message: "User deactivation failed" });
            }
        } else {
            return res.status(400).json({ message: "Invalid User" });
        }
    } catch (error) {
        console.error("deactivateCandidateAccount:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const deleteCandidateAccountPermanently = async (req, res) => {
    try {
        const { email, deleteAccountReason } = req.body;
        const userInDb = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
        });
        if (userInDb) {
            const updatedUser = await User.findOneAndUpdate({ email: email }, { $set: { isDeletedPermanently: true, isDeletedPermanentlyReason: deleteAccountReason } }, { new: true, runValidators: true });
            if (updatedUser) {
                return res.status(200).json({ message: "User deleted successfully" });
            } else {
                return res.status(500).json({ message: "User deletion failed" });
            }
        } else {
            return res.status(400).json({ message: "Invalid User" });
        }
        
    } catch(error) {
        console.error("deleteCandidateAccountPermanently:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const updateJobPreference = async (req, res) => {
    try {
        const { email, jobType, preferredShift, locationPreferenceKM, minimumSalaryLPA, maximumSalaryLPA } = req.body;
        const userInDb = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
        });
        if (userInDb) {
            const updatedUser = await User.findOneAndUpdate({ email: email }, {
                $set:
                {
                    'careerPreference.jobTypes': jobType, 'careerPreference.preferredShift': preferredShift, 'careerPreference.locationPreferenceKM': locationPreferenceKM,
                    'careerPreference.minimumSalaryLPA': minimumSalaryLPA, 'careerPreference.maximumSalaryLPA': maximumSalaryLPA
                }
            });
            if (updatedUser) {
                return res.status(200).json({ message: "User preference updated successfully", updatedUser });
            } else {
                return res.status(500).json({ message: "Error updating user preference" });
            }
        } else {
            return res.status(400).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("updateJobPreference:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const saveUserJob = async (req, res) => {
    try {
        const { email, jobId } = req.body;
        
        if (mongoose.Types.ObjectId.isValid(jobId)) {
            const jobInDb = await Job.findById(jobId);
            if (jobInDb) {
                const userInDb = await User.findOne({
                    email: { $regex: new RegExp(`^${email}$`, "i") },
                });
                if (userInDb) {
                    const updatedUser = await User.findOneAndUpdate({ email: email }, { $addToSet: { jobSaved: jobId } }, { new: true, runValidators: true });
                    if (updatedUser) {
                        return res.status(200).json({ message: "Job saved successfully", updatedUser });
                    } else {
                        return res.status(500).json({ message: "Error updating save jobs" });
                    }
                } else {
                    return res.status(400).json({ message: "Invalid email" })
                }
            } else {
                return res.status(400).json({ message: "Job ID does not exist" });
            }
        } else {
            return res.status(400).json({message: "Invalid Job ID"})
        }
    } catch (error) {
        console.error("saveUserJob:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const getUserSavedJobs = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            const userInDb = await User.findById(userId)
                .populate({
                    path: 'jobSaved',
                    select: 'title location minimumExperienceInYears maximumExperienceInYears minimumSalaryLPA maximumSalaryLPA',
                    populate: [
                        {
                            path: 'createdBy',
                            model: 'Employer',
                            select: 'companyName companyLogo'
                        },
                        {
                            path: 'skills',
                            model: 'Skill',
                            select: 'Name'
                        }
                    ]
                });

            if (!userInDb) {
                return res.status(400).json({ message: "User ID does not exist" });
            }
            const savedJobs = userInDb.jobSaved.map(job => ({
                _id: job._id,
                title: job.title,
                location: job.location,
                minimumExperienceInYears: job.minimumExperienceInYears,
                maximumExperienceInYears: job.maximumExperienceInYears,
                minimumSalaryLPA: job.minimumSalaryLPA,
                maximumSalaryLPA: job.maximumSalaryLPA,
                companyName: job.createdBy?.companyName || null,
                companyLogo: job.createdBy?.companyLogo || null,
                skills: job.skills?.map(skill => skill.Name) || []
            }));
            return res.status(200).json({ savedJobs });
        } else {
            return res.status(400).json({ message: "Invalid user ID" });
        }
    } catch (error) {
        console.error("getUserSavedJobs:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

const getUserAppliedJobs = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userInDb = await User.findById(userId);
        if (userInDb) {
            const appliedJobs = await Job.find({ 'applicants.id': userId })
                .select('title location minimumExperienceInYears maximumExperienceInYears minimumSalaryLPA maximumSalaryLPA applicants')
                .populate([
                    {
                        path: 'createdBy',
                        model: 'Employer',
                        select: 'companyName logo'
                    },
                    {
                        path: 'skills',
                        model: 'Skill',
                        select: 'Name'
                    }
                ]);

            const userAppliedJobs = appliedJobs.map(job => {
                const applicants = job.applicants || [];
                const applicant = applicants.find(a => a.id.toString() === userId.toString());

                return {
                    _id: job._id,
                    title: job.title,
                    location: job.location,
                    minimumExperienceInYears: job.minimumExperienceInYears,
                    maximumExperienceInYears: job.maximumExperienceInYears,
                    minimumSalaryLPA: job.minimumSalaryLPA,
                    maximumSalaryLPA: job.maximumSalaryLPA,
                    companyName: job.createdBy?.companyName || null,
                    companyLogo: job.createdBy?.companyLogo || null,
                    skills: job.skills?.map(skill => skill.Name) || [],
                    applicantInfo: applicant ? {
                        appliedDate: applicant?.appliedDate,
                        status: applicant?.status
                    } : null
                };
            });

            return res.status(200).json({ appliedJobs: userAppliedJobs });
        } else {
            return res.status(400).json({ message: "Invalid user ID" });
        }
    } catch (error) {
        console.error("getUserAppliedJobs:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
    
}

const updateCandidateProfileVisibility = async(req, res)=> {
    try {
        const userId = req.user.userId;
        const candidateProfileVisibility = req.body.candidateProfileVisibility;
        const userInDb = await User.findById(userId);
        if (userInDb) {
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { candidateProfileVisibility: candidateProfileVisibility } }, { new: true, runValidators: true });
            console.log(updatedUser);
            if (updatedUser) {
                return res.status(200).json({ message: "User Profile Visibility updated successfully" });
            } else {
                return res.status(500).json({ message: "User Profile Visibility update failed" });
            }
        } else {
            return res.status(400).json({message: "Invalid user ID"})
        }
    } catch (error) {
        console.error("updateCandidateProfileVisibility:", error);
        return res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = {
  signUp,
  signIn,
  resendOtpCode,
  verifyOtp,
  updateCandidateData,
  getCandidateData,
  googleAuthCallback,
  getLandingPageData,
  searchJobsController,
  applyForJob,
  saveUserExperienceLevel,
  getDashboardStats,
  jobApplicationStatus,
  incrementJobViewCount,
  uploadCV,
  uploadProfilePic,
  updateCandidateDataResume,
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
};

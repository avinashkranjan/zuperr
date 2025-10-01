const User = require("../../model/employee/employee");
const nodemailer = require("nodemailer");
const Job = require("../../model/job/job");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { google } = require("googleapis");
//const mongoose  = require('mongoose');

require("dotenv").config();

const CLIENT_ID = process.env.nodemailClientId;
const CLIENT_SECRET = process.env.clientSecret;
const REDIRECT_URI = process.env.redirectUri;
const REFRESH_TOKEN = process.env.refereshToken;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(firstname, email, otp) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.nodemaileruser,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.nodemaileruser,
      to: email,
      subject: "Zuperr OTP for Signup",
      html:
        "Hello " +
        firstname +
        "! <br><br>This is your OTP: " +
        otp +
        " <br><br>Thanks,<br>Zuperr",
      text:
        "Hello " +
        firstname +
        "! <br><br>This is your OTP: " +
        otp +
        " <br><br>Thanks,<br>Zuperr",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.messageId);
    return result.messageId;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function sendMailOTPForEmailUpdate(firstname, email, otp) {
    try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.nodemaileruser,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.nodemaileruser,
      to: email,
      subject: "Zuperr OTP for Email Update",
      html:
        "Hello " +
        firstname +
        "! <br><br>This is your OTP: " +
        otp +
        " <br><br>Thanks,<br>Zuperr",
      text:
        "Hello " +
        firstname +
        "! <br><br>This is your OTP: " +
        otp +
        " <br><br>Thanks,<br>Zuperr",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.messageId);
    return result.messageId;
  } catch (error) {
    console.log(error);
    return error;
  }
}

function generateSecurePassword() {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&#";
  let password = "";
  while (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
      password
    )
  ) {
    password = Array(8)
      .fill(0)
      .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
      .join("");
  }
  return password;
}

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Caught error in findUserByEmail:", error.message);
  }
};

const createGoogleUser = async (userData) => {
  try {
    const newUser = new User({
      firstname: userData?.firstname,
      lastname: userData.lastname,
      email: userData.email,
      mobilenumber: userData.mobilenumber
        ? userData.mobilenumber.replace(/\s+/g, "")
        : "0000000000",
      password: generateSecurePassword(),
      isverified: true,
    });
    const newUserSavedInDb = await newUser.save();
    const googleAuthenticationToken = jwt.sign(
      { userId: newUserSavedInDb._id, email: newUserSavedInDb.email },
      process.env.JWT_SECRET,
      { expiresIn: "14d" } // Token expiration time
    );
    return { newUserSavedInDb, googleAuthenticationToken };
  } catch (error) {
    console.error("Caught error in createGoogleUser:", error.message);
  }
};

// Handle Google authentication
const handleGoogleAuth = async (profileData) => {
  try {
    // First check if user exists
    const existingUser = await findUserByEmail(profileData.email);

    if (existingUser) {
      const googleSigninToken = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "14d" }
      );
      return {
        newUserSavedInDb: existingUser,
        googleAuthenticationToken: googleSigninToken,
      };
    }

    // If user doesn't exist, create new user
    const userData = {
      firstname: profileData?.firstname,
      lastname: profileData.lastName,
      email: profileData.email,
      mobilenumber: profileData.mobilenumber,
    };

    const { newUserSavedInDb, googleAuthenticationToken } =
      await createGoogleUser(userData);
    return { newUserSavedInDb, googleAuthenticationToken };
  } catch (error) {
    console.error("Caught error in handleGoogleAuth:", error.message);
  }
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const saveUserInDb = async (user, email, mobilenumber) => {
  try {
    let savedUser;
    const userExistInDb = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (
      userExistInDb === null ||
      (userExistInDb != null && !userExistInDb.isverified)
    ) {
      const userMobileNumberExistInDb = await User.findOne({ mobilenumber });
      if (
        userMobileNumberExistInDb != null &&
        userMobileNumberExistInDb.mobilenumber == user.mobilenumber &&
        userMobileNumberExistInDb.isverified
      ) {
        return "This mobile number is already registered. Please log in or use a different number.";
      }
      //if (userExistInDb != null) {
      //    await User.deleteOne({ email });
      //}
      const otp = generateOTP();
      const messsageId = sendMail(user?.firstname, email, otp);
      if (messsageId != null) {
        if (userExistInDb != null) {
          userExistInDb.firstname = user.firstname;
          userExistInDb.lastname = user.lastname;
          userExistInDb.email = email;
          userExistInDb.mobilenumber = mobilenumber;
          userExistInDb.password = user.password;
          savedUser = await userExistInDb.save();
        } else {
          const userSaveInDb = new User(user);
          savedUser = await userSaveInDb.save();
        }
        const token = jwt.sign({ otp, email }, process.env.JWT_SECRET, {
          expiresIn: "10m",
        });
        console.log(token, "tokenSign");
        const savedUserObject = savedUser.toObject();
        delete savedUserObject.password;
        return { savedUserObject, token, otp };
      } else {
        return `There was an error while sending OTP ${messageId}`;
      }
    } else {
      return "This email is already registered";
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errors.join(", ").toString();
    }
    console.error("Caught error in saveUserInDb:", error.message);
  }
};

const checkUserInDb = async (email, password) => {
  try {
    const userInDb = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (userInDb == null) {
      return "User does not exist";
    }
    if (userInDb != null && !userInDb.isverified) {
      return "OTP is not verified, Please signup again";
    }

    const isValidPassword = await userInDb.comparePassword(password);
    if (isValidPassword) {
      //const otp = generateOTP();
      //const mailOptions = {
      //    from: process.env.fromaddress,
      //    to: email,
      //    subject: 'Zuperr OTP code',
      //    text: `Your OTP code is: ${otp}`
      //};
      //const messageId = sendMail('', email, otp);
      //await transporter.sendMail(mailOptions);
      //if (messageId != null) {
      const newToken = jwt.sign(
        { userId: userInDb._id, email: userInDb.email },
        process.env.JWT_SECRET,
        { expiresIn: "14d" } // Token expiration time
      );
      //const userInDbObject = userInDb.toObject();
      //delete userInDbObject.password;
      return {
        newToken,
        id: userInDb["_id"],
        userExperienceLevel: userInDb.userExperienceLevel,
      };
      //}
    } else {
      return "Invalid email or password.";
    }
  } catch (error) {
    console.error("Caught error in checkUserInDb:", error.message);
  }
};

const validateOtp = async (otpsent, token) => {
  try {
    // Trim spaces from the OTP input
    otpsent = otpsent.trim();

    // Log for debugging
    console.log("OTP length:", otpsent.length);
    console.log("OTP sent:", otpsent);

    // Verify token and extract otp and email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { otp, email } = decoded;
    console.log("Original OTP:", otp);

    // Validate OTP input length
    if (otpsent.length === 0) {
      return "Incorrect OTP. Please try again";
    }
    if (otpsent.length !== 4 && otpsent.length !== 6) {
      return "OTP must be 4 or 6 digits.";
    }

    // Check that OTP contains only digits (works for both 4 and 6 digit OTP)
    const otpRegex = /^[0-9]+$/;
    if (!otpRegex.test(otpsent)) {
      return "OTP must contain only numbers.";
    }

    // Compare the sent OTP with the original one (converted to strings)
    if (otp.toString() !== otpsent.toString()) {
      return "Incorrect OTP. Please try again";
    }

    // Find user in the database by email
    const userInDb = await User.findOne({ email });
    if (!userInDb) {
      return "User data not found";
    }

    // If user is already verified, generate a new token and return the user object
    if (userInDb.isverified) {
      const newToken = jwt.sign(
        { userId: userInDb._id, email: userInDb.email },
        process.env.JWT_SECRET,
        { expiresIn: "14d" }
      );
      const userInDbObject = userInDb.toObject();
      delete userInDbObject.password;
      return { userSavedObject: userInDbObject, newToken };
    }

    // Mark the user as verified
    userInDb.isverified = true;
    await User.updateOne({ _id: userInDb._id }, { $set: { isverified: true } });

    // Generate a new JWT token for the verified user
    const newToken = jwt.sign(
      { userId: userInDb._id, email: userInDb.email },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    const userSavedObject = userInDb.toObject();
    delete userSavedObject.password;

    return { userSavedObject, newToken };
  } catch (error) {
    console.error("Caught error in validateOtp:", error.message);
    return "Something went wrong. Please try again.";
  }
};

const resendOtp = async (email) => {
  try {
    //    const user = await User.findOne({ email });
    const otp = generateOTP();
    //    user.otp = newOtp;
    //    user.expiresAt = new Date(currentTime + 2 * 60 * 1000);
    const messsageId = sendMail("", email, otp);
    if (messsageId != null) {
      const token = jwt.sign({ otp, email }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });
      return { token, otp };
    } else {
      return `There was an error while sending OTP ${messageId}`;
    }
    //    await user.save();
    //    const token = jwt.sign({ otp, email }, process.env.JWT_SECRET, { expiresIn: '10m' });
  } catch (error) {
    console.error("Caught error in resendOtp:", error.message);
  }
};

const flattenObject = (obj, prefix = "") => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      value !== null &&
      value !== undefined &&
      (typeof value !== "string" || value.trim() !== "")
    ) {
      if (typeof value === "object" && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, fullKey));
      } else {
        acc[fullKey] = value;
      }
    }

    return acc;
  }, {});
};

const updateCandidateDataInDb = async (userId, updatedFields) => {
  try {
    const cleanFields = flattenObject(updatedFields);

    if (Object.keys(cleanFields).length === 0) {
      console.warn("No valid fields to update.");
      return null;
    }

    const updatedCandidateInDb = await User.findOneAndUpdate(
      { _id: userId },
      { $set: cleanFields },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedCandidateInDb) {
      console.warn(`User with ID ${userId} not found.`);
      return null;
    }

    return updatedCandidateInDb;
  } catch (error) {
    console.error("Error updating candidate data in DB:", error.message);
    throw new Error("Failed to patch user data.");
  }
};

const getRandomJobs = async (userId) => {
  try {
    let userLevel = null;
    const user = await User.findById(userId);
    if (user.userExperienceLevel == "Fresher") {
      userLevel = "Entry-Level";
    } else {
      userLevel = "Senior-Level";
    }
    if (!user) {
      return null;
    }

    const jobs = await Job.aggregate([
      {
        $match: {
          isDeleted: false,
          isActive: true,
          jobExperienceLevelType: userLevel,
          applicants: {
            $not: {
              $elemMatch: { id: new mongoose.Types.ObjectId(userId) },
            },
          },
        },
      },
      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skills",
        },
      },
      {
        $lookup: {
          from: "employers",
          localField: "createdBy",
          foreignField: "_id",
          as: "employer",
        },
      },
      {
        $unwind: {
          path: "$employer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          companyName: "$employer.companyName",
          companyLogo: "$employer.companyLogo",
        },
      },
      {
        $unset: [
          "employer",
          "applicants",
          "skills.createdAt",
          "skills.updatedAt",
          "skills.__v",
          "__v",
        ],
      },
    ]);
    return jobs;
  } catch (error) {
    console.error("Caught error in getRandomJobs:", error.message);
  }
};

const searchJobs = async (filters) => {
  try {
    const matchConditions = {
      isDeleted: false,
      isActive: true,
    };

    const andConditions = [];

    // Keyword regex conditions
    if (filters.searchKeywords?.length > 0) {
      const keywordConditions = filters.searchKeywords.map((keyword) => ({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { jobCategory: { $regex: keyword, $options: "i" } },
          { location: { $regex: keyword, $options: "i" } },
          { "skills.Name": { $regex: keyword, $options: "i" } }, // Will be replaced later after lookup
        ],
      }));
      andConditions.push(...keywordConditions);
    }

    // Skill ObjectId matching
    if (filters.skills?.length > 0) {
      const skillObjectIds = filters.skills.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      andConditions.push({ skills: { $in: skillObjectIds } });
    }

    if (andConditions.length > 0) {
      matchConditions.$and = andConditions;
    }

    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skills", // Directly override the field
        },
      },
      {
        $lookup: {
          from: "employers",
          localField: "createdBy",
          foreignField: "_id",
          as: "employerDetails",
        },
      },
      { $unwind: "$employerDetails" },
      { $match: matchConditions },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          __v: 0,
          applicants: 0,
          "employerDetails.password": 0,
          "skills.__v": 0,
          "skills.createdAt": 0,
          "skills.updatedAt": 0,
        },
      },
    ]);

    return jobs.map((job) => ({
      ...job,
      companyName: job.employerDetails?.companyName || "Unknown",
      companyLogo: job.employerDetails?.companyLogo || null,
      // override employerDetails or remove if not needed
    }));
  } catch (error) {
    console.error("Search Jobs Error:", error);
    throw error;
  }
};

const searchCompanies = async ({ searchKeywords }) => {
  try {
    if (!searchKeywords || searchKeywords.length === 0) return [];

    const keywordRegex = searchKeywords.map((keyword) => ({
      companyName: { $regex: keyword, $options: "i" },
    }));

    const companies = await Employer.find({ $or: keywordRegex })
      .select("companyName industry location") // add fields as needed
      .lean();

    return companies;
  } catch (error) {
    throw error;
  }
};

const updateUserExperinceLevel = async (userId, userExperienceLevel) => {
  try {
    const updatedCandidateInDb = await User.findOneAndUpdate(
      { _id: userId },
      { $set: userExperienceLevel },
      { new: true }
    );
    return updatedCandidateInDb;
  } catch (error) {
    console.error("Caught error in updateUserExperinceLevel:", error.message);
  }
};

const getCandidateStats = async (userId) => {
  try {
    const applicantId = new mongoose.Types.ObjectId(userId);
    const pipeline = [
      // Match documents with an applicant matching the userId
      { $match: { "applicants.id": applicantId } },
      // Unwind the applicants array
      { $unwind: "$applicants" },
      // Filter again to only process the matching applicant
      { $match: { "applicants.id": applicantId } },
      // Project the necessary fields and compute daysAgo
      {
        $project: {
          appliedDate: "$applicants.appliedDate",
          status: "$applicants.status",
          daysAgo: {
            $floor: {
              $divide: [
                { $subtract: ["$$NOW", "$applicants.appliedDate"] },
                86400000, // milliseconds in one day
              ],
            },
          },
        },
      },
      // Only include results where daysAgo is between 1 and 7
      { $match: { daysAgo: { $gte: 0, $lte: 7 } } },
      // Group by daysAgo
      {
        $group: {
          _id: "$daysAgo",
          totalApplications: { $sum: 1 },
          statusChanges: {
            $sum: {
              $cond: [{ $ne: ["$status", "Applied"] }, 1, 0],
            },
          },
        },
      },
    ];

    return await Job.aggregate(pipeline);
  } catch (error) {
    throw new Error(`Failed to fetch candidate stats: ${error.message}`);
  }
};

const getJobApplicationStatus = async (userId) => {
  try {
    const applicationData = [];
    const applications = await Job.aggregate([
      // Match jobs where the user has applied
      { $match: { "applicants.id": new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$applicants" },
      { $match: { "applicants.id": new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "employers",
          localField: "createdBy",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: "$employer" },
      {
        $project: {
          jobTitle: "$title",
          companyName: "$employer.companyName",
          location: "$location",
          appliedDate: "$applicants.appliedDate",
          status: "$applicants.status",
          jobId: "$_id", // <-- Job ID included here
        },
      },
    ]);

    const currentDate = new Date();
    const result = applications.map((app) => {
      const daysAgoApplied = Math.floor(
        (currentDate - app.appliedDate) / (1000 * 60 * 60 * 24)
      );

      applicationData.push({
        jobId: app.jobId, // ✅ include jobId here
        jobTitle: app.jobTitle,
        companyName: app.companyName || "Not specified",
        location: app.location,
        daysSinceApplication: daysAgoApplied,
        status: app.status,
      });
    });

    return applicationData;
  } catch (error) {
    throw new Error(
      `caught error in getJobApplicationStatus: ${error.message}`
    );
  }
};

const calculateScore = async (job, candidate) => {
  const weightedSkillScore = calculateSkillScore(job, candidate);
  const weightedExperienceScore = calculateExperienceScore(job, candidate);
  const weightedCTCScore = calculateCTCScore(job, candidate);
  const weightedEducationScore = calculateEduationScore(job, candidate);
  const weightedAgeScore = calculateAgeScore(job, candidate);
  const wightedGenderScore = calculateGenderScore(job, candidate);

  const finalScore =
    weightedSkillScore +
    weightedExperienceScore +
    weightedCTCScore +
    weightedEducationScore +
    weightedAgeScore +
    wightedGenderScore;

  console.log(finalScore);

  return finalScore;
  //return parseFloat(weightedScore.toFixed(2));
};

function calculateSkillScore(job, candidate, maxScore = 35) {
  const jobSkills = job.skills || [];
  const candidateSkills = candidate.keySkills || [];

  const jobSkillCount = jobSkills.length;

  if (jobSkillCount === 0) return 0;

  const jobSkillsSet = new Set(
    jobSkills.map((skill) => String(skill).toLowerCase())
  );

  // Ensure candidate skills are strings (by converting to lowercase)
  const matchingSkills = candidateSkills.filter((skill) =>
    jobSkillsSet.has(String(skill).toLowerCase())
  ).length;

  const skillMatchPercentage = (matchingSkills / jobSkillCount) * 100;
  const weightedScore = (skillMatchPercentage * maxScore) / 100;

  return parseFloat(weightedScore.toFixed(2));
}

function getTotalExperienceInYears(employmentHistory = []) {
  let totalMonths = 0;

  for (const job of employmentHistory) {
    const from = new Date(job.duration?.from);
    const to = job.isCurrentJob ? new Date() : new Date(job.duration?.to);

    if (!from || isNaN(from) || !to || isNaN(to)) {
      continue; // skip invalid dates
    }

    const months =
      (to.getFullYear() - from.getFullYear()) * 12 +
      (to.getMonth() - from.getMonth());

    if (months > 0) {
      totalMonths += months;
    }
  }

  return totalMonths / 12; // convert months to years
}

function calculateExperienceScore(job, candidate, maxScore = 20) {
  const jobMin = job.minimumExperienceInYears || 0;
  const jobMax = job.maximumExperienceInYears || 0;

  const totalExperienceYears = getTotalExperienceInYears(
    candidate.employmentHistory || []
  );

  // Full match
  if (totalExperienceYears >= jobMin && totalExperienceYears >= jobMax) {
    return maxScore;
  }

  // Close match (within 0.5 years for either)
  const minDiff = jobMin - totalExperienceYears;
  const maxDiff = jobMax - totalExperienceYears;

  const isMinClose = minDiff <= 0.5 && minDiff > 0;
  const isMaxClose = maxDiff <= 0.5 && maxDiff > 0;

  if (isMinClose || isMaxClose) {
    return maxScore * 0.5;
  }

  return 0;
}

function calculateCTCScore(job, candidate, maxScore = 15) {
  const jobMin = job.minimumSalaryLPA || 0;
  const jobMax = job.maximumSalaryLPA || 0;

  const candMin = candidate.careerPreference?.minimumSalaryLPA || 0;
  const candMax = candidate.careerPreference?.maximumSalaryLPA || 0;

  // Full match: candidate expects within or below job's salary range
  if (candMin <= jobMax && candMax <= jobMax) {
    return maxScore;
  }

  // Slightly over-demanding (<= 0.5 LPA above job max)
  const maxDiffHigh = candMax - jobMax;

  if (maxDiffHigh > 0 && maxDiffHigh <= 0.5) {
    return maxScore * 0.5; // partial score
  }

  // Demanding too much
  return 0;
}

function calculateEduationScore(job, candidate) {
  const candidateLevel = getHighestEducationLevel(candidate);
  const score = calculateQualificationScore(job.education, candidateLevel);

  return score;
}

function getHighestEducationLevel(candidate) {
  const degreeHierarchy = {
    "Below 10th": 1,
    "10th": 2,
    "12th": 3,
    Diploma: 3.5,
    Graduate: 4,
    "Post Graduate": 5,
    PhD: 6,
  };

  let schoolLevel = 0;
  let collegeLevel = 0;

  if (Array.isArray(candidate.educationTill12th)) {
    for (const edu of candidate.educationTill12th) {
      const level = degreeHierarchy[edu.education] || 0;
      if (level > schoolLevel) schoolLevel = level;
    }
  }

  if (Array.isArray(candidate.educationAfter12th)) {
    for (const edu of candidate.educationAfter12th) {
      const level = degreeHierarchy[edu.educationLevel] || 0;
      if (level > collegeLevel) collegeLevel = level;
    }
  }

  return Math.max(schoolLevel, collegeLevel);
}

function calculateQualificationScore(
  requiredDegree,
  candidateDegreeLevel,
  maxScore = 10
) {
  const degreeHierarchy = {
    "Below 10th": 1,
    "10th": 2,
    "12th": 3,
    Diploma: 3.5,
    Graduate: 4,
    "Post Graduate": 5,
    PhD: 6,
  };

  const requiredLevel = degreeHierarchy[requiredDegree];
  if (!requiredLevel || !candidateDegreeLevel) return 0;

  if (candidateDegreeLevel >= requiredLevel) {
    return maxScore;
  }

  if (requiredLevel - candidateDegreeLevel === 1) {
    return maxScore * 0.5;
  }

  return 0;
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

function calculateAgeScore(job, candidate, maxScore = 5) {
  const age = calculateAge(candidate.dateOfBirth);
  if (age === null) return 0;

  const fromAge = parseInt(job.fromAge, 10);
  const toAge = parseInt(job.toAge, 10);

  if (isNaN(fromAge) || isNaN(toAge)) return 0;

  return age >= fromAge && age <= toAge ? maxScore : 0;
}

function calculateGenderScore(job, candidate, maxScore = 5) {
  const jobGender = job.gender?.toLowerCase();
  const candidateGender = candidate.gender?.toLowerCase();

  if (!jobGender || !candidateGender) return 0;

  if (jobGender === "any") {
    return maxScore;
  }

  return jobGender === candidateGender ? maxScore : 0;
}

const validatePasswordForUpdateCandidateEmailService = async (oldEmail, newEmail, password) => {
    const userInDb = await User.findOne({
        email: { $regex: new RegExp(`^${oldEmail}$`, "i") },
    });
    const existinguserInDb = await User.findOne({
        email: { $regex: new RegExp(`^${newEmail}$`, "i") },
    });
    if (existinguserInDb) {
        return "New email already exists";
    }
    if (userInDb) {
        const isValidPassword = await userInDb.comparePassword(password);
        if (isValidPassword) {
            const otp = generateOTP();
            const messageId = sendMailOTPForEmailUpdate(userInDb.firstname, newEmail, otp)
            if (messageId) {
                const token = jwt.sign({ otp, newEmail, oldEmail }, process.env.JWT_SECRET, {
                    expiresIn: "10m",
                });
                return { token, otp };
            } else {
                return `There was an error while sending OTP ${messageId}`;
            }
        } else {
            return "Incorrect Password";
        }
    } else {
        return "Invalid Email";
    }
    
}

const validateOtpForEmailUpdate = async (otpReceived, token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { otp, oldEmail, newEmail } = decoded;
        
        if (otp == otpReceived) {
            await User.updateOne({ email: oldEmail }, { $set: { email: newEmail } });
            return { newEmail};
        } else {
            return "Incorrect OTP";
        }
    }
    catch (error) {
        console.error("Caught error in validateOtpForEmailUpdate:", error.message);
        return "Something went wrong. Please try again.";
    }
}

//const getCandidateStats = async (userId) => {
//    console.log(userId);
//    try {
//        const pipeline = [
//            {
//                $match: {
//                    "applicants.id": new mongoose.Types.ObjectId(userId)
//                }
//            },
//            { $unwind: "$applicants" },
//            {
//                $match: {
//                    "applicants.id": new mongoose.Types.ObjectId(userId)
//                }
//            },
//            {
//                $project: {
//                    status: "$applicants.status",
//                    daysAgo: {
//                        $floor: {
//                            $divide: [
//                                { $subtract: ["$$NOW", "$applicants.appliedDate"] },
//                                86400000
//                            ]
//                        }
//                    }
//                }
//            },
//            { $match: { daysAgo: { $gte: 1, $lte: 7 } } },
//            {
//                $group: {
//                    _id: "$daysAgo",
//                    applied: { $sum: 1 },
//                    statusChanged: {
//                        $sum: {
//                            $cond: [{ $ne: ["$status", "Newly Applied"] }, 1, 0]
//                        }
//                    }
//                }
//            }
//        ];

//        return await Job.aggregate(pipeline);
//    } catch (error) {
//        throw error;
//    }
//};

module.exports = {
  saveUserInDb,
  checkUserInDb,
  validateOtp,
  updateCandidateDataInDb,
  createGoogleUser,
  handleGoogleAuth,
  getRandomJobs,
  searchJobs,
  updateUserExperinceLevel,
  getCandidateStats,
  resendOtp,
  getJobApplicationStatus,
  calculateScore,
  validatePasswordForUpdateCandidateEmailService,
  validateOtpForEmailUpdate
};

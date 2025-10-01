const Employer = require("../../model/employer/employer.model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const User = require("../../model/employee/employee");

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

const getAllEmployersService = async () => {
  try {
    const employers = await Employer.find({});
    return employers;
  } catch (error) {
    throw new Error("Failed to fetch employers: " + error.message);
  }
};

const getSingleEmployerService = async (userId) => {
  try {
    const employer = await Employer.findById(userId);
    if (!employer) throw new Error("Employer not found");

    // ----------------------------
    // 🔹 Profile Completeness
    // ----------------------------
    let filledFields = 0;
    let totalFields = 6; // you can adjust based on importance

    if (employer.companyName) filledFields++;
    if (employer.email) filledFields++;
    if (employer.mobileNumber) filledFields++;
    if (employer.address?.line1) filledFields++;
    if (employer.companyLogo) filledFields++;
    if (employer.description) filledFields++;

    const profileCompleteness = Math.round((filledFields / totalFields) * 10); // scale 0–10

    // ----------------------------
    // 🔹 Verified Documents
    // ----------------------------
    let verifiedDocuments = 0;
    if (employer.gstDocs && employer.isGstVerified) verifiedDocuments++;
    if (employer.panDocs) verifiedDocuments++;

    // scale to 0–10
    const verifiedDocsScore = Math.min(verifiedDocuments * 5, 10);

    // ----------------------------
    // 🔹 Response Time (dummy example, replace with real logic)
    // ----------------------------
    const responseTime = employer.trustMetrics.responseTime || 5; // keep old or dummy avg

    // ----------------------------
    // 🔹 Job Fulfillment (dummy example, replace with real logic)
    // ----------------------------
    const jobsPosted = employer.jobsPosted || 0;
    const jobsCompleted = employer.jobsCompleted || 0;
    const jobFulfillment =
      jobsPosted > 0 ? Math.round((jobsCompleted / jobsPosted) * 10) : 0;

    // ----------------------------
    // 🔹 Trust Score Calculation
    // ----------------------------
    let trustScore =
      profileCompleteness + verifiedDocsScore + responseTime + jobFulfillment;

    // normalize to 0–10
    trustScore = Math.min(Math.round(trustScore / 4), 10);

    // ----------------------------
    // 🔹 Trust Badge (rating + theme)
    // ----------------------------
    let rating = 1;
    let badgeTheme = "bronze";

    if (trustScore >= 9) {
      rating = 5;
      badgeTheme = "gold";
    } else if (trustScore >= 7) {
      rating = 4;
      badgeTheme = "silver";
    } else if (trustScore >= 5) {
      rating = 3;
      badgeTheme = "bronze";
    } else if (trustScore >= 3) {
      rating = 2;
      badgeTheme = "bronze";
    }

    // ----------------------------
    // 🔹 Update Employer
    // ----------------------------
    employer.trustMetrics.profileCompleteness = profileCompleteness;
    employer.trustMetrics.verifiedDocuments = verifiedDocsScore;
    employer.trustMetrics.responseTime = responseTime;
    employer.trustMetrics.jobFulfillment = jobFulfillment;

    employer.trustScore = trustScore;
    employer.trustBadge.rating = rating;
    employer.trustBadge.theme = badgeTheme;
    employer.trustBadge.stars = rating;

    await employer.save();

    return [employer];
  } catch (error) {
    throw new Error("Failed to fetch employer: " + error.message);
  }
};

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

//let transport = nodemailer.createTransport({
//    service: 'gmail',
//    auth: {
//        user: process.env.nodemaileruser,
//        pass: process.env.nodemailerpassword,
//    }
//});

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
    return await Employer.findOne({ email });
  } catch (error) {
    console.error("Caught error in findUserByEmail:", error.message);
  }
};

const createGoogleUser = async (userData) => {
  try {
    const newUser = new Employer({
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
    const userExistInDb = await Employer.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (
      userExistInDb === null ||
      (userExistInDb != null && !userExistInDb.isverified)
    ) {
      const userMobileNumberExistInDb = await Employer.findOne({
        mobilenumber,
      });
      if (
        userMobileNumberExistInDb != null &&
        userMobileNumberExistInDb.mobilenumber == user.mobilenumber &&
        userMobileNumberExistInDb.isverified
      ) {
        return "This mobile number is already registered. Please log in or use a different number.";
      }
      //if (userExistInDb != null) {
      //    await Employer.deleteOne({ email });
      //}
      const otp = generateOTP();
      const messageId = await sendMail(user?.firstname, email, otp);
      if (messageId != null) {
        if (userExistInDb != null) {
          userExistInDb.firstname = user.firstname;
          userExistInDb.lastname = user.lastname;
          userExistInDb.email = email;
          userExistInDb.mobilenumber = mobilenumber;
          userExistInDb.password = user.password;
          userExistInDb.companyName = user.companyNamme;
          userExistInDb.gstNumber = user.gstNumber;
          savedUser = await userExistInDb.save();
        } else {
          const userSaveInDb = new Employer(user);
          savedUser = await userSaveInDb.save();
        }
        const token = jwt.sign({ otp, email }, process.env.JWT_SECRET, {
          expiresIn: "10m",
        });
        console.log(token, "tokenSignup");
        const savedUserObject = savedUser.toObject();
        delete savedUserObject.password;
        return { savedUserObject, token, otp };
      } else {
        return `There was an error while sending OTP ${messageId}`;
      }
    } else {
      return "Employer already exists";
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
    const userInDb = await Employer.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (userInDb == null) {
      return "Employer does not exist";
    }

    if (userInDb != null && !userInDb.isverified) {
      return "OTP is not verified, Please signup again";
    }

    const isValidPassword = await userInDb.comparePassword(password);
    if (isValidPassword) {
      //const otp = generateOTP();
      //const messageId = sendMail('', email, otp);
      //if (messageId != null) {
      //const mailOptions = {
      //        from: process.env.fromaddress,
      //        to: email,
      //        subject: 'Zuperr OTP code',
      //        text: `Your OTP code is: ${otp}`
      //};
      //await transport.sendMail(mailOptions);
      const newToken = jwt.sign(
        { userId: userInDb._id, email: userInDb.email },
        process.env.JWT_SECRET,
        { expiresIn: "14d" } // Token expiration time
      );
      //const userInDbObject = userInDb.toObject();
      //delete userInDbObject.password;
      return { newToken, id: userInDb["_id"] };
    } else {
      return "Invalid credentials";
    }
  } catch (error) {
    console.error("Caught error in checkUserInDb:", error.message);
  }
};

const validateOtp = async (otpsent, token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { otp, email } = decoded;
    console.log(decoded);
    if (otp.toString() != otpsent.toString()) {
      return "otp is incorrect";
    }

    const userInDb = await Employer.findOne({ email });
    if (!userInDb) {
      return "Employer data not found ";
    }
    console.log("decoded 23");
    if (userInDb.isverified) {
      const newToken = jwt.sign(
        { userId: userInDb._id, email: userInDb.email },
        process.env.JWT_SECRET,
        { expiresIn: "14d" } // Token expiration time
      );
      const userInDbObject = userInDb.toObject();
      delete userInDbObject.password;

      return { userSavedObject: userInDbObject, newToken };
    }

    userInDb.isverified = true;
    await Employer.updateOne(
      { _id: userInDb._id },
      { $set: { isverified: true } }
    );
    //const userSaved = await userInDb.save();
    // Generate a new JWT token
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
  }
};

const getPacificUserService = async (searchCriteria) => {
  try {
    const {
      jobTitle,
      skills,
      jobLocation,
      experience,
      degree,
      activeInLastDays,
    } = searchCriteria;

    const degreeHierarchy = {
      "Below 10th": 1,
      "10th": 2,
      "12th": 3,
      Graduate: 4,
      "Post Graduate": 5,
      PhD: 6,
    };

    const pipeline = [];
    const matchStage = { $match: {} };

    // Skills filter (AND logic)
    if (skills?.length) {
      const escapedSkills = skills.map(
        (skill) => skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape regex special chars
      );
      matchStage.$match.keySkills = {
        $in: escapedSkills.map((skill) => new RegExp(`^${skill}$`, "i")),
      };
    }

    // Job Title filter
    if (jobTitle) {
      matchStage.$match.$or = [
        { keySkills: { $regex: jobTitle, $options: "i" } },
        {
          "employmentHistory.description": { $regex: jobTitle, $options: "i" },
        },
      ];
    }

    // Location filter
    if (jobLocation) {
      matchStage.$match["careerPreference.preferredLocation"] = {
        $regex: jobLocation,
        $options: "i",
      };
    }

    // Add matchStage FIRST to optimize performance
    if (Object.keys(matchStage.$match).length > 0) {
      pipeline.push(matchStage);
    }

    // Degree filter (added AFTER matchStage)
    if (degree) {
      pipeline.push(
        {
          $addFields: {
            highestSchoolEducation: {
              $max: {
                $map: {
                  input: "$educationTill12th",
                  in: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$$this.education", "Below 10th"] },
                          then: 1,
                        },
                        {
                          case: { $eq: ["$$this.education", "10th"] },
                          then: 2,
                        },
                        {
                          case: { $eq: ["$$this.education", "12th"] },
                          then: 3,
                        },
                      ],
                      default: 0,
                    },
                  },
                },
              },
            },
            highestCollegeEducation: {
              $max: {
                $map: {
                  input: "$educationAfter12th",
                  in: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$$this.educationLevel", "Graduate"] },
                          then: 4,
                        },
                        {
                          case: {
                            $eq: ["$$this.educationLevel", "Post Graduate"],
                          },
                          then: 5,
                        },
                        {
                          case: { $eq: ["$$this.educationLevel", "PhD"] },
                          then: 6,
                        },
                      ],
                      default: 0,
                    },
                  },
                },
              },
            },
          },
        },
        {
          $addFields: {
            highestEducationLevel: {
              $max: ["$highestSchoolEducation", "$highestCollegeEducation"],
            },
          },
        },
        {
          $match: {
            highestEducationLevel: { $gte: degreeHierarchy[degree] },
          },
        }
      );
    }

    // Experience filter
    if (experience !== undefined) {
      const experienceValue = parseFloat(experience);
      if (isNaN(experienceValue)) {
        return res
          .status(400)
          .json({ message: "Experience must be a valid number" });
      }

      pipeline.push(
        {
          $addFields: {
            totalMonths: {
              $sum: {
                $map: {
                  input: "$employmentHistory",
                  as: "emp",
                  in: {
                    $add: [
                      {
                        $multiply: [
                          { $ifNull: ["$$emp.workExperience.years", 0] },
                          12,
                        ],
                      },
                      { $ifNull: ["$$emp.workExperience.months", 0] },
                    ],
                  },
                },
              },
            },
          },
        },
        {
          $addFields: {
            totalYears: { $round: [{ $divide: ["$totalMonths", 12] }, 1] },
          },
        },
        {
          $match: { totalYears: { $gte: experienceValue } },
        }
      );
    }

    // Active in last N days filter
    if (activeInLastDays) {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - activeInLastDays);
      pipeline.push({
        $match: { updatedAt: { $gte: dateThreshold } },
      });
    }

    const candidates = await User.aggregate(pipeline);
    return candidates;
  } catch (error) {
    console.error("Caught error in getPacificUserService:", error.message);
  }
};

const validatePasswordForUpdateEmployerEmailService = async (
  oldEmail,
  newEmail,
  password
) => {
  const userInDb = await Employer.findOne({
    email: { $regex: new RegExp(`^${oldEmail}$`, "i") },
  });
  const existinguserInDb = await Employer.findOne({
    email: { $regex: new RegExp(`^${newEmail}$`, "i") },
  });
  if (existinguserInDb) {
    return "New email already exists";
  }
  if (userInDb) {
    const isValidPassword = await userInDb.comparePassword(password);
    console.log(isValidPassword);
    if (isValidPassword) {
      const otp = generateOTP();
      const messageId = sendMailOTPForEmailUpdate(
        userInDb.firstname,
        newEmail,
        otp
      );
      if (messageId) {
        const token = jwt.sign(
          { otp, newEmail, oldEmail },
          process.env.JWT_SECRET,
          {
            expiresIn: "10m",
          }
        );
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
};

const validateOtpForEmployerEmailUpdate = async (otpReceived, token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { otp, oldEmail, newEmail } = decoded;

    if (otp == otpReceived) {
      await Employer.updateOne(
        { email: oldEmail },
        { $set: { email: newEmail } }
      );
      return { newEmail };
    } else {
      return "Incorrect OTP";
    }
  } catch (error) {
    console.error(
      "Caught error in validateOtpForEmployerEmailUpdate:",
      error.message
    );
    return "Something went wrong. Please try again.";
  }
};

module.exports = {
  getAllEmployersService,
  getSingleEmployerService,
  saveUserInDb,
  checkUserInDb,
  validateOtp,
  createGoogleUser,
  handleGoogleAuth,
  getPacificUserService,
  validatePasswordForUpdateEmployerEmailService,
  validateOtpForEmployerEmailUpdate,
};

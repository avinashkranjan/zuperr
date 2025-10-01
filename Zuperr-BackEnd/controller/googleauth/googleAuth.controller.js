const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../../model/employee/employee");
const employer = require("../../model/employer/employer.model");

function generateStrongPassword(length = 12) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  // Use only these special characters: @$!%*?&
  const special = "@$!%*?&";
  const allChars = uppercase + lowercase + digits + special;
  let password = "";
  // Ensure at least one character from each category:
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];
  // Fill remaining characters:
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  // Shuffle the result
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
  return password;
}

// For sign-in (find or create)
async function handleGoogleAuth(profileData, userType) {
  try {
    console.log(profileData, "profileData");
    // Extract required fields from Google payload
    const { email, given_name, family_name } = profileData;
    let userInDb, employerInDb;
    if (userType == "employee") {
      userInDb = await User.findOne({ email });
      if (!userInDb) {
        userInDb = new User({
          firstname: given_name,
          lastname: family_name,
          email: email,
          password: generateStrongPassword(12),
          isverified: true,
        });
        const userSavedInDb = await userInDb.save();
        const newToken = jwt.sign(
          { userId: userSavedInDb._id.toString(), email: userSavedInDb.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return {
          newUserSavedInDb: userSavedInDb,
          googleAuthenticationToken: newToken,
        };
      } else {
        const newToken = jwt.sign(
          { userId: userInDb._id.toString(), email: userInDb.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return {
          newUserSavedInDb: userInDb,
          googleAuthenticationToken: newToken,
        };
      }
    } else {
      employerInDb = await employer.findOne({ email });
      if (!employerInDb) {
        employerInDb = new employer({
          firstname: given_name,
          lastname: family_name,
          email: email,
          password: generateStrongPassword(12),
          isverified: true,
        });
        const employerSavedInDb = await employerInDb.save();
        const newToken = jwt.sign(
          {
            userId: employerSavedInDb._id.toString(),
            email: employerSavedInDb.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return {
          newUserSavedInDb: employerSavedInDb,
          googleAuthenticationToken: newToken,
        };
      } else {
        const newToken = jwt.sign(
          { userId: employerInDb._id.toString(), email: employerInDb.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return {
          newUserSavedInDb: employerInDb,
          googleAuthenticationToken: newToken,
        };
      }
    }
    //userInDb = await employer.findOne({ email });
    //if (!userInDb) {
    //    userInDb = new employer({
    //        firstname: given_name,
    //        lastname: family_name,
    //        email: email,
    //        password: generateStrongPassword(12),
    //        isverified: true,
    //    });
    //}

    //if (!userInDb) {
    //    await userInDb.save();
    //} else {
    //    if (!userInDb.isverified) {
    //        throw new Error("User is not verified, please sign up again");
    //    }
    //}

    //// Generate JWT using the user's MongoDB ObjectId (userInDb._id is already an ObjectId)
    //const newToken = jwt.sign(
    //    { userId: userInDb._id.toString(), email: userInDb.email },
    //    process.env.JWT_SECRET,
    //    { expiresIn: '1h' }
    //);
    //return { newUserSavedInDb: userInDb, googleAuthenticationToken: newToken };
  } catch (error) {
    console.error("Error in handleGoogleAuth:", error.message);
    throw error;
  }
}

// For Google sign-up (only create; error if user exists)
async function handleGoogleSignUp(profileData, userType) {
  try {
    const { email, given_name, family_name } = profileData;

    let userInDb;
    if (userType == "employee") {
      userInDb = await User.findOne({ email });
      if (userInDb) {
        return { error: "User already exists" };
      }
      userInDb = new User({
        firstname: given_name,
        lastname: family_name,
        email: email,
        password: generateStrongPassword(12),
        isverified: true,
      });
    } else {
      userInDb = await employer.findOne({ email });
      if (userInDb) {
        return { error: "User already exists" };
      }
      userInDb = new employer({
        firstname: given_name,
        lastname: family_name,
        email: email,
        password: generateStrongPassword(12),
        isverified: true,
      });
    }

    await userInDb.save();

    const newToken = jwt.sign(
      { userId: userInDb._id.toString(), email: userInDb.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { newUserSavedInDb: userInDb, googleAuthenticationToken: newToken };
  } catch (error) {
    console.error("Error in handleGoogleSignUp:", error.message);
    throw error;
  }
}

// Controller for Google Sign-In (find or create)
const googleSignInCallback = async (req, res) => {
  try {
    const { token, userType } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });
    }
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const result = await handleGoogleAuth(payload, userType);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: {
        firstname: result.newUserSavedInDb?.firstname,
        lastname: result.newUserSavedInDb.lastname,
        email: result.newUserSavedInDb.email,
      },
      signInToken: result.googleAuthenticationToken,
      userID: result.newUserSavedInDb._id,
      userExperienceLevel: result.newUserSavedInDb.userExperienceLevel || "",
    });
  } catch (error) {
    console.error("Error in Google sign-in callback:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Authentication failed",
        error: error.message,
      });
  }
};

// Controller for Google Sign-Up (create new user only)
const googleSignUpCallback = async (req, res) => {
  try {
    const { token, userType } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });
    }
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(userType, "userType");
    const result = await handleGoogleSignUp(payload, userType);
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: "Google sign-up successful",
      user: {
        firstname: result.newUserSavedInDb?.firstname,
        lastname: result.newUserSavedInDb.lastname,
        email: result.newUserSavedInDb.email,
      },
      signInToken: result.googleAuthenticationToken,
      userID: result.newUserSavedInDb._id,
      userExperienceLevel: result.newUserSavedInDb.userExperienceLevel || "",
    });
  } catch (error) {
    console.error("Error in Google sign-up callback:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Sign-up failed",
        error: error.message,
      });
  }
};

module.exports = {
  googleSignInCallback,
  googleSignUpCallback,
};

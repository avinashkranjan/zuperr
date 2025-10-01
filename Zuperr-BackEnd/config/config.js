const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
const { handleGoogleAuth } = require("../services/employee/employee.service");

require("dotenv").config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.connectionString);
    console.log("Mongodb connected");
  } catch (error) {
    console.log("Error connecing mongodb ", error);
    process.exit(1);
  }
};

async function getPhoneNumber(accessToken) {
  try {
    // Make a request to the Google People API to get the phone number
    const response = await axios.get(
      "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // Extract the phone number from the response, if available
    const phoneNumbers = response.data.phoneNumbers || [];
    if (phoneNumbers.length > 0) {
      // Assuming the first phone number is the mobile number
      return phoneNumbers[0].value;
    } else {
      return null; // No phone number available
    }
  } catch (error) {
    console.error("Error fetching phone number:", error);
    return null; // If there's an error, return null for the phone number
  }
}

// Configure Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Extract profile data
        const profileData = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
        };

        const mobilenumber = await getPhoneNumber(accessToken);

        // Add phone number to the profileData
        if (mobilenumber) {
          profileData.mobilenumber = mobilenumber;
        } else {
          profileData.mobilenumber = null; // In case the phone number is not available
        }

        // Call service function to handle authentication
        const { newUserSavedInDb, googleAuthenticationToken } =
          await handleGoogleAuth(profileData);
        return done(null, {
          user: newUserSavedInDb,
          token: googleAuthenticationToken,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    firstName: user?.firstname,
    lastName: user.lastname,
    email: user.email,
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = {
  port: process.env.port || 8000,
  connectToDb,
  passport,
};

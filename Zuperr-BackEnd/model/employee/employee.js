const mongo = require("mongoose");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongo.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name field is required"],
      match: [/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Please enter a valid first name"],
      maxlength: [20, "First name cannot exceed 20 characters"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name field is required"],
      match: [/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Please enter a valid last name"],
      maxlength: [20, "Last name cannot exceed 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[^@]+@[^@]+\.[^@]+$/,
        "Please provide a valid email address with a proper domain.",
      ],
    },
    mobilenumber: {
      type: String,
      default: "0000000000",
      validate: {
        validator: function (value) {
          const mobileNumberRegex = /^[0-9]{10}$/;
          return mobileNumberRegex.test(value);
        },
        message: "Invalid mobile number. Please enter a valid 10-digit number.",
      },
    },
    noticePeriod: {
      type: String,
      default: "0",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long."],
      maxlength: [12, "Password cannot exceed 12 characters"],
      validate: {
        validator: function (value) {
          const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
          return strongPasswordRegex.test(value);
        },
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      },
    },
    isverified: { type: Boolean, required: true, default: false },
    userExperienceLevel: { type: String, default: null },
    minimumExperienceInYears: { type: Number, default: 0 },
    maximumExperienceInYears: { type: Number, default: 0 },
    profilePicture: {
      type: String,
      default: null,
    },
    resume: {
      type: String,
      default: null,
    },
    educationAfter12th: [
      {
        educationLevel: { type: String, default: null },
        courseName: { type: String, default: null },
        specialization: { type: String, default: null },
        grading: { type: String, default: null },
        gradeValue: { type: mongo.Schema.Types.Mixed, default: null },
        instituteName: { type: String, default: null },
        courseDuration: {
          from: { type: Date, default: Date.now },
          to: { type: Date, default: Date.now },
        },
        courseType: { type: String, default: null },
        examinationBoard: { type: String, default: null },
        skills: { type: String, default: null },
        passingYear: { type: Number, default: null },
      },
    ],
    educationTill12th: [
      {
        education: { type: String, default: null },
        examinationBoard: { type: String, default: null },
        mediumOfStudy: { type: String, default: null },
        gradeType: { type: String, default: null },
        gradingOutOf: { type: String, default: null },
        gradeValue: { type: String, default: null },
        passingYear: { type: String, default: null },
      },
    ],
    careerPreference: {
      jobTypes: { type: [String], default: null },
      availability: { type: String, default: null },
      preferredLocation: { type: String, default: null },
      minimumSalaryLPA: { type: Number, default: 0 },
      maximumSalaryLPA: { type: Number, default: 0 },
      jobRoles: { type: [String], default: [] }, // Added from career-prefs.tsx
      preferredShift: {type: String, default: null},
      locationPreferenceKM: { type: Number, default: 0 } 
    },
    keySkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        default: null,
      },
    ],
    dateOfBirth: {
      type: Date,
      required: false,
      validate: {
        validator: function (value) {
          return value < Date.now();
        },
        message: "Date of birth must be a valid date in the past",
      },
    },
    gender: { type: String, default: null },
    maritalStatus: { type: String, default: null }, // Added from personal-details.tsx
    address: {
      // Added from personal-details.tsx
      line1: { type: String, default: null },
      landmark: { type: String, default: null },
      district: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      pincode: { type: String, default: null },
    },
    permanentAddress: {
      // Added from personal-details.tsx
      line1: { type: String, default: null },
      landmark: { type: String, default: null },
      district: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      pincode: { type: String, default: null },
    },
    hasPermanentAddress: { type: Boolean, default: false }, // Added from personal-details.tsx
    languages: [
      {
        language: { type: String, default: null },
        proficiencyLevel: { type: String, default: null },
      },
    ],
    internships: [
      {
        companyName: { type: String, default: null },
        role: { type: String, default: null },
        duration: {
          from: { type: Date, default: Date.now },
          to: { type: Date, default: Date.now },
        },
        projectName: { type: String, default: null },
        description: { type: String, default: null },
        keySkills: { type: String, default: null },
        projectURL: { type: String, default: null },
      },
    ],
    projects: [
      {
        projectName: { type: String, default: null },
        duration: {
          from: { type: Date, default: Date.now },
          to: { type: Date, default: Date.now },
        },
        description: { type: String, default: null },
        keySkills: { type: String, default: null },
        endResult: { type: String, default: null },
        projectURL: { type: String, default: null },
      },
    ],
    profileSummary: { type: String, default: null },
    accomplishments: [
      {
        certificationName: { type: String, default: null },
        certificationID: { type: String, default: null },
        certificationURL: { type: String, default: null },
        certificationValidity: {
          month: { type: String, default: null },
          year: { type: String, default: null },
        },
        noExpiry: { type: Boolean, default: false }, // Added from accomplishments.tsx
        awards: { type: String, default: null },
        clubs: { type: String, default: null },
        positionHeld: { type: String, default: null },
        educationalReference: { type: String, default: null },
        duration: {
          from: { type: Date, default: Date.now },
          to: { type: Date, default: Date.now },
        },
        isCurrent: { type: Boolean, default: false }, // Added from accomplishments.tsx
        responsibilities: { type: String, default: null },
        mediaUpload: { type: String, default: null },
      },
    ],
    competitiveExams: [
      {
        examName: { type: String, default: null },
        examYear: { type: String, default: null },
        obtainedScore: { type: String, default: null }, // Added from entrance_exams.tsx
        maxScore: { type: String, default: null }, // Added from entrance_exams.tsx
      },
    ],
    employmentHistory: [
      {
        workExperience: {
          years: { type: Number, default: null },
          months: { type: Number, default: null },
        },
        companyName: { type: String, default: null },
        duration: {
          from: { type: Date, default: Date.now },
          to: { type: Date, default: Date.now },
        },
        position: { type: String, default: null },
        keyAchievements: { type: String, default: null },
        annualSalary: { type: String, default: null },
        isCurrentJob: { type: Boolean, default: null },
        description: { type: String, default: null },
      },
    ],
    academicAchievements: [
      {
        achievement: { type: String, default: null },
        receivedDuring: { type: String, default: null }, // Added from academic-achemivements.tsx
        educationReference: { type: String, default: null }, // Added from academic-achemivements.tsx
        topRank: { type: String, default: null },
      },
    ],
    selectedJobCategories: { type: [String], default: null },
    isDeactivated: { type: Boolean, default: false},
    isDeactivatedReason: { type: String, default: null},
    isDeletedPermanently: { type: Boolean, default: false},
    isDeletedPermanentlyReason: { type: String, default: null},
    jobSaved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        default: null,
      },
    ],
    candidateProfileVisibility: {type: String, default: null},
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.password;
        delete ret.__v;
        delete ret.isverified;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
      return next();
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongo.model("User", userSchema);

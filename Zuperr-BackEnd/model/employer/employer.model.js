const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
    },
    companyLogo: {
      type: String, // file URL / S3 path
    },
    companyWebsite: {
      type: String,
    },
    companySize: {
      type: String, // e.g. "1-10", "11-50", etc.
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: function (value) {
          if (!value) return false;
          const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return emailRegex.test(value);
        },
        message: "Email is invalid",
      },
    },
    mobileNumber: {
      type: String,
      default: "0000000000",
      validate: {
        validator: function (value) {
          const mobileNumberRegex = /^[0-9]{10}$/;
          return mobileNumberRegex.test(value);
        },
        message: "Mobile number must be exactly 10 digits",
      },
    },
    gstNumber: {
      type: String,
      default: "",
    },
    gstDocs: {
      type: String, // file URL for GST verification doc
    },
    panDocs: {
      type: String, // file URL for PAN verification doc
    },
    industries: {
      type: [String],
      default: [],
    },
    address: {
      district: { type: String },
      state: { type: String },
      country: { type: String },
      line1: { type: String },
      landmark: { type: String },
      pincode: { type: String },
    },
    description: {
      type: String,
      maxlength: 200,
    },

    // Auth & Verification
    password: {
      type: String,
      required: [true, "Password is required"],
      // validate: {
      //   validator: function (value) {
      //     const strongPasswordRegex =
      //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      //     return strongPasswordRegex.test(value);
      //   },
      //   message:
      //     "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character",
      // },
    },
    otp: { type: String },
    isGstVerified: {
      type: Boolean,
      default: false,
    },
    isverified: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    isDeactivatedReason: { type: String, default: null },
    isDeletedPermanently: { type: Boolean, default: false },
    isDeletedPermanentlyReason: { type: String, default: null },
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    recruiterVisibility: {
      type: Boolean,
      default: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    preferences: {
      jobType: { type: String },
      workMode: { type: String },
      industry: { type: String },
      aboutCompany: { type: String },
      isWalkIn: { type: String, enum: ["yes", "no"] },
      gender: { type: String, enum: ["any", "male", "female", "other"] },
      hideGender: { type: Boolean, default: false },
      ageRange: {
        from: { type: Number },
        to: { type: Number },
      },
      hideAge: { type: Boolean, default: false },
      googleSync: { type: Boolean, default: true },
      scheduleTemplate: { type: String },
    },
    hiringPreferences: {
      states: {
        type: [String],
        validate: {
          validator: (arr) => arr.length <= 3,
          message: "You can select up to 3 states only",
        },
        default: [],
      },
      cities: {
        type: [String],
        validate: {
          validator: (arr) => arr.length <= 3,
          message: "You can select up to 3 cities only",
        },
        default: [],
      },
      distance: {
        type: Number, // optional if you enable slider later
        default: null,
      },
    },
    recruiterProfile: {
      fullName: { type: String },
      email: { type: String },
      mobile: { type: String },
      linkedin: { type: String, default: "" },
      designation: {
        type: String,
        enum: ["HR Manager", "Talent Acquisition", "CEO", "Associates"],
      },
    },
    trustMetrics: {
      profileCompleteness: { type: Number, default: 0, min: 0, max: 10 },
      verifiedDocuments: { type: Number, default: 0, min: 0, max: 10 },
      responseTime: { type: Number, default: 0, min: 0, max: 10 },
      jobFulfillment: { type: Number, default: 0, min: 0, max: 10 },
    },

    trustBadge: {
      theme: {
        type: String,
        enum: ["gold", "silver", "bronze", "none"],
        default: "none",
      },
      rating: { type: Number, default: 0 },
      stars: { type: Number, default: 0 },
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
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

// 🔐 Hash password before save
employerSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare passwords
employerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Employer", employerSchema);

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    minimumExperienceInYears: { type: Number, default: 0 },
    maximumExperienceInYears: { type: Number, default: 0 },
    jobCategory: { type: String, required: true },
    jobType: { type: String, required: true },
    workMode: { type: String, required: true },
    salaryRange: {
      currency: {
        type: String,
        default: "INR",
      },
      minimumSalary: {
        type: Number,
        required: true,
        default: 0,
      },
      maximumSalary: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    minimumSalaryLPA: { type: Number, required: true, default: 0 },
    maximumSalaryLPA: { type: Number, required: true, default: 0 },
    skills: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    ],
    screeningQuestions: { type: [String] },
    education: { type: String, required: true },
    industry: { type: [String], required: true },
    degree: { type: String, required: true },
    fromAge: { type: String, required: true },
    toAge: { type: String, required: true },
    gender: { type: String, required: true },
    jobDescription: { type: String, required: true },
    walkIn: { type: String, required: true },
    location: { type: String, required: true },
    distance: { type: Number, required: true },
    previewed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isSponsored: { type: Boolean, default: false },
    jobViewsCount: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    applicants: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedDate: { type: Date, default: Date.now },
        status: String,
        score: Number,
      },
    ],
    bookmarkedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    jobStatus: { type: String, default: "Open" },
    status: {
      type: String,
      default: "pending",
      enum: ["approved", "rejected", "pending"],
    },
    jobStatusReason: { type: String, default: "" },
    jobExperienceLevelType: { type: String },
  },
  { timestamps: true }
);

jobSchema.pre("save", function (next) {
  if (this.minimumExperienceInYears === 0) {
    this.jobExperienceLevelType = "Entry-Level";
  } else {
    this.jobExperienceLevelType = "Senior-Level";
  }
  next();
});

jobSchema.index({
  title: "text",
  jobCategory: "text",
  jobType: "text",
  workMode: "text",
  salaryRange: "text",
  experienceLevel: "text",
  skills: "text",
  qualifications: "text",
  location: "text",
});

module.exports = mongoose.model("Job", jobSchema);

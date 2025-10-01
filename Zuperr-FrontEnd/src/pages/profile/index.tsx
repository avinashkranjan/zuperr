/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import { get, post } from "@api/index";
import Loader from "@base-components/Loader";
// import AccomplishmentLogo from "../../assets/images/AccomplishmentLogo.png";
// import CareerPreferenceLogo from "../../assets/images/CareerPreferenceLogo.png";
// import CompetetiveExamsLogo from "../../assets/images/CompetetiveExamsLogo.png";
// import EducationLogo from "../../assets/images/EducationLogo.png";
// import EmploymentHistoryLogo from "../../assets/images/EmploymentHistoryLogo.png";
// import KeySkillsLogo from "../../assets/images/KeySkillsLogo.png";
import EditDialog from "./edit-dialog";
import ProfileHeader from "../../components/ProfileHeader";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Separator } from "@components/ui/separator";
import ApplicationStatus from "./application-status";
import ProfileChart from "./profile-chart";
import ViewAndEditSections from "./view-and-edit-section";
import CareerPreferencesForm from "./profile-forms/career-prefs";
import EducationDialog from "./profile-forms/education";
import TenthEducationDialog from "./profile-forms/education-higher";
import KeySkillsDialog from "./profile-forms/skills-form";
import LanguageDialog from "./profile-forms/languages";
import InternshipDialog from "./profile-forms/internships";
import ProjectDialog from "./profile-forms/projects";
import ProfileSummaryDialog from "./profile-forms/profile_summary";
import EntranceExams from "./profile-forms/entrance_exams";
import EmploymentHistoryDialog from "./profile-forms/employment-history";
import AcademicAchievementsDialog from "./profile-forms/academic-achemivements";
import PersonalDetailsDialog from "./profile-forms/personal-details";
import AccomplishmentsDialog from "./profile-forms/accomplishments";

export const profileSectionsConfig = [
  {
    id: "personalDetails",
    title: "Personal Details",
    isList: false,
    fields: [
      { label: "First Name", name: "firstname", type: "text", required: true },
      { label: "Last Name", name: "lastname", type: "text", required: true },
      {
        label: "Email",
        name: "email",
        type: "email",
        required: true,
        disabled: true,
      },
      {
        label: "Mobile Number",
        name: "mobilenumber",
        type: "tel",
        required: true,
      },
      { label: "Date of Birth", name: "dateOfBirth", type: "date" },
      {
        label: "Gender",
        name: "gender",
        type: "select",
        options: ["Male", "Female", "Other", "Prefer not to say"],
      },
      {
        label: "Marital Status",
        name: "maritalStatus",
        type: "select",
        options: ["Single", "Married", "Divorced", "Widowed"],
      },
      { label: "Profile Picture", name: "profilePicture", type: "file" },
      { label: "Resume", name: "resume", type: "file" },

      { label: "Address (Line 1)", name: "address.line1", type: "text" },
      { label: "Address (Landmark)", name: "address.landmark", type: "text" },
      { label: "Address (District)", name: "address.district", type: "text" },
      { label: "Address (State)", name: "address.state", type: "text" },
      { label: "Address (Country)", name: "address.country", type: "text" },
      { label: "Address (Pincode)", name: "address.pincode", type: "text" },
      {
        label: "Different Permanent Address",
        name: "hasPermanentAddress",
        type: "checkbox",
      },
      {
        label: "Permanent Address (Line 1)",
        name: "permanentAddress.line1",
        type: "text",
      },
      {
        label: "Permanent Address (Landmark)",
        name: "permanentAddress.landmark",
        type: "text",
      },
      {
        label: "Permanent Address (District)",
        name: "permanentAddress.district",
        type: "text",
      },
      {
        label: "Permanent Address (State)",
        name: "permanentAddress.state",
        type: "text",
      },
      {
        label: "Permanent Address (Country)",
        name: "permanentAddress.country",
        type: "text",
      },
      {
        label: "Permanent Address (Pincode)",
        name: "permanentAddress.pincode",
        type: "text",
      },
    ],
  },
  {
    id: "educationTill12th",
    title: "Education (Till 12th)",
    isList: true,
    arrayName: "educationTill12th",
    fields: [
      {
        label: "Education Level",
        name: "education",
        type: "select",
        options: ["10th", "12th"],
        required: true,
      },
      { label: "Examination Board", name: "examinationBoard", type: "text" },
      { label: "Medium of Study", name: "mediumOfStudy", type: "text" },
      {
        label: "Grade Type",
        name: "gradeType",
        type: "select",
        options: ["Percentage", "CGPA", "GPA"],
      },
      { label: "Grading Out Of", name: "gradingOutOf", type: "text" },
      { label: "Grade Value", name: "gradeValue", type: "text" },
      { label: "Passing Year", name: "passingYear", type: "year" },
    ],
  },
  {
    id: "higherEducation",
    title: "Higher Education",
    isList: true,
    arrayName: "educationAfter12th",
    fields: [
      {
        label: "Education Level",
        name: "educationLevel",
        type: "select",
        options: ["Diploma", "Bachelor's", "Master's", "PhD"],
        required: true,
      },
      {
        label: "Course Name",
        name: "courseName",
        type: "text",
        required: true,
      },
      { label: "Specialization", name: "specialization", type: "text" },
      {
        label: "Institute Name",
        name: "instituteName",
        type: "text",
        required: true,
      },
      {
        label: "Course Type",
        name: "courseType",
        type: "select",
        options: ["Full-time", "Part-time", "Distance", "Online"],
      },
      { label: "Examination Board", name: "examinationBoard", type: "text" },
      { label: "Skills Gained", name: "skills", type: "tags" },
      {
        label: "Grading System",
        name: "grading",
        type: "select",
        options: ["Percentage", "CGPA", "GPA"],
      },
      { label: "Grade Value", name: "gradeValue", type: "number" },
      {
        label: "Passing Year",
        name: "passingYear",
        type: "year",
        required: true,
      },
      { label: "Start Date", name: "courseDuration.from", type: "date" },
      { label: "End Date", name: "courseDuration.to", type: "date" },
    ],
  },
  {
    id: "keySkills",
    title: "Key Skills",
    isList: true,
    arrayName: "keySkills",
    fields: [
      {
        label: "Skill",
        name: "skill",
        type: "autocomplete",
        endpoint: "/api/skills", // Suggested API endpoint
        required: true,
      },
    ],
  },
  {
    id: "careerPreference",
    title: "Career Preferences",
    isList: false,
    parentObject: "careerPreference",
    fields: [
      {
        label: "Job Types",
        name: "jobTypes",
        type: "multiselect",
        options: [
          "Full-time",
          "Part-time",
          "Contract",
          "Internship",
          "Freelance",
        ],
      },
      {
        label: "Preferred Job Roles",
        name: "jobRoles",
        type: "autocomplete",
        endpoint: "/api/job-roles",
        multiple: true,
      },
      {
        label: "Preferred Locations",
        name: "preferredLocation",
        type: "autocomplete",
        endpoint: "/api/locations",
        multiple: true,
      },
      {
        label: "Availability",
        name: "availability",
        type: "select",
        options: [
          "Immediately",
          "1 month notice",
          "2 months notice",
          "3 months notice",
        ],
      },
      {
        label: "Experience Level",
        name: "userExperienceLevel",
        type: "select",
        options: [
          "Fresher",
          "0-2 years",
          "2-5 years",
          "5-10 years",
          "10+ years",
        ],
      },
      {
        label: "Minimum Salary (LPA)",
        name: "minimumSalaryLPA",
        type: "number",
        min: 0,
        step: 0.5,
      },
      {
        label: "Maximum Salary (LPA)",
        name: "maximumSalaryLPA",
        type: "number",
        min: 0,
        step: 0.5,
      },
      {
        label: "Notice Period (days)",
        name: "noticePeriod",
        type: "number",
        min: 0,
      },
      {
        label: "Job Categories",
        name: "selectedJobCategories",
        type: "autocomplete",
        endpoint: "/api/job-categories",
        multiple: true,
      },
    ],
  },
  {
    id: "languages",
    title: "Languages",
    isList: true,
    arrayName: "languages",
    fields: [
      {
        label: "Language",
        name: "language",
        type: "autocomplete",
        endpoint: "/api/languages",
        required: true,
      },
      {
        label: "Proficiency",
        name: "proficiencyLevel",
        type: "select",
        options: ["Basic", "Conversational", "Fluent", "Native"],
        required: true,
      },
    ],
  },
  {
    id: "internships",
    title: "Internships",
    isList: true,
    arrayName: "internships",
    fields: [
      {
        label: "Company Name",
        name: "companyName",
        type: "text",
        required: true,
      },
      { label: "Role", name: "role", type: "text", required: true },
      { label: "Project Name", name: "projectName", type: "text" },
      { label: "Description", name: "description", type: "richtext" },
      { label: "Skills Used", name: "keySkills", type: "tags" },
      { label: "Project URL", name: "projectURL", type: "url" },
      {
        label: "Start Date",
        name: "duration.from",
        type: "date",
        required: true,
      },
      { label: "End Date", name: "duration.to", type: "date" },
      { label: "Currently Working", name: "isCurrent", type: "checkbox" },
    ],
  },
  {
    id: "projects",
    title: "Projects",
    isList: true,
    arrayName: "projects",
    fields: [
      {
        label: "Project Name",
        name: "projectName",
        type: "text",
        required: true,
      },
      { label: "Description", name: "description", type: "richtext" },
      { label: "Skills Used", name: "keySkills", type: "tags" },
      { label: "End Result", name: "endResult", type: "text" },
      { label: "Project URL", name: "projectURL", type: "url" },
      { label: "Start Date", name: "duration.from", type: "date" },
      { label: "End Date", name: "duration.to", type: "date" },
      { label: "Ongoing Project", name: "isCurrent", type: "checkbox" },
    ],
  },
  {
    id: "employmentHistory",
    title: "Employment History",
    isList: true,
    arrayName: "employmentHistory",
    fields: [
      {
        label: "Company Name",
        name: "companyName",
        type: "text",
        required: true,
      },
      { label: "Position", name: "position", type: "text", required: true },
      { label: "Description", name: "description", type: "richtext" },
      { label: "Key Achievements", name: "keyAchievements", type: "richtext" },
      { label: "Annual Salary", name: "annualSalary", type: "text" },
      { label: "Currently Working", name: "isCurrentJob", type: "checkbox" },
      { label: "Years", name: "workExperience.years", type: "number", min: 0 },
      {
        label: "Months",
        name: "workExperience.months",
        type: "number",
        min: 0,
        max: 11,
      },
      { label: "Start Date", name: "duration.from", type: "date" },
      { label: "End Date", name: "duration.to", type: "date" },
    ],
  },
  {
    id: "academicAchievements",
    title: "Academic Achievements",
    isList: true,
    arrayName: "academicAchievements",
    fields: [
      {
        label: "Achievement",
        name: "achievement",
        type: "text",
        required: true,
      },
      { label: "Received During", name: "receivedDuring", type: "text" },
      {
        label: "Education Reference",
        name: "educationReference",
        type: "text",
      },
      { label: "Top Rank", name: "topRank", type: "text" },
      { label: "Year", name: "year", type: "year" },
      { label: "Institution", name: "institution", type: "text" },
      { label: "Description", name: "description", type: "richtext" },
    ],
  },
  {
    id: "competitiveExams",
    title: "Entrance Exams",
    isList: true,
    arrayName: "competitiveExams",
    fields: [
      { label: "Exam Name", name: "examName", type: "text", required: true },
      { label: "Exam Year", name: "examYear", type: "year" },
      { label: "Obtained Score", name: "obtainedScore", type: "text" },
      { label: "Maximum Score", name: "maxScore", type: "text" },
    ],
  },
  {
    id: "accomplishments",
    title: "Accomplishments",
    isList: true,
    arrayName: "accomplishments",
    fields: [
      { label: "Certification Name", name: "certificationName", type: "text" },
      { label: "Certification ID", name: "certificationID", type: "text" },
      { label: "Certification URL", name: "certificationURL", type: "url" },
      { label: "No Expiry", name: "noExpiry", type: "checkbox" },

      { label: "Awards", name: "awards", type: "text" },
      { label: "Clubs", name: "clubs", type: "text" },
      { label: "Position Held", name: "positionHeld", type: "text" },
      { label: "Responsibilities", name: "responsibilities", type: "richtext" },
      { label: "Start Date", name: "duration.from", type: "date" },
      { label: "End Date", name: "duration.to", type: "date" },
      { label: "Currently Active", name: "isCurrent", type: "checkbox" },
      { label: "Media Upload", name: "mediaUpload", type: "file" },
    ],
  },
  {
    id: "profileSummary",
    title: "Profile Summary",
    isList: false,
    fields: [
      {
        label: "Summary",
        name: "profileSummary",
        type: "richtext",
        required: true,
      },
    ],
  },
];

// --- Helper Functions ---
// const getNestedValue = (obj: any, path: any) => {
//   if (!obj || !path) return undefined;
//   // eslint-disable-next-line no-useless-escape
//   const keys = path.split(/[.\[\]]/).filter((key: any) => key !== "");

//   return keys.reduce((acc: any, key: string) => {
//     if (acc && typeof acc === "object") {
//       return acc[key];
//     }
//     return undefined;
//   }, obj);
// };

const isFieldFilled = (value: any) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  !(Array.isArray(value) && value.length === 0);

// --- React Component ---
export default function Profile({
  activeTabWindow,
}: {
  activeTabWindow?: string;
}) {
  const { control, setValue, getValues, watch } = useForm({
    defaultValues: {
      personalDetails: {},
      careerPreference: {},
      profileSummary: "",
      educationTill12th: [],
      educationAfter12th: [],
      keySkills: [],
      languages: [],
      internships: [],
      projects: [],
      accomplishments: [],
      competitiveExams: [],
      employmentHistory: [],
      academicAchievements: [],
      firstname: "",
      lastname: "",
      email: "",
      mobilenumber: "",
      dateOfBirth: null,
      gender: "",
      maritalStatus: "",
      hasPermanentAddress: false,
      address: {
        line1: "",
        landmark: "",
        district: "",
        state: "",
        country: "",
        pincode: "",
      },
      permanentAddress: {
        line1: "",
        landmark: "",
        district: "",
        state: "",
        country: "",
        pincode: "",
      },
      profilePicture: "",
    },
  });
  const [activeTab, setActiveTab] = useState(
    activeTabWindow ?? "view-and-edit"
  );
  const [activeActivityTab, setActiveActivityTab] = useState(
    "profile-performance"
  );
  const [activeSection, setActiveSection] = useState("resume");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSectionConfig, setCurrentSectionConfig] = useState<any>(null);
  const [dialogKey, setDialogKey] = useState<string>(""); // Unique key for dialog
  const [loader, setLoader] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [candidateData, setCandidateData] = useState<any>(null);

  const allValues = watch();

  const fetchCandidateData = useCallback(async () => {
    setLoader(true);
    try {
      const data: any = await get("/employee/getcandidatedata");
      if (data) {
        setCandidateData(data);

        // First, handle direct field mappings
        Object.keys(data).forEach((key: any) => {
          if (
            profileSectionsConfig.some(
              (s) =>
                s.id === key || s.arrayName === key || s.parentObject === key
            ) ||
            profileSectionsConfig.some((s) =>
              s.fields.some((f) => (Array.isArray(f) ? false : f.name === key))
            )
          ) {
            setValue(key, data[key], { shouldValidate: true });
          }
        });

        // Handle each section specifically
        profileSectionsConfig.forEach((section: any) => {
          if (section.parentObject && data[section.parentObject]) {
            // Handle parent object sections (like careerPreference)
            section.fields.forEach((field: any) => {
              const value = getNestedValue(
                data[section.parentObject],
                field.name
              );
              setValue(`${section.parentObject}.${field.name}` as any, value, {
                shouldValidate: true,
              });
            });
          } else if (section.isList && data[section.arrayName]) {
            // Handle list sections (arrays)
            setValue(section.arrayName, data[section.arrayName], {
              shouldValidate: true,
            });
          } else if (!section.isList && !section.parentObject) {
            // Handle flat sections (like personalDetails)
            section.fields.forEach((field: any) => {
              const value = getNestedValue(data, field.name);
              if (value !== undefined) {
                setValue(field.name, value, { shouldValidate: true });
              }
            });
          }
        });

        // Special handling for profileSummary if it exists as a direct field
        if (data.profileSummary) {
          setValue("profileSummary", data.profileSummary, {
            shouldValidate: true,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      // Handle error display to user
    } finally {
      setLoader(false);
    }
  }, [setValue]);

  // Also update your getNestedValue function to handle undefined cases better:
  const getNestedValue = (obj: any, path: any) => {
    if (!obj || !path) return undefined;

    // Handle simple field names first
    if (typeof path === "string" && !path.includes(".")) {
      return obj[path];
    }

    // Handle nested paths like "address.line1"
    const keys = path
      .split(/[.[\]]/)
      .filter((key: any) => key !== "" && key !== undefined);

    return keys.reduce((acc: any, key: string) => {
      if (acc && typeof acc === "object" && key in acc) {
        return acc[key];
      }
      return undefined;
    }, obj);
  };

  useEffect(() => {
    fetchCandidateData();
  }, [fetchCandidateData]);

  // --- Profile Completion Calculation ---
  const calculateProfileCompletion = useCallback((data: any) => {
    if (!data) return 0;

    let totalFields = 0;
    let filledFields = 0;

    profileSectionsConfig.forEach((section: any) => {
      if (section.isList) {
        const array = getNestedValue(data, section.arrayName);
        totalFields++;
        if (array && Array.isArray(array) && array.length > 0) {
          const hasFilledEntry = array.some((entry: any) =>
            section.fields.some((field: any) =>
              isFieldFilled(getNestedValue(entry, field.name))
            )
          );
          if (hasFilledEntry) {
            filledFields++;
          }
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let sectionHasFilledField = false;
        section.fields.forEach((field: any) => {
          totalFields++;
          let value;
          if (section.parentObject) {
            value = getNestedValue(
              data,
              `${section.parentObject}.${field.name}`
            );
          } else {
            value = getNestedValue(data, field.name);
          }
          if (isFieldFilled(value)) {
            filledFields++;
            sectionHasFilledField = true;
          }
        });
      }
    });
    const completion =
      totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    return completion;
  }, []);

  useEffect(() => {
    const completion = calculateProfileCompletion(allValues);
    setProfileCompletion(completion);
  }, [allValues, calculateProfileCompletion]);

  // --- Form Submission ---
  const onSubmit = async (data: any) => {
    setLoader(true);
    console.log("Submitting data:", data);
    try {
      await post("/employee/updatecandidatedata", { updatedFields: data });
      console.log("Candidate data updated successfully", data);
      setDialogOpen(false);
      fetchCandidateData();
    } catch (error) {
      console.error("Error updating candidate data:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleOpenDialog = (sectionConfig: any) => {
    const uniqueKey = `${sectionConfig.id}-${Date.now()}-${Math.random()}`;
    setDialogKey(uniqueKey);
    setCurrentSectionConfig(sectionConfig);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentSectionConfig(null);
    setDialogKey(""); // Reset the unique key
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const activityTabParam = searchParams.get("activityTab");
    const validTabs = ["view-and-edit", "activity"];
    const validActivityTabs = ["profile-performance", "job-application-status"];

    const selectedTab = validTabs.includes(tabParam || "")
      ? tabParam!
      : "view-and-edit";
    setActiveTab(selectedTab);

    if (
      selectedTab === "activity" &&
      validActivityTabs.includes(activityTabParam || "")
    ) {
      setActiveActivityTab(activityTabParam!);
    } else if (selectedTab === "activity") {
      setActiveActivityTab(activeActivityTab || validActivityTabs[0]);
    }

    if (selectedTab === "view-and-edit" && location.pathname !== "/profile") {
      navigate(`/profile?tab=${selectedTab}`, { replace: true });
    } else if (
      selectedTab === "activity" &&
      location.pathname !== "/analytics"
    ) {
      console.log(
        "Redirecting to analytics page with tab and activityTab params"
      );
      navigate(`/analytics?tab=${selectedTab}&activeTab=${activeActivityTab}`, {
        replace: true,
      });
    }
  }, [location.pathname, navigate, searchParams]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setCurrentSectionConfig(null);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tabValue);

    let targetPath = location.pathname;

    if (tabValue === "view-and-edit" && location.pathname !== "/profile") {
      targetPath = "/profile";
    } else if (tabValue === "activity" && location.pathname !== "/analytics") {
      targetPath = "/analytics";
    }

    navigate(`${targetPath}?${newParams.toString()}`, { replace: true });
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const dialogMap: Record<string, React.ComponentType<any>> = {
    personalDetails: PersonalDetailsDialog,
    careerPreference: CareerPreferencesForm,
    educationTill12th: TenthEducationDialog,
    higherEducation: EducationDialog,
    keySkills: KeySkillsDialog,
    languages: LanguageDialog,
    internships: InternshipDialog,
    projects: ProjectDialog,
    accomplishments: AccomplishmentsDialog,
    profileSummary: ProfileSummaryDialog,
    competitiveExams: EntranceExams,
    employmentHistory: EmploymentHistoryDialog,
    academicAchievements: AcademicAchievementsDialog,
  };

  if (loader) return <Loader />;

  return (
    <div className="container mx-auto h-full">
      <div className="my-4">
        <div className="w-full">
          <ProfileHeader
            profileCompletion={profileCompletion}
            candidateData={candidateData}
            onUpdateProfile={fetchCandidateData}
          />
        </div>

        {activeTab === "view-and-edit" && (
          <div className="lg:col-span-1 h-fit overflow-x-auto whitespace-nowrap">
            <h2 className="text-2xl font-bold">Quick Links</h2>
            <div className="mt-6 border-b border-black relative">
              {/* Scrollable area with arrows */}
              <div className="relative">
                {/* Left arrow */}
                <button
                  onClick={() =>
                    scrollContainerRef.current?.scrollBy({
                      left: -150,
                      behavior: "smooth",
                    })
                  }
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1 rounded-full"
                >
                  ◀
                </button>

                {/* Right arrow */}
                <button
                  onClick={() =>
                    scrollContainerRef.current?.scrollBy({
                      left: 150,
                      behavior: "smooth",
                    })
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1 rounded-full"
                >
                  ▶
                </button>

                {/* Scrollable section */}
                <div
                  ref={scrollContainerRef}
                  className="flex gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-2 px-8 scroll-smooth"
                  style={{
                    scrollbarWidth: "thin",
                    msOverflowStyle: "none",
                  }}
                >
                  <button
                    onClick={() => setActiveSection("resume")}
                    className={`${
                      activeSection === "resume"
                        ? "text-black"
                        : "text-gray-400"
                    } flex justify-between font-semibold items-center w-auto px-3 py-2 rounded hover:bg-blue-100 bg-white shadow-sm`}
                  >
                    <span className="truncate">Resume Upload</span>
                  </button>

                  {profileSectionsConfig.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        handleOpenDialog(section);
                      }}
                      className={`${
                        activeSection === section.id
                          ? "text-black"
                          : "text-gray-400"
                      } flex justify-between font-semibold items-center w-auto px-3 py-2 rounded hover:bg-blue-100 bg-white shadow-sm`}
                    >
                      <span className="truncate">{section.title}</span>
                      {activeSection === section.id && (
                        <span className="absolute bottom-0 top-[2.8rem] left-6 w-24 h-[2.5px] rounded-sm bg-black" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div
            className={`${
              activeTab === "activity" ? "h-52" : "h-36"
            } flex flex-col items-start mt-4 py-6 px-8 border rounded-2xl w-1/4 `}
          >
            <span
              className={`${
                activeTab === "view-and-edit" ? "text-black" : "text-gray-500"
              } mt-4 cursor-pointer font-semibold`}
              onClick={() => handleTabChange("view-and-edit")}
            >
              View & Edit
            </span>
            <Separator orientation="horizontal" className="w-full mt-2" />
            <span
              className={`${
                activeTab === "activity" ? "text-black" : "text-gray-500"
              } mt-4 cursor-pointer w-full font-semibold`}
              onClick={() => handleTabChange("activity")}
            >
              <div className="flex justify-between items-center">
                <p>Activity Insights</p>
                {activeTab === "activity" ? (
                  <ChevronDown className="ml-auto" />
                ) : (
                  <ChevronUp className="ml-auto" />
                )}
              </div>

              {activeTab === "activity" && (
                <span className="mt-2">
                  <p
                    className={`${
                      activeActivityTab === "profile-performance"
                        ? "text-black"
                        : "text-gray-400"
                    } ml-6 mt-2`}
                    onClick={() => {
                      setActiveActivityTab("profile-performance");
                      setSearchParams({
                        tab: "activity",
                        activityTab: "profile-performance",
                      });
                    }}
                  >
                    Profile Performance
                  </p>
                  <p
                    className={`${
                      activeActivityTab === "job-application-status"
                        ? "text-black"
                        : "text-gray-400"
                    } ml-6 my-2`}
                    onClick={() => {
                      setActiveActivityTab("job-application-status");
                      setSearchParams({
                        tab: "activity",
                        activityTab: "job-application-status",
                      });
                    }}
                  >
                    Job Application Status
                  </p>
                </span>
              )}
            </span>
          </div>

          {activeTab === "view-and-edit" ? (
            <ViewAndEditSections
              candidateData={candidateData}
              profileSectionsConfig={profileSectionsConfig}
              fetchCandidateData={fetchCandidateData}
              handleOpenDialog={handleOpenDialog}
            />
          ) : activeActivityTab === "profile-performance" ? (
            <div className="flex-1 mt-4 w-3/4">
              <ProfileChart />
            </div>
          ) : (
            <div className="flex-1 mt-4 w-3/4">
              <ApplicationStatus />
            </div>
          )}
        </div>
      </div>

      {currentSectionConfig != null &&
        (() => {
          const DialogComponent =
            dialogMap[currentSectionConfig.id] ?? EditDialog;

          console.log("Current Section Config:", currentSectionConfig);

          const sectionData = (() => {
            if (currentSectionConfig.isList && currentSectionConfig.arrayName) {
              return JSON.parse(
                JSON.stringify(getValues(currentSectionConfig.arrayName) || [])
              );
            } else if (currentSectionConfig.parentObject) {
              return JSON.parse(
                JSON.stringify(
                  getValues(currentSectionConfig.parentObject) || {}
                )
              );
            } else {
              const allFormValues = getValues();
              const sectionOnlyData: any = {};

              currentSectionConfig.fields.forEach((field: any) => {
                if (field.name.includes(".")) {
                  const keys = field.name.split(".");
                  const value = getNestedValue(allFormValues, field.name);

                  let current = sectionOnlyData;
                  keys.forEach((key: any, index: number) => {
                    if (index === keys.length - 1) {
                      current[key] = value || "";
                    } else {
                      current[key] = current[key] || {};
                      current = current[key];
                    }
                  });
                } else {
                  sectionOnlyData[field.name] =
                    getNestedValue(allFormValues, field.name) || "";
                }
              });

              return sectionOnlyData;
            }
          })();

          console.log("Section Data:", sectionData);

          return (
            <DialogComponent
              key={dialogKey}
              open={dialogOpen}
              onOpenChange={handleCloseDialog}
              sectionConfig={currentSectionConfig}
              control={control}
              onSubmit={onSubmit}
              sectionData={sectionData}
            />
          );
        })()}
    </div>
  );
}

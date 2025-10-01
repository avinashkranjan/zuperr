import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../../../components/ui/sheet";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { JobDetails } from ".";
import { useToast } from "@src/hooks/use-toast";
import { post, put } from "@api/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Trash2,
  PlusCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import AnimatedSlider from "@base-components/AnimateSlider";

// Interface for the form data, now including screening questions
interface JobFormData {
  title: string;
  jobCategory: string;
  jobType: string;
  workMode: string;
  minimumExperienceInYears: number | "";
  maximumExperienceInYears: number | "";
  salaryRange: {
    currency: string;
    minimumSalary: number | "";
    maximumSalary: number | "";
  };
  additionalRequirements?: string; // Optional field for additional requirements
  skills: string[];
  education: string;
  industry: string;
  degree: string;
  fromAge: number | "";
  toAge: number | "";
  gender: "Male" | "Female" | "Any";
  jobDescription: string;
  location: string;
  createdBy: string;
  screeningQuestions: string[]; // New field for screening questions
  aboutCompany: string; // New field for company description
}

const jobCategoryNames: string[] = [
  "Software Development",
  "Web Development",
  "Mobile App Development",
  "DevOps & Cloud",
  "UI/UX Design",
  "Game Development",
  "Data Science",
  "AI / ML",
  "Cybersecurity",
  "IT Support",
  "Accounting",
  "Finance",
  "Banking & Insurance",
  "Auditing & Compliance",
  "HR & Recruitment",
  "Legal",
  "Project Management",
  "Business Consulting",
  "Sales & BD",
  "Marketing",
  "Digital Marketing",
  "SEO/SEM",
  "Public Relations",
  "Market Research",
  "Content Writing",
  "Copywriting",
  "Technical Writing",
  "Journalism",
  "Translation",
  "Graphic Design",
  "Video Editing",
  "Animation",
  "Photography",
  "Product Design",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Electronics Engineering",
  "Industrial Engineering",
  "Manufacturing",
  "Medical & Healthcare",
  "Pharmacy",
  "Nursing",
  "Clinical Research",
  "Psychology & Counseling",
  "Teaching & Education",
  "Training & Development",
  "Instructional Design",
  "Operations & Admin",
  "Customer Support",
  "BPO / KPO",
  "Retail",
  "E-commerce",
  "Hospitality",
  "Tourism",
  "Event Management",
  "Logistics",
  "Procurement",
  "Supply Chain",
  "Transportation",
  "Construction & Skilled Trades",
  "Architecture",
  "Environmental & Sustainability",
  "Government & Public Sector",
  "Defense & Law Enforcement",
  "Freelance & Remote",
  "Virtual Assistance",
  "Online Tutoring",
  "Others / Miscellaneous",
];

interface AddJobPostModalProps {
  onClose: () => void;
  setShowAddJobPostModal: (value: boolean) => void;
  showAddJobPostModal: boolean;
  selectedJob?: JobDetails | null;
  employer?: any | null;
}

// The main component for the Add/Edit Job Post Modal
const AddJobPostModal: React.FC<AddJobPostModalProps> = ({
  showAddJobPostModal,
  setShowAddJobPostModal,
  onClose,
  selectedJob,
  employer,
}) => {
  //========================> Hooks
  const { toast } = useToast();

  //========================> Use States
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(""); // State for the current screening question input
  const [formData, setFormData] = React.useState<JobFormData>({
    title: "",
    jobCategory: "",
    jobType: "",
    workMode: "",
    location: "",
    minimumExperienceInYears: "",
    maximumExperienceInYears: "",
    salaryRange: {
      currency: "INR",
      minimumSalary: "",
      maximumSalary: "",
    },
    skills: [],
    education: "",
    industry: "",
    degree: "",
    fromAge: "",
    toAge: "",
    gender: "Any",
    jobDescription: "",
    createdBy: "",
    screeningQuestions: [],
    aboutCompany: "", // New field for company description
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [distance, setDistance] = React.useState(60);

  // Function to auto-populate form with employer data
  const populateEmployerData = React.useCallback(() => {
    if (!employer) return;

    const updatedFormData: Partial<JobFormData> = {};

    // Location from address
    if (employer.address?.state && !formData.location) {
      updatedFormData.location = employer.address.state;
    }

    // Job type from preferences
    if (employer.preferences?.jobType && !formData.jobType) {
      // Convert from backend format to UI format
      const jobTypeMap: Record<string, string> = {
        fulltime: "Full-Time",
        parttime: "Part Time",
        internship: "Internship",
      };
      updatedFormData.jobType =
        jobTypeMap[employer.preferences.jobType] ||
        employer.preferences.jobType;
    }

    // Work mode from preferences
    if (employer.preferences?.workMode && !formData.workMode) {
      // Convert from backend format to UI format
      const workModeMap: Record<string, string> = {
        wfh: "Remote",
        wfo: "Work from Office",
        hybrid: "Hybrid",
      };
      updatedFormData.workMode =
        workModeMap[employer.preferences.workMode] ||
        employer.preferences.workMode;
    }

    // Industry from preferences or industries array
    if (
      (employer.preferences?.industry || employer.industries?.length) &&
      !formData.industry
    ) {
      updatedFormData.industry =
        employer.preferences?.industry || employer.industries[0];
    }

    // About company from preferences or description
    if (
      (employer.preferences?.aboutCompany || employer.description) &&
      !formData.aboutCompany
    ) {
      updatedFormData.aboutCompany =
        employer.preferences?.aboutCompany || employer.description || "";
    }

    // Set createdBy if not already set
    if (employer._id && !formData.createdBy) {
      updatedFormData.createdBy = employer._id;
    }

    // Update form data if we have any changes
    if (Object.keys(updatedFormData).length > 0) {
      setFormData((prev) => ({ ...prev, ...updatedFormData }));
    }
  }, [employer, formData]);

  React.useEffect(() => {
    if (selectedJob) {
      // ✅ Populate existing job for editing
      setFormData({
        title: selectedJob.title || "",
        jobCategory: selectedJob.jobCategory || "",
        jobType: selectedJob.jobType || "",
        workMode: selectedJob.workMode || "",
        location: selectedJob.location || "",
        minimumExperienceInYears: selectedJob.minimumExperienceInYears || "",
        maximumExperienceInYears: selectedJob.maximumExperienceInYears || "",
        salaryRange: {
          currency: selectedJob.salaryRange?.currency || "INR",
          minimumSalary:
            selectedJob.salaryRange?.minimumSalary === "" ||
            selectedJob.salaryRange?.minimumSalary === undefined
              ? ""
              : Number(selectedJob.salaryRange?.minimumSalary),
          maximumSalary:
            selectedJob.salaryRange?.maximumSalary === "" ||
            selectedJob.salaryRange?.maximumSalary === undefined
              ? ""
              : Number(selectedJob.salaryRange?.maximumSalary),
        },
        skills: selectedJob.skills
          ? selectedJob.skills.map((skill: any) =>
              typeof skill === "string" ? skill : skill.name || skill.id || ""
            )
          : [],
        education: selectedJob.education || "",
        industry: selectedJob.industry?.[0] || "",
        degree: selectedJob.degree || "",
        fromAge:
          selectedJob.fromAge === "" || selectedJob.fromAge === undefined
            ? ""
            : Number(selectedJob.fromAge),
        toAge:
          selectedJob.toAge === "" || selectedJob.toAge === undefined
            ? ""
            : Number(selectedJob.toAge),
        gender:
          selectedJob.gender === "Male" ||
          selectedJob.gender === "Female" ||
          selectedJob.gender === "Any"
            ? selectedJob.gender
            : "Any",
        jobDescription: selectedJob.jobDescription || "",
        createdBy: selectedJob.createdBy || "",
        screeningQuestions: selectedJob.screeningQuestions || [],
        aboutCompany: selectedJob.aboutCompany || "",
        // additionalRequirements: selectedJob.additionalRequirements || "",
      });
    } else if (employer) {
      // ✅ New Job — auto-fill employer defaults
      populateEmployerData();
    }
  }, [selectedJob, employer, populateEmployerData]);

  // Function to generate job description using AI
  async function generateJobDescription() {
    try {
      setIsGenerating(true);
      // This is a placeholder for your actual API call.
      // Replace with your API endpoint and payload structure.
      const response: any = await post(
        "/employer/llm/generate-job-description",
        {
          jobTitle: formData.title,
          jobCategory: formData.jobCategory,
          jobType: formData.jobType,
          workMode: formData.workMode,
          location: formData.location,
          minimumExperienceInYears: formData.minimumExperienceInYears,
          maximumExperienceInYears: formData.maximumExperienceInYears,
          salaryRange: formData.salaryRange,
          skills: formData.skills.join(", "),
          education: formData.education,
          industry: formData.industry,
        }
      );
      setFormData((prev) => ({
        ...prev,
        jobDescription: response.jobDescription,
      }));
    } catch (error) {
      console.log("Error generating job description:", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  //========================> Callbacks & Handlers
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.title) newErrors.title = "Job title is required";
      if (!formData.jobCategory)
        newErrors.jobCategory = "Job category is required";
      if (!formData.jobType) newErrors.jobType = "Job type is required";
      if (!formData.workMode) newErrors.workMode = "Work mode is required";
      if (!formData.location) newErrors.location = "Location is required";
    } else if (step === 2) {
      if (!formData.minimumExperienceInYears)
        newErrors.minimumExperienceInYears = "Min experience is required";
      if (!formData.maximumExperienceInYears)
        newErrors.maximumExperienceInYears = "Max experience is required";
      if (
        formData.maximumExperienceInYears &&
        formData.minimumExperienceInYears &&
        +formData.maximumExperienceInYears < +formData.minimumExperienceInYears
      ) {
        newErrors.maximumExperienceInYears =
          "Max must be greater than or equal to min";
      }
      if (!formData.salaryRange.minimumSalary)
        newErrors.minimumSalary = "Min salary is required";
      if (!formData.salaryRange.maximumSalary)
        newErrors.maximumSalary = "Max salary is required";
      if (
        formData.salaryRange.maximumSalary &&
        formData.salaryRange.minimumSalary &&
        +formData.salaryRange.maximumSalary <
          +formData.salaryRange.minimumSalary
      ) {
        newErrors.maximumSalary =
          "Max salary must be greater than or equal to min";
      }
      if (!formData.education) newErrors.education = "Education is required";
      if (formData.skills.length === 0)
        newErrors.skills = "At least one skill is required";
    } else if (step === 3) {
      if (!formData.jobDescription)
        newErrors.jobDescription = "Job description is required";
      if (formData.jobDescription.length < 100)
        newErrors.jobDescription =
          "Description must be at least 100 characters";
    } else {
      // return true; // No validation for step 4 (optional) or 5 (preview)
      return Object.keys(newErrors).length === 0;
    }
    // No validation for step 3 (optional),  step 4 (optional) or 5 (preview)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [name]: value === "" ? "" : parseFloat(value),
      },
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  const handleAddQuestion = () => {
    if (currentQuestion.trim()) {
      setFormData((prev) => ({
        ...prev,
        screeningQuestions: [
          ...prev.screeningQuestions,
          currentQuestion.trim(),
        ],
      }));
      setCurrentQuestion(""); // Clear input after adding
    }
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to post a job.",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        ...formData,
        createdBy: userId,
        industry: [formData.industry],
      };

      try {
        if (selectedJob) {
          await put(`/employer/update-jobs/${selectedJob._id}`, payload);
          toast({
            title: "Success",
            description: "Job post updated successfully",
          });
        } else {
          await post("/employer/create-jobs/", payload);
          toast({
            title: "Success",
            description: "Job post created successfully",
          });
        }
        setShowAddJobPostModal(false);
        onClose();
      } catch (error: any) {
        toast({
          title: "Error",
          description: `An error occurred: ${error.message || "Unknown error"}`,
          variant: "destructive",
        });
      }
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Job Title / Designation</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Senior Software Engineer"
                value={formData.title}
                onChange={handleInputChange}
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <Label htmlFor="jobCategory">Job Category</Label>
              <Select
                value={formData.jobCategory}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, jobCategory: value }))
                }
              >
                <SelectTrigger
                  className={cn(errors.jobCategory && "border-red-500")}
                >
                  <SelectValue placeholder="Select Job Category" />
                </SelectTrigger>

                <SelectContent>
                  {jobCategoryNames.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.jobCategory && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.jobCategory}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Mumbai, India"
                value={formData.location}
                onChange={handleInputChange}
                className={cn(errors.location && "border-red-500")}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            <div>
              <Label className="mb-2 block">Job Type</Label>
              <div className="flex gap-2">
                {["Full-Time", "Part Time", "Internship"].map((type) => (
                  <Button
                    key={type}
                    variant={formData.jobType === type ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, jobType: type })}
                  >
                    {type}
                  </Button>
                ))}
              </div>
              {errors.jobType && (
                <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>
              )}
            </div>
            <div>
              <Label className="mb-2 block">Work Mode</Label>
              <div className="flex gap-2">
                {["Remote", "Work from Office", "Hybrid"].map((mode) => (
                  <Button
                    key={mode}
                    variant={formData.workMode === mode ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, workMode: mode })}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
              {errors.workMode && (
                <p className="text-red-500 text-sm mt-1">{errors.workMode}</p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="minimumExperienceInYears">
                Minimum Experience (Years)
              </Label>
              <Input
                id="minimumExperienceInYears"
                name="minimumExperienceInYears"
                type="number"
                placeholder="e.g., 2"
                value={formData.minimumExperienceInYears}
                onChange={handleInputChange}
                className={cn(
                  errors.minimumExperienceInYears && "border-red-500"
                )}
              />
              {errors.minimumExperienceInYears && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.minimumExperienceInYears}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="maximumExperienceInYears">
                Maximum Experience (Years)
              </Label>
              <Input
                id="maximumExperienceInYears"
                name="maximumExperienceInYears"
                type="number"
                placeholder="e.g., 5"
                value={formData.maximumExperienceInYears}
                onChange={handleInputChange}
                className={cn(
                  errors.maximumExperienceInYears && "border-red-500"
                )}
              />
              {errors.maximumExperienceInYears && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maximumExperienceInYears}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="minimumSalary">Minimum Salary (LPA)</Label>
              <Input
                id="minimumSalary"
                name="minimumSalary"
                type="number"
                placeholder="e.g., 8"
                value={formData.salaryRange.minimumSalary}
                onChange={handleSalaryChange}
                className={cn(errors.minimumSalary && "border-red-500")}
              />
              {errors.minimumSalary && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.minimumSalary}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="maximumSalary">Maximum Salary (LPA)</Label>
              <Input
                id="maximumSalary"
                name="maximumSalary"
                type="number"
                placeholder="e.g., 12"
                value={formData.salaryRange.maximumSalary}
                onChange={handleSalaryChange}
                className={cn(errors.maximumSalary && "border-red-500")}
              />
              {errors.maximumSalary && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maximumSalary}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                name="skills"
                placeholder="e.g., React, Node.js, TypeScript"
                value={formData.skills.join(", ")}
                onChange={handleSkillsChange}
                className={cn(errors.skills && "border-red-500")}
              />
              {errors.skills && (
                <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
              )}
            </div>
            <div>
              <Label>Education Level</Label>
              <Select
                value={formData.education}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, education: value }))
                }
              >
                <SelectTrigger
                  className={cn(errors.education && "border-red-500")}
                >
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Below 12th">Below 12th</SelectItem>
                  <SelectItem value="12th">12th</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                  <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
              {errors.education && (
                <p className="text-red-500 text-sm mt-1">{errors.education}</p>
              )}
            </div>
            <div>
              <Label>Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, industry: value }))
                }
              >
                <SelectTrigger
                  className={cn(errors.industry && "border-red-500")}
                >
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT-Software, Software Services">
                    IT-Software, Software Services
                  </SelectItem>
                  <SelectItem value="Accounting / Auditing / Taxation">
                    Accounting / Auditing / Taxation
                  </SelectItem>
                  <SelectItem value="Agriculture / Forestry / Fishing">
                    Agriculture / Forestry / Fishing
                  </SelectItem>
                  <SelectItem value="Aviation / Aerospace">
                    Aviation / Aerospace
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
              )}
            </div>

            <div>
              <Label className="mb-2 block">Additional Requirements</Label>
              <div className="flex gap-2">
                {["Industry", "Degree", "Gender", "Age"].map((mode) => (
                  <Button
                    key={mode}
                    variant={
                      formData.additionalRequirements === mode
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setFormData({ ...formData, additionalRequirements: mode })
                    }
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Is this Walk-in Interview</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="walkInInterview" value="yes" />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="walkInInterview" value="no" />
                  No
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Company Address</Label>
              <div className="text-blue-600 font-medium cursor-pointer flex items-center gap-2">
                <span>📍</span> Use my Current Location
              </div>
              <div className="text-gray-500 text-sm">OR</div>
              <Input placeholder="Enter Location" />
            </div>

            <div className="space-y-2">
              <Label>Distance</Label>
              <div className="px-2">
                <AnimatedSlider
                  value={distance}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(val) => setDistance(val)}
                />
                <div className="text-sm text-blue-600 mt-1">{distance}km</div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="jobDescription">Job Description</Label>
              <button
                onClick={generateJobDescription}
                disabled={isGenerating}
                className="text-sm flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 mb-2"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </span>
              </button>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Editor (Markdown)</p>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    placeholder="Provide a detailed job description..."
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    className={cn(
                      errors.jobDescription && "border-red-500",
                      "h-48"
                    )}
                  />
                  {errors.jobDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobDescription}
                    </p>
                  )}
                </div>
                <div className="p-4 border rounded-md bg-gray-50 overflow-auto h-48">
                  <p className="text-sm font-medium mb-1">Live Preview</p>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{formData.jobDescription}</ReactMarkdown>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium mt-4 mb-1">About Company</p>
                  <Textarea
                    id="aboutCompany"
                    name="aboutCompany"
                    placeholder="Provide details of the company..."
                    value={formData.aboutCompany}
                    onChange={handleInputChange}
                    className={cn(
                      errors.aboutCompany && "border-red-500",
                      "h-48"
                    )}
                  />
                  {errors.aboutCompany && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.aboutCompany}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="screeningQuestion">
                Add Screening Questions (Optional)
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                Add questions to help you screen candidates more effectively.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  id="screeningQuestion"
                  name="screeningQuestion"
                  placeholder="e.g., What are your salary expectations?"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
                />
                <Button
                  onClick={handleAddQuestion}
                  variant="outline"
                  size="icon"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Added Questions:</p>
              {formData.screeningQuestions.length === 0 ? (
                <p className="text-sm text-gray-400">No questions added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {formData.screeningQuestions.map((q, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                    >
                      <span className="text-sm">{q}</span>
                      <Button
                        onClick={() => handleRemoveQuestion(index)}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">
              Confirm Job Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <Label>Job Title</Label>
                <p className="text-sm text-gray-700">{formData.title}</p>
              </div>
              <div>
                <Label>Job Category</Label>
                <p className="text-sm text-gray-700">{formData.jobCategory}</p>
              </div>
              <div>
                <Label>Location</Label>
                <p className="text-sm text-gray-700">{formData.location}</p>
              </div>
              <div>
                <Label>Job Type</Label>
                <p className="text-sm text-gray-700">{formData.jobType}</p>
              </div>
              <div>
                <Label>Work Mode</Label>
                <p className="text-sm text-gray-700">{formData.workMode}</p>
              </div>
              <div>
                <Label>Experience</Label>
                <p className="text-sm text-gray-700">
                  {formData.minimumExperienceInYears} -{" "}
                  {formData.maximumExperienceInYears} Years
                </p>
              </div>
              <div>
                <Label>Salary</Label>
                <p className="text-sm text-gray-700">
                  ₹{formData.salaryRange.minimumSalary} - ₹
                  {formData.salaryRange.maximumSalary} LPA
                </p>
              </div>
              <div>
                <Label>Education</Label>
                <p className="text-sm text-gray-700">{formData.education}</p>
              </div>
              <div>
                <Label>Industry</Label>
                <p className="text-sm text-gray-700">{formData.industry}</p>
              </div>
              <div className="md:col-span-2">
                <Label>Skills</Label>
                <p className="text-sm text-gray-700">
                  {formData.skills.join(", ")}
                </p>
              </div>
            </div>
            <div>
              <Label>Job Description</Label>
              <div className="prose prose-sm max-w-none p-4 border rounded-md bg-gray-50 mt-1 h-40 overflow-y-auto">
                <ReactMarkdown>{formData.jobDescription}</ReactMarkdown>
              </div>
            </div>
            <div>
              <Label>Screening Questions</Label>
              {formData.screeningQuestions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 mt-1">
                  {formData.screeningQuestions.map((q, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {q}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  No screening questions added.
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={showAddJobPostModal} onOpenChange={setShowAddJobPostModal}>
      <SheetContent
        side="right"
        className="w-full md:max-w-3xl overflow-y-auto max-h-screen rounded-none"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-2xl font-semibold text-center">
            {selectedJob ? "Edit Job Post" : "Post a New Job"}
          </SheetTitle>
        </SheetHeader>

        <div className="p-6">
          <div className="w-full flex justify-center mb-6">
            <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>

          {renderStepContent(currentStep)}
        </div>

        <SheetFooter className="flex justify-between px-6 py-4 border-t">
          <div>
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>
          <div>
            {currentStep < 6 ? (
              <Button onClick={handleNext} className="text-white">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {selectedJob ? "Update Job" : "Submit Job"}
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddJobPostModal;

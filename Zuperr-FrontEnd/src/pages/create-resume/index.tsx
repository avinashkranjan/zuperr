import React, { useState, useRef } from "react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
  Education,
  Experience,
  Project,
  ResumeData,
  Skill,
  TemplateType,
} from "../../types/resume";
import ResumeForm from "../../components/create-resume/ResumeForm";
import ResumeTemplate from "../../components/create-resume/templates";
import TemplatePicker from "../../components/create-resume/TemplatePicker";
import { Download, FileText, Eye, Dock, Loader2 } from "lucide-react";
import { get } from "@api/index";

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

const CreateResume = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("modern");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const resumeRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchCandidateData() {
    try {
      setLoading(true);
      const data = await get("/employee/getcandidatedata");
      if (data) {
        const mapped = mapCandidateDataToResumeData(data);
        setResumeData(mapped);
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      alert("Failed to fetch candidate data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function mapCandidateDataToResumeData(data: any): ResumeData {
    const fullName = `${data?.firstname || ""} ${data.lastname || ""}`.trim();

    const personalInfo = {
      fullName,
      email: data.email || "",
      phone: data.mobilenumber || "",
      location: data.careerPreference?.preferredLocation || "",
      website: "",
      linkedin: "",
      summary: data.profileSummary || "",
    };

    const experience: Experience[] = (data.employmentHistory || []).map(
      (item: any) => ({
        id: item._id,
        position: item.description?.split("\n")[0] || "Unknown",
        company: item.companyName || "",
        location: "",
        startDate: item.duration?.from
          ? new Date(item.duration.from).toISOString().split("T")[0]
          : "",
        endDate: item.duration?.to
          ? new Date(item.duration.to).toISOString().split("T")[0]
          : "",
        current: item.isCurrentJob || false,
        description: item.description || "",
      })
    );

    const education: Education[] = (data.educationAfter12th || []).map(
      (edu: any) => ({
        id: edu._id,
        degree: `${edu.educationLevel || ""} in ${edu.courseName || ""}`.trim(),
        institution: edu.instituteName || "",
        location: "", // Not provided
        graduationDate: edu.passingYear ? `${edu.passingYear}-01-01` : "",
        gpa: edu.gradeValue?.toString() || undefined,
      })
    );

    const skills: Skill[] = (data.keySkills || []).map((skill: any) => ({
      id: skill._id,
      name: skill.Name,
      level: "Intermediate", // Default value, as no level is provided
    }));

    const projects: Project[] = (data.projects || []).map((project: any) => ({
      id: project._id || Math.random().toString(36).substring(2),
      name: project.name || "Untitled Project",
      description: project.description || "",
      technologies: (project.technologies || []).join(", "),
      link: project.link || "",
    }));

    return {
      personalInfo,
      experience,
      education,
      skills,
      projects,
    };
  }

  const handlePrint = () => {
    if (resumeData.personalInfo.fullName.trim() === "") {
      alert("Please add at least your name before printing.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Failed to open print window. Please allow pop-ups for this site.");
      return;
    }

    // Get the HTML content of the resume
    const resumeContent = resumeRef.current?.innerHTML || "";

    // Create a complete HTML document with embedded styles
    const printDocument = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${resumeData.personalInfo.fullName}'s Resume</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Helvetica+Neue&display=swap');
          
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: white;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            line-height: 1.5;
          }
          
          @page {
            size: letter;
            margin: 0.5in;
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          /* Add any additional print-specific styles here */
          @media print {
            body {
              background: white;
            }
            a {
              text-decoration: none;
              color: inherit;
            }
          }
        </style>
      </head>
      <body>
        ${resumeContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          };
        </script>
      </body>
    </html>
  `;

    printWindow.document.open();
    printWindow.document.write(printDocument);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Resume Builder
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a professional resume in minutes. Fill in your information,
            choose a template, and download your custom resume.
          </p>
        </div>

        <Tabs
          defaultValue="edit"
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(value as "edit" | "preview")
          }
        >
          <div className="flex justify-between mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Edit Information
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview Resume
              </TabsTrigger>
            </TabsList>
            <Button
              disabled={loading}
              onClick={() => {
                fetchCandidateData();
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              {loading ? (
                <span className="animate-spin">
                  <Loader2 className="w-4 h-4 mr-2 inline-block" />
                </span>
              ) : (
                <Dock className="w-4 h-4" />
              )}
              Autofill from Profile
            </Button>
          </div>

          <TabsContent value="edit" className="space-y-6">
            <TemplatePicker
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
            <ResumeForm data={resumeData} onChange={setResumeData} />
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setActiveTab("preview")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-6 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Resume
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card className="p-4 md:p-6 bg-white shadow-md">
              <div className="flex justify-end mb-6">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="bg-primary/90 hover:bg-primary text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg overflow-hidden">
                <div
                  ref={resumeRef}
                  className="transform scale-[0.8] origin-top-center md:scale-90 mx-auto"
                >
                  <ResumeTemplate
                    templateType={selectedTemplate}
                    data={resumeData}
                  />
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setActiveTab("edit")}
                  variant="outline"
                  size="lg"
                  className="mr-4"
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={handlePrint}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 px-6 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateResume;

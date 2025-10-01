import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import PersonalInfoForm from "./PersonalInfoForm";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
import SkillsForm from "./SkillsForm";
import ProjectsForm from "./ProjectsForm";
import { ResumeData } from "../../types/resume";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState("personal");

  const updatePersonalInfo = (personalInfo: typeof data.personalInfo) => {
    onChange({ ...data, personalInfo });
  };

  const updateExperience = (experience: typeof data.experience) => {
    onChange({ ...data, experience });
  };

  const updateEducation = (education: typeof data.education) => {
    onChange({ ...data, education });
  };

  const updateSkills = (skills: typeof data.skills) => {
    onChange({ ...data, skills });
  };

  const updateProjects = (projects: typeof data.projects) => {
    onChange({ ...data, projects });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Resume Information
      </h2>
      <Tabs
        defaultValue="personal"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoForm
            data={data.personalInfo}
            onChange={updatePersonalInfo}
          />
        </TabsContent>

        <TabsContent value="experience">
          <ExperienceForm data={data.experience} onChange={updateExperience} />
        </TabsContent>

        <TabsContent value="education">
          <EducationForm data={data.education} onChange={updateEducation} />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsForm data={data.skills} onChange={updateSkills} />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsForm data={data.projects} onChange={updateProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeForm;

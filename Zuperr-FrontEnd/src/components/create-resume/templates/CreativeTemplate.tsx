import React from "react";
import { ResumeData } from "../../../types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface CreativeTemplateProps {
  data: ResumeData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getSkillBarWidth = (level: string) => {
    switch (level) {
      case "Beginner":
        return "25%";
      case "Intermediate":
        return "50%";
      case "Advanced":
        return "75%";
      case "Expert":
        return "100%";
      default:
        return "50%";
    }
  };

  return (
    <div
      className="bg-white shadow-lg min-h-[11in] w-[8.5in] mx-auto flex"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {data.personalInfo.fullName}
          </h1>
          <div className="w-12 h-1 bg-yellow-400 mb-4"></div>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-yellow-300">Contact</h2>
          <div className="space-y-2 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="break-all">{data.personalInfo.website}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                <span className="break-all">{data.personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-yellow-300">Skills</h2>
            <div className="space-y-3">
              {data.skills.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{skill.name}</span>
                    <span>{skill.level}</span>
                  </div>
                  <div className="w-full bg-indigo-900 rounded-full h-1.5">
                    <div
                      className="bg-yellow-300 h-1.5 rounded-full"
                      style={{ width: getSkillBarWidth(skill.level) }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-yellow-300">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-xs opacity-90">{edu.institution}</p>
                  <p className="text-xs">{formatDate(edu.graduationDate)}</p>
                  {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-indigo-600 border-b border-indigo-200 pb-1">
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-indigo-600 border-b border-indigo-200 pb-1">
              Work Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-3 before:h-3 before:bg-yellow-400 before:rounded-full before:border-2 before:border-indigo-600"
                >
                  <div className="mb-1">
                    <h3 className="font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-sm text-indigo-600">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3 text-indigo-600 border-b border-indigo-200 pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800">{project.name}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-indigo-600 mb-1">
                    {project.technologies}
                  </p>
                  {project.description && (
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-center">
        <span className="text-sm text-center text-gray-500">
          Generated by{" "}
          <a
            href="https://zuperr.co"
            className="text-blue-600 hover:underline pr-1"
          >
            Zuperr
          </a>
          Resume Builder
        </span>
      </p>
    </div>
  );
};

export default CreativeTemplate;

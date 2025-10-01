import React from "react";
import { ResumeData } from "../../../types/resume";

interface ClassicTemplateProps {
  data: ResumeData;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div
      className="bg-white p-8 shadow-lg min-h-[11in] w-[8.5in] mx-auto"
      style={{ fontFamily: "Times New Roman, serif" }}
    >
      {/* Header */}
      <div className="text-center border-b border-gray-400 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {data.personalInfo.fullName}
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.location && (
            <div>{data.personalInfo.location}</div>
          )}
          {data.personalInfo.website && <div>{data.personalInfo.website}</div>}
          {data.personalInfo.linkedin && (
            <div>{data.personalInfo.linkedin}</div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {formatDate(exp.startDate)} -{" "}
                  {exp.current ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="italic text-gray-600 mb-2">
                {exp.company}, {exp.location}
              </p>
              {exp.description && (
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                  <p className="italic text-gray-600">
                    {edu.institution}, {edu.location}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(edu.graduationDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="text-gray-700">
            {data.skills.map((skill, index) => (
              <span key={skill.id}>
                {skill.name} ({skill.level})
                {index < data.skills.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Projects
          </h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-800">{project.name}</h3>
                {project.link && (
                  <span className="text-sm text-gray-600">
                    View at: {project.link}
                  </span>
                )}
              </div>
              <p className="text-sm italic text-gray-600 mb-1">
                Technologies: {project.technologies}
              </p>
              {project.description && (
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
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

export default ClassicTemplate;

import React from "react";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import { ResumeData } from "@src/types/resume";

interface ModernTemplateProps {
  data: ResumeData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Define all styles as objects
  const styles = {
    page: {
      backgroundColor: "#ffffff",
      padding: "32px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      minHeight: "11in",
      width: "8.5in",
      margin: "0 auto",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      lineHeight: 1.5,
      fontSize: "14px",
    },
    header: {
      borderBottom: "2px solid #2563eb",
      paddingBottom: "24px",
      marginBottom: "24px",
    },
    name: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#1f2937",
      marginBottom: "8px",
    },
    contactInfo: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "16px",
      fontSize: "14px",
      color: "#4b5563",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#2563eb",
      marginBottom: "12px",
    },
    sectionContent: {
      marginBottom: "24px",
    },
    jobTitle: {
      fontWeight: 600,
      color: "#1f2937",
      marginBottom: "4px",
    },
    company: {
      color: "#4b5563",
      marginBottom: "4px",
    },
    date: {
      fontSize: "12px",
      color: "#6b7280",
    },
    description: {
      color: "#374151",
      fontSize: "12px",
      marginTop: "8px",
    },
    skillsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "8px",
    },
    skillItem: {
      display: "flex",
      justifyContent: "space-between",
    },
    footer: {
      textAlign: "center" as const,
      marginTop: "32px",
      fontSize: "12px",
      color: "#6b7280",
    },
    link: {
      color: "#2563eb",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.name}>{data.personalInfo.fullName}</h1>
        <div style={styles.contactInfo}>
          {data.personalInfo.email && (
            <div style={styles.contactItem}>
              <Mail size={16} />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div style={styles.contactItem}>
              <Phone size={16} />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.location && (
            <div style={styles.contactItem}>
              <MapPin size={16} />
              {data.personalInfo.location}
            </div>
          )}
          {data.personalInfo.website && (
            <div style={styles.contactItem}>
              <Globe size={16} />
              {data.personalInfo.website}
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div style={styles.contactItem}>
              <Linkedin size={16} />
              LinkedIn
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Professional Summary</h2>
          <p style={{ color: "#374151" }}>{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Professional Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <div>
                  <h3 style={styles.jobTitle}>{exp.position}</h3>
                  <p style={styles.company}>
                    {exp.company} • {exp.location}
                  </p>
                </div>
                <p style={styles.date}>
                  {formatDate(exp.startDate)} -{" "}
                  {exp.current ? "Present" : formatDate(exp.endDate)}
                </p>
              </div>
              {exp.description && (
                <p style={styles.description}>{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3 style={styles.jobTitle}>{edu.degree}</h3>
                  <p style={styles.company}>
                    {edu.institution} • {edu.location}
                  </p>
                  {edu.gpa && <p style={styles.date}>GPA: {edu.gpa}</p>}
                </div>
                <p style={styles.date}>{formatDate(edu.graduationDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <div style={styles.skillsGrid}>
            {data.skills.map((skill) => (
              <div key={skill.id} style={styles.skillItem}>
                <span style={{ color: "#374151" }}>{skill.name}</span>
                <span style={styles.date}>{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          {data.projects.map((project) => (
            <div key={project.id} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <h3 style={styles.jobTitle}>{project.name}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    style={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                )}
              </div>
              <p style={styles.date}>{project.technologies}</p>
              {project.description && (
                <p style={styles.description}>{project.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        Generated by{" "}
        <a href="https://zuperr.co" style={styles.link}>
          Zuperr
        </a>{" "}
        Resume Builder
      </div>
    </div>
  );
};

export default ModernTemplate;

import React from "react";
import { ResumeData, TemplateType } from "../../../types/resume";
import ModernTemplate from "./ModernTemplate";
import ClassicTemplate from "./ClassicTemplate";
import CreativeTemplate from "./CreativeTemplate";

interface ResumeTemplateProps {
  templateType: TemplateType;
  data: ResumeData;
}

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({
  templateType,
  data,
}) => {
  switch (templateType) {
    case "modern":
      return <ModernTemplate data={data} />;
    case "classic":
      return <ClassicTemplate data={data} />;
    case "creative":
      return <CreativeTemplate data={data} />;
    default:
      return <ModernTemplate data={data} />;
  }
};

export default ResumeTemplate;

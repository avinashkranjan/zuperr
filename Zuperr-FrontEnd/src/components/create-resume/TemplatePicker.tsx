/* eslint-disable arrow-body-style */
import React from "react";
import { Card, CardContent } from "@components/ui/card";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";
import { TemplateType } from "../../types/resume";

interface TemplateOption {
  value: TemplateType;
  label: string;
  description: string;
}

interface TemplatePickerProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

const templates: TemplateOption[] = [
  {
    value: "modern",
    label: "Modern",
    description:
      "Clean, professional layout with accent colors and modern typography",
  },
  {
    value: "classic",
    label: "Classic",
    description:
      "Traditional layout with elegant typography, perfect for formal industries",
  },
  {
    value: "creative",
    label: "Creative",
    description:
      "Colorful side panel design with skill bars, ideal for creative fields",
  },
];

const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <Card className="mb-6 bg-gray-50 border-blue-100">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Select a Template
          </h2>
          <p className="text-sm text-gray-600">
            Choose the design that best represents you.
          </p>
        </div>

        <RadioGroup
          value={selectedTemplate}
          onValueChange={(value) => onSelectTemplate(value as TemplateType)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {templates.map((template) => (
            <div key={template.value} className="relative">
              <RadioGroupItem
                value={template.value}
                id={`template-${template.value}`}
                className="sr-only"
              />
              <Label
                htmlFor={`template-${template.value}`}
                className={`
                  flex flex-col h-full border-2 rounded-lg p-4 cursor-pointer transition-all hover:bg-blue-50
                  ${
                    selectedTemplate === template.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }
                `}
              >
                <span className="font-medium text-gray-800 mb-1">
                  {template.label}
                </span>
                <span className="text-xs text-gray-600">
                  {template.description}
                </span>
                <div
                  className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                    selectedTemplate === template.value
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                ></div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TemplatePicker;

import React from "react";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Education } from "../../types/resume";

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    const updated = data.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange(updated);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
          Education
          <Button
            onClick={addEducation}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((education) => (
          <div
            key={education.id}
            className="p-4 border rounded-lg space-y-4 bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-700">Education Entry</h4>
              <Button
                onClick={() => removeEducation(education.id)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Degree</Label>
                <Input
                  value={education.degree}
                  onChange={(e) =>
                    updateEducation(education.id, "degree", e.target.value)
                  }
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div>
                <Label>Institution</Label>
                <Input
                  value={education.institution}
                  onChange={(e) =>
                    updateEducation(education.id, "institution", e.target.value)
                  }
                  placeholder="University of California, Berkeley"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={education.location}
                  onChange={(e) =>
                    updateEducation(education.id, "location", e.target.value)
                  }
                  placeholder="Berkeley, CA"
                />
              </div>
              <div>
                <Label>Graduation Date</Label>
                <Input
                  type="month"
                  value={education.graduationDate}
                  onChange={(e) =>
                    updateEducation(
                      education.id,
                      "graduationDate",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <Label>GPA (Optional)</Label>
                <Input
                  value={education.gpa || ""}
                  onChange={(e) =>
                    updateEducation(education.id, "gpa", e.target.value)
                  }
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No education added yet.</p>
            <Button
              onClick={addEducation}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Education
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationForm;

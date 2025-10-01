import React from "react";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Experience } from "../../types/resume";

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange([...data, newExperience]);
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: string | boolean
  ) => {
    const updated = data.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
          Work Experience
          <Button
            onClick={addExperience}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((experience) => (
          <div
            key={experience.id}
            className="p-4 border rounded-lg space-y-4 bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-700">Experience Entry</h4>
              <Button
                onClick={() => removeExperience(experience.id)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Position</Label>
                <Input
                  value={experience.position}
                  onChange={(e) =>
                    updateExperience(experience.id, "position", e.target.value)
                  }
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={experience.company}
                  onChange={(e) =>
                    updateExperience(experience.id, "company", e.target.value)
                  }
                  placeholder="Google Inc."
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={experience.location}
                  onChange={(e) =>
                    updateExperience(experience.id, "location", e.target.value)
                  }
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) =>
                    updateExperience(experience.id, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${experience.id}`}
                  checked={experience.current}
                  onCheckedChange={(checked) =>
                    updateExperience(experience.id, "current", !!checked)
                  }
                />
                <Label htmlFor={`current-${experience.id}`}>
                  Currently working here
                </Label>
              </div>
              {!experience.current && (
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={experience.endDate}
                    onChange={(e) =>
                      updateExperience(experience.id, "endDate", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={experience.description}
                onChange={(e) =>
                  updateExperience(experience.id, "description", e.target.value)
                }
                placeholder="Describe your role, responsibilities, and achievements..."
                rows={3}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No work experience added yet.</p>
            <Button
              onClick={addExperience}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Experience
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;

import React from "react";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Project } from "../../types/resume";

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
    };
    onChange([...data, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    const updated = data.map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    onChange(updated);
  };

  const removeProject = (id: string) => {
    onChange(data.filter((project) => project.id !== id));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
          Projects
          <Button
            onClick={addProject}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((project) => (
          <div
            key={project.id}
            className="p-4 border rounded-lg space-y-4 bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-700">Project Entry</h4>
              <Button
                onClick={() => removeProject(project.id)}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) =>
                    updateProject(project.id, "name", e.target.value)
                  }
                  placeholder="E-commerce Website"
                />
              </div>
              <div>
                <Label>Technologies Used</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) =>
                    updateProject(project.id, "technologies", e.target.value)
                  }
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Project Link (Optional)</Label>
                <Input
                  value={project.link || ""}
                  onChange={(e) =>
                    updateProject(project.id, "link", e.target.value)
                  }
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) =>
                  updateProject(project.id, "description", e.target.value)
                }
                placeholder="Describe the project, your role, and key achievements..."
                rows={3}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No projects added yet.</p>
            <Button
              onClick={addProject}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsForm;

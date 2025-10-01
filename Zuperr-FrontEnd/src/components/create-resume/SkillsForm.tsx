import React from "react";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Skill } from "../../types/resume";

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "Intermediate",
    };
    onChange([...data, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    const updated = data.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onChange(updated);
  };

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
          Skills
          <Button
            onClick={addSkill}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50"
          >
            <div className="flex-1">
              <Label>Skill Name</Label>
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                placeholder="JavaScript"
              />
            </div>
            <div className="w-48">
              <Label>Level</Label>
              <Select
                value={skill.level}
                onValueChange={(value) => updateSkill(skill.id, "level", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => removeSkill(skill.id)}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No skills added yet.</p>
            <Button
              onClick={addSkill}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsForm;

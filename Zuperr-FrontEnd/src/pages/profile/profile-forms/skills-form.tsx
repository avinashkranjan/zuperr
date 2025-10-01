/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { EditDialogProps } from "../edit-dialog";
import { get } from "@api/index";

interface Skill {
  Name: string;
  _id: string;
}

export default function KeySkillsDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Load initial selected skills from sectionData
  useEffect(() => {
    if (Array.isArray(sectionData)) {
      setSkills(sectionData);
    }
  }, [sectionData]);

  // Fetch all available skills from API
  useEffect(() => {
    const getAllSkills = async () => {
      try {
        setLoading(true); // Start loading
        const response: any = await get("/employer/skills/get-all-skill");
        if (response) {
          setAllSkills(response.skills);
        } else {
          console.error("No skills data returned");
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getAllSkills();
  }, []);

  const handleAddSkill = () => {
    const foundSkill = allSkills.find((s) => s._id === selectedSkillId);
    if (foundSkill && !skills.some((s) => s._id === selectedSkillId)) {
      setSkills((prev) => [...prev, foundSkill]);
    }
    setSelectedSkillId(""); // Reset dropdown
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => prev.filter((skill) => skill._id !== id));
  };

  const handleSave = () => {
    const skillIds = skills.map((s) => s._id);
    onSubmit({
      keySkills: skillIds,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">Add Key Skills</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Key Skills</DialogTitle>
          <DialogDescription>
            Select and manage your key skills.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Skill Tags */}
          <div>
            <Label>Your Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  className="flex items-center gap-1 bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full"
                >
                  <span>{skill.Name}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill._id)}
                    className="hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Dropdown */}
          <div>
            <Label>
              Add Skill from List<sup className="text-red-500">*</sup>
            </Label>
            <div className="flex gap-2 items-center mt-2">
              <Select
                value={selectedSkillId}
                onValueChange={setSelectedSkillId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : allSkills.length > 0 ? (
                    allSkills.map((skill) => (
                      <SelectItem key={skill._id} value={skill._id}>
                        {skill.Name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      No skills available
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button onClick={handleAddSkill} disabled={!selectedSkillId}>
                Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button className="w-full" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { X, Pencil } from "lucide-react";
import { EditDialogProps } from "../edit-dialog";

interface Project {
  projectName: string;
  duration: {
    from: string;
    to: string;
  };
  description: string;
  keySkills?: string;
  endResult: string;
  projectURL?: string;
  _id?: string;
}

export default function ProjectDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({
    projectName: "",
    duration: { from: "", to: "" },
    description: "",
    keySkills: "",
    endResult: "",
    projectURL: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    setProjects(sectionData || []);
  }, [sectionData]);

  const handleInputChange = (field: keyof Project, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDurationChange = (key: "from" | "to", value: string) => {
    setForm((prev) => ({
      ...prev,
      duration: { ...prev.duration, [key]: value },
    }));
  };

  const handleSaveOne = () => {
    const newEntry = { ...form };

    if (editIndex !== null) {
      const updated = [...projects];
      updated[editIndex] = newEntry;
      setProjects(updated);
      setEditIndex(null);
    } else {
      setProjects((prev) => [...prev, newEntry]);
    }

    setForm({
      projectName: "",
      duration: { from: "", to: "" },
      description: "",
      keySkills: "",
      endResult: "",
      projectURL: "",
    });
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setForm(projects[index]);
  };

  const handleDelete = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setForm({
        projectName: "",
        duration: { from: "", to: "" },
        description: "",
        keySkills: "",
        endResult: "",
        projectURL: "",
      });
    }
  };

  const handleSaveAll = () => {
    onSubmit({
      projects: projects,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Projects</DialogTitle>
          <DialogDescription>
            Showcase your hands-on experience, how you&apos;re applying your
            skills in real-world scenarios.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Project Name */}
          <div>
            <Label>Project Name*</Label>
            <Input
              placeholder="Project Name"
              value={form.projectName}
              onChange={(e) => handleInputChange("projectName", e.target.value)}
            />
          </div>

          {/* Project Duration */}
          <div>
            <Label>Project Duration*</Label>
            <div className="flex gap-2">
              <Input
                type="month"
                value={form.duration.from}
                onChange={(e) => handleDurationChange("from", e.target.value)}
              />
              <span className="mt-2">to</span>
              <Input
                type="month"
                value={form.duration.to}
                onChange={(e) => handleDurationChange("to", e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description*</Label>
            <Textarea
              value={form.description}
              placeholder="What was the project about?"
              className="resize-none"
              maxLength={300}
              onChange={(e) =>
                handleInputChange("description", e.target.value?.slice(0, 300))
              }
            />
            <p className="text-sm text-muted-foreground">
              {form.description.length}/300 characters
            </p>
          </div>

          {/* Key Skills */}
          <div>
            <Label>Key Skills (Optional)</Label>
            <Input
              placeholder="Key skills used in the project"
              value={form.keySkills}
              onChange={(e) => handleInputChange("keySkills", e.target.value)}
            />
          </div>

          {/* End Result */}
          <div>
            <Label>Result / Conclusion*</Label>
            <Input
              placeholder="Result or outcome of the project"
              value={form.endResult}
              onChange={(e) => handleInputChange("endResult", e.target.value)}
            />
          </div>

          {/* Project URL */}
          <div>
            <Label>Project URL (Optional)</Label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={form.projectURL}
              onChange={(e) => handleInputChange("projectURL", e.target.value)}
            />
          </div>

          <Button
            onClick={handleSaveOne}
            className="w-full mt-2"
            variant="secondary"
          >
            {editIndex !== null ? "Update Project" : "Add Project"}
          </Button>

          {/* Project Cards */}
          {projects.length > 0 && (
            <div className="space-y-3 mt-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-muted p-4 rounded-md flex justify-between items-start gap-4"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{project.projectName}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.duration.from?.slice(0, 7)} to{" "}
                      {project.duration.to?.slice(0, 7)}
                    </p>
                    <p className="text-sm">{project.description}</p>
                    {project.keySkills && (
                      <p className="text-sm text-muted-foreground">
                        <b>Skills:</b> {project.keySkills}
                      </p>
                    )}
                    <p className="text-sm">
                      <b>Outcome:</b> {project.endResult}
                    </p>
                    {project.projectURL && (
                      <a
                        href={project.projectURL}
                        className="text-blue-500 text-sm underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.projectURL}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(index)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button
            className="w-full"
            onClick={handleSaveAll}
            disabled={projects.length === 0}
          >
            Save All Projects
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

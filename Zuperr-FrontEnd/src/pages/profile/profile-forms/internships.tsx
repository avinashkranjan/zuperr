"use client";

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
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { EditDialogProps } from "../edit-dialog";
import { X } from "lucide-react";

interface Internship {
  _id?: string;
  companyName: string;
  role: string;
  projectName: string;
  description: string;
  keySkills: string;
  projectURL?: string;
  duration: {
    from: string;
    to: string;
  };
}

export default function InternshipDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const emptyEntry: Internship = {
    companyName: "",
    role: "",
    projectName: "",
    description: "",
    keySkills: "",
    projectURL: "",
    duration: {
      from: "",
      to: "",
    },
  };

  const [form, setForm] = useState<Internship>(emptyEntry);

  useEffect(() => {
    if (sectionData && Array.isArray(sectionData)) {
      setInternships(sectionData);
    } else if (sectionData && typeof sectionData === "object") {
      setInternships([sectionData]);
    }
  }, [sectionData]);

  const handleChange = (field: keyof Internship, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDurationChange = (type: "from" | "to", value: string) => {
    setForm((prev) => ({
      ...prev,
      duration: { ...prev.duration, [type]: value },
    }));
  };

  const resetForm = () => {
    setForm(emptyEntry);
    setEditingIndex(null);
  };

  const handleAddOrUpdate = () => {
    if (
      !form.companyName ||
      !form.role ||
      !form.projectName ||
      !form.description
    )
      return;

    if (editingIndex !== null) {
      const updated = [...internships];
      updated[editingIndex] = form;
      setInternships(updated);
    } else {
      setInternships((prev) => [...prev, form]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setForm(internships[index]);
  };

  const handleDelete = (index: number) => {
    setInternships((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) resetForm();
  };

  const handleSave = () => {
    onSubmit({
      internships: internships,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">Add Internship</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Internships</DialogTitle>
          <DialogDescription>
            Add internships you&apos;ve completed during your studies.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Input Fields */}
          <div>
            <Label>Company Name *</Label>
            <Input
              placeholder="Company Name"
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
          </div>

          <div>
            <Label>Internship Role *</Label>
            <Input
              placeholder="Internship Role"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
          </div>

          <div>
            <Label>Internship Duration *</Label>
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

          <div>
            <Label>Project Name *</Label>
            <Input
              placeholder="Internship Project Name"
              value={form.projectName}
              onChange={(e) => handleChange("projectName", e.target.value)}
            />
          </div>

          <div>
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe what you did"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value.slice(0, 300))
              }
            />
            <p className="text-sm text-muted-foreground">
              {form.description.length}/300 characters
            </p>
          </div>

          <div>
            <Label>Key Skills Used</Label>
            <Input
              placeholder="E.g., Node.js, MongoDB"
              value={form.keySkills}
              onChange={(e) => handleChange("keySkills", e.target.value)}
            />
          </div>

          <div>
            <Label>Project URL (Optional)</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={form.projectURL}
              onChange={(e) => handleChange("projectURL", e.target.value)}
            />
          </div>

          <Button className="w-full mt-4" onClick={handleAddOrUpdate}>
            {editingIndex !== null ? "Update Internship" : "Add Internship"}
          </Button>

          {/* Internship List */}
          {internships.length > 0 && (
            <div className="space-y-4 mt-6">
              {internships.map((entry, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg bg-muted flex justify-between"
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{entry.companyName}</p>
                    <p className="text-muted-foreground">{entry.role}</p>
                    <p>
                      {new Date(entry.duration.from).toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )}{" "}
                      to{" "}
                      {new Date(entry.duration.to).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs">{entry.projectName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
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
            onClick={handleSave}
            className="w-full"
            disabled={internships.length === 0}
          >
            Save All Internships
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
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
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Checkbox } from "@components/ui/checkbox";
import { X } from "lucide-react";
import { EditDialogProps } from "../edit-dialog";

interface EmploymentEntry {
  _id?: string;
  workExperience: {
    years: number;
    months: number;
  };
  duration: {
    from: string;
    to: string;
  };
  companyName: string;
  position: string;
  keyAchievements: string;
  annualSalary: string;
  isCurrentJob: boolean;
  description: string;
}

export default function EmploymentHistoryDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [employmentList, setEmploymentList] = React.useState<EmploymentEntry[]>(
    []
  );
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  const [form, setForm] = React.useState<EmploymentEntry>({
    companyName: "",
    position: "",
    keyAchievements: "",
    annualSalary: "",
    isCurrentJob: false,
    description: "",
    duration: { from: "", to: "" },
    workExperience: { years: 0, months: 0 },
  });

  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

  React.useEffect(() => {
    if (Array.isArray(sectionData)) {
      setEmploymentList(sectionData);
    } else if (sectionData && typeof sectionData === "object") {
      setEmploymentList([sectionData]);
    }
  }, [sectionData]);

  const handleInput = (key: keyof EmploymentEntry, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDuration = (key: "from" | "to", value: string) => {
    setForm((prev) => ({
      ...prev,
      duration: { ...prev.duration, [key]: value },
    }));
  };

  const handleWorkExp = (key: "years" | "months", value: number) => {
    setForm((prev) => ({
      ...prev,
      workExperience: { ...prev.workExperience, [key]: value },
    }));
  };

  const resetForm = () => {
    setForm({
      companyName: "",
      position: "",
      keyAchievements: "",
      annualSalary: "",
      isCurrentJob: false,
      description: "",
      duration: { from: "", to: "" },
      workExperience: { years: 0, months: 0 },
    });
    setEditingIndex(null);
  };

  const handleAddOrUpdate = () => {
    if (
      !form.companyName ||
      !form.position ||
      !form.description ||
      !form.keyAchievements
    )
      return;

    if (editingIndex !== null) {
      const updated = [...employmentList];
      updated[editingIndex] = form;
      setEmploymentList(updated);
    } else {
      setEmploymentList((prev) => [...prev, form]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    setForm(employmentList[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setEmploymentList((prev) => prev.filter((_, i) => i !== index));
    resetForm();
  };

  const handleSave = () => {
    onSubmit({
      employmentHistory: employmentList,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Employment History</DialogTitle>
          <DialogDescription>
            Add your previous jobs, roles, achievements, and responsibilities.
          </DialogDescription>
        </DialogHeader>

        {/* Form Inputs */}
        <div className="space-y-4 pt-4">
          {/* Work Experience */}
          <div className="space-y-1">
            <Label>Total Work Experience *</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Years</Label>
                <Select
                  value={form.workExperience.years?.toString() || ""}
                  onValueChange={(val) => handleWorkExp("years", Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Years" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>Months</Label>
                <Select
                  value={form.workExperience.months?.toString() || ""}
                  onValueChange={(val) => handleWorkExp("months", Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Months" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label>Company Name *</Label>
            <Input
              placeholder="e.g., Google"
              value={form.companyName}
              onChange={(e) => handleInput("companyName", e.target.value)}
            />
          </div>

          <div>
            <Label>Job Title *</Label>
            <Input
              placeholder="e.g., Software Engineer"
              value={form.position}
              onChange={(e) => handleInput("position", e.target.value)}
            />
          </div>

          <div>
            <Label>Duration *</Label>
            <div className="flex gap-2">
              <Input
                type="month"
                value={form.duration.from}
                onChange={(e) => handleDuration("from", e.target.value)}
                placeholder="Start date"
              />
              <Input
                type="month"
                disabled={form.isCurrentJob}
                className={form.isCurrentJob ? "opacity-50" : ""}
                value={form.duration.to}
                onChange={(e) => handleDuration("to", e.target.value)}
                placeholder="End date"
              />
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Checkbox
                checked={form.isCurrentJob}
                onCheckedChange={(val) => handleInput("isCurrentJob", !!val)}
              />
              <Label>I currently work here</Label>
            </div>
          </div>

          <div>
            <Label>Key Achievements *</Label>
            <Input
              placeholder="e.g., Led team to launch new product"
              value={form.keyAchievements}
              onChange={(e) => handleInput("keyAchievements", e.target.value)}
            />
          </div>

          <div>
            <Label>Annual Salary *</Label>
            <div className="flex gap-2">
              <div className="border rounded-md px-3 py-2 text-sm bg-muted">
                ₹
              </div>
              <Input
                type="number"
                placeholder="e.g., 1200000"
                value={form.annualSalary}
                onChange={(e) => handleInput("annualSalary", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Role Description *</Label>
            <Textarea
              placeholder="Describe your responsibilities, skills used, and notable outcomes"
              value={form.description}
              onChange={(e) =>
                handleInput("description", e.target.value.slice(0, 1000))
              }
              className="min-h-[120px]"
            />

            <p className="text-sm text-muted-foreground text-right">
              {form.description.length}/1000 characters
            </p>
          </div>

          <Button onClick={handleAddOrUpdate} className="w-full">
            {editingIndex !== null ? "Update Entry" : "Add Employment"}
          </Button>

          {/* List of Existing Entries */}
          {employmentList.length > 0 && (
            <div className="space-y-4 mt-6">
              {employmentList.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-md bg-muted flex justify-between items-start"
                >
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{entry.companyName}</p>
                    <p className="text-muted-foreground">{entry.position}</p>
                    <p>
                      {entry.workExperience.years} yrs{" "}
                      {entry.workExperience.months} mos
                    </p>
                    <p className="text-xs">{entry.keyAchievements}</p>
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
            disabled={employmentList.length === 0}
          >
            Save All Employment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

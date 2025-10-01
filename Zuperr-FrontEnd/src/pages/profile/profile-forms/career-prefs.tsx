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
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";
import { X } from "lucide-react";
import { EditDialogProps } from "../edit-dialog";

type JobType = "Full Time" | "Part Time" | "Remote" | "Internship";

export default function CareerPreferencesDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [newJobRole, setNewJobRole] = useState("");
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [availability, setAvailability] = useState<string | null>(null);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  useEffect(() => {
    if (sectionData) {
      setJobRoles(sectionData.jobRoles || []);
      setJobTypes(sectionData.jobTypes || []);
      setAvailability(sectionData.availability || null);
      setPreferredLocation(sectionData.preferredLocation || "");
      setMinSalary(sectionData.minimumSalaryLPA?.toString() || "");
      setMaxSalary(sectionData.maximumSalaryLPA?.toString() || "");
    }
  }, [sectionData]);

  const handleAddJobRole = () => {
    if (newJobRole && !jobRoles.includes(newJobRole) && jobRoles.length < 3) {
      setJobRoles((prev) => [...prev, newJobRole]);
      setNewJobRole("");
    }
  };

  const handleDeleteRole = (role: string) => {
    setJobRoles((prev) => prev.filter((r) => r !== role));
  };

  const toggleJobType = (type: JobType) => {
    setJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSave = () => {
    const payload = {
      jobRoles,
      jobTypes,
      availability,
      preferredLocation,
      minimumSalaryLPA: Number(minSalary),
      maximumSalaryLPA: Number(maxSalary),
    };
    onSubmit({
      careerPreference: payload,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">Set Career Preferences</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Career Preferences</DialogTitle>
          <DialogDescription>
            Define your job expectations to find better matches.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Job Roles */}
          <div>
            <Label>Job Roles (max 3)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newJobRole}
                onChange={(e) => setNewJobRole(e.target.value)}
                placeholder="Add Job Role"
              />
              <Button
                onClick={handleAddJobRole}
                disabled={jobRoles.length >= 3}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {jobRoles.map((role) => (
                <div
                  key={role}
                  className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {role}
                  <button
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => handleDeleteRole(role)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Job Types */}
          <div>
            <Label>Preferred Job Types</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {(
                ["Full Time", "Part Time", "Remote", "Internship"] as JobType[]
              ).map((type) => (
                <Button
                  key={type}
                  variant={jobTypes.includes(type) ? "default" : "outline"}
                  onClick={() => toggleJobType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <Label>Availability to Work</Label>
            <ToggleGroup
              type="single"
              value={availability ?? ""}
              onValueChange={(val) => setAvailability(val)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2"
            >
              {[
                "Immediate",
                "15 days or less",
                "1 month",
                "2 months",
                "3 months",
                "Notice Period",
              ].map((val) => (
                <ToggleGroupItem key={val} value={val} className="border">
                  {val}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Preferred Location */}
          <div>
            <Label>Preferred Location</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  const loc = localStorage.getItem("user_location");
                  if (loc) setPreferredLocation(loc);
                }}
              >
                Detect My Location
              </Button>
              <span className="text-sm text-muted-foreground">
                or enter manually
              </span>
            </div>
            <Input
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              className="mt-2"
              placeholder="Location"
            />
          </div>

          {/* Salary */}
          <div>
            <Label>Salary Expectation (LPA)</Label>
            <div className="flex gap-2">
              <div className="relative w-full">
                <span className="absolute left-3 top-1.5 text-gray-500">₹</span>
                <Input
                  type="number"
                  className="pl-7"
                  placeholder="Minimum"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
              </div>
              <div className="relative w-full">
                <span className="absolute left-3 top-1.5 text-gray-500">₹</span>
                <Input
                  type="number"
                  className="pl-7"
                  placeholder="Maximum"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={handleSave} className="w-full">
            Save All Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

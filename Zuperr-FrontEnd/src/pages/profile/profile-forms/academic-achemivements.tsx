"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { EditDialogProps } from "../edit-dialog";

const predefinedAchievements = [
  "College Topper",
  "Department Topper",
  "Top 3 in Class",
  "Top 5 in Class",
  "Top 10 in Class",
  "Top 20 in Class",
  "Gold Medalist",
  "Silver Medalist",
  "Bronze Medalist",
  "Scholarship Recipient",
  "Merit Scholarship",
  "Full Tuition Waiver",
  "Dean's List",
  "Best Project Award",
  "Best Paper Award",
  "Published Research Paper",
  "All-Rounder",
  "Highest Attendance",
  "Student of the Year",
  "Best Intern",
  "Event Winner",
  "Olympiad Qualifier",
  "Hackathon Winner",
  "Patent Holder",
  "Other",
];

export default function AcademicAchievementsDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [achievementList, setAchievementList] = React.useState<any[]>([]);
  const [selectedAchievement, setSelectedAchievement] = React.useState("");
  const [customAchievement, setCustomAchievement] = React.useState("");
  const [receivedDuring, setReceivedDuring] = React.useState("");
  const [educationReference, setEducationReference] = React.useState("");
  const [topRank, setTopRank] = React.useState("");
  const [editIndex, setEditIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    setAchievementList(sectionData || []);
  }, [sectionData]);

  const resetForm = () => {
    setSelectedAchievement("");
    setCustomAchievement("");
    setReceivedDuring("");
    setEducationReference("");
    setTopRank("");
    setEditIndex(null);
  };

  const handleAddOrUpdate = () => {
    const finalAchievement =
      selectedAchievement === "Other" ? customAchievement : selectedAchievement;

    if (!finalAchievement || !receivedDuring) return;

    const newEntry = {
      achievement: finalAchievement,
      receivedDuring,
      educationReference,
      topRank,
    };

    if (editIndex !== null) {
      const updated = [...achievementList];
      updated[editIndex] = newEntry;
      setAchievementList(updated);
    } else {
      setAchievementList((prev) => [...prev, newEntry]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const item = achievementList[index];
    setSelectedAchievement(
      predefinedAchievements.includes(item.achievement)
        ? item.achievement
        : "Other"
    );
    setCustomAchievement(
      predefinedAchievements.includes(item.achievement) ? "" : item.achievement
    );
    setReceivedDuring(item.receivedDuring);
    setEducationReference(item.educationReference || "");
    setTopRank(item.topRank || "");
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...achievementList];
    updated.splice(index, 1);
    setAchievementList(updated);
  };

  const handleFinalSubmit = () => {
    onSubmit({
      academicAchievements: achievementList,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Academic Achievements
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            List your recognitions, ranks, and honors earned during your
            academic journey.
          </DialogDescription>
        </DialogHeader>

        {/* Existing Entries */}
        {achievementList.length > 0 && (
          <div className="space-y-3 mt-4">
            {achievementList.map((item, index) => (
              <div
                key={item._id}
                className="flex justify-between items-start border p-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{item.achievement}</p>
                  <p className="text-sm text-muted-foreground">
                    During: {item.receivedDuring}
                    {item.topRank && ` | Rank: ${item.topRank}`}
                    {item.educationReference &&
                      ` | Ref: ${item.educationReference}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4 pt-6">
          {/* Achievement */}
          <div className="space-y-1">
            <Label>
              Achievement<span className="text-red-500">*</span>
            </Label>
            <select
              value={selectedAchievement}
              onChange={(e) => setSelectedAchievement(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select</option>
              {predefinedAchievements.map((ach) => (
                <option key={ach} value={ach}>
                  {ach}
                </option>
              ))}
            </select>
            {selectedAchievement === "Other" && (
              <Input
                placeholder="Custom Achievement"
                value={customAchievement}
                onChange={(e) => setCustomAchievement(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Received During */}
          <div className="space-y-1">
            <Label>
              Received During<span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g., Final Year, 3rd Semester"
              value={receivedDuring}
              onChange={(e) => setReceivedDuring(e.target.value)}
            />
          </div>

          {/* Education Reference */}
          <div className="space-y-1">
            <Label>Education Reference (Optional)</Label>
            <Input
              placeholder="e.g., ABC Institute of Technology"
              value={educationReference}
              onChange={(e) => setEducationReference(e.target.value)}
            />
          </div>

          {/* Rank */}
          <div className="space-y-1">
            <Label>Top Rank (Optional)</Label>
            <Input
              placeholder="e.g., 5"
              value={topRank}
              onChange={(e) => setTopRank(e.target.value)}
            />
          </div>

          {/* Add/Update Button */}
          <Button onClick={handleAddOrUpdate} className="w-full">
            {editIndex !== null ? "Update" : "Add"} Achievement
          </Button>
        </div>

        {/* Final Save */}
        <div className="pt-6">
          <Button onClick={handleFinalSubmit} className="w-full">
            Save All Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

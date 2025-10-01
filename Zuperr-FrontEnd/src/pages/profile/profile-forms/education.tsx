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
import moment from "moment";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { EditDialogProps } from "../edit-dialog";

const educationLevels = [
  "10th",
  "12th",
  "Diploma",
  "Graduate",
  "Postgraduate",
  "Ph.D.",
  "Certificate Course",
  "Online Program",
  "Other",
];

const courses = [
  "B.Tech",
  "M.Tech",
  "MBA",
  "B.Sc",
  "M.Sc",
  "B.Com",
  "M.Com",
  "BBA",
  "LLB",
  "LLM",
  "MBBS",
  "PhD",
  "CA",
  "CFA",
  "Diploma",
  "Certification",
  "Other",
];

const specializations = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Finance",
  "Marketing",
  "Operations",
  "Law",
  "Medicine",
  "Physics",
  "Mathematics",
  "Statistics",
  "Other",
];

export default function EducationDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [educationList, setEducationList] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Form fields
  const [educationLevel, setEducationLevel] = useState("");
  const [courseName, setCourseName] = useState("");
  const [specializationField, setSpecializationField] = useState("");
  const [gradeType, setGradeType] = useState<"percentage" | "cgpa">("cgpa");
  const [gradeValue, setGradeValue] = useState("");
  const [gradeOutOf, setGradeOutOf] = useState("10");
  const [instituteName, setInstituteName] = useState("");
  const [courseType, setCourseType] = useState<
    "full-time" | "part-time" | "distance" | null
  >(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [examinationBoard, setExaminationBoard] = useState("");
  const [skills, setSkills] = useState("");

  useEffect(() => {
    // Ensure sectionData is always an array
    if (Array.isArray(sectionData)) {
      setEducationList(sectionData);
    }
  }, [sectionData]);

  const resetForm = () => {
    setEducationLevel("");
    setCourseName("");
    setSpecializationField("");
    setGradeType("cgpa");
    setGradeValue("");
    setGradeOutOf("10");
    setInstituteName("");
    setCourseType(null);
    setFromDate("");
    setToDate("");
    setExaminationBoard("");
    setSkills("");
    setEditIndex(null);
  };

  const handleAddOrUpdate = () => {
    if (
      !educationLevel ||
      !courseName ||
      !specializationField ||
      !instituteName
    )
      return;

    const newEntry = {
      educationLevel,
      courseName,
      specialization: specializationField,
      grading: gradeType.toUpperCase(),
      gradeValue: parseFloat(gradeValue),
      gradeOutOf,
      instituteName,
      courseType: courseType ? courseType.replace("-", " ") : "",
      // FIX: Store dates as ISO strings to keep data consistent
      courseDuration: {
        from: fromDate ? new Date(fromDate).toISOString() : "",
        to: toDate ? new Date(toDate).toISOString() : "",
      },
      examinationBoard,
      skills,
      passingYear: toDate ? new Date(toDate).getFullYear() : undefined,
    };

    if (editIndex !== null) {
      const updated = [...educationList];
      updated[editIndex] = newEntry;
      setEducationList(updated);
    } else {
      setEducationList((prev) => [...prev, newEntry]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const item = educationList[index];
    setEducationLevel(item.educationLevel);
    setCourseName(item.courseName);
    setSpecializationField(item.specialization);
    // FIX: Ensure gradeType is correctly set and handled for the RadioGroup
    setGradeType(item.grading?.toLowerCase() || "cgpa");
    setGradeValue(item.gradeValue?.toString() || "");
    setGradeOutOf(item.gradeOutOf?.toString() || "10");
    setInstituteName(item.instituteName);
    setCourseType(item.courseType?.toLowerCase().replace(" ", "-") || null);
    // FIX: Use moment to format dates for the input fields
    setFromDate(
      item.courseDuration?.from
        ? moment(item.courseDuration.from).format("YYYY-MM")
        : ""
    );
    setToDate(
      item.courseDuration?.to
        ? moment(item.courseDuration.to).format("YYYY-MM")
        : ""
    );

    setExaminationBoard(item.examinationBoard || "");
    setSkills(item.skills || "");
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...educationList];
    updated.splice(index, 1);
    setEducationList(updated);
  };

  const handleFinalSubmit = () => {
    onSubmit({
      educationAfter12th: educationList,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Education</DialogTitle>
          <DialogDescription>
            Highlight your academic background and certifications.
          </DialogDescription>
        </DialogHeader>

        {/* Cards */}
        {educationList.map((edu, i) => (
          <div
            key={edu._id || i} // Use index as fallback key
            className="border p-3 rounded-md flex justify-between items-start mb-4"
          >
            <div>
              <p className="font-semibold">
                {edu.courseName} in {edu.specialization}
              </p>
              <p className="text-sm text-muted-foreground">
                {edu.educationLevel} | {edu.instituteName} | {edu.courseType} |{" "}
                {/* FIX: Use moment for robust date formatting */}
                {edu.courseDuration?.from &&
                  moment(edu.courseDuration.from).format("MMM YYYY")}{" "}
                to{" "}
                {edu.courseDuration?.to &&
                  moment(edu.courseDuration.to).format("MMM YYYY")}
              </p>
              <p className="text-sm">
                {edu.grading}: {edu.gradeValue}/{edu.gradeOutOf} | Board:{" "}
                {edu.examinationBoard}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(i)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(i)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <Label>Education Level*</Label>
            <Select value={educationLevel} onValueChange={setEducationLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Course Name*</Label>
            <Select value={courseName} onValueChange={setCourseName}>
              <SelectTrigger>
                <SelectValue placeholder="Course name" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Specialization*</Label>
            <Select
              value={specializationField}
              onValueChange={setSpecializationField}
            >
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Grading*</Label>
            <RadioGroup
              // FIX: Use `value` instead of `defaultValue` for a controlled component
              value={gradeType}
              onValueChange={(val) => setGradeType(val as any)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cgpa" id="cgpa" />
                <Label htmlFor="cgpa">CGPA/GPA</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Acquired"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
                className="w-1/2"
                type="number"
              />
              <span>out of</span>
              <Select value={gradeOutOf} onValueChange={setGradeOutOf}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Out of" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="col-span-2">
            <Label>Institute/University Name*</Label>
            <Input
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Course Duration*</Label>
            <div className="flex gap-2">
              <Input
                type="month"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <span className="self-center">to</span>
              <Input
                type="month"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-span-2">
            <Label>Course Type*</Label>
            <div className="flex gap-2 mt-2">
              {["full-time", "part-time", "distance"].map((type) => (
                <Button
                  key={type}
                  variant={courseType === type ? "default" : "outline"}
                  onClick={() => setCourseType(type as any)}
                >
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <Label>Examination Board</Label>
            <Input
              value={examinationBoard}
              onChange={(e) => setExaminationBoard(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Key Skills (comma-separated)</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
        </div>

        {/* Add/Update Button */}
        <div className="pt-6">
          <Button className="w-full" onClick={handleAddOrUpdate}>
            {editIndex !== null ? "Update Education" : "Add Education"}
          </Button>
        </div>

        {/* Save All Button */}
        <DialogFooter className="mt-4">
          <Button className="w-full" onClick={handleFinalSubmit}>
            Save All Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

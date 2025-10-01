/* eslint-disable no-nested-ternary */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@components/ui/select";
import { useForm } from "react-hook-form";
import { EditDialogProps } from "../edit-dialog";
import { Plus } from "lucide-react";

type EducationData = {
  examinationBoard: string | null;
  mediumOfStudy: string | null;
  gradeType: string | null;
  gradingOutOf: string | null;
  gradeValue: string;
  passingYear: string;
  _id: string;
};

const educationLabels: Record<string, string> = {
  SSC: "10th (SSC)",
  HSC: "12th (HSC)",
};

export default function TenthEducationDialog({
  open,
  onOpenChange,
  sectionConfig,
  onSubmit,
  sectionData,
}: EditDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<EducationData>();

  const educationType = sectionConfig?.id || "SSC";

  const [gradeType, setGradeType] = useState<string>("percentage");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localData, setLocalData] = useState<EducationData[]>([]);

  const editingRecord = useMemo(
    () => localData.find((item) => item._id === editingId) || null,
    [editingId, localData]
  );

  useEffect(() => {
    if (open) {
      setLocalData(
        Array.isArray(sectionData)
          ? [...sectionData]
          : sectionData
          ? [sectionData]
          : []
      );
      setShowAddForm(false);
      setIsEditMode(false);
      setEditingId(null);
    }
  }, [open, sectionData]);

  useEffect(() => {
    if (editingRecord && open) {
      reset({
        ...editingRecord,
        gradeValue: editingRecord.gradeValue?.replace("%", "") || "",
        gradeType:
          editingRecord.gradeType ||
          (editingRecord.gradeValue?.includes("%") ? "percentage" : "cgpa"),
      });
      setGradeType(
        editingRecord.gradeType ||
          (editingRecord.gradeValue?.includes("%") ? "percentage" : "cgpa")
      );
    }
  }, [editingRecord, open, reset]);

  const handleFormSubmit = (data: Partial<EducationData>) => {
    const finalGradeValue =
      gradeType === "percentage" ? data.gradeValue : data.gradeValue;

    const newEntry: EducationData = {
      ...(data as EducationData),
      gradeType,
      gradeValue: finalGradeValue || "",
      _id: editingId || crypto.randomUUID(),
    };

    let updatedArray: EducationData[];

    if (isEditMode && editingId) {
      updatedArray = localData.map((item) =>
        item._id === editingId ? newEntry : item
      );
    } else {
      updatedArray = [...localData, newEntry];
    }

    onSubmit({
      educationTill12th: updatedArray,
    });
    setLocalData(updatedArray);
    setShowAddForm(false);
    setEditingId(null);
    setIsEditMode(false);
    onOpenChange(false);
  };

  const handleRemove = (id: string) => {
    const updatedArray = localData.filter((item) => item._id !== id);
    onSubmit({
      educationTill12th: updatedArray,
    });
    setLocalData(updatedArray);
    onOpenChange(false);
  };

  const currentData = watch();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setShowAddForm(false);
          setEditingId(null);
          setIsEditMode(false);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{educationLabels[educationType] || "Education Details"}</span>
          </DialogTitle>
          <DialogDescription>
            {showAddForm
              ? `Add new ${educationLabels[educationType]} details`
              : `Manage your ${educationLabels[educationType]} details`}
          </DialogDescription>
        </DialogHeader>

        {!showAddForm ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              {localData.map((record) => (
                <div
                  key={record._id}
                  className="border rounded-xl p-4 shadow-sm space-y-2"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Board</Label>
                      <p className="text-sm">
                        {record.examinationBoard || "—"}
                      </p>
                    </div>
                    <div>
                      <Label>Medium</Label>
                      <p className="text-sm">{record.mediumOfStudy || "—"}</p>
                    </div>
                    <div>
                      <Label>Grade Type</Label>
                      <p className="text-sm">
                        {record.gradeType?.toLowerCase() === "percentage"
                          ? "Percentage"
                          : record.gradeType?.toLowerCase() === "cgpa"
                          ? "CGPA"
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <Label>Grade</Label>
                      <p className="text-sm">{record.gradeValue || "—"}</p>
                    </div>
                    <div>
                      <Label>Grading Scale</Label>
                      <p className="text-sm">{record.gradingOutOf || "—"}</p>
                    </div>
                    <div>
                      <Label>Passing Year</Label>
                      <p className="text-sm">{record.passingYear || "—"}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditMode(true);
                        setEditingId(record._id);
                        setShowAddForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemove(record._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  setIsEditMode(false);
                  setShowAddForm(true);
                  setEditingId(null);
                  reset({
                    examinationBoard: null,
                    mediumOfStudy: null,
                    gradeType: null,
                    gradingOutOf: null,
                    gradeValue: "",
                    passingYear: "",
                    _id: "",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add New
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6 mt-4"
          >
            {/* Exam Board */}
            <div>
              <Label>Examination Board</Label>
              <Select
                onValueChange={(val) => setValue("examinationBoard", val)}
                value={currentData.examinationBoard || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Examination Board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                  <SelectItem value="State Board">State Board</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {currentData.examinationBoard === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Specify examination board"
                  {...register("examinationBoard")}
                />
              )}
            </div>

            {/* Medium */}
            <div>
              <Label>Medium of Study</Label>
              <Input
                placeholder="e.g. English, Hindi"
                {...register("mediumOfStudy")}
                value={currentData.mediumOfStudy || ""}
              />
            </div>

            {/* Grade Type */}
            <div>
              <Label>Percentage / CGPA</Label>
              <RadioGroup
                value={gradeType.toLowerCase()}
                onValueChange={(val) => {
                  setGradeType(val as string);
                  setValue("gradeType", val as string);
                }}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Percentage</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="cgpa" id="cgpa" />
                  <Label htmlFor="cgpa">CGPA</Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-2 mt-3">
                <Input
                  placeholder={
                    gradeType === "percentage" ? "e.g. 85" : "e.g. 8.5"
                  }
                  className="w-1/3"
                  {...register("gradeValue")}
                  value={currentData.gradeValue || ""}
                />
                <span>out of</span>
                <Select
                  onValueChange={(val) => setValue("gradingOutOf", val)}
                  value={currentData.gradingOutOf || ""}
                >
                  <SelectTrigger className="w-1/3">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeType.toLowerCase() === "percentage" ? (
                      <SelectItem value="100">100</SelectItem>
                    ) : (
                      <>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </>
                    )}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {currentData.gradingOutOf === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Specify grading scale"
                  {...register("gradingOutOf")}
                />
              )}
            </div>

            {/* Passing Year */}
            <div>
              <Label>Passing Year</Label>
              <Select
                onValueChange={(val) => setValue("passingYear", val)}
                value={currentData.passingYear || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem value={year.toString()} key={year}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full">
                {isEditMode ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

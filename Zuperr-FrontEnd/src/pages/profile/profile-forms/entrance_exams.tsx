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
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { EditDialogProps } from "../edit-dialog";
import { Trash2, Pencil } from "lucide-react";

export default function EntranceExams({
  open,
  onOpenChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sectionConfig,
  onSubmit,
  sectionData,
}: EditDialogProps) {
  const examNames = [
    "JEE Main",
    "JEE Advanced",
    "BITSAT",
    "VITEEE",
    "SRMJEEE",
    "COMEDK UGET",
    "WBJEE",
    "MHT CET",
    "KCET",
    "AP EAMCET",
    "TS EAMCET",
    "AMUEEE",
    "LPUNEST",
    "NEET UG",
    "NEET PG",
    "AIIMS PG",
    "INI CET",
    "FMGE",
    "CAT",
    "XAT",
    "MAT",
    "CMAT",
    "SNAP",
    "NMAT",
    "ATMA",
    "GMAT",
    "IIFT",
    "CLAT UG",
    "CLAT PG",
    "AILET",
    "LSAT India",
    "DU LLB",
    "CUET UG",
    "CUET PG",
    "GATE",
    "UPSC CSE",
    "IFS",
    "IES/ESE",
    "SSC CGL",
    "SSC CHSL",
    "SSC JE",
    "RRB NTPC",
    "RRB JE",
    "IBPS PO",
    "IBPS Clerk",
    "IBPS SO",
    "SBI PO",
    "SBI Clerk",
    "RBI Grade B",
    "RBI Assistant",
    "NABARD",
    "UPPCS",
    "MPPSC",
    "BPSC",
    "KPSC",
    "TNPSC",
    "APPSC",
    "WBCS",
    "TET",
    "CTET",
    "UGC NET",
    "CSIR NET",
    "NDA",
    "CDS",
    "AFCAT",
    "SSB Interview",
    "Indian Coast Guard",
    "Merchant Navy Entrance",
    "Army TES",
    "Naval Academy Exam",
    "CA Foundation",
    "CA Intermediate",
    "CA Final",
    "CS Foundation",
    "CMA Foundation",
    "NATA",
    "CEED",
    "NID DAT",
    "UCEED",
    "IGNOU OPENMAT",
    "ISRO Recruitment Exam",
    "DRDO CEPTAM",
    "BARC Exam",
    "TISSNET",
    "ICAR AIEEA",
    "IIHM eCHAT",
    "Hotel Management NCHMCT JEE",
    "Other",
  ];
  const examYears = Array.from(
    { length: 10 },
    (_, i) => `${new Date().getFullYear() - i}`
  );

  const [examList, setExamList] = React.useState<any[]>([]);
  const [selectedExamName, setSelectedExamName] = React.useState("");
  const [customExamName, setCustomExamName] = React.useState("");
  const [examYear, setExamYear] = React.useState("");
  const [obtainedScore, setObtainedScore] = React.useState("");
  const [maxScore, setMaxScore] = React.useState("");

  const [editIndex, setEditIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    setExamList(sectionData || []);
  }, [sectionData]);

  const resetForm = () => {
    setSelectedExamName("");
    setCustomExamName("");
    setExamYear("");
    setObtainedScore("");
    setMaxScore("");
    setEditIndex(null);
  };

  const handleAddOrUpdate = () => {
    const finalExamName =
      selectedExamName === "Other" ? customExamName : selectedExamName;

    if (!finalExamName || !examYear || !obtainedScore || !maxScore) return;

    const newEntry = {
      examName: finalExamName,
      examYear,
      obtainedScore,
      maxScore,
    };

    if (editIndex !== null) {
      const updatedList = [...examList];
      updatedList[editIndex] = newEntry;
      setExamList(updatedList);
    } else {
      setExamList((prev) => [...prev, newEntry]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const item = examList[index];
    setSelectedExamName(
      examNames.includes(item.examName) ? item.examName : "Other"
    );
    setCustomExamName(examNames.includes(item.examName) ? "" : item.examName);
    setExamYear(item.examYear);
    setObtainedScore(item.obtainedScore);
    setMaxScore(item.maxScore);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...examList];
    updated.splice(index, 1);
    setExamList(updated);
  };

  const handleFinalSubmit = () => {
    onSubmit({
      competitiveExams: examList,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Entrance Exams
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add details about competitive exams you have taken.
          </DialogDescription>
        </DialogHeader>

        {/* Cards */}
        {examList.length > 0 && (
          <div className="space-y-3 mt-4">
            {examList.map((exam, index) => (
              <div
                key={exam._id}
                className="flex justify-between items-start border p-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{exam.examName}</p>
                  <p className="text-sm text-muted-foreground">
                    Year: {exam.examYear} | Score: {exam.obtainedScore} /{" "}
                    {exam.maxScore}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4 pt-6">
          {/* Exam Name */}
          <div className="space-y-1">
            <Label>
              Exam Name<span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedExamName}
              onValueChange={(val) => {
                setSelectedExamName(val);
                if (val !== "Other") setCustomExamName("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Exam Name" />
              </SelectTrigger>
              <SelectContent>
                {examNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedExamName === "Other" && (
              <Input
                className="mt-2"
                placeholder="Custom Exam Name"
                value={customExamName}
                onChange={(e) => setCustomExamName(e.target.value)}
              />
            )}
          </div>

          {/* Year */}
          <div className="space-y-1">
            <Label>
              Exam Year<span className="text-red-500">*</span>
            </Label>
            <Select value={examYear} onValueChange={(val) => setExamYear(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Exam Year" />
              </SelectTrigger>
              <SelectContent>
                {examYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Score */}
          <div className="space-y-1">
            <Label>
              Score / Percentile<span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Obtained"
                value={obtainedScore}
                onChange={(e) => setObtainedScore(e.target.value)}
              />
              <Input
                placeholder="Maximum"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
              />
            </div>
          </div>

          {/* Add/Update */}
          <Button onClick={handleAddOrUpdate} className="w-full">
            {editIndex !== null ? "Update" : "Add"} Exam
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

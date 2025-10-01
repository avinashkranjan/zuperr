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
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import { X, Pencil } from "lucide-react";
import { EditDialogProps } from "../edit-dialog";

interface LanguageEntry {
  language: string;
  proficiencyLevel: string;
  _id?: string;
}

const languageOptions = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
  "Urdu",
  "Assamese",
  "Konkani",
  "Manipuri",
  "Sanskrit",
  "Santali",
  "Sindhi",
  "Kashmiri",
  "Nepali",
  "Bodo",
  "Dogri",
  "Maithili",
  "Tulu",
  "Rajasthani",
  "Other",
];

const proficiencyLevels = [
  "Basic",
  "Conversational",
  "Intermediate",
  "Fluent",
  "Native",
];

export default function LanguageDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [languages, setLanguages] = useState<LanguageEntry[]>([]);
  const [language, setLanguage] = useState<string>();
  const [customLanguage, setCustomLanguage] = useState<string>("");
  const [proficiencyLevel, setProficiencyLevel] = useState<string>();

  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Load initial data
  useEffect(() => {
    setLanguages(sectionData || []);
  }, [sectionData]);

  const handleAddOrUpdate = () => {
    if (!(language || customLanguage) || !proficiencyLevel) return;

    const newEntry: LanguageEntry = {
      language: language === "Other" ? customLanguage : language!,
      proficiencyLevel,
    };

    if (editIndex !== null) {
      const updated = [...languages];
      updated[editIndex] = newEntry;
      setLanguages(updated);
      setEditIndex(null);
    } else {
      setLanguages((prev) => [...prev, newEntry]);
    }

    setLanguage(undefined);
    setCustomLanguage("");
    setProficiencyLevel(undefined);
  };

  const handleEdit = (index: number) => {
    const entry = languages[index];
    setLanguage(
      languageOptions.includes(entry.language) ? entry.language : "Other"
    );
    setCustomLanguage(
      languageOptions.includes(entry.language) ? "" : entry.language
    );
    setProficiencyLevel(entry.proficiencyLevel);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...languages];
    updated.splice(index, 1);
    setLanguages(updated);
    if (editIndex === index) {
      setEditIndex(null);
      setLanguage(undefined);
      setProficiencyLevel(undefined);
    }
  };

  const handleSave = () => {
    onSubmit({
      languages: languages,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Languages</DialogTitle>
          <DialogDescription>
            Specify the languages you speak and your proficiency level.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Language Selection */}
          <div>
            <Label>
              Language<sup className="text-red-500">*</sup>
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {language === "Other" && (
              <Input
                placeholder="Enter custom language"
                className="mt-2"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
              />
            )}
          </div>

          {/* Proficiency */}
          <div>
            <Label>
              Proficiency Level<sup className="text-red-500">*</sup>
            </Label>
            <Select
              value={proficiencyLevel}
              onValueChange={setProficiencyLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose proficiency" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAddOrUpdate}
            className="w-full"
            variant="secondary"
            disabled={!(language || customLanguage) || !proficiencyLevel}
          >
            {editIndex !== null ? "Update Language" : "Add Language"}
          </Button>

          {/* List */}
          {languages.length > 0 && (
            <div className="space-y-3">
              {languages.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md"
                >
                  <div>
                    <p className="font-medium capitalize">{entry.language}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {entry.proficiencyLevel}
                    </p>
                  </div>
                  <div className="flex gap-2">
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
            onClick={handleSave}
            disabled={languages.length === 0}
          >
            Save All Languages
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

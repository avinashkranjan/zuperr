"use client";

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

export default function EmpJobPreferencesForm() {
  const [jobType, setJobType] = useState("Full Time");
  const [shift, setShift] = useState("Day");
  const [locationRange, setLocationRange] = useState(60);
  const [salaryRange, setSalaryRange] = useState("");

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Job Preferences</h2>

      <Card className="rounded-2xl border">
        <CardContent className="p-6 space-y-6">
          {/* Job Type */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Job Type
            </Label>
            <div className="flex gap-4">
              {["Full Time", "Part Time", "Freelance"].map((type) => (
                <Button
                  key={type}
                  variant={jobType === type ? "default" : "outline"}
                  onClick={() => setJobType(type)}
                  className="rounded-full px-6"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Preferred Shift */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Preferred Shift
            </Label>
            <RadioGroup
              defaultValue={shift}
              onValueChange={setShift}
              className="flex gap-6"
            >
              {["Day", "Night", "Flexible"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Job Location Preference */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Job Location Preference
            </Label>
            <div className="border rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-2">
                {locationRange}km
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={locationRange}
                onChange={(e) => setLocationRange(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0km</span>
                <span>100km</span>
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Salary Range
            </Label>
            <Select value={salaryRange} onValueChange={setSalaryRange}>
              <SelectTrigger className="w-full max-w-md h-12 text-muted-foreground">
                <SelectValue placeholder="Salary Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3 LPA">1–3 LPA</SelectItem>
                <SelectItem value="3-7 LPA">3–7 LPA</SelectItem>
                <SelectItem value="7-15 LPA">7–15 LPA</SelectItem>
                <SelectItem value="15-20 LPA">15–20 LPA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button className="bg-blue-600 text-white px-8 rounded-xl text-base">
              save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

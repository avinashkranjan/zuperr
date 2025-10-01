import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Textarea } from "@components/ui/textarea";
import { Checkbox } from "@components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";
import { Label } from "@components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";
import { Input } from "@components/ui/input";
import { get, patch } from "@api/index";

export default function RecruiterPreferences() {
  const [isEditing, setIsEditing] = useState(false);
  const [jobType, setJobType] = useState("fulltime");
  const [workMode, setWorkMode] = useState("wfh");
  const [gender, setGender] = useState("any");
  const [hideGender, setHideGender] = useState(false);
  const [hideAge, setHideAge] = useState(false);
  const [googleSync, setGoogleSync] = useState(true);
  const [industry, setIndustry] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [isWalkIn, setIsWalkIn] = useState("no");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(30);
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      const employerId = localStorage.getItem("userId");
      const response: any = await get(`/employer/${employerId}`);
      const prefs = response.data[0].preferences;
      if (prefs) {
        setJobType(prefs.jobType || "fulltime");
        setWorkMode(prefs.workMode || "wfh");
        setIndustry(prefs.industry || "");
        setAboutCompany(prefs.aboutCompany || "");
        setIsWalkIn(prefs.isWalkIn || "no");
        setGender(prefs.gender || "any");
        setHideGender(prefs.hideGender || false);
        setHideAge(prefs.hideAge || false);
        setMinAge(prefs.ageRange?.from || 18);
        setMaxAge(prefs.ageRange?.to || 30);
        setGoogleSync(prefs.googleSync ?? true);
        setScheduleMessage(prefs.scheduleTemplate || "");
      }
      setIsLoading(false);
    };

    fetchPreferences();
  }, []);

  const handleSavePreferences = async () => {
    setIsLoading(true);
    const preferences = {
      jobType,
      workMode,
      industry,
      aboutCompany,
      isWalkIn,
      gender,
      hideGender,
      hideAge,
      ageRange: {
        from: minAge,
        to: maxAge,
      },
      googleSync,
      scheduleTemplate: scheduleMessage,
    };

    try {
      const employerId = localStorage.getItem("userId");
      const response: any = await patch(`/employer/${employerId}`, {
        preferences,
      });
      if (response) {
        console.log("Preferences saved successfully");
      } else {
        console.error("Failed to save preferences", response.message);
      }
    } catch (error) {
      console.error("Failed to save preferences", error);
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Recruiter Preferences</h2>

      <Card>
        <CardContent className="p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold border-b border-gray-200 pb-5">
              Default Posting Template
            </h3>
            <div className="flex justify-end gap-3 pt-6 border-t">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSavePreferences}
                    className="text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="text-white"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Preferences
                </Button>
              )}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <Label className="mb-2 block font-semibold">Job Type</Label>
            <ToggleGroup
              type="single"
              className="flex gap-2"
              value={jobType}
              onValueChange={isEditing ? setJobType : undefined}
              disabled={!isEditing}
            >
              <ToggleGroupItem
                value="fulltime"
                variant="outline"
                className="rounded-lg px-4"
              >
                Full Time
              </ToggleGroupItem>
              <ToggleGroupItem
                value="parttime"
                variant="outline"
                className="rounded-lg px-4"
              >
                Part Time
              </ToggleGroupItem>
              <ToggleGroupItem
                value="internship"
                variant="outline"
                className="rounded-lg px-4"
              >
                Internship
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Work Mode */}
          <div className="mt-8">
            <Label className="mb-2 block font-semibold">Work Mode</Label>
            <ToggleGroup
              type="single"
              className="flex gap-2"
              value={workMode}
              onValueChange={isEditing ? setWorkMode : undefined}
              disabled={!isEditing}
            >
              <ToggleGroupItem
                value="wfh"
                variant="outline"
                className="rounded-lg px-6"
              >
                Work From Home
              </ToggleGroupItem>
              <ToggleGroupItem
                value="wfo"
                variant="outline"
                className="rounded-lg px-6"
              >
                Work From Office
              </ToggleGroupItem>
              <ToggleGroupItem
                value="hybrid"
                variant="outline"
                className="rounded-lg px-6"
              >
                Hybrid
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Industry Data */}
          <div className="mt-8">
            <Label className="mb-2 block font-semibold">Industry</Label>
            <Select
              value={industry}
              onValueChange={isEditing ? setIndustry : undefined}
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* About Company */}
          <div className="mt-8">
            <Label className="mb-2 block font-semibold">About Company*</Label>
            <Textarea
              placeholder="About Company"
              className="w-full max-w-2xl"
              value={aboutCompany}
              onChange={
                isEditing ? (e) => setAboutCompany(e.target.value) : undefined
              }
              disabled={!isEditing}
            />
          </div>

          {/* Walk-in */}
          <div className="mt-8">
            <Label className="mb-2 block font-semibold">
              Is this Walk-in Interview
            </Label>
            <RadioGroup
              value={isWalkIn}
              onValueChange={isEditing ? setIsWalkIn : undefined}
              className="flex gap-6"
              disabled={!isEditing}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Gender */}
          <div className="mt-8">
            <Label className="mb-2 block font-semibold">Gender</Label>
            <ToggleGroup
              type="single"
              className="flex gap-2"
              value={gender}
              onValueChange={isEditing ? setGender : undefined}
              disabled={!isEditing}
            >
              <ToggleGroupItem
                value="any"
                variant="outline"
                className="rounded-lg px-6"
              >
                Any
              </ToggleGroupItem>
              <ToggleGroupItem
                value="male"
                variant="outline"
                className="rounded-lg px-6"
              >
                Male
              </ToggleGroupItem>
              <ToggleGroupItem
                value="female"
                variant="outline"
                className="rounded-lg px-6"
              >
                Female
              </ToggleGroupItem>
              <ToggleGroupItem
                value="other"
                variant="outline"
                className="rounded-lg px-6"
              >
                Other
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="mt-3">
              <Checkbox
                checked={hideGender}
                onCheckedChange={isEditing ? (setHideGender as any) : undefined}
                id="hideGender"
                disabled={!isEditing}
              />
              <Label htmlFor="hideGender" className="ml-2">
                Hide Gender preference from Employee
              </Label>
            </div>
          </div>

          {/* Age */}
          <div className="mt-8">
            <Label className="mb-2 block font-semibold">Age Range</Label>
            <div className="flex gap-3 max-w-sm">
              <Select
                value={minAge.toString()}
                onValueChange={
                  isEditing ? (val) => setMinAge(parseInt(val)) : undefined
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Min Age" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(48)].map((_, i) => (
                    <SelectItem key={i} value={(18 + i).toString()}>
                      {18 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="mt-2">to</span>
              <Select
                value={maxAge.toString()}
                onValueChange={
                  isEditing ? (val) => setMaxAge(parseInt(val)) : undefined
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Max Age" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(48)].map((_, i) => (
                    <SelectItem key={i} value={(18 + i).toString()}>
                      {18 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3">
              <Checkbox
                checked={hideAge}
                onCheckedChange={isEditing ? (setHideAge as any) : undefined}
                id="hideAge"
                disabled={!isEditing}
              />
              <Label htmlFor="hideAge" className="ml-2">
                Hide Age Preference from employee
              </Label>
            </div>
          </div>

          {/* Schedule Interview Dialog */}
          <div className="mt-8 border-t">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="mt-2 font-bold text-lg p-4">
                  Schedule Interview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Schedule Interview</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Select Job</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Job" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">
                          Frontend Developer
                        </SelectItem>
                        <SelectItem value="backend">
                          Backend Developer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Select Candidate
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anjali">Anjali</SelectItem>
                        <SelectItem value="ravi">Ravi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3pm">03:00 PM</SelectItem>
                          <SelectItem value="4pm">04:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Write a message (optional)
                    </label>
                    <Textarea
                      placeholder="Interview message"
                      rows={3}
                      value={scheduleMessage}
                      onChange={(e) => setScheduleMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Google Calendar Sync
                    </span>
                    <Switch
                      checked={googleSync}
                      onCheckedChange={setGoogleSync}
                    />
                  </div>

                  <div className="border rounded-md p-4 text-sm bg-muted">
                    <p className="font-semibold mb-1">Hi Anjali,</p>
                    <p>
                      You have been shortlisted for an interview with Zuperr.
                      Please find the interview details below:
                    </p>
                    <p className="mt-2">
                      <strong>Date:</strong> 02 July 2025
                      <br />
                      <strong>Time:</strong> 03:00 PM - 03:30 PM
                      <br />
                      <strong>Mode:</strong> Google Meet
                    </p>
                    <p className="mt-2">
                      <strong>Message from recruiter:</strong>
                      <br />
                      {scheduleMessage ||
                        "Please confirm your availability by responding to this email."}
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    type="submit"
                    className="text-white"
                    onClick={handleSavePreferences}
                  >
                    Save Preference
                  </Button>
                  <Button variant="outline" type="reset">
                    Reset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

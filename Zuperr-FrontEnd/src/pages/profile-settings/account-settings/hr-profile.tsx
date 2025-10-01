"use client";

import * as React from "react";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Link2 } from "lucide-react";
import { get, patch } from "@api/index";

export default function RecruiterProfileForm() {
  const employerId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    mobile: "",
    linkedin: "",
    designation: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ✅ Fetch existing recruiter profile
  React.useEffect(() => {
    if (!employerId) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res: any = await get(`/employer/${employerId}`);
        if (res?.data[0].recruiterProfile) {
          setForm({
            fullName: res.data[0].recruiterProfile.fullName || "",
            email: res.data[0].recruiterProfile.email || "",
            mobile: res.data[0].recruiterProfile.mobile || "",
            linkedin: res.data[0].recruiterProfile.linkedin || "",
            designation: res.data[0].recruiterProfile.designation || "",
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load recruiter profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [employerId]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerId) return;
    try {
      setSaving(true);
      await patch(`/employer/${employerId}`, {
        recruiterProfile: form,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to save recruiter profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto mt-10 bg-white border border-gray-300 rounded-xl p-8">
      <h2 className="text-2xl font-semibold mb-6">
        Recruiter/<span className="font-normal">HR Profile</span>
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        {/* Email Address */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* Mobile No. */}
        <div>
          <Label htmlFor="mobile">Mobile No.</Label>
          <Input
            id="mobile"
            placeholder="Mobile No."
            value={form.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
          />
        </div>

        {/* LinkedIn (Optional) */}
        <div>
          <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
          <div className="relative">
            <Input
              id="linkedin"
              placeholder="LinkedIn"
              value={form.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              className="pr-10"
            />
            <Link2 className="absolute right-3 top-2.5 text-muted-foreground w-5 h-5" />
          </div>
        </div>

        {/* Designation */}
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Select
            onValueChange={(value) => handleChange("designation", value)}
            value={form.designation}
          >
            <SelectTrigger id="designation">
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HR Manager">HR Manager</SelectItem>
              <SelectItem value="Talent Acquisition">
                Talent Acquisition
              </SelectItem>
              <SelectItem value="CEO">CEO</SelectItem>
              <SelectItem value="Associates">Associates</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <Button
            type="submit"
            className="w-[120px] rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

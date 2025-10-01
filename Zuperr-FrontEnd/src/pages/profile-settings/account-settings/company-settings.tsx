/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Upload, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { get, patch } from "@api/index";

export default function CompanyForm() {
  const employerId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    companySize: "",
    gstNumber: "",
    description: "",
    address: {
      district: "",
      state: "",
      country: "",
      line1: "",
      landmark: "",
      pincode: "",
    },
  });

  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const industryOptions = [
    "Any Industry",
    "Accounting / Auditing / Taxation",
    "Agriculture / Forestry / Livestock / Fertilizers",
    "Airlines / Aviation / Aerospace",
  ];

  useEffect(() => {
    if (employerId) {
      fetchEmployerData();
    }
  }, [employerId]);

  const fetchEmployerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await get(`/employer/${employerId}`);

      if (res && res.data) {
        const emp = res.data[0];
        setFormData({
          companyName: emp.companyName || "",
          companyWebsite: emp.companyWebsite || "",
          companySize: emp.companySize || "",
          gstNumber: emp.gstNumber || "",
          description: emp.description || "",
          address: {
            district: emp.address?.district || "",
            state: emp.address?.state || "",
            country: emp.address?.country || "",
            line1: emp.address?.line1 || "",
            landmark: emp.address?.landmark || "",
            pincode: emp.address?.pincode || "",
          },
        });
        setIndustries(emp.industries || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch employer data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleIndustry = (industry: string) => {
    setIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await patch(`/employer/${employerId}`, {
        ...formData,
        industries,
      });
      setSuccess("Company information updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading company information...
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-md shadow">
      <h2 className="text-2xl font-semibold mb-6">Company Information</h2>

      {/* Error & Success Messages */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 text-sm text-green-600 bg-green-100 rounded-md">
          {success}
        </div>
      )}

      {/* Company Logo Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center border border-dashed rounded-md h-40">
          <Upload className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Company Logo</span>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
            />
          </div>

          <div>
            <Label>GST Business Verification Docs</Label>
            <Input
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="GST Number"
            />
          </div>
        </div>
      </div>

      {/* Company Website & Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Company Website</Label>
          <Input
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://yourcompany.com"
          />
        </div>

        <div>
          <Label>Company Size</Label>
          <Select
            value={formData.companySize}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, companySize: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Company Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10</SelectItem>
              <SelectItem value="11-50">11-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="201-500">201-500</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Industry Type */}
      <div className="mt-6">
        <Label>Industry Type</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {industries.map((ind) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
              key={ind}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full cursor-pointer"
              onClick={() => toggleIndustry(ind)}
            >
              {ind}
            </div>
          ))}
        </div>
        <Select onValueChange={toggleIndustry}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent>
            {industryOptions.map((option, idx) => (
              <SelectItem key={idx} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Address Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 text-blue-600 cursor-pointer">
          <MapPin className="w-4 h-4" />
          <span>Use my Current Location</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="district"
            value={formData.address.district}
            onChange={handleChange}
            placeholder="District"
          />
          <Input
            name="state"
            value={formData.address.state}
            onChange={handleChange}
            placeholder="State"
          />
          <Input
            name="country"
            value={formData.address.country}
            onChange={handleChange}
            placeholder="Country"
          />
        </div>

        <div>
          <Input
            name="line1"
            value={formData.address.line1}
            onChange={handleChange}
            placeholder="Address Line No. 1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="landmark"
            value={formData.address.landmark}
            onChange={handleChange}
            placeholder="Landmark / Area / Road Name"
          />
          <Input
            name="pincode"
            value={formData.address.pincode}
            onChange={handleChange}
            placeholder="Pincode"
          />
        </div>
      </div>

      {/* Company Description */}
      <div className="mt-6">
        <Label>Company Description</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter a short company description"
          maxLength={200}
          className="resize-none mt-1"
        />
        <div className="text-right text-sm text-gray-400">max 200 chars</div>
      </div>

      {/* Submit */}
      <div className="mt-6 text-right">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

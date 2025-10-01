"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@components/ui/switch";
import { Card, CardContent } from "@components/ui/card";
import { get, patch } from "@api/index";

export default function PrivacyVisibilityToggle() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVisibility = async () => {
      const employerId = localStorage.getItem("userId");
      const response: any = await get(`/employer/${employerId}`);
      const prefs = response.data[0].recruiterVisibility;
      setIsVisible(prefs);
    };

    fetchVisibility();
  }, []);

  const updateVisibility = async (value: boolean) => {
    setIsVisible(value);
    setIsLoading(true);

    try {
      const employerId = localStorage.getItem("userId");
      const response: any = await patch(`/employer/${employerId}`, {
        recruiterVisibility: value,
      });

      if (!response) {
        console.error("Failed to update visibility", response?.message);
      }
    } catch (error) {
      console.error("Failed to update visibility", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Privacy & Visibility</h2>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="text-lg font-semibold">
            Recruiter Visibility to Job Seekers
          </div>
          <hr />
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Anonymous Posting / Visible Recruiter Details
            </p>
            <Switch
              checked={isVisible}
              onCheckedChange={updateVisibility}
              className="data-[state=checked]:bg-blue-600"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

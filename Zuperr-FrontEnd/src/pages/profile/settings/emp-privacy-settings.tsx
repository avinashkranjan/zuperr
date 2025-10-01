"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Card, CardContent } from "@components/ui/card";

export default function EmpPrivacyVisibilityToggle() {
  const [visibility, setVisibility] = React.useState<string>("");

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold">Privacy & Visibility Settings</h2>

      <Card className="rounded-2xl shadow-sm border border-muted">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Profile Visibility
            </Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="w-full max-w-md h-12 text-muted-foreground">
                <SelectValue placeholder="Profile Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground max-w-3xl">
            Profile visibility controls who can view your information online. It
            enhances privacy by letting users choose between public, private, or
            customized settings to manage exposure on social or professional
            platforms.
          </p>

          <div className="flex justify-end pt-4">
            <Button className="bg-blue-600 text-white rounded-xl px-8 text-base">
              save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Card, CardContent } from "@components/ui/card";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative max-w-xl mb-5">
      <Label className="font-semibold">{label}</Label>
      <Input
        className="pr-10"
        placeholder={placeholder}
        type={visible ? "text" : "password"}
      />
      <div
        className="absolute right-3 top-7 cursor-pointer text-gray-500"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </div>
    </div>
  );
};

export default function EmpLoginSecurityPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  return (
    <div className="mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-semibold">Login & Security</h2>

      <Card>
        <CardContent className="p-6">
          <Accordion
            type="multiple"
            className="space-y-6"
            defaultValue={["email"]}
          >
            {/* Change Email */}
            <AccordionItem value="email">
              <AccordionTrigger className="text-lg font-bold">
                Change Email
              </AccordionTrigger>
              <AccordionContent className="pl-4 space-y-4 pt-4">
                <Label className="font-semibold">Email Address</Label>
                <Input
                  disabled
                  defaultValue="zupperr@gmail.com"
                  className="max-w-xl mb-5"
                />

                <Label className="font-semibold mt-5">New Email</Label>
                <Input className="max-w-xl mb-5" placeholder="New Email" />

                <PasswordInput label="Password" placeholder="Password" />

                <Button className="text-white">Send OTP</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Change Password */}
            <AccordionItem value="password">
              <AccordionTrigger className="text-lg font-bold">
                Change Password
              </AccordionTrigger>
              <AccordionContent className="pl-4 space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Your password must be at least 6 characters and should include
                  a combination of number, letter and special characters (! $ @
                  %)
                </p>
                <PasswordInput
                  label="Old Password"
                  placeholder="Old Password"
                />
                <PasswordInput
                  label="New Password"
                  placeholder="New Password"
                />
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm Password"
                />
                <Button className="text-white">Save</Button>
              </AccordionContent>
            </AccordionItem>

            {/* Two Factor */}
            <AccordionItem value="2fa">
              <AccordionTrigger className="text-lg font-bold">
                Two-Factor Authentication
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-4">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">
                    Two-Factor Authentication
                  </Label>
                  <Switch
                    checked={twoFAEnabled}
                    onCheckedChange={setTwoFAEnabled}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Deactivate Account */}
            <AccordionItem value="deactivate">
              <AccordionTrigger className="text-lg font-bold">
                Deactivate Account
              </AccordionTrigger>
              <AccordionContent className="pl-4 space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Deactivating your account is a temporary action. Your profile
                  will be disabled, and your name and details will no longer
                  appear on most of the content you’ve shared. However, you can
                  still use Messenger.
                </p>
                <div className="space-y-2">
                  <Label className="font-semibold">Confirm with reason</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Confirm with reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privacy">Privacy concerns</SelectItem>
                      <SelectItem value="break">Taking a break</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="destructive">Deactivate & Logout</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Delete Account */}
            <AccordionItem value="delete">
              <AccordionTrigger className="text-lg font-bold">
                Delete Account Permanently
              </AccordionTrigger>
              <AccordionContent className="pl-4 space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Permanently remove your account from zuperr. Once deleted, it
                  cannot be restored.
                </p>
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️ Delete Account
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import React, { useEffect, useState } from "react";
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
import { get, patch, remove } from "@api/index";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

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

export default function LoginSecurityPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [employer, setEmployer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisibility = async () => {
      const employerId = localStorage.getItem("userId");
      const response: any = await get(`/employer/${employerId}`);
      const prefs = response.data[0];
      setEmployer(prefs);
      setTwoFAEnabled(prefs.twoFactorEnabled || false);
    };

    fetchVisibility();
  }, []);

  const updateTwoFA = async (value: boolean) => {
    setTwoFAEnabled(value);

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
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const employerId = localStorage.getItem("userId");
      const response: any = await remove(`/employer/${employerId}`);

      if (!response) {
        console.error("Failed to update visibility", response?.message);
      }
    } catch (error) {
      console.error("Failed to update visibility", error);
    } finally {
      setIsLoading(false);
      localStorage.clear();
      await navigate("/");
      window.location.reload();
    }
  };

  const handleDeactivate = async () => {
    setIsLoading(true);

    try {
      const employerId = localStorage.getItem("userId");
      const response: any = await patch(`/employer/${employerId}`, {
        isDeactivated: true,
        isDeactivatedReason: deactivateReason,
      });

      if (!response) {
        console.error("Failed to update visibility", response?.message);
      }
    } catch (error) {
      console.error("Failed to update visibility", error);
    } finally {
      setIsLoading(false);
      localStorage.clear();
      await navigate("/");
      window.location.reload();
    }
  };

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
                  defaultValue={employer?.email || ""}
                  className="max-w-xl mb-5"
                />
                <div className="h-2"></div>
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
                    onCheckedChange={updateTwoFA}
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
                  <Select
                    value={deactivateReason}
                    onValueChange={setDeactivateReason}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Confirm with reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privacy">Privacy concerns</SelectItem>
                      <SelectItem value="break">Taking a break</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Deactivate & Logout</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will deactivate your account and log you
                          out. You can reactivate your account at any time by
                          logging back in.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeactivate}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                        >
                          {isLoading ? "Deactivating..." : "Deactivate Account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                      >
                        {isLoading ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

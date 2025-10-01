import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { Card } from "./ui/card";
import {
  BookCopyIcon,
  CalendarClockIcon,
  IndianRupee,
  Mail,
  MapPin,
  PersonStandingIcon,
  Phone,
  Plus,
  Edit2,
  Pencil,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { post } from "@api/index";

const ProfileHeader = ({
  profileCompletion,
  candidateData,
  onUpdateProfile,
}: {
  profileCompletion: number;
  candidateData: any;
  onUpdateProfile: () => void;
}) => {
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    noticePeriod: "",
    experience: "",
    ctc: "",
    preferredLocation: "",
    email: "",
    mobilenumber: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenDialog = (dialogType: string, currentValue?: string) => {
    setActiveDialog(dialogType);
    // Pre-populate form data with current values for editing
    if (dialogType === "addLocation" || dialogType === "editLocation") {
      setFormData((prev) => ({
        ...prev,
        preferredLocation:
          candidateData?.careerPreference?.preferredLocation || "",
      }));
    } else if (dialogType === "addEmail" || dialogType === "editEmail") {
      setFormData((prev) => ({
        ...prev,
        email: candidateData?.email || "",
      }));
    } else if (dialogType === "addPhone" || dialogType === "editPhone") {
      setFormData((prev) => ({
        ...prev,
        mobilenumber: candidateData?.mobilenumber || "",
      }));
    } else if (
      dialogType === "addNoticePeriod" ||
      dialogType === "editNoticePeriod"
    ) {
      setFormData((prev) => ({
        ...prev,
        noticePeriod: candidateData?.noticePeriod?.toString() || "",
      }));
    } else if (dialogType === "addCTC" || dialogType === "editCTC") {
      setFormData((prev) => ({
        ...prev,
        ctc: candidateData?.employmentHistory?.[0]?.annualSalary || "",
      }));
    }
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Information Updated",
      description: `Your ${activeDialog
        ?.replace("add", "")
        .replace("edit", "")
        .trim()
        .toLowerCase()} has been updated.`,
    });
    handleCloseDialog();
  };

  async function updateUserInfo(fieldName: any, fieldValue: any) {
    await post("/employee/updatecandidatedata", {
      updatedFields: {
        [fieldName]: fieldValue.toString(),
      },
    });
    onUpdateProfile();
    handleSave();
  }

  const fieldRequirements = [
    {
      key: "education",
      label: "Education",
      icon: <BookCopyIcon className="w-4 h-4 text-gray-500" />,
      weightage: 20,
      isMissing: !candidateData?.educationHistory?.length,
    },
    {
      key: "phone",
      label: "Phone No.",
      icon: <Phone className="w-4 h-4 text-gray-500" />,
      weightage: 10,
      isMissing: !candidateData?.mobilenumber,
    },
    {
      key: "email",
      label: "Email",
      icon: <Mail className="w-4 h-4 text-gray-500" />,
      weightage: 10,
      isMissing: !candidateData?.email,
    },
    {
      key: "location",
      label: "Preferred Location",
      icon: <MapPin className="w-4 h-4 text-gray-500" />,
      weightage: 10,
      isMissing: !candidateData?.careerPreference?.preferredLocation,
    },
    {
      key: "noticePeriod",
      label: "Notice Period",
      icon: <CalendarClockIcon className="w-4 h-4 text-gray-500" />,
      weightage: 10,
      isMissing: !candidateData?.noticePeriod,
    },
    {
      key: "experience",
      label: "Work Experience",
      icon: <PersonStandingIcon className="w-4 h-4 text-gray-500" />,
      weightage: 20,
      isMissing: !candidateData?.employmentHistory?.length,
    },
    {
      key: "ctc",
      label: "Current CTC",
      icon: <IndianRupee className="w-4 h-4 text-gray-500" />,
      weightage: 20,
      isMissing:
        !candidateData?.employmentHistory?.[0]?.annualSalary ||
        candidateData?.employmentHistory?.[0]?.annualSalary === "",
    },
  ];

  function getDynamicGradient(percent: number) {
    if (percent <= 19) {
      return "#ED2713"; // red
    } else if (percent <= 49) {
      return `linear-gradient(to right, #ED2713 0%, #E06214 ${percent}%)`; // red to orange
    } else if (percent <= 74) {
      return `linear-gradient(to right, #ED2713 0%, #E06214 20%, #FCF803 ${percent}%)`; // red, orange, yellow
    } else if (percent <= 99) {
      return `linear-gradient(to right, #ED2713 0%, #E06214 20%, #FCF803 50%, #50FC00 ${percent}%)`; // to green
    } else {
      return `linear-gradient(to right, #ED2713 0%, #E06214 20%, #FCF803 50%, #50FC00 75%, #1E9600 ${percent}%)`; // full
    }
  }

  // Filter only missing fields
  const missingFields = fieldRequirements.filter((field) => field.isMissing);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    try {
      setIsUploading(true);
      const userId = localStorage.getItem("userId");
      const res: any = await post(
        `/employee/upload-profile/${userId}`,
        formData
      );
      console.log("Upload response:", res);

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });
      onUpdateProfile();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <MapPin className="w-5 h-5 text-gray-500" />
                {candidateData?.careerPreference?.preferredLocation ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="flex-1">
                      {candidateData.careerPreference.preferredLocation}
                    </span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleOpenDialog("editLocation")}
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                    onClick={() => handleOpenDialog("addLocation")}
                  >
                    <Plus className="w-4 h-4" />
                    Add Preferred Location
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-gray-500" />
                {candidateData?.email ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="flex-1">{candidateData.email}</span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleOpenDialog("editEmail")}
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                    onClick={() => handleOpenDialog("addEmail")}
                  >
                    <Plus className="w-4 h-4" />
                    Add Email
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-gray-500" />
                {candidateData?.mobilenumber ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="flex-1">{candidateData.mobilenumber}</span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleOpenDialog("editPhone")}
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                    onClick={() => handleOpenDialog("addPhone")}
                  >
                    <Plus className="w-4 h-4" />
                    Add Phone Number
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-3 mt-3">
              {/* Notice Period */}
              {candidateData?.noticePeriod > 0 ? (
                <div className="flex items-center gap-3 group">
                  <CalendarClockIcon className="w-5 h-5 text-gray-500" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="flex-1">
                      {candidateData.noticePeriod} days
                    </span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleOpenDialog("editNoticePeriod")}
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  onClick={() => handleOpenDialog("addNoticePeriod")}
                >
                  <Plus className="w-4 h-4" />
                  Add Notice Period
                </button>
              )}

              {/* Experience */}
              {candidateData?.employmentHistory?.length > 0 ? (
                (() => {
                  const total = candidateData.employmentHistory.reduce(
                    (acc: { years: number; months: number }, job: any) => {
                      const { years = 0, months = 0 } =
                        job.workExperience || {};
                      return {
                        years: acc.years + years,
                        months: acc.months + months,
                      };
                    },
                    { years: 0, months: 0 }
                  );

                  // Normalize months to years
                  total.years += Math.floor(total.months / 12);
                  total.months = total.months % 12;

                  return (
                    <div className="flex items-center gap-3 group">
                      <PersonStandingIcon className="w-5 h-5 text-gray-500" />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="flex-1">
                          {total.years}y
                          {total.months > 0 ? ` ${total.months}m` : ""}
                        </span>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleOpenDialog("editExperience")}
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <button
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  onClick={() => handleOpenDialog("addExperience")}
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              )}

              {/* Current CTC */}
              {candidateData?.employmentHistory?.length > 0 &&
              candidateData.employmentHistory[0].annualSalary !== null ? (
                <div className="flex items-center gap-3 group">
                  <IndianRupee className="w-5 h-5 text-gray-500" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="flex flex-1">
                      {candidateData.employmentHistory[0].annualSalary}{" "}
                      <p className="pl-2 mt-1 text-xs">(Annual CTC)</p>
                    </span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleOpenDialog("editCTC")}
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  onClick={() => handleOpenDialog("addCTC")}
                >
                  <Plus className="w-4 h-4" />
                  Add Current CTC
                </button>
              )}
            </div>
          </div>

          {/* Location Dialog */}
          <Dialog
            open={
              activeDialog === "addLocation" || activeDialog === "editLocation"
            }
            onOpenChange={handleCloseDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {activeDialog === "editLocation" ? "Edit" : "Add"} Preferred
                  Location
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Label htmlFor="preferredLocation">Location</Label>
                <Input
                  id="preferredLocation"
                  name="preferredLocation"
                  placeholder="e.g., Bangalore, Mumbai"
                  value={formData.preferredLocation || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      preferredLocation: e.target.value,
                    }))
                  }
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    updateUserInfo(
                      "careerPreference.preferredLocation",
                      formData.preferredLocation
                    )
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Email Dialog */}
          <Dialog
            open={activeDialog === "addEmail" || activeDialog === "editEmail"}
            onOpenChange={handleCloseDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {activeDialog === "editEmail" ? "Edit" : "Add"} Email
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="e.g., you@example.com"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={() => updateUserInfo("email", formData.email)}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Phone Dialog */}
          <Dialog
            open={activeDialog === "addPhone" || activeDialog === "editPhone"}
            onOpenChange={handleCloseDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {activeDialog === "editPhone" ? "Edit" : "Add"} Phone Number
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Label htmlFor="mobilenumber">Phone Number</Label>
                <Input
                  id="mobilenumber"
                  name="mobilenumber"
                  placeholder="e.g., 9876543210"
                  value={formData.mobilenumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mobilenumber: e.target.value,
                    }))
                  }
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    updateUserInfo("mobilenumber", formData.mobilenumber)
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Notice Period Dialog */}
          <Dialog
            open={
              activeDialog === "addNoticePeriod" ||
              activeDialog === "editNoticePeriod"
            }
            onOpenChange={handleCloseDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {activeDialog === "editNoticePeriod" ? "Edit" : "Add"} Notice
                  Period
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period (in days)</Label>
                  <Input
                    id="noticePeriod"
                    name="noticePeriod"
                    placeholder="e.g., 30, 60, 90"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    updateUserInfo("noticePeriod", formData.noticePeriod);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Experience Dialog */}
          <Dialog
            open={
              activeDialog === "addExperience" ||
              activeDialog === "editExperience"
            }
            onOpenChange={handleCloseDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {activeDialog === "editExperience" ? "Edit" : "Add"}{" "}
                  Experience
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (in years)</Label>
                  <Input
                    id="experience"
                    name="experience"
                    placeholder="e.g., 2.5, 3, 5+"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    updateUserInfo("experience", formData.experience)
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* CTC Dialog */}
          <Dialog
            open={activeDialog === "addCTC" || activeDialog === "editCTC"}
            onOpenChange={handleCloseDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {activeDialog === "editCTC" ? "Edit" : "Add"} Current CTC
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ctc">Current CTC (per annum)</Label>
                  <Input
                    id="ctc"
                    name="ctc"
                    placeholder="e.g., ₹500,000, ₹10,00,000"
                    value={formData.ctc}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    updateUserInfo(
                      "employmentHistory.0.annualSalary",
                      formData.ctc
                    )
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="w-full lg:w-1/3 p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full relative group">
            <Avatar className="w-full h-full">
              {candidateData?.profilePicture ? (
                <AvatarImage
                  src={`https://zuperrr-bucket.blr1.cdn.digitaloceanspaces.com/${candidateData.profilePicture}`}
                  alt="Profile"
                  className="object-cover rounded-full"
                />
              ) : (
                <AvatarFallback className="text-lg font-medium bg-gray-200 text-gray-600">
                  {(candidateData?.firstname?.[0]?.toUpperCase() || "") +
                    (candidateData?.lastname?.[0]?.toUpperCase() || "")}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Edit Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-100 transition-all"
              disabled={isUploading}
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mx-auto text-center mt-2">
            <h2 className="text-xl font-bold mb-1">
              {candidateData?.firstname} {candidateData?.lastname}
            </h2>
            <p className="text-base text-gray-600 line-clamp-5">
              Software Developer II
            </p>
            <p className="text-sm text-gray-600">
              {
                candidateData?.employmentHistory?.[
                  candidateData?.employmentHistory.length - 1
                ]?.companyName
              }
            </p>
          </div>
        </Card>

        <Card className="w-full lg:w-1/3 p-6">
          <div className="mb-2 flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="absolute left-0 top-0 h-full transition-all duration-700 ease-in-out rounded-full"
              style={{
                width: `${profileCompletion}%`,
                background: getDynamicGradient(profileCompletion),
              }}
            ></div>

            {/* Percentage Bubble */}
            <div
              className="absolute -top-6 transform -translate-x-1/2 text-xs text-white bg-blue-700 px-2 py-0.5 rounded shadow"
              style={{ left: `${profileCompletion}%` }}
            >
              {profileCompletion}%
            </div>

            {/* Thumb */}
            <div
              className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-700 border-2 border-white"
              style={{ left: `${profileCompletion}%` }}
            ></div>
          </div>

          {missingFields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between mb-3 text-sm"
            >
              <div className="flex items-center text-gray-700">
                {field.icon}
                <span className="ml-2">{field.label}</span>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                +{field.weightage}%
              </span>
            </div>
          ))}

          {missingFields.length > 0 && (
            <Button
              className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                const element = document.getElementById("profile-data");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Complete Missing Details
            </Button>
          )}
        </Card>
      </div>
    </>
  );
};

export default ProfileHeader;

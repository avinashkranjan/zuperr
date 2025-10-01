"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Checkbox } from "@components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@components/ui/select";
import { EditDialogProps } from "../edit-dialog";
import { post } from "@api/index";

interface Accomplishment {
  _id?: string;
  certificationName: string;
  certificationID: string;
  certificationURL: string;
  certificationValidity?: { month: string; year: string };
  noExpiry: boolean;
  awards: string;
  clubs: string;
  positionHeld: string;
  educationalReference?: string;
  isCurrent: boolean;
  duration: { from: string; to?: string };
  responsibilities: string;
  mediaUpload?: string;
}

const initialForm: Accomplishment = {
  certificationName: "",
  certificationID: "",
  certificationURL: "",
  certificationValidity: { month: "", year: "" },
  noExpiry: false,
  awards: "",
  clubs: "",
  positionHeld: "",
  educationalReference: "",
  isCurrent: false,
  duration: { from: "", to: "" },
  responsibilities: "",
  mediaUpload: "",
};

export default function AccomplishmentsDialog({
  open,
  onOpenChange,
  sectionData,
  onSubmit,
}: EditDialogProps) {
  const [accomplishments, setAccomplishments] = React.useState<
    Accomplishment[]
  >([]);
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<Accomplishment>(initialForm);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [mediaFile, setMediaFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [mediaPreviewUrl, setMediaPreviewUrl] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (Array.isArray(sectionData)) {
      setAccomplishments(sectionData);
    }
  }, [sectionData]);

  const handleInput = (key: keyof Accomplishment, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userId = localStorage.getItem("userId");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("certificate", file);

      const res: any = await post(
        `/employee/upload-certification/${userId}`,
        formData
      );
      const fileUrl = res?.fileKey;

      setForm((prev) => ({ ...prev, mediaUpload: fileUrl }));
      setMediaFile(file);
      setMediaPreviewUrl(fileUrl);
    } catch (err) {
      console.error("Certificate upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadCertificateMedia = async (
    file: File,
    userId: string
  ): Promise<string | null> => {
    if (!file || !userId) return null;

    const formData = new FormData();
    formData.append("certificate", file);

    try {
      const res: any = await post(
        `/employee/upload-certification/${userId}`,
        formData
      );
      const fileUrl = res?.fileKey;

      return fileUrl;
    } catch (err) {
      console.error("Certificate upload failed:", err);

      return null;
    }
  };

  const handleSaveForm = async () => {
    const userId = localStorage.getItem("userId");

    let mediaURL = form.mediaUpload ?? "";
    if (mediaFile && userId) {
      const uploadedUrl = await uploadCertificateMedia(mediaFile, userId);
      if (uploadedUrl) mediaURL = uploadedUrl;
    }

    const updatedForm = { ...form, mediaUpload: mediaURL };

    const updated = [...accomplishments];
    if (editingIndex != null) {
      updated[editingIndex] = updatedForm;
    } else {
      updated.push(updatedForm);
    }

    setAccomplishments(updated);
    setForm(initialForm);
    setStep(1);
    setEditingIndex(null);
    setMediaFile(null);
    setMediaPreviewUrl(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setMediaPreviewUrl(accomplishments[index].mediaUpload || null);
    setForm(accomplishments[index]);
    setStep(1);
  };

  const handleDelete = (index: number) => {
    const updated = [...accomplishments];
    updated.splice(index, 1);
    setAccomplishments(updated);
  };

  const handleFinalSubmit = () => {
    console.log("Final Accomplishments Data:", accomplishments);
    onSubmit({
      accomplishments: accomplishments,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Accomplishments</DialogTitle>
          <DialogDescription>
            Add certifications, awards, and other achievements.
          </DialogDescription>
        </DialogHeader>

        {/* Existing Cards */}
        <div className="space-y-2 mb-4">
          {accomplishments.map((item, index) => (
            <div
              key={index}
              className="border p-3 rounded-md shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{item.certificationName}</p>
                <p className="text-sm text-muted-foreground">
                  {item.certificationID} · {item.positionHeld}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 py-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-10 rounded-full ${
                step === s ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <Label>Certification Name*</Label>
            <Input
              value={form.certificationName}
              onChange={(e) => handleInput("certificationName", e.target.value)}
            />

            <Label>Certification ID*</Label>
            <Input
              value={form.certificationID}
              onChange={(e) => handleInput("certificationID", e.target.value)}
            />

            <Label>Certification URL*</Label>
            <Input
              value={form.certificationURL}
              onChange={(e) => handleInput("certificationURL", e.target.value)}
            />

            <Label>Certification Validity*</Label>
            <Input
              value={form.certificationValidity?.month || ""}
              onChange={(e) =>
                handleInput("certificationValidity", {
                  ...form.certificationValidity,
                  month: e.target.value,
                })
              }
              placeholder="Month"
              disabled={form.noExpiry}
            />
            <Input
              value={form.certificationValidity?.year || ""}
              onChange={(e) =>
                handleInput("certificationValidity", {
                  ...form.certificationValidity,
                  year: e.target.value,
                })
              }
              placeholder="Year"
              disabled={form.noExpiry}
            />

            <Checkbox
              checked={form.noExpiry}
              onCheckedChange={(val) => handleInput("noExpiry", !!val)}
            />
            <Label>This certification does not expire</Label>

            <Button className="w-full" onClick={() => setStep(2)}>
              Next
            </Button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <Label>Awards*</Label>
            <Input
              value={form.awards}
              onChange={(e) => handleInput("awards", e.target.value)}
            />

            <Label>Description*</Label>
            <Textarea
              value={form.responsibilities}
              onChange={(e) => handleInput("responsibilities", e.target.value)}
            />

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <Label>Club/Committee/Activity Name*</Label>
            <Input
              value={form.clubs}
              onChange={(e) => handleInput("clubs", e.target.value)}
            />

            <Label>Position Held*</Label>
            <Select
              value={form.positionHeld}
              onValueChange={(val) => handleInput("positionHeld", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="President">President</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>

            <Label>Education Reference</Label>
            <Input
              value={form.educationalReference}
              onChange={(e) =>
                handleInput("educationalReference", e.target.value)
              }
            />

            <Label>Duration*</Label>
            <div className="flex gap-2">
              <Input
                value={form.duration.from}
                onChange={(e) =>
                  handleInput("duration", {
                    ...form.duration,
                    from: e.target.value,
                  })
                }
                placeholder="MM/YYYY"
              />
              <span className="text-sm pt-2">to</span>
              <Input
                value={form.duration.to}
                onChange={(e) =>
                  handleInput("duration", {
                    ...form.duration,
                    to: e.target.value,
                  })
                }
                placeholder="MM/YYYY"
                disabled={form.isCurrent}
              />
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                checked={form.isCurrent}
                onCheckedChange={(val) => handleInput("isCurrent", !!val)}
              />
              <Label>I currently hold this position</Label>
            </div>

            <Label className="mt-4">Media Upload (Optional)</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.rtf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />

            {/* Uploading Indicator */}
            {isUploading && (
              <p className="text-sm text-blue-600 mt-2">Uploading file...</p>
            )}

            {/* Preview after upload */}
            {mediaPreviewUrl && (
              <div className="mt-2 border p-2 rounded-md bg-gray-50">
                {/\.(png|jpe?g)$/i.test(mediaPreviewUrl) ? (
                  <img
                    src={`https://zuperrr-bucket.blr1.cdn.digitaloceanspaces.com/${mediaPreviewUrl}`}
                    alt="Uploaded Media"
                    className="max-h-48 object-contain rounded"
                  />
                ) : (
                  <a
                    href={`https://zuperrr-bucket.blr1.cdn.digitaloceanspaces.com/${mediaPreviewUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline"
                  >
                    View Uploaded File
                  </a>
                )}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                ← Back
              </Button>
              <Button onClick={handleSaveForm}>
                {editingIndex != null ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        )}

        {/* Final Save */}
        <DialogFooter className="mt-6">
          <Button className="w-full" onClick={handleFinalSubmit}>
            Save All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

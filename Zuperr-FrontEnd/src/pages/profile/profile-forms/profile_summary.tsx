import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { EditDialogProps } from "../edit-dialog";

export default function ProfileSummaryDialog({
  open,
  onOpenChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sectionConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  control,
  onSubmit,
  sectionData,
}: EditDialogProps) {
  const [summary, setSummary] = useState(sectionData?.profileSummary);

  const characterLimit = 1000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">Add Profile Summary</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profile Summary</DialogTitle>
          <DialogDescription>
            Your profile summary should highlight key points from your career
            and education, your professional interests, and the kind of career
            you’re looking for. Write at least 50 characters (max. 1000
            characters).
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <Label>
              Profile Summary<sup className="text-red-500">*</sup>
            </Label>
            <Textarea
              placeholder="Profile Summary"
              value={summary}
              onChange={(e) =>
                setSummary(e.target.value.slice(0, characterLimit))
              }
              className="resize-none"
              rows={6}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Up to {summary.length}/{characterLimit} characters only
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            className="w-full"
            disabled={summary.length < 50}
            onClick={() => {
              onOpenChange(false);
              onSubmit({
                profileSummary: summary,
              });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

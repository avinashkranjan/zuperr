import React from "react";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

interface JobAnalyticsModalProps {
  employer?: any;
  open: boolean;
  onClose: () => void;
  job: any;
  onViewDetails: () => void;
}

const JobAnalyticsModal: React.FC<JobAnalyticsModalProps> = ({
  employer,
  open,
  onClose,
  job,
  onViewDetails,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-lg px-6 pt-6 pb-4 p-10 rounded-2xl">
      <div className="border border-blue-200 rounded-xl p-5 relative">
        {/* Top right date */}
        <span className="absolute right-5 top-4 text-xs text-gray-500">
          {job?.createdAt
            ? `${Math.round(
                (Date.now() - new Date(job.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )} Days Ago`
            : "—"}
        </span>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">Analytics</h2>

        {/* Job Title & Logo */}
        <div className="flex items-center gap-3 mb-5">
          <div>
            <Avatar className="w-16 h-16 rounded-md">
              <AvatarImage
                src={undefined}
                alt={`${employer?.firstname}'s logo`}
              />
              <AvatarFallback className="text-lg rounded-lg font-medium bg-blue-200 text-blue-600">
                {(employer?.firstname?.[0].toUpperCase() || "") +
                  (employer?.lastname?.[0].toUpperCase() || "")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="font-medium text-sm">{job?.title}</h3>
            <p className="text-xs text-gray-500">
              {employer?.firstname} {employer?.lastname}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-start gap-8 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1">Views</span>
            <div className="bg-gray-100 rounded-md px-4 py-1 text-sm font-medium">
              {job?.jobViewsCount}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1">Applicants</span>
            <div className="bg-gray-100 rounded-md px-4 py-1 text-sm font-medium">
              {job?.applicants.length}
            </div>
          </div>
        </div>

        {/* View Detail Button */}
        <div className="flex justify-end">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md px-5 py-2"
            onClick={onViewDetails}
          >
            View Detail Analytics
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default JobAnalyticsModal;

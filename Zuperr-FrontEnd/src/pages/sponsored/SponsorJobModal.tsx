/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// SponsorJobModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter, // Import DialogFooter for buttons at the bottom
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { MapPin, Loader2 } from "lucide-react"; // Import Loader2 for loading indicator
import { patch } from "@api/index";
import { useToast } from "@src/hooks/use-toast";

interface SponsorJobModalProps {
  employer: any;
  jobs: any[];
  onClose: () => void;
  onSponsor: (jobIds: string[]) => void; // Modified to accept an array of job IDs
}

const SponsorJobModal: React.FC<SponsorJobModalProps> = ({
  employer,
  jobs,
  onClose,
  onSponsor,
}) => {
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [isSponsoring, setIsSponsoring] = useState(false); // State for loading indicator
  const { toast } = useToast();

  const handleSelectJob = (jobId: string) => {
    setSelectedJobIds((prevSelectedIds) =>
      prevSelectedIds.includes(jobId)
        ? prevSelectedIds.filter((id) => id !== jobId)
        : [...prevSelectedIds, jobId]
    );
  };

  const handleSponsorAllSelected = async () => {
    if (selectedJobIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one job to sponsor.",
      });

      return;
    }

    setIsSponsoring(true);
    try {
      const sponsorshipPromises = selectedJobIds.map((jobId) =>
        patch(`/employer/patch-jobs/${jobId}`, { isSponsored: true })
      );

      await Promise.all(sponsorshipPromises);
      onSponsor(selectedJobIds); // Pass all sponsored job IDs back

      toast({
        title: "Success",
        description: "Selected jobs sponsored successfully!",
      });
      onClose(); // Close the modal after successful sponsorship
    } catch (error) {
      console.error("Error sponsoring jobs:", error);

      toast({
        title: "Error",
        description: "Failed to sponsor jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSponsoring(false);
    }
  };

  const selectedJobs = jobs.filter((job) => selectedJobIds.includes(job._id));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[72rem] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Jobs - Sponsor a Job Post</DialogTitle>
        </DialogHeader>

        {/* Job Selection Section */}
        <div className="space-y-4 mt-4">
          <h3 className="text-md font-semibold">Select Jobs to Sponsor:</h3>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs available to sponsor.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className={`p-4 border rounded-lg flex justify-between items-center cursor-pointer transition-all duration-200
                ${
                  selectedJobIds.includes(job._id)
                    ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleSelectJob(job._id)}
              >
                <div>
                  <div className="flex flex-col items-start shrink-0">
                    <div className="flex flex-row">
                      <div>
                        <Avatar className="w-16 h-16 rounded-md">
                          <AvatarImage
                            src={undefined}
                            alt={`${employer?.firstname}'s logo`}
                          />
                          <AvatarFallback className="text-lg rounded-lg font-medium bg-blue-200 text-blue-600">
                            {(employer?.firstname?.[0]?.toUpperCase() || "") +
                              (employer?.lastname?.[0]?.toUpperCase() || "")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <h2 className="text-lg font-semibold text-left ml-2 pt-1.5">
                        {job?.title}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      {" "}
                      {employer?.firstname} {employer?.lastname}
                    </p>
                  </div>
                  <div className="text-sm flex items-center mt-2">
                    <MapPin className="w-3 h-3 mr-1 text-black" />
                    <span className="text-black">
                      Location: {job?.location}
                    </span>
                  </div>
                  <p className="text-sm text-black font-semibold">
                    Experience: {job?.experienceLevel}
                  </p>

                  <div className="flex gap-2 my-2">
                    {job.skills.slice(0, 3).map((skill: any, i: number) => (
                      <Badge
                        key={i}
                        className="text-xs bg-gray-100 border border-gray-300 text-gray-600"
                      >
                        {skill.Name}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge className="text-xs bg-gray-100 border border-gray-300 text-gray-600">
                        +{job.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                {/* No individual sponsor button here, selection is by clicking the job card */}
              </div>
            ))
          )}
        </div>

        {/* Selected Jobs Preview Section */}
        {selectedJobIds.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-semibold mb-3">
              Selected Jobs for Sponsorship ({selectedJobIds.length}):
            </h3>
            <div className="space-y-3">
              {selectedJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
                >
                  <Avatar className="w-10 h-10 rounded-md">
                    <AvatarImage
                      src={undefined}
                      alt={`${employer?.firstname}'s logo`}
                    />
                    <AvatarFallback className="text-sm rounded-lg font-medium bg-blue-100 text-blue-500">
                      {(employer?.firstname?.[0]?.toUpperCase() || "") +
                        (employer?.lastname?.[0]?.toUpperCase() || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-gray-600">
                      {employer?.firstname} {employer?.lastname} -{" "}
                      {job.location}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from closing
                      handleSelectJob(job._id); // Deselect the job
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSponsoring}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full"
            onClick={handleSponsorAllSelected}
            disabled={selectedJobIds.length === 0 || isSponsoring}
          >
            {isSponsoring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sponsor Selected Jobs ({selectedJobIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SponsorJobModal;

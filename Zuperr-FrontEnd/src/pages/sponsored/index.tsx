/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { CirclePlus, Ellipsis, MapPin, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Input } from "../../components/ui/input";
import { get, remove } from "../../api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useToast } from "@src/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import SponsorJobModal from "./SponsorJobModal";
import JobAnalyticsModal from "../job-analytics/JobPost/JobAnalyticsModal";
import { JobDetails } from "../job-analytics/JobPost";

const SponseredJobPost: React.FC = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [employer, setEmployer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobToDelete, setJobToDelete] = useState<JobDetails | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const response: any = await get(`/employer/get-jobs/${userId}`);

        if (response) {
          const formattedJobs = response.map((job: JobDetails) => ({
            ...job,
            location: job.location || "N/A",
            salaryRange: job.salaryRange || "Not Disclosed",
          }));

          console.log("Fetched Jobs:", formattedJobs);
          setJobs(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    if (employer == null) {
      getEmployer();
    }

    fetchJobs();
  }, [showSponsorModal]);

  async function getEmployer() {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response: any = await get(`/employer/${userId}`);
      setEmployer(response.data[0]);
    } catch (error) {
      console.error("Error fetching employer data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Job Update and Delete
  const handleJobUpdateAndDelete = async (type: string, jobID: string) => {
    if (type === "update") {
      const jobToEdit = jobs.find((job) => job._id === jobID);
      if (jobToEdit) {
        setSelectedJob(jobToEdit);
        setShowSponsorModal(true); // <-- OPEN the modal for update
      }
      return;
    }

    if (type === "delete") {
      try {
        setLoading(true);
        await remove(`/employer/delete-jobs/${jobID}`);

        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobID));

        toast({
          title: "Success",
          description: "Job post deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({
          title: "Error",
          description: `Failed to delete job: ${error}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const navigate = useNavigate();

  function formatSalary(
    amount: string | number,
    currency: string = "INR"
  ): string {
    const numericAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^\d.]/g, ""))
        : amount;

    if (isNaN(numericAmount)) return "Invalid Amount";

    if (currency === "INR") {
      if (numericAmount >= 1_00_00_000) {
        return `${(numericAmount / 1_00_00_000).toFixed(2)} CPA`;
      } else if (numericAmount >= 1_00_000) {
        return `${(numericAmount / 1_00_000).toFixed(0)} LPA`;
      } else if (numericAmount >= 1_000) {
        return `${(numericAmount / 1_000).toFixed(0)} TPA`;
      } else {
        return `${numericAmount}`;
      }
    } else if (currency === "USD") {
      if (numericAmount >= 1_000_000) {
        return `${(numericAmount / 1_000_000).toFixed(2)}M`;
      } else if (numericAmount >= 1_000) {
        return `${(numericAmount / 1_000).toFixed(1)}K`;
      } else {
        return `${numericAmount}`;
      }
    } else {
      return `${numericAmount}`; // fallback for unknown currencies
    }
  }

  const filteredJobs = jobs
    .filter((job) => job.isSponsored)
    .filter((job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <div className="py-4 px-8 max-w-7xl">
        {/* Header and Search/Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-4 sm:mb-0">Sponsered Job Post</h1>

          {/* Search & Filter Section */}
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto relative">
            <span className="absolute left-4 top-3 sm:top-3">
              <Search className="h-4 w-4 text-gray-500" />
            </span>
            <Input
              className="w-full sm:w-[300px] rounded-full pl-10 pr-4 py-2"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Job Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Create Job Post Button */}
          <div
            className="border-2 col-span-3 border-gray-100 rounded-xl h-80 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
            onClick={() => setShowSponsorModal(true)}
          >
            <CirclePlus className="bg-[#DEE8FF] text-blue-500 rounded-full p-6 h-16 w-16" />
            <Button className="h-8 border-2 border-gray-300 text-sm rounded-full bg-white hover:bg-gray-50 max-w-md">
              Sponsored Jobs have <b>20x more reach</b> than normal Jobs do
            </Button>
          </div>

          {/* Render Job Cards */}
          {loading ? (
            <p className="text-center w-full col-span-full">Loading jobs...</p>
          ) : filteredJobs.filter((job) => job.isSponsored).length === 0 ? (
            <p className="text-center w-full col-span-full">
              No sponsored jobs found.
            </p>
          ) : (
            filteredJobs
              .filter((job) => job.isSponsored)
              .map((job) => (
                <Card
                  key={job._id}
                  className="h-full border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm"
                >
                  {/* Header Row with Date */}
                  <div className="flex justify-between py-2 px-4 mb-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger>
                        <Ellipsis className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setJobToDelete(job);
                            setOpenDeleteDialog(true);
                          }}
                          className="text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleJobUpdateAndDelete("update", job?._id)
                          }
                        >
                          Update
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {job?.createdAt && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(job?.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Company Logo and Info */}
                  <CardContent className="flex items-center px-4 pt-0 pb-2 gap-4">
                    {/* Logo and Company */}
                    <div className="flex flex-col items-start shrink-0">
                      <div className="flex flex-row">
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

                        <h2 className="text-lg font-semibold text-left ml-2 pt-3 line-clamp-2">
                          {job?.title}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-600 text-left">
                        {employer?.firstname} {employer?.lastname}
                      </p>
                    </div>

                    {/* Title, centered vertically with logo */}
                  </CardContent>

                  {/* Job Info */}
                  <div className="px-4 space-y-2 text-sm text-black font-semibold pb-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-black" />
                      <span className="text-black">
                        Location: {job?.location}
                      </span>
                    </div>
                    <p className="text-black font-semibold">
                      Experience: {job?.experienceLevel}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job?.skills?.slice(0, 3).map((skill, i) => (
                        <Badge
                          key={i}
                          className="rounded-full border border-gray-200 bg-gray-100 text-gray-600 text-xs px-2 py-1"
                        >
                          {skill.Name}
                        </Badge>
                      ))}
                      {job?.skills?.length > 3 && (
                        <Badge className="rounded-full border border-gray-200 bg-gray-100 text-gray-400 text-xs px-2 py-1">
                          +{job.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Footer with CTC & Button */}
                  <CardFooter className="px-4 py-3 flex-col items-start justify-between mt-auto border-t border-gray-200">
                    <p className="text-sm">
                      Work Mode: {job?.workMode || "Work From Office"}
                    </p>
                    <div className="flex justify-between w-full">
                      <div>
                        <div className="flex flex-col">
                          <div className="font-semibold text-md">
                            {job.salaryRange.currency}{" "}
                            {formatSalary(
                              job?.salaryRange?.minimumSalary,
                              job?.salaryRange?.currency
                            )}{" "}
                            -{" "}
                            {formatSalary(
                              job?.salaryRange?.maximumSalary,
                              job?.salaryRange?.currency
                            )}
                          </div>
                          <div className="font-medium text-sm text-[#B2B2B2]">
                            CTC
                          </div>
                        </div>
                      </div>
                      <Button
                        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-700"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowAnalyticsModal(true);
                        }}
                      >
                        Analytics
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
          )}
        </div>
      </div>

      {selectedJob && (
        <JobAnalyticsModal
          employer={employer}
          open={showAnalyticsModal}
          job={selectedJob}
          onClose={() => setShowAnalyticsModal(false)}
          onViewDetails={() => {
            navigate("/job-analytics/job-details", {
              state: { job: selectedJob },
              replace: true,
            });
          }}
        />
      )}

      {showSponsorModal && (
        <SponsorJobModal
          employer={employer}
          jobs={jobs}
          onClose={() => setShowSponsorModal(false)}
          onSponsor={(jobId: string[]) => {
            toast({
              title: "Sponsored!",
              description: `Job(s) with ID(s): ${jobId.join(
                ", "
              )} have been sponsored successfully.`,
            });
            setShowSponsorModal(false);
          }}
        />
      )}

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (jobToDelete) {
                  handleJobUpdateAndDelete("delete", jobToDelete._id);
                }
                setOpenDeleteDialog(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SponseredJobPost;

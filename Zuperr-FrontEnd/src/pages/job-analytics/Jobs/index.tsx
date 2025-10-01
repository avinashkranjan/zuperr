import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { useNavigate } from "react-router-dom";
import { get } from "@api/index";
import Loader from "@base-components/Loader";
import { SortDesc } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/ui/popover";
import { Command, CommandItem, CommandGroup } from "@components/ui/command";

interface Applicant {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
}

interface Job {
  _id: string;
  title: string;
  jobCategory: string;
  jobType: string;
  workMode: string;
  salaryRange: string;
  experienceLevel: string;
  skills: string[];
  qualifications: string[];
  location: string;
  applicants: Applicant[];
  createdAt: string;
  jobStatus: string;
}

type SortOption = "title" | "applicants" | "activeDays";

function Jobs() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [sortOpen, setSortOpen] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoader(true);
        const userId = localStorage.getItem("userId");
        const response = await get<Job[]>(
          `/employer/jobs/get-jobs-with-applicants/${userId}`
        );
        setJobs(response);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoader(false);
      }
    };
    fetchJobs();
  }, []);

  const sortedJobs = useMemo(
    () =>
      [...jobs].sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        } else if (sortBy === "applicants") {
          return b.applicants.length - a.applicants.length;
        } else if (sortBy === "activeDays") {
          const daysA = a.createdAt
            ? (Date.now() - new Date(a.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
            : 0;
          const daysB = b.createdAt
            ? (Date.now() - new Date(b.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
            : 0;
          return daysB - daysA;
        }
        return 0;
      }),
    [jobs, sortBy]
  );

  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const displayedJobs = sortedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (job: Job) => {
    navigate("/job-analytics/job-details", { state: { job } });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Open":
        return "border text-gray-700";
      case "Paused":
        return "border text-gray-700 opacity-60";
      case "Closed":
        return "border text-gray-700 opacity-50";
      default:
        return "border text-gray-700";
    }
  };

  return loader ? (
    <Loader />
  ) : (
    <div className="p-6">
      <Card className="rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 text-sm">
                <SortDesc className="h-4 w-4" />
                Sort
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandGroup>
                  <CommandItem onSelect={() => setSortBy("title")}>
                    Sort by Title
                  </CommandItem>
                  <CommandItem onSelect={() => setSortBy("applicants")}>
                    Sort by Applicants
                  </CommandItem>
                  <CommandItem onSelect={() => setSortBy("activeDays")}>
                    Sort by Active Days
                  </CommandItem>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-5 bg-blue-600 text-white text-center text-md font-medium py-6 px-10">
          <div>Title</div>
          <div>Active Day</div>
          <div>Applicants</div>
          <div>Job Status</div>
          <div>Analytics</div>
        </div>

        {/* Job Rows */}
        <div className="divide-y">
          {displayedJobs.map((job) => {
            const activeDays =
              job?.createdAt == null
                ? "--"
                : Math.floor(
                    (new Date().getTime() -
                      new Date(job?.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
            return (
              <div
                key={job._id}
                className="grid grid-cols-5 items-center text-center text-md py-6 px-4 hover:bg-gray-50"
              >
                <div className="text-gray-800">{job.title}</div>
                <div className="text-gray-800 text-center">{activeDays}</div>
                <div className="text-gray-800">{job.applicants.length}</div>
                <div>
                  <span
                    className={`rounded-md px-5 py-3 text-xs text-center ${getStatusStyle(
                      job?.jobStatus || "Open"
                    )}`}
                  >
                    {job?.jobStatus || "Open"}
                  </span>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleRowClick(job)}
                    className="text-blue-600 hover:underline"
                  >
                    Click here
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 px-6 py-6 bg-white border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Preview
          </Button>
          <Button
            className="text-white"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Jobs;

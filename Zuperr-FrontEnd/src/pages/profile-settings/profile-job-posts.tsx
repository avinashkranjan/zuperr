/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from "react";
import { Ellipsis, MapPin, Search, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useToast } from "@src/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from "@components/ui/select";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { get, patch } from "@api/index";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Input } from "@components/ui/input";

export interface JobDetails {
  screeningQuestions: never[];
  salaryRange: {
    currency: string;
    minimumSalary: string | number;
    maximumSalary: string | number;
  };
  minimumExperienceInYears: number;
  maximumExperienceInYears: number;
  minimumSalaryLPA: number;
  maximumSalaryLPA: number;
  isSponsored: boolean;
  jobViewsCount: number;
  jobStatus: null;
  _id: string;
  title: string;
  experienceLevel: string;
  jobCategory: string;
  jobType: string;
  workMode: string;
  skills: Skill[];
  education: string;
  industry: string[];
  degree: string;
  fromAge: string;
  toAge: string;
  gender: string;
  jobDescription: string;
  walkIn: string;
  location: string;
  distance: number;
  previewed: boolean;
  isDeleted: boolean;
  isActive: boolean;
  createdBy: string;
  applicants: Applicant[];
  createdAt: Date;
  updatedAt: Date;
  jobExperienceLevelType: string;
  __v: number;
  salaryDisplay: string;
  aboutCompany: string; // New field for company description
  status: string; // New field for job status
  jobStatusReason: string; // New field for job status reason
}

export interface Applicant {
  id: string;
  status: string;
  _id: string;
  appliedDate: Date;
}

export interface Skill {
  _id: string;
  Name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const ProfileJobPosts: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [jobs, setJobs] = useState<JobDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [employer, setEmployer] = useState<any>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState("date-desc");
  const [deletedJobs, setDeletedJobs] = useState<JobDetails[]>([]);
  const [showDeletedJobsModal, setShowDeletedJobsModal] = useState(false);

  const navigate = useNavigate();

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
    const fetchDeletedJobs = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const response: any = await get(`/employer/get-jobs/deleted/${userId}`);
        if (response) {
          const formattedJobs = response.map((job: JobDetails) => ({
            ...job,
            location: job.location || "N/A",
            salaryRange: job.salaryRange || "Not Disclosed",
          }));
          console.log("Fetched Deleted Jobs:", formattedJobs);
          setDeletedJobs(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    getEmployer();
    fetchJobs();
    fetchDeletedJobs();
  }, [refresh]);

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

  const handleSortChange = (option: string) => {
    setSortOption(option);
    const sortedJobs = [...jobs];

    switch (option) {
      case "title-asc":
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "salary-desc":
        sortedJobs.sort(
          (a, b) =>
            parseFloat(b.salaryRange?.maximumSalary.toString()) -
            parseFloat(a.salaryRange?.maximumSalary.toString())
        );
        break;
      default:
        // date-desc
        sortedJobs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setJobs(sortedJobs);
  };

  const handleJobUpdateAndDelete = async (type: string, jobID: string) => {
    if (type === "delete") {
      try {
        setLoading(true);
        await patch(`/employer/patch-jobs/${jobID}`, {
          isDeleted: true,
        });

        // Update state to remove the deleted job
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobID));

        // Show success toast
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
        setRefresh((prev) => !prev);
      }
    }
    if (type === "restore") {
      try {
        // setLoading(true);
        await patch(`/employer/patch-jobs/${jobID}`, {
          isDeleted: false,
        });

        // Update state to remove the deleted job
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobID));

        // Show success toast
        toast({
          title: "Success",
          description: "Job restored deleted successfully",
        });
      } catch (error) {
        console.error("Error restored job:", error);
        toast({
          title: "Error",
          description: `Failed to restored job: ${error}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setRefresh((prev) => !prev);
      }
    }
  };

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

  const filteredJobs = jobs.filter((job) => {
    const lowerSearch = searchTerm.toLowerCase();

    return (
      job.title.toLowerCase().includes(lowerSearch) ||
      job.location?.toLowerCase().includes(lowerSearch) ||
      (employer?.firstname + " " + employer?.lastname)
        ?.toLowerCase()
        .includes(lowerSearch) ||
      job.skills?.some((skill) =>
        skill.Name.toLowerCase().includes(lowerSearch)
      )
    );
  });

  return (
    <>
      <div className="py-4 px-8 w-fill">
        {/* Header and Search/Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-xl font-bold mb-4 sm:mb-0">Active Jobs</h1>

          {/* Search & Filter Section */}
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto relative">
            <span className="absolute left-4 top-3 sm:top-3">
              <Search className="h-4 w-4 text-gray-500" />
            </span>
            <Input
              className="w-full sm:w-[300px] rounded-xl bg-white pl-10 pr-4 py-2"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-4 ml-0 sm:ml-4 mt-4 sm:mt-0">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-lg">
                  <SelectItem value="date-desc">Date: Newest First</SelectItem>
                  <SelectItem value="title-asc">Title: A-Z</SelectItem>
                  <SelectItem value="salary-desc">
                    Salary: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="p-2"
                onClick={() => setShowDeletedJobsModal(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Job Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {/* Render Job Cards */}
          {loading ? (
            <p className="text-center w-full col-span-full">Loading jobs...</p>
          ) : (
            filteredJobs.map((job) => (
              <Card
                key={job?._id}
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
                        className="text-red-600 hover:bg-red-100"
                        onClick={() =>
                          handleJobUpdateAndDelete("delete", job?._id)
                        }
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {new Date(job?.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
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
                              (employer.lastname?.[0].toUpperCase() || "")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <h2 className="text-lg font-semibold text-left ml-2 pt-1.5">
                        {job?.title}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      {employer?.firstname} {employer.lastname}
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
                  <span className="flex justify-between w-full mb-2">
                    <p className="text-sm">
                      Work Mode: {job?.workMode || "Work From Office"}
                    </p>
                    <Badge
                      className={`${
                        job?.status === "approved"
                          ? "bg-green-50 border-green-600 text-green-600"
                          : job?.status === "pending"
                          ? "bg-yellow-50 border-yellow-600 text-yellow-600"
                          : "bg-red-50 border-red-600 text-red-600"
                      } rounded-full px-3 py-1 text-xs shadow-none font-medium hover:bg-transparent`}
                    >
                      {job?.status.charAt(0).toUpperCase() +
                        job?.status.slice(1)}
                    </Badge>
                  </span>

                  <div className="flex justify-between w-full">
                    <div>
                      <div className="text-base font-semibold text-black">
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
                      <div className="text-xs text-gray-500">CTC</div>
                    </div>
                    <Button
                      className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-700"
                      onClick={() =>
                        navigate("/job-analytics/job-details", {
                          state: { job },
                          replace: true,
                        })
                      }
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

      {showDeletedJobsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Deleted Job Posts</h2>
            {deletedJobs.length === 0 ? (
              <p>No deleted jobs.</p>
            ) : (
              <ul className="space-y-2">
                {deletedJobs.map((job) => (
                  <li
                    key={job._id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <span>{job.title}</span>
                    <Button
                      className="text-white"
                      onClick={() => {
                        handleJobUpdateAndDelete("restore", job._id);
                        setRefresh((prev) => !prev);
                      }}
                    >
                      Restore
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-right">
              <Button
                variant="outline"
                onClick={() => setShowDeletedJobsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileJobPosts;

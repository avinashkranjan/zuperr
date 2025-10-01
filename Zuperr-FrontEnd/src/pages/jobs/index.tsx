/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo, useCallback } from "react";

import { Button } from "@components/ui/button";
import { get, post } from "@api/index";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@src/hooks/use-toast";
import JobSidebar from "../../components/JobSidebar";
import JobModal from "./job-modal";
import Categories from "./categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@components/ui/pagination";
import JobCard from "./job-cards";

// It's good practice to export types if they are used elsewhere
export interface IJob {
  _id: string;
  title: string;
  experienceLevel: string;
  jobCategory: string;
  jobType: string;
  workMode: string;
  salaryRange: {
    minimumSalary: string;
    maximumSalary: string;
    currency: string;
  };
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
  isSponsored: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  jobExperienceLevelType: string;
  companyName: string;
  bgColor?: string;
}

export interface Skill {
  _id: string;
  Name: string;
}

type ILandingPageJobsResponse = IJob[];

interface ICategory {
  name: string;
  jobs: number;
  bgColor: string;
}

// Mapping of filter title to job field name for filtering
const filterMapping: { [key: string]: keyof IJob } = {
  "Working Schedule": "jobType",
  "Employment Type": "workMode",
  Industry: "jobCategory",
  Cities: "location",
};

// Predefined colors for categories
const categoryColors: { [key: string]: string } = {
  "Software Development": "bg-blue-100",
  IT: "bg-green-100",
  Marketing: "bg-purple-100",
  "Cloud Computing": "bg-yellow-100",
  Design: "bg-orange-100",
  "Human Resources": "bg-blue-100",
  "Data Science": "bg-teal-100",
};

const generateRandomCategoryColor = (): string => {
  const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "pink",
    "cyan",
    "lime",
    "teal",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `bg-${randomColor}-100`;
};

const Jobs: React.FC = () => {
  const { toast } = useToast();

  const [allJobs, setAllJobs] = useState<IJob[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [showOnlySelectedCategories, setShowOnlySelectedCategories] =
    useState(true);

  const jobsPerPage = 6;

  // --- Data Fetching and Management ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const jobsResponse = await get<ILandingPageJobsResponse>(
        "/employee/landing"
      );
      await post("/employee/jobviewed/all", {
        jobIds: jobsResponse.map((job) => job._id),
      });

      const categoryCount: { [key: string]: number } = {};
      jobsResponse.forEach((job) => {
        categoryCount[job.jobCategory] =
          (categoryCount[job.jobCategory] || 0) + 1;
      });

      const updatedCategories = Object.keys(categoryCount).map((key) => ({
        name: key,
        jobs: categoryCount[key],
        bgColor: categoryColors[key] || generateRandomCategoryColor(),
      }));

      const updatedJobs = jobsResponse.map((job) => ({
        ...job,
        bgColor:
          categoryColors[job.jobCategory] || generateRandomCategoryColor(),
      }));

      setCategories(updatedCategories);
      setAllJobs(updatedJobs);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCandidateData = useCallback(async () => {
    try {
      const data = await get<any>("/employee/getcandidatedata");
      setCandidateData(data);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchCandidateData();
  }, [fetchData, fetchCandidateData]);

  // --- Filtering Logic with useMemo for performance ---
  const filteredJobs = useMemo(() => {
    let jobs = [...allJobs];

    // Filter by selected preferences if enabled
    if (
      showOnlySelectedCategories &&
      candidateData?.selectedJobCategories?.length > 0
    ) {
      jobs = jobs.filter((job) =>
        candidateData.selectedJobCategories.includes(job.jobCategory)
      );
    }

    // Filter by sidebar selections
    const hasActiveFilters = Object.keys(selectedFilters).length > 0;
    if (hasActiveFilters) {
      jobs = jobs.filter((job) => {
        return Object.entries(selectedFilters).every(
          ([filterTitle, options]) => {
            if (!options || options.length === 0) return true;
            const field = filterMapping[filterTitle];
            return field && options.includes(job[field] as string);
          }
        );
      });
    }

    return jobs;
  }, [allJobs, selectedFilters, showOnlySelectedCategories, candidateData]);

  // --- Pagination Logic with useMemo ---
  const totalPages = useMemo(
    () => Math.ceil(filteredJobs.length / jobsPerPage),
    [filteredJobs, jobsPerPage]
  );

  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage, jobsPerPage]);

  useEffect(() => {
    // Reset to page 1 whenever filters change
    setCurrentPage(1);
  }, [filteredJobs]);

  // --- Event Handlers with useCallback ---
  const handleFilterChange = useCallback(
    (filterName: string, options: string[]) => {
      setSelectedFilters((prev) => {
        const newFilters = { ...prev, [filterName]: options };
        if (options.length === 0) delete newFilters[filterName];
        return newFilters;
      });
    },
    []
  );

  const resetFilters = useCallback(() => setSelectedFilters({}), []);

  const handleApply = useCallback(
    async (jobId: string) => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast({
          title: "Error",
          description: "Please sign in to apply.",
          variant: "destructive",
        });
        return;
      }
      try {
        await post("/employee/jobs/applyforJobs", { jobId, userId });
        toast({
          title: "Success",
          description: "Applied successfully!",
          variant: "success",
        });
        fetchData(); // Refresh data to reflect application status
      } catch (error) {
        console.error("Error applying for job:", error);
        toast({
          title: "Error",
          description: `Error applying for job: ${error}`,
          variant: "destructive",
        });
      }
    },
    [toast, fetchData]
  );

  const handleCardClick = useCallback((job: IJob) => setSelectedJob(job), []);
  const closeModal = useCallback(() => setSelectedJob(null), []);
  const sponsoredJobs = currentJobs.filter((job) => job.isSponsored);
  const normalJobs = currentJobs.filter((job) => !job.isSponsored);
  const sortedJobs = [...sponsoredJobs, ...normalJobs];

  return (
    <>
      <div className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <JobSidebar
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
          <main className="lg:col-span-3">
            <Categories categories={categories} />

            <section className="mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recommended Jobs</h2>
                <div className="flex justify-between gap-3 items-center">
                  <Button
                    onClick={fetchData}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
                  </Button>
                  <Select
                    value={showOnlySelectedCategories ? "selected" : "all"}
                    onValueChange={(value) =>
                      setShowOnlySelectedCategories(value === "selected")
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter Jobs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      <SelectItem value="selected">
                        Selected Categories
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <Badge variant="secondary">{filteredJobs.length}</Badge> */}
                </div>
              </div>

              {loading ? (
                <p>Loading jobs...</p>
              ) : filteredJobs.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-xl font-semibold text-gray-600 text-center">
                    No jobs match your criteria. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {sortedJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onCardClick={handleCardClick}
                        onApply={handleApply}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center w-full">
                      <Pagination>
                        <PaginationContent className="flex gap-2">
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                              }
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                              <Button
                                variant={
                                  currentPage === index + 1
                                    ? "default"
                                    : "outline"
                                }
                                className="h-8 px-3 text-sm"
                                onClick={() => setCurrentPage(index + 1)}
                              >
                                {index + 1}
                              </Button>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(p + 1, totalPages)
                                )
                              }
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </section>
          </main>
        </div>
        {selectedJob && (
          <JobModal
            job={selectedJob}
            onClose={closeModal}
            onApply={handleApply}
          />
        )}
      </div>
    </>
  );
};

export default Jobs;

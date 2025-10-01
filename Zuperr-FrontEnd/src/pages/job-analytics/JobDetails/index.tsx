/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import { Table } from "@components/ui/table";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@components/ui/pagination";
import { MultiSelect } from "@components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { put as apiPut } from "@api/index";
import AnimatedSlider from "@base-components/AnimateSlider";
import { ArrowLeft } from "lucide-react";

function JobDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const jobs: any = location.state?.job || [];
  const { toast } = useToast();

  // State for dynamic options
  const [skillsOptions, setSkillsOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [ctcOptions, setCtcOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [experienceOptions, setExperienceOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Other state variables
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: 50,
    experience: [] as string[],
    ctc: [] as string[],
  });
  const [filteredApplicants, setFilteredApplicants] = useState<any>(
    jobs.applicants
  );
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const itemsPerPage = 10;

  // Extract dynamic options from applicants data
  useEffect(() => {
    const extractDynamicOptions = () => {
      const uniqueSkills = new Set<string>();
      const ctcValues: number[] = [];
      const expValues: number[] = [];

      jobs.applicants?.forEach((applicant: any) => {
        // Skills
        if (applicant.id.keySkills) {
          applicant.id.keySkills?.forEach((skill: any) => {
            if (typeof skill === "object" && skill.Name) {
              uniqueSkills.add(skill.Name);
            } else if (typeof skill === "string") {
              uniqueSkills.add(skill);
            }
          });
        }

        // CTC
        if (applicant.id.careerPreference?.minimumSalaryLPA) {
          ctcValues.push(applicant.id.careerPreference.minimumSalaryLPA);
        }

        // Experience
        if (applicant.id.maximumExperienceInYears) {
          expValues.push(applicant.id.maximumExperienceInYears);
        }
      });

      // Set skills options
      setSkillsOptions(
        Array.from(uniqueSkills)?.map((skill) => ({
          value: skill,
          label: skill,
        }))
      );

      // Set CTC options (dynamic ranges based on actual data)
      const minCtc = Math.min(...ctcValues, 0);
      const maxCtc = Math.max(...ctcValues, 0);
      const ctcStep = 5; // 5 LPA increments
      const dynamicCtcOptions = [];

      for (
        let i = Math.floor(minCtc / ctcStep) * ctcStep;
        i <= maxCtc;
        i += ctcStep
      ) {
        const rangeEnd = i + ctcStep;
        dynamicCtcOptions.push({
          value: `${i}-${rangeEnd}`,
          label: `${i}-${rangeEnd} LPA`,
        });
      }

      // Add a final range if there are values above the last step
      if (maxCtc > dynamicCtcOptions.length * ctcStep) {
        dynamicCtcOptions.push({
          value: `${dynamicCtcOptions.length * ctcStep}+`,
          label: `${dynamicCtcOptions.length * ctcStep}+ LPA`,
        });
      }

      setCtcOptions(dynamicCtcOptions);

      // Set Experience options (dynamic ranges based on actual data)
      const minExp = Math.min(...expValues, 0);
      const maxExp = Math.max(...expValues, 0);
      const expStep = 2; // 2 year increments
      const dynamicExpOptions = [];

      for (
        let i = Math.floor(minExp / expStep) * expStep;
        i <= maxExp;
        i += expStep
      ) {
        const rangeEnd = i + expStep;
        dynamicExpOptions.push({
          value: `${i}-${rangeEnd}`,
          label: `${i}-${rangeEnd} years`,
        });
      }

      // Add a final range if there are values above the last step
      if (maxExp > dynamicExpOptions.length * expStep) {
        dynamicExpOptions.push({
          value: `${dynamicExpOptions.length * expStep}+`,
          label: `${dynamicExpOptions.length * expStep}+ years`,
        });
      }

      setExperienceOptions(dynamicExpOptions);
    };

    extractDynamicOptions();
  }, [jobs]);

  // Calculate distances for each applicant
  useEffect(() => {
    if (jobs.applicants && jobs.location) {
      const applicantsWithDistance = jobs.applicants?.map((applicant: any) => {
        const distance = "--";
        return {
          ...applicant,
          distance,
        };
      });
      setFilteredApplicants(applicantsWithDistance);
      setTotalPages(Math.ceil(applicantsWithDistance.length / itemsPerPage));
    }
  }, [jobs]);

  // Pagination logic
  const displayedApplicants: any = filteredApplicants?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handling search
  const handleSearch = () => {
    setCurrentPage(1);
    const filtered: any = jobs.applicants.filter((applicant: any) => {
      const { keySkills, careerPreference, maximumExperienceInYears } =
        applicant.id;
      const distance = applicant.distance || 0;

      // Check Skills
      const hasSkills =
        filters.skills.length === 0 ||
        (keySkills &&
          filters.skills.every((skill) =>
            keySkills.some(
              (ks: any) =>
                (typeof ks === "string" && ks.includes(skill)) ||
                (typeof ks === "object" && ks.Name && ks.Name.includes(skill))
            )
          ));

      // Check Location
      const withinLocation = distance <= filters.location;

      // Check Experience
      const hasExperience =
        filters.experience.length === 0 ||
        filters.experience.some((range) => {
          const [minStr, maxStr] = range.split("-");
          const min = parseFloat(minStr);
          const max = maxStr.endsWith("+") ? Infinity : parseFloat(maxStr);
          const exp = maximumExperienceInYears || 0;

          if (maxStr.endsWith("+")) {
            return exp >= min;
          }
          return exp >= min && exp <= max;
        });

      // Check CTC
      const hasCTC =
        filters.ctc.length === 0 ||
        filters.ctc.some((range) => {
          const [minStr, maxStr] = range.split("-");
          const min = parseFloat(minStr);
          const max = maxStr.endsWith("+") ? Infinity : parseFloat(maxStr);
          const ctc = careerPreference?.minimumSalaryLPA || 0;

          if (maxStr.endsWith("+")) {
            return ctc >= min;
          }
          return ctc >= min && ctc <= max;
        });

      return hasSkills && withinLocation && hasExperience && hasCTC;
    });

    setFilteredApplicants(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    toast({
      title: "Filters Applied",
      description: `${filtered.length} applicants found.`,
    });
  };

  const handlePrevClick = () => {
    if (currentPage === 1) {
      toast({
        title: "Start of pages",
        description: "You are already on the first page",
        variant: "destructive",
      });
    } else {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage === totalPages) {
      toast({
        title: "End of pages",
        description: "You are already on the last page",
        variant: "destructive",
      });
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleStatusChange = (applicantID: string, status: string) => {
    setSelectedUserId(applicantID);
    setNewStatus(status);
    setIsDialogOpen(true);
  };

  const updateStatus = async () => {
    if (!selectedUserId || !newStatus) return;
    try {
      const userId = localStorage.getItem("userId");
      const response: any = await apiPut(
        `employer/jobs/${jobs._id}/applicants/${selectedUserId}/status`,
        { status: newStatus, userId }
      );
      if (response.message === "Applicant status updated successfully") {
        toast({
          title: "Success",
          description: "Applicant status updated successfully.",
        });
        navigate("/job-analytics/jobs");
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const statusOptions = [
    { label: "Under Review", value: "Under Review" },
    { label: "Shortlist", value: "Shortlisted" },
    { label: "Hired", value: "Hired" },
    { label: "Rejected", value: "Reject" },
  ];

  return (
    <div className="p-4 sm:p-6">
      <Card className="shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 p-6 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {jobs.title}
          </h2>
          <Button
            onClick={() => navigate("/job-analytics/jobs")}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-row justify-between w-5/12 ml-12 gap-6 p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Views</span>
            <span className="text-md text-muted-foreground font-semibold border border-gray-300 rounded-xl px-10 py-2">
              {jobs?.jobViewsCount || 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Applicants</span>
            <span className="text-md text-muted-foreground font-semibold border border-gray-300 rounded-xl px-10 py-2">
              {jobs?.applicants?.length || 0}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border-t border-b w-11/12 mx-auto">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Skills</label>
            <MultiSelect
              options={skillsOptions}
              onValueChange={(value) =>
                setFilters({ ...filters, skills: value })
              }
              value={filters.skills}
              placeholder="Select Skills"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Max Location (km)
            </label>
            <AnimatedSlider
              value={filters.location}
              min={1}
              max={100}
              step={1}
              onValueChange={(value) =>
                setFilters({ ...filters, location: value })
              }
            />
            <p className="text-sm text-gray-700">{filters.location} km</p>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Experience</label>
            <MultiSelect
              options={experienceOptions}
              onValueChange={(value) =>
                setFilters({ ...filters, experience: value })
              }
              value={filters.experience}
              placeholder="Select Experience"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">CTC (LPA)</label>
            <MultiSelect
              options={ctcOptions}
              onValueChange={(value) => setFilters({ ...filters, ctc: value })}
              value={filters.ctc}
              placeholder="Select CTC"
            />
          </div>

          {/* Filter Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-2 p-4">
            <Button
              onClick={handleSearch}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Table */}
        <CardContent className="overflow-x-auto p-4">
          <Table>
            <thead className="bg-primary text-white text-sm">
              <tr>
                {[
                  "Candidate Name",
                  "Location",
                  "Score",
                  "Experience",
                  "CTC",
                  "CV Download",
                  "Status",
                ].map((heading) => (
                  <th key={heading} className="p-3 text-center">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center text-gray-500">
              {displayedApplicants?.map((user: any, index: number) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="p-3 font-semibold my-4">
                    {user.id?.firstname} {user.id.lastname}
                  </td>
                  <td className="p-3 font-semibold my-4">{user.distance}</td>
                  <td
                    className="p-3 font-semibold  my-4"
                    style={{
                      color:
                        user.score >= 90
                          ? "green"
                          : user.score >= 75
                          ? "orange"
                          : "red",
                    }}
                  >
                    {user.score || 0}%
                  </td>
                  <td className="p-3 font-semibold  my-4">
                    {user.id.maximumExperienceInYears || "0"} Yrs
                  </td>
                  <td className="p-3 text-green-500 font-semibold  my-4">
                    {user.id.careerPreference?.minimumSalaryLPA || "--"} LPA
                  </td>
                  <td className="p-3 text-center justify-center mx-auto  my-4">
                    {user.id.resume ? (
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => {
                          if (!user.id.resume) return;
                          const link = document.createElement("a");
                          link.href = `https://zuperrr-bucket.blr1.digitaloceanspaces.com/${user.id.resume}`;
                          link.download = `${user.id.firstname}_${user.id.lastname}_resume.pdf`;
                          link.target = "_blank";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        disabled={!user.id.resume}
                      >
                        Click here
                      </Button>
                    ) : (
                      <span className="text-gray-500">No Resume</span>
                    )}
                  </td>
                  <td className="p-3 justify-center text-center mx-auto  my-4">
                    <Select
                      value={user.status || ""}
                      onValueChange={(status) =>
                        handleStatusChange(user._id, status)
                      }
                    >
                      <SelectTrigger className="mx-auto w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>

        {/* Confirm Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Status Update</DialogTitle>
              <DialogDescription>
                Are you sure you want to change the status to &quot;{newStatus}
                &quot;?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateStatus}>Yes, Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 p-4">
          <Pagination className="flex gap-2 flex-wrap justify-center">
            <PaginationContent className="flex gap-4">
              <PaginationItem>
                <PaginationPrevious
                  className="text-gray-600 hover:text-blue-600"
                  onClick={handlePrevClick}
                  aria-disabled={currentPage <= 1}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                ?.slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2)
                )
                ?.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 py-1 rounded ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext
                  className="text-gray-600 hover:text-blue-600"
                  onClick={handleNextClick}
                  aria-disabled={currentPage === totalPages}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}

export default JobDetails;

/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { get } from "@api/index";
import { Card } from "@components/ui/card";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

interface Candidate {
  id: string;
  name: string;
  location: string;
  distance: string;
  score: string;
  experience: string;
  ctc: string;
  cv: string;
  status: "Under Review" | "Rejected" | "Shortlisted" | "Hired";
}

interface JobData {
  _id: string;
  title: string;
  applicants: Array<{
    id: {
      firstname: string;
      lastname: string;
      address: {
        state: string;
      };
      employmentHistory: Array<{
        workExperience: {
          years: number;
        };
      }>;
      careerPreference: {
        minimumSalaryLPA: number;
      };
      resume: string;
    };
    status: Candidate["status"];
    score: number;
  }>;
  jobViewsCount: number;
}

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "" | "Under Review" | "Rejected" | "Shortlisted" | "Hired"
  >("");
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [selectedJobData, setSelectedJobData] = useState<JobData>();
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    get(`employer/jobs/get-jobs-with-applicants/${userId}`)
      .then((data: any) => {
        if (data && data.length > 0) {
          setJobData(data);
          setSelectedJobData(data[0]);
          transformCandidateData(data[0]);
        }
      })
      .catch((err) => console.error("Error fetching job data:", err));
  }, []);

  const transformCandidateData = (data: JobData) => {
    const transformed = data.applicants.map((applicant, index) => {
      const totalExperience = applicant.id.employmentHistory.reduce(
        (total, job) => total + job.workExperience.years,
        0
      );

      return {
        id: `${index}-${applicant.id.firstname}`,
        name: `${applicant.id.firstname} ${applicant.id.lastname}`,
        location: applicant.id.address.state,
        distance: `${Math.floor(Math.random() * 40) + 20}.${Math.floor(
          Math.random() * 9
        )}km`,
        score: `${applicant.score}%`,
        experience: `${totalExperience}-${totalExperience + 1} Yr`,
        ctc: `${
          applicant.id.careerPreference.minimumSalaryLPA +
          Math.floor(Math.random() * 5)
        }.${Math.floor(Math.random() * 9)} CTC`,
        cv: applicant.id.resume || "Click here",
        status: applicant.status,
      };
    });

    setCandidates(transformed);
    setFilteredCandidates(transformed);
  };

  useEffect(() => {
    let temp = [...candidates];

    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      temp = temp.filter((c) => c.name.toLowerCase().includes(queryLower));
    }

    if (selectedStatus) {
      temp = temp.filter((c) => c.status === selectedStatus);
    }

    setFilteredCandidates(temp);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, candidates]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCandidates = filteredCandidates.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSelectJob = (job: JobData) => {
    setSearchQuery(job.title);
    setSelectedJobData(job);
    transformCandidateData(job);
  };

  // Count candidates by status
  const statusCounts = {
    "Under Review": candidates.filter((c) => c.status === "Under Review")
      .length,
    Rejected: candidates.filter((c) => c.status === "Rejected").length,
    Shortlisted: candidates.filter((c) => c.status === "Shortlisted").length,
    Hired: candidates.filter((c) => c.status === "Hired").length,
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <Card className="p-6">
        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold mb-2 border-b border-black pb-6">
          Candidates
        </h1>
        <p className="text-gray-600 my-6 w-11/12 mx-auto">
          Status Option in Analytics connected with Candidates. This helps to
          sort candidates by different status of Candidates.
        </p>

        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-11/12 mx-auto">
          <div className="flex-1 w-full">
            <Label>Posted Jobs</Label>
            <div className="relative mt-2">
              <Select
                value={searchQuery ? searchQuery : selectedJobData?.title || ""}
                onValueChange={(handleValue) => {
                  const selectedJob = jobData.find(
                    (job) => job.title === handleValue
                  );
                  if (selectedJob) {
                    handleSelectJob(selectedJob);
                  } else {
                    setSelectedJobData(undefined);
                    setSearchQuery(handleValue);
                  }
                }}
              >
                <SelectTrigger className="w-full py-2 bg-white border border-gray-300 rounded-xl">
                  <SelectValue placeholder="Select Posted Jobs" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-lg">
                  {jobData.map((job) => (
                    <SelectItem key={job._id} value={job.title}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 w-11/12 mx-auto mb-4">
          <div className="text-center flex flex-col">
            <span className="text-gray-600 text-sm">Applicants</span>
            <span className="mt-2 text-md text-muted-foreground font-semibold border border-gray-300 rounded-xl px-10 py-2">
              {selectedJobData?.applicants.length || 0}
            </span>
          </div>
          <div className="text-center flex flex-col">
            <span className="text-gray-600 text-sm">Views</span>
            <span className="mt-2 text-md text-muted-foreground font-semibold border border-gray-300 rounded-xl px-10 py-2">
              {selectedJobData?.jobViewsCount || 0}
            </span>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap justify-between gap-2 mb-6 w-11/12 mx-auto">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              onClick={() => {
                setSelectedStatus(
                  (prev) =>
                    (prev === status ? "" : status) as
                      | ""
                      | "Under Review"
                      | "Rejected"
                      | "Shortlisted"
                      | "Hired"
                );
              }}
              className={`${
                selectedStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-500"
              } flex items-center gap-2 py-5 px-8 rounded-xl font-semibold border border-blue-500 hover:bg-blue-600 hover:text-white transition-colors`}
            >
              {status} <span className="text-sm opacity-80">- {count}</span>
            </Button>
          ))}
        </div>
        <p className="my-4">
          Showing candidates for{" "}
          <span className="font-semibold">
            {selectedJobData ? selectedJobData.title : "Select a job"}
          </span>
        </p>
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="text-center mx-auto">
              <TableRow className="bg-blue-500 hover:bg-blue-500 text-white text-center">
                <TableHead className="py-5 text-center text-white font-semibold">
                  Candidate Name
                </TableHead>
                <TableHead className="py-5 text-center text-white font-semibold">
                  Location
                </TableHead>
                <TableHead className="py-5 text-center text-white font-semibold">
                  Score
                </TableHead>
                <TableHead className="py-5 text-center text-white font-semibold">
                  Experience
                </TableHead>
                <TableHead className="py-5 text-center text-white font-semibold">
                  CTC
                </TableHead>
                <TableHead className="py-5 text-center text-white font-semibold">
                  CV
                </TableHead>
                <TableHead className="py-5 text-center text-white font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedJobData?.applicants.map((candidate: any) => (
                <TableRow
                  key={candidate.id._id}
                  className="font-semibold text-gray-500 text-center"
                >
                  <TableCell>
                    {candidate.id?.firstname} {candidate.id.lastname}
                  </TableCell>

                  <TableCell>--</TableCell>
                  <TableCell
                    style={{
                      color:
                        parseInt(candidate.score) >= 90
                          ? "green"
                          : parseInt(candidate.score) >= 75
                          ? "orange"
                          : "red",
                    }}
                  >
                    {candidate.score}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {candidate.id.maximumExperienceInYears || "0"} Yrs
                  </TableCell>
                  <TableCell>
                    {candidate.id.careerPreference?.minimumSalaryLPA || "-"} -
                    {candidate.id.careerPreference?.maximumSalaryLPA || ""} LPA
                  </TableCell>
                  <TableCell>
                    {candidate.id.resume ? (
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => {
                          if (!candidate.id.resume) return;
                          const link = document.createElement("a");
                          link.href = `https://zuperrr-bucket.blr1.digitaloceanspaces.com/${candidate.id.resume}`;
                          link.download = `${candidate.id.firstname}_${candidate.id.lastname}_resume.pdf`;
                          link.target = "_blank";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        disabled={!candidate.id.resume}
                      >
                        Click here
                      </Button>
                    ) : (
                      <span className="text-gray-500">No Resume</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        candidate.status === "Shortlisted"
                          ? "bg-green-100 text-green-800"
                          : candidate.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : candidate.status === "Hired"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {displayedCandidates.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    No candidates found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {filteredCandidates.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Candidates;

/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Grid, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { post } from "@api/index";
import { useTypedSelector } from "@src/redux/rootReducer";
import { IJob } from "@src/pages/jobs";
import JobModal from "@src/pages/jobs/job-modal";
import LocationSearch from "./location-search";

const getRandomBgColor = () => {
  const colors = ["bg-red-200", "bg-green-200", "bg-blue-200", "bg-yellow-200"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function SearchContainer({
  onSearch,
}: {
  onSearch?: (searchQuery: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const sessionInfo = useTypedSelector((state) => state.App.sessionInfo);
  const isEmployee = sessionInfo.userType === "employee";
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [locationTerm, setLocationTerm] = useState("");

  useEffect(() => {
    const savedDistance = localStorage.getItem("locationDistance");
    if (locationTerm && savedDistance) {
      onSearch?.(locationTerm);
    }
  }, [locationTerm]);

  const handleSearch = async () => {
    try {
      const payload = { searchText: searchTerm.trim() };

      const response: any = await post("/employee/jobs/search", payload);
      console.log("Search response:", response);
      const { jobs, companies } = response;

      const jobsWithColor = jobs.map((job: any) => ({
        ...job,
        bgColor: getRandomBgColor(),
      }));

      const companiesWithColor = companies.map((company: any) => ({
        ...company,
        bgColor: getRandomBgColor(),
      }));

      setFilteredJobs(jobsWithColor);
      setFilteredCompanies(companiesWithColor);
      setIsSearchDialogOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLocationSearch = async () => {
    try {
      setSearchTerm("");

      const response: any = await post("/employee/jobs/search", {
        searchText: locationTerm.trim(),
      });

      const { jobs } = response;

      // Filter client-side by location (if needed)
      const locationMatchedJobs = jobs.filter((job: any) =>
        job?.location?.toLowerCase().includes(locationTerm.toLowerCase())
      );

      const jobsWithColor = locationMatchedJobs.map((job: any) => ({
        ...job,
        bgColor: getRandomBgColor(),
      }));

      setFilteredJobs(jobsWithColor);
      setFilteredCompanies([]);
      setIsSearchDialogOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    isEmployee && (
      <div className="bg-blue-600 p-4 w-full">
        <div className="container flex justify-center mx-auto">
          <div className="w-3/4 flex items-center backdrop-blur-md bg-blue-400/30 border border-white/30 rounded-full overflow-hidden px-2 py-1 shadow-sm">
            <input
              type="text"
              placeholder="Jobs, Company, Skill ..."
              className="rounded-full px-4 bg-transparent text-white placeholder-white border-none focus:outline-none focus:ring-0 focus-visible:ring-0 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <Button
              className="rounded-full bg-white text-blue-500 font-semibold hover:bg-white ml-2 px-6"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          <Separator
            orientation="vertical"
            className="h-8 mt-2 mx-4 bg-white"
          />

          <LocationSearch
            onSearch={(location: string) => {
              setLocationTerm(location);
              handleLocationSearch();
            }}
          />
        </div>

        <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
          <DialogContent className="sm:max-w-[425px] md:max-w-screen-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                Search Results
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    className={
                      viewMode === "grid" ? "text-white" : "text-black"
                    }
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4 mr-1" />
                    Grid View
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    className={
                      viewMode === "list" ? "text-white" : "text-black"
                    }
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4 mr-1" />
                    List View
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                <DialogDescription>
                  {searchTerm && locationTerm ? (
                    <>
                      Displaying results for &quot;<b>{searchTerm}</b>&quot; in
                      &quot;<b>{locationTerm}</b>&quot;.
                    </>
                  ) : searchTerm ? (
                    <>
                      Displaying results for &quot;<b>{searchTerm}</b>&quot;.
                    </>
                  ) : locationTerm ? (
                    <>
                      Displaying jobs in &quot;<b>{locationTerm}</b>&quot;.
                    </>
                  ) : (
                    <>Showing all available jobs.</>
                  )}
                </DialogDescription>
              </DialogDescription>
            </DialogHeader>
            <h3 className="text-lg font-semibold mt-4">Jobs</h3>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="border p-4 rounded-lg shadow-sm cursor-pointer"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsSearchDialogOpen(false);
                    }}
                  >
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.companyName}</p>
                    <p className="text-xs text-gray-500">{job.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex justify-between items-center border p-4 rounded-lg shadow-sm cursor-pointer"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsSearchDialogOpen(false);
                    }}
                  >
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.companyName}</p>
                      <p className="text-xs text-gray-500">{job.location}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {filteredCompanies.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-4">Companies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className={`border p-4 rounded-lg shadow-sm ${company.bgColor}`}
                    >
                      <h4 className="font-semibold">{company.companyName}</h4>
                    </div>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        {selectedJob && (
          <JobModal
            job={selectedJob}
            onClose={closeModal}
            onApply={() => {
              // Handle job application logic here
              console.log(`Applying for job: ${selectedJob._id}`);
              setSelectedJob(null);
            }}
          />
        )}
      </div>
    )
  );
}

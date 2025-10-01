/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { post } from "@api/index";
import { Button } from "@components/ui/button";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import React from "react";

const ApplicationStatus = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationsPerPage = 6;

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;

  const [applications, setApplications] = useState<any[]>([]);
  const currentApplications = applications.slice(
    indexOfFirstApplication,
    indexOfLastApplication
  );
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  const getStatusStep = (status: string) => {
    switch (status) {
      case "under_review":
        return 1;
      case "shortlisted":
        return 2;
      case "hired":
        return 3;
      case "reject":
        return 4;
      default:
        return 1;
    }
  };

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response: any[] = await post(
          "/employee/jobapplicationstatus",
          {}
        );
        setApplications(response);

        const selectedId = searchParams.get("selected");
        if (selectedId) {
          const foundApp = response.find(
            (app) => app.jobId?.toString() === selectedId
          );
          if (foundApp) {
            setSelectedApplication({
              id: foundApp.jobId,
              job: {
                title: foundApp.jobTitle,
                company: foundApp.companyName,
                location: foundApp.location,
              },
              status: foundApp.status.toLowerCase().replaceAll(" ", "_"),
              appliedDate: `${foundApp.daysSinceApplication} days ago`,
              description: foundApp.description || "",
              topSkills: foundApp.topSkills || [],
              missingSkills: foundApp.missingSkills || [],
              suggestedActions: foundApp.suggestedActions || [],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    }

    fetchApplications();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-6">Job Application Status</h3>

      {!selectedApplication && (
        <>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentApplications.map((app, index) => (
                <div
                  key={index}
                  className="bg-[#FFE5D1] rounded-2xl p-4 relative cursor-pointer h-full flex flex-col justify-between"
                  onClick={() => {
                    const selectedId = app.jobId;
                    setSelectedApplication({
                      id: selectedId,
                      job: {
                        title: app.jobTitle,
                        company: app.companyName,
                        location: app.location,
                      },
                      status: app.status.toLowerCase().replaceAll(" ", "_"),
                      appliedDate: `${app.daysSinceApplication} days ago`,
                      description: app.description || "",
                      topSkills: app.topSkills || [],
                      missingSkills: app.missingSkills || [],
                      suggestedActions: app.suggestedActions || [],
                    });

                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.set("selected", selectedId);
                      return newParams;
                    });
                  }}
                >
                  {/* Content Section */}
                  <div className="flex items-start gap-4">
                    <div className="bg-black w-12 h-12 flex items-center justify-center rounded-lg">
                      <span className="text-white text-xl font-bold">
                        {app.companyName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <h4 className="text-lg font-semibold">{app.jobTitle}</h4>
                      <p className="text-sm text-black">{app.companyName}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{app.location}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        Recruiter&apos;s action:
                        <span className="ml-2 bg-white text-black px-2 py-1 rounded-full text-xs">
                          {app.daysSinceApplication} Day(s) Ago
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Button */}
                  <div className="mt-6">
                    <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
                      {app.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? "text-gray-400" : "text-blue-600"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages ? "text-gray-400" : "text-blue-600"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Selected Application Details Inline */}
      {selectedApplication && (
        <div className="mt-6">
          <Button
            onClick={() => {
              setSelectedApplication(null);
              setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.delete("selected");
                return newParams;
              });
            }}
            variant="ghost"
            className="mb-4 text-sm text-blue-600"
          >
            ← Back to applications
          </Button>

          <div className="bg-[#FFF2E5] rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-md">
                {selectedApplication?.job?.company.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {selectedApplication?.job?.title}
                </h2>
                <p className="text-gray-700">
                  {selectedApplication?.job?.company}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedApplication?.job?.location}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                Applied: {selectedApplication?.appliedDate}
              </span>
              <span className="bg-blue-600 text-white px-4 py-1 text-sm rounded font-semibold">
                {selectedApplication?.status.replaceAll("_", " ").toUpperCase()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Application Progress</h3>
              <div className="relative h-12">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 bg-blue-600 rounded-full"
                    style={{
                      width: `${
                        (getStatusStep(selectedApplication.status) / 4) * 100
                      }%`,
                    }}
                  />
                </div>

                <div className="absolute top-[1.13rem] left-0 right-0 flex justify-between mb-5">
                  {["Under Review", "Shortlisted", "Hired", "Reject"].map(
                    (label, index) => (
                      <div
                        key={label}
                        className="flex flex-col items-center w-1/4"
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            getStatusStep(selectedApplication.status) > index
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        ></div>
                        <span className="text-xs text-center my-4 leading-tight">
                          {label.split(" ").map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <h3 className="text-lg font-semibold mt-10 pt-10 mb-2">
              Job Description & Company Details
            </h3>
            <p className="text-gray-700 mb-4">
              {selectedApplication?.description}
            </p>

            {selectedApplication?.topSkills?.length > 0 && (
              <>
                <h4 className="font-semibold mt-4">Top Skills</h4>
                <ul className="list-disc pl-6 mb-4">
                  {selectedApplication?.topSkills.map(
                    (skill: any, i: number) => (
                      <li key={i}>{skill}</li>
                    )
                  )}
                </ul>
              </>
            )}

            {selectedApplication?.missingSkills?.length > 0 && (
              <>
                <h4 className="font-semibold mt-4">Missing Skills</h4>
                <ul className="list-disc pl-6 mb-4">
                  {selectedApplication?.missingSkills.map(
                    (skill: any, i: number) => (
                      <li key={i}>{skill}</li>
                    )
                  )}
                </ul>
              </>
            )}

            {selectedApplication?.suggestedActions?.length > 0 && (
              <>
                <h4 className="font-semibold mt-4">Suggested Actions</h4>
                <ul className="list-disc pl-6">
                  {selectedApplication?.suggestedActions.map(
                    (action: any, i: number) => (
                      <li key={i}>{action}</li>
                    )
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;

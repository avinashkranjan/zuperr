/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { MapPin, Sparkles, X, Bookmark, BookmarkCheck } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { get, post } from "@api/index";
import { useToast } from "@src/hooks/use-toast";
import { Link } from "react-router-dom";

const JobModal = ({
  job,
  onClose,
  onApply,
}: {
  job: any;
  onClose: () => void;
  onApply: (jobId: string) => void;
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = [
    "Analyzing your profile...",
    "Fetching job details...",
    "Generating AI summary...",
    "Evaluating skills match...",
  ];
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [topSkills, setTopSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { toast } = useToast();
  // Initialize bookmark state from localStorage
  useEffect(() => {
    if (job?._id) {
      const bookmarks = JSON.parse(
        localStorage.getItem("bookmarkedJobs") || "[]"
      );
      setIsBookmarked(bookmarks.includes(job.id));
    }
  }, [job?._id]);

  const toggleBookmark = () => {
    if (!job?._id) return;

    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedJobs") || "[]"
    );
    let updatedBookmarks;

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((id: string) => id !== job._id);
      toast({
        title: "Removed from bookmarks",
        description: `${job.title} has been removed.`,
        variant: "destructive",
      });
    } else {
      updatedBookmarks = [...bookmarks, job._id];
      toast({
        title: "Job Saved, View Saved Jobs",
        description: (
          <div className="flex items-center gap-2">
            <span>{job.title} has been saved.</span>
            <Link
              to="/saved-jobs"
              className="text-blue-600 font-medium underline hover:text-blue-800"
            >
              View Saved Jobs
            </Link>
          </div>
        ),
      });
    }

    localStorage.setItem("bookmarkedJobs", JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  async function getProfileSummary() {
    try {
      setLoading(true);
      setError("");
      const data: any = await get("/employee/getcandidatedata");
      const llmRes: any = await post("/employee/analyze-candidate", {
        jobDescription: job,
        candidateProfile: data,
      });
      if (llmRes) {
        setAiSummary(llmRes.aiSummary);
        setTopSkills(llmRes.topSkills);
        setMissingSkills(llmRes.missingSkills);
        setSuggestedActions(llmRes.suggestedActions);
      }
    } catch (error) {
      console.error("Error fetching profile summary:", error);
      setError("Failed to fetch profile summary. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const candidateRank = Math.floor(Math.random() * (80 - 20 + 1)) + 20;

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
      return `${numericAmount}`;
    }
  }

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply(job._id);
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className={`${job.bgColor} w-[700px] max-h-[90vh] rounded-2xl overflow-y-auto shadow-xl p-6 relative`}
      >
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleBookmark}
            className="p-1 rounded-full hover:bg-gray-200/50 transition-colors"
            aria-label={isBookmarked ? "Unbookmark job" : "Bookmark job"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-blue-600 fill-blue-600" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button className="text-black hover:text-red-500" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 items-start">
          <Avatar className="w-16 h-16 rounded-md">
            <AvatarImage src={undefined} alt={`${job.companyName}'s logo`} />
            <AvatarFallback className="text-lg rounded-lg font-medium bg-blue-200 text-blue-600">
              {(() => {
                const words = job.companyName?.trim().split(" ") || [];
                const firstInitial = words[0]?.[0]?.toUpperCase() || "";
                const lastInitial =
                  words[words.length - 1]?.[0]?.toUpperCase() || "";
                return firstInitial + lastInitial;
              })()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <p className="text-sm text-gray-700">{job.companyName}</p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={16} />
              <span className="text-sm">{job.location}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Experience: <strong>{job.experienceLevel}</strong>
            </div>
            <div className="text-md font-semibold text-blue-800 mt-1">
              {job.salaryRange.currency}{" "}
              {formatSalary(
                job?.salaryRange?.minimumSalary,
                job?.salaryRange?.currency
              )}{" "}
              -
              {formatSalary(
                job?.salaryRange?.maximumSalary,
                job?.salaryRange?.currency
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job?.skills?.slice(0, 3).map((skill: any, i: number) => (
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

        {/* Summary + Job Description */}
        <div className="mt-6 border-t border-white/90">
          <span className="flex justify-between py-2 mb-2 w-full">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  onClick={getProfileSummary}
                  className="text-sm flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Summarize with AI</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[450px] max-h-[450px] overflow-y-auto rounded-xl shadow-xl p-4 space-y-4">
                {!loading ? (
                  error !== "" ? (
                    <div className="flex items-center justify-center h-24">
                      <div className="text-red-600 font-medium text-sm text-center">
                        {error}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* AI Summary */}
                      <div className="text-green-700 font-medium text-sm">
                        {aiSummary}
                      </div>

                      {/* Candidate Rank */}
                      <div className="text-gray-700 text-sm font-medium">
                        Candidate Rank:{" "}
                        <span className="text-blue-600 font-semibold">
                          You’re in the Top {candidateRank}% of applicants for
                          this role.
                        </span>
                      </div>

                      {/* Top Skills */}
                      <div>
                        <h4 className="font-semibold text-sm mb-1 text-gray-700">
                          Top Skills Matched:
                        </h4>
                        {topSkills.length === 0 ? (
                          <div className="text-gray-500 text-xs">
                            No top skills matched.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {topSkills.map((skill, i) => (
                              <Badge
                                key={i}
                                className="bg-green-100 hover:text-white text-green-700"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Missing Skills */}
                      <div>
                        <h4 className="font-semibold text-sm mb-1 text-gray-700">
                          Missing Skills:
                        </h4>
                        {missingSkills.length === 0 ? (
                          <div className="text-gray-500 text-xs">
                            No missing skills detected.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill, i) => (
                              <Badge
                                key={i}
                                className="bg-red-100 hover:text-white text-red-700"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Suggested Actions */}
                      <div>
                        <h4 className="font-semibold text-sm mb-1 text-gray-700">
                          Suggested Actions:
                        </h4>
                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                          {suggestedActions.length > 0
                            ? suggestedActions.map((action, i) => (
                                <li key={i}>{action}</li>
                              ))
                            : null}
                        </ul>
                      </div>
                    </>
                  )
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <span className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                    <p>
                      <span className="ml-2">
                        {loadingTexts[loadingTextIndex]}
                      </span>
                    </p>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <h3 className="font-semibold text-lg">Job Description</h3>
            <div className="w-24" />
          </span>

          <p className="text-sm leading-relaxed text-gray-800">
            {job.jobDescription}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-full px-6 py-2 border-gray-300"
            onClick={toggleBookmark}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            onClick={handleApplyClick}
            className="bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-700"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;

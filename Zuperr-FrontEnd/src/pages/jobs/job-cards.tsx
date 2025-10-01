/* eslint-disable no-nested-ternary */
import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { useDistance } from "@src/hooks/useDistance";
import { Button } from "@components/ui/button";

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

// --- Helper Functions (can be moved to a utils file) ---
const formatDate = (isoDate: string): string => {
  if (!isoDate) return "Unknown Date";
  const date = new Date(isoDate);
  return isNaN(date.getTime())
    ? "Invalid Date"
    : `${date.getDate()} ${date.toLocaleString("en-GB", {
        month: "long",
      })} ${date.getFullYear()}`;
};

const formatSalary = (
  amount: string | number,
  currency: string = "INR"
): string => {
  const numericAmount =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^\d.]/g, ""))
      : amount;

  if (isNaN(numericAmount)) return "N/A";

  const formatters = {
    INR: [
      { threshold: 1_00_00_000, divisor: 1_00_00_000, suffix: "CPA" },
      { threshold: 1_00_000, divisor: 1_00_000, suffix: "LPA" },
      { threshold: 1_000, divisor: 1_000, suffix: "TPA" },
    ],
    USD: [
      { threshold: 1_000_000, divisor: 1_000_000, suffix: "M" },
      { threshold: 1_000, divisor: 1_000, suffix: "K" },
    ],
  };

  const rules = formatters[currency as keyof typeof formatters];
  if (rules) {
    for (const rule of rules) {
      if (numericAmount >= rule.threshold) {
        return `${(numericAmount / rule.divisor).toFixed(
          currency === "INR" && rule.suffix === "CPA" ? 2 : 0
        )} ${rule.suffix}`;
      }
    }
  }
  return `${numericAmount}`;
};

const getInitials = (name?: string): string => {
  if (!name) return "";
  const words = name.trim().split(" ");
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase();
};

// --- Component Props ---
interface JobCardProps {
  job: IJob;
  onCardClick: (job: IJob) => void;
  onApply: (jobId: string) => void;
}

// --- The Memoized JobCard Component ---
const JobCard: React.FC<JobCardProps> = React.memo(
  ({
    job,
    onCardClick,
    onApply,
  }: {
    job: IJob;
    onCardClick: (job: IJob) => void;
    onApply: (jobId: string) => void;
  }) => {
    const userLocation = localStorage.getItem("user_location") || "";
    const distance = useDistance(userLocation, job.location);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleApplyClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onApply(job._id);
    };

    const companyInitials = React.useMemo(
      () => getInitials(job.companyName),
      [job.companyName]
    );

    // const savedDistance = Number(
    //   localStorage.getItem("locationDistance") || null
    // );

    const Wrapper = job.isSponsored ? motion.div : "div";

    return (
      <Wrapper
        {...(job.isSponsored && {
          whileHover: { scale: 1.02 },
          transition: { duration: 0.3 },
        })}
      >
        <Card
          onClick={() => onCardClick(job)}
          className={`h-auto flex flex-col rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
            job.isSponsored
              ? "border-2 border-yellow-400 bg-yellow-50 hover:shadow-yellow-300"
              : `${job.bgColor}`
          }`}
        >
          <CardHeader className="border-b-2 border-b-white flex-row justify-between items-center px-4 py-2">
            <Badge className="text-xs text-white bg-blue-500 px-2 py-1 rounded-full">
              {job.jobCategory}
            </Badge>
            {job.isSponsored && (
              <Badge className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full ml-auto">
                Sponsored
              </Badge>
            )}
            {job.createdAt && (
              <Badge className="w-fit rounded-full bg-[#F9F9F9] p-2 hover:bg-inherit">
                <span className="text-[#717171] font-normal">
                  {formatDate(job.createdAt.toString())}
                </span>
              </Badge>
            )}
          </CardHeader>

          <CardContent className="flex-1 p-4 flex flex-col gap-2">
            <div className="flex flex-col gap-3">
              <div className="relative w-fit">
                <Avatar
                  className={`w-16 h-16 rounded-md ${
                    job.isSponsored ? "ring-2 ring-yellow-400" : ""
                  }`}
                >
                  <AvatarImage
                    src={undefined}
                    alt={`${job.companyName}'s logo`}
                  />
                  <AvatarFallback className="text-lg rounded-lg font-medium bg-blue-200 text-blue-600">
                    {companyInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-lg font-semibold text-wrap break-words">
                {job.title}
              </CardTitle>
            </div>

            <div className="text-sm text-black font-medium">
              {job.companyName ?? "--"}
            </div>

            <div className="flex items-center gap-1">
              <MapPin className="h-[15px]" />
              <span className="text-sm">{job.location}</span>
              {job.location.toLocaleLowerCase() === "remote" ? (
                <Badge className="text-xs text-white bg-gray-500 px-2 py-1 rounded-full ml-2">
                  Remote
                </Badge>
              ) : distance === null ? (
                <Badge className="text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
                  ...
                </Badge>
              ) : (
                distance >= 0 && (
                  <Badge className="text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
                    {distance.toFixed(1)} KM
                  </Badge>
                )
              )}
            </div>

            <p className="text-sm">
              Experience:{" "}
              <span className="ml-3 font-semibold">
                {job.experienceLevel} Yrs
              </span>
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {job.skills?.slice(0, 3).map((skill) => (
                <Badge
                  key={skill._id}
                  className="rounded-full border border-gray-200 bg-gray-100 text-gray-600 text-xs px-2 py-1"
                >
                  {skill.Name}
                </Badge>
              ))}
              {job.skills?.length > 3 && (
                <Badge className="rounded-full border border-gray-200 bg-gray-100 text-gray-400 text-xs px-2 py-1">
                  +{job.skills.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between p-4 border-t-2 border-t-[#E0E0E0]">
            <div className="flex flex-col">
              <div className="font-semibold text-md">
                {job.salaryRange.currency}{" "}
                {formatSalary(
                  job.salaryRange.minimumSalary,
                  job.salaryRange.currency
                )}{" "}
                -{" "}
                {formatSalary(
                  job.salaryRange.maximumSalary,
                  job.salaryRange.currency
                )}
              </div>
              <div className="font-medium text-sm text-[#B2B2B2]">CTC</div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className={`mt-2 px-6 py-2 rounded-full transition-all duration-200 ${
                  job.isSponsored
                    ? "text-white bg-yellow-500 hover:bg-yellow-600"
                    : "text-white bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => onCardClick(job)}
              >
                View Details
              </Button>
            </motion.div>
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className={`mt-2 px-6 py-2 rounded-full transition-all duration-200 ${
                  job.isSponsored
                    ? "text-white bg-yellow-500 hover:bg-yellow-600"
                    : "text-white bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleApplyClick}
              >
                Apply
              </Button>
            </motion.div> */}
          </CardFooter>
        </Card>
      </Wrapper>
    );
  }
);

export default JobCard;

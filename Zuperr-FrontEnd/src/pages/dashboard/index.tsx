/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Card } from "@components/ui/card";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  Area,
} from "recharts";
import { Skeleton } from "@components/ui/skeleton";
import { get } from "@api/index";
import { motion, useMotionValue, animate } from "framer-motion";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../../base-components/dateRangePicker/dateRangePicker";
import { format, subDays } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Label } from "@components/ui/label";
import ApplicantChart from "./ApplicantChart";
import ApplicantStatusChart from "./ApplicantStatusChart";

// Type definitions
interface ChartData {
  _id: string | null;
  count: number;
}

interface ApplicantStatusData extends ChartData {
  _id: string | null;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const COLORS = [
  "#FF9800", // New Applied
  "#1976D2", // Shortlisted
  "#9C27B0", // In-Review
  "#009688", // Reject
  "#8BC34A", // Hire
];

// Animation variants for cards
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      onUpdate: (latest) => {
        setDisplay(Math.round(latest));
      },
    });
    return controls.stop;
  }, [value, count]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-muted-foreground font-bold mt-2 border border-muted-foreground w-20 rounded-xl text-center p-2"
    >
      {display}
    </motion.span>
  );
};

const DashboardHeader: React.FC = () => (
  <motion.div
    initial={{
      x: -100,
      opacity: 0,
    }}
    animate={{
      x: 0,
      opacity: 1,
    }}
    transition={{ duration: 0.8 }}
    className="mb-8 border-b pb-8 border-black"
  >
    <h1 className="text-3xl font-bold text-black">Dashboard View</h1>
  </motion.div>
);

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // All data states
  const [jobs, setJobs] = useState<any[]>([]);
  const [allMetrics, setAllMetrics] = useState<{
    totalJobs: number;
    jobsByCategory: ChartData[];
    applicantStatus: ApplicantStatusData[];
    topSkills: ChartData[];
    applicationsTrend: ChartData[];
    applicationStatusBreakdown: ChartData[];
    totalApplicantTrend: ChartData[];
  }>({
    totalJobs: 0,
    jobsByCategory: [],
    applicantStatus: [],
    topSkills: [],
    applicationsTrend: [],
    applicationStatusBreakdown: [],
    totalApplicantTrend: [],
  });

  // Fetch all data on initial load
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const [
          jobsRes,
          totalJobsRes,
          jobsByCategoryRes,
          applicantStatusRes,
          topSkillsRes,
          applicationsTrendRes,
        ] = await Promise.all([
          get<any[]>(`/employer/get-jobs/${userId}`),
          get<{ totalJobs: number }>(`/dashboard/total-jobs/${userId}`),
          get<ChartData[]>(`/dashboard/jobs-by-category/${userId}`),
          get<ApplicantStatusData[]>(`/dashboard/applicant-status/${userId}`),
          get<ChartData[]>(`/dashboard/top-skills/${userId}`),
          get<ChartData[]>(`/dashboard/applications-trend/${userId}`),
        ]);

        setJobs(jobsRes);
        setAllMetrics((prev) => ({
          ...prev,
          totalJobs: totalJobsRes.totalJobs,
          jobsByCategory: jobsByCategoryRes,
          applicantStatus: applicantStatusRes,
          topSkills: topSkillsRes,
          applicationsTrend: applicationsTrendRes,
        }));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Fetch filtered data when job title or date range changes
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        setLoading(true);

        const params = new URLSearchParams({
          jobTitle: selectedJobTitle,
          ...(dateRange?.from && {
            startDate: format(dateRange.from, "yyyy-MM-dd"),
          }),
          ...(dateRange?.to && { endDate: format(dateRange.to, "yyyy-MM-dd") }),
        });

        const [breakdownRes, trendRes] = await Promise.all([
          get<ChartData[]>(
            `/dashboard/application-status-breakdown/${userId}?${params}`
          ),
          get<ChartData[]>(
            `/dashboard/total-applicant-trend/${userId}?${params}`
          ),
        ]);

        setAllMetrics((prev) => ({
          ...prev,
          applicationStatusBreakdown: breakdownRes,
          totalApplicantTrend: trendRes,
        }));
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [dateRange, selectedJobTitle]);

  // Calculate derived metrics
  const { totalJobViews, totalApplicants } = useMemo(() => {
    let views = 0;
    let applicants = 0;

    if (selectedJobTitle === "all") {
      views = jobs.reduce((acc, job) => acc + (job.jobViewsCount || 0), 0);
      applicants = allMetrics.applicantStatus.reduce(
        (acc, curr) => acc + curr.count,
        0
      );
    } else {
      const selectedJob = jobs.find((job) => job.title === selectedJobTitle);
      views = selectedJob?.jobViewsCount || 0;
      // For applicants, we'd ideally have this filtered from the API, but using the breakdown as fallback
      applicants = allMetrics.applicationStatusBreakdown.reduce(
        (acc, curr) => acc + curr.count,
        0
      );
    }

    return { totalJobViews: views, totalApplicants: applicants };
  }, [
    jobs,
    selectedJobTitle,
    allMetrics.applicantStatus,
    allMetrics.applicationStatusBreakdown,
  ]);

  if (loading) return <DashboardSkeleton />;

  const chartData = allMetrics.applicationStatusBreakdown.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="min-h-screen w-full py-4 px-8">
      <Card className="space-y-6 p-6">
        <DashboardHeader />

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div>
            <Label>Select Period</Label>
            <DateRangePicker
              value={dateRange}
              onChange={(range: any) => setDateRange(range)}
              className="border-primary"
            />
          </div>
          <div>
            <Label>Select Job Title</Label>
            <Select
              onValueChange={setSelectedJobTitle}
              value={selectedJobTitle}
            >
              <SelectTrigger className="w-full sm:w-64 border-muted-foreground text-muted-foreground">
                <SelectValue placeholder="Select Job Title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job._id} value={job.title}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <MetricCard
            title="Total Jobs"
            value={allMetrics.totalJobs}
            icon={<BriefcaseIcon className="h-6 w-6 text-blue-500" />}
          />
          <MetricCard
            title="Job Views"
            value={totalJobViews}
            icon={<CategoryIcon className="h-6 w-6 text-emerald-500" />}
          />
          <MetricCard
            title="Total Applicants"
            value={totalApplicants}
            icon={<UsersIcon className="h-6 w-6 text-amber-500" />}
          />
        </motion.div>

        <span className="my-4"></span>
        <div className="space-y-6">
          <Label className="text-xl font-bold">
            Application Status Breakdown
          </Label>
          {totalApplicants > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Applicant Status">
                <ResponsiveContainer width="100%" height={300}>
                  <ApplicantStatusChart data={chartData} />
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Total Applicant Vs Days">
                <ResponsiveContainer width="100%" height={300}>
                  <ApplicantChart data={allMetrics.totalApplicantTrend} />
                </ResponsiveContainer>
              </ChartCard>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No applicants found for the selected criteria.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Reusable Components (keep these the same as in your original code)
const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="h-full"
  >
    <div className="p-6 transition-all h-full">
      <div className="w-full h-[300px] sm:h-[350px]">{children}</div>
    </div>
  </motion.div>
);

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => (
  <motion.div variants={cardVariants}>
    <div className="flex flex-col">
      <Label className="text-sm text-muted-foreground">{title}</Label>
      <AnimatedCounter value={value} />
    </div>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen p-8 bg-muted/40">
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Skeleton className="h-32 rounded-xl bg-muted/50" />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
          >
            <Card className="p-6">
              <Skeleton className="h-6 w-1/3 mb-4 bg-muted" />
              <Skeleton className="w-full h-[300px] bg-muted/50" />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// Icons (keep these the same as in your original code)
const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

export default Dashboard;

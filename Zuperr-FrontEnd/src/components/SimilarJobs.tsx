import React, { useEffect, useState } from "react";
import { get } from "@api/index";
import { Layers } from "lucide-react";
import JobCard from "@src/pages/jobs/job-cards";
import { IJob } from "@src/pages/jobs";

interface SimilarJobsProps {
  jobId: string;
  onJobClick: (job: IJob) => void;
}

const SimilarJobs: React.FC<SimilarJobsProps> = ({ jobId, onJobClick }) => {
  const [similarJobs, setSimilarJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        setLoading(true);
        const response: any = await get(`/employee/jobs/similar/${jobId}`);
        if (response.success) {
          setSimilarJobs(response.similarJobs || []);
        }
      } catch (error) {
        console.error("Error fetching similar jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchSimilarJobs();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Similar Jobs</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!similarJobs.length) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Similar Jobs</h3>
        <span className="text-sm text-gray-500">
          You might also be interested in
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {similarJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onClick={() => onJobClick(job)}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;

import React, { useEffect, useState } from "react";
import { get } from "@api/index";
import { useToast } from "@src/hooks/use-toast";
import { Sparkles } from "lucide-react";
import JobCard from "@src/pages/jobs/job-cards";
import { IJob } from "@src/pages/jobs";

interface JobRecommendationsProps {
  onJobClick: (job: IJob) => void;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({
  onJobClick,
}) => {
  const [recommendations, setRecommendations] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response: any = await get("/employee/jobs/recommendations");
        if (response.success) {
          setRecommendations(response.recommendations || []);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        // Don't show error toast if user is not authenticated
        // as recommendations are optional
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold">Recommended for You</h2>
        <span className="text-sm text-gray-500">
          Based on your profile and preferences
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onClick={() => onJobClick(job)}
          />
        ))}
      </div>
    </section>
  );
};

export default JobRecommendations;

"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@components/ui/card";
import { cn } from "@lib/utils";
import { get } from "@api/index";

function BadgeCard({
  title,
  rating,
  stars,
  theme,
}: {
  title: string;
  rating: number;
  stars: number;
  theme: "gold" | "silver" | "bronze";
}) {
  const colors = {
    gold: "from-[#f5d442] to-[#f9c425]",
    silver: "from-[#e0e0e0] to-[#bdbdbd]",
    bronze: "from-[#e09c63] to-[#d1834b]",
  };

  return (
    <div
      className={cn(
        "relative p-6 w-60 h-72 rounded-xl shadow-lg text-center border-2",
        "flex flex-col justify-between",
        "bg-gradient-to-br",
        colors[theme]
      )}
    >
      <div className="font-bold text-md">{title} ★</div>
      <p className="text-xs leading-snug mt-2">
        Display company trust badges to attract top talent. Verified employee,
        secure application process, equal opportunity, and employee review build
        credibility.
      </p>

      <div className="mt-3">
        <div className="bg-black text-white inline-block px-4 py-2 rounded-full text-xs font-semibold mb-2">
          {rating}/10
          <span className="ml-2">
            {Array.from({ length: stars }).map((_, idx) => (
              <span key={idx}>★</span>
            ))}
          </span>
        </div>

        <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-bold mt-1 transform rotate-[-5deg]">
          TRUSTED BRAND
        </div>
      </div>
    </div>
  );
}

type TrustMetrics = {
  profileCompleteness: number;
  verifiedDocuments: number;
  responseTime: number;
  jobFulfillment: number;
};

type TrustBadge = {
  theme: "gold" | "silver" | "bronze" | "none";
  rating: number;
  stars: number;
};

export default function CompanyTrustBadges() {
  const employerId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [metrics, setMetrics] = useState<TrustMetrics | null>(null);
  const [badge, setBadge] = useState<TrustBadge | null>(null);

  useEffect(() => {
    if (!employerId) return;
    const fetchTrustData = async () => {
      try {
        const res: any = await get(`/employer/${employerId}`);
        if (res?.data) {
          console.log("Fetched trust data:", res.data);
          setMetrics(res.data[0].trustMetrics || null);
          setBadge(res.data[0].trustBadge || null);
        }
      } catch (err) {
        console.error("Failed to fetch trust data:", err);
      }
    };
    fetchTrustData();
  }, [employerId]);

  if (!metrics) {
    return <div className="p-6 text-gray-500">Loading trust badges...</div>;
  }

  const metricList = [
    {
      label: "Profile completeness",
      value: metrics.profileCompleteness,
      color: "blue",
    },
    {
      label: "Verified documents",
      value: metrics.verifiedDocuments,
      color: "green",
    },
    {
      label: "Response time to applicants",
      value: metrics.responseTime,
      color: "orange",
    },
    {
      label: "Job fulfillment rate",
      value: metrics.jobFulfillment,
      color: "purple",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h2 className="text-2xl font-semibold">Company Trust Badges</h2>

      {/* Trust Metrics */}
      <Card className="p-6 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {metricList.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={188.5}
                    strokeDashoffset={188.5 - (item.value / 10) * 188.5}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                  {item.value}/10
                </div>
              </div>
              <div className="text-sm">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Main Badge */}
        {badge && ["gold", "silver", "bronze"].includes(badge.theme) && (
          <div className="flex justify-center mt-10">
            <BadgeCard
              title="ZUPERR"
              rating={badge.rating}
              stars={badge.stars}
              theme={badge.theme as "gold" | "silver" | "bronze"}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

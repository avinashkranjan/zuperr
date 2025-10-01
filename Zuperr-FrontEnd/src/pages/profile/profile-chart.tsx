/* eslint-disable no-nested-ternary */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";
import React, { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { get } from "@api/index";

const ProfileChart = () => {
  const [activeFilter, setActiveFilter] = useState("7days");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const range =
          activeFilter === "7days" ? 7 : activeFilter === "30days" ? 30 : 90;
        const response: any = await get(
          `/employee/getcandidateactivity/${range}`
        );

        const formatted = response.data.map((item: any) => ({
          name: item.day.toString(),
          applications: item.applied,
          views: item.statusChanged,
        }));

        setChartData(formatted);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    fetchApplications();
  }, [activeFilter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-6">Profile Performance</h3>

      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              name="Job Applications"
              type="monotone"
              dataKey="applications"
              stroke="#8AE28A"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              name="Status Changes"
              type="monotone"
              dataKey="views"
              stroke="#FFDE21"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Brush dataKey="name" height={30} stroke="#3B82F6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-6 gap-4 font-semibold">
        {["7days", "30days", "90days"].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            onClick={() => setActiveFilter(filter)}
            className={activeFilter === filter ? "bg-blue-600 text-white" : ""}
          >
            {filter === "7days"
              ? "7 Days"
              : filter === "30days"
              ? "Last 30 Days"
              : "Last 90 Days"}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProfileChart;

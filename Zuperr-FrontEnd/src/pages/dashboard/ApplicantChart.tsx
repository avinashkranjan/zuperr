"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";
const CustomDot = (props: any) => {
  const { cx, cy, value } = props;
  const showLabel = value === 4; // Label only the max value
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="white"
        stroke="#16a34a"
        strokeWidth={3}
      />
      {showLabel && (
        <foreignObject x={cx - 20} y={cy - 40} width={60} height={30}>
          <div className="text-xs bg-white px-2 py-1 rounded shadow font-semibold text-black text-center">
            {value}
          </div>
        </foreignObject>
      )}
    </>
  );
};

const ApplicantChart = ({ data }: { data: any[] }) => (
  <div className="w-full h-[300px] p-4 rounded-xl">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 30, right: 30, left: 0, bottom: 30 }}
      >
        <defs>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        {/* Y Axis with Label */}
        <YAxis tick={{ fill: "#888" }}>
          <Label
            value="Total Applicants"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle", fill: "#888", fontSize: 14 }}
          />
        </YAxis>

        {/* X Axis with Label */}
        <XAxis dataKey="date" tick={{ fill: "#888" }}>
          <Label
            value="Dates"
            position="insideBottom"
            offset={-10}
            style={{ fill: "#888", fontSize: 14 }}
          />
        </XAxis>

        <Tooltip
          contentStyle={{ borderRadius: "8px", backgroundColor: "#fff" }}
          formatter={(value) => [`${value}`, "Applicants"]}
        />

        <Area
          type="monotone"
          dataKey="count"
          stroke="#16a34a"
          fillOpacity={1}
          fill="url(#greenGradient)"
          dot={<CustomDot />}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default ApplicantChart;

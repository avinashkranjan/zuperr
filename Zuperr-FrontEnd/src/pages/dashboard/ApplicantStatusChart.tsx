"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";

// Match your image’s colors
const COLORS = {
  "New Applied": "#f97316",
  Shortlisted: "#3b82f6",
  "Under Review": "#a855f7",
  Hire: "#84cc16",
  Reject: "#0f766e",
};

const GLOWS = {
  "New Applied": "drop-shadow(0 0 8px #f97316aa)",
  Shortlisted: "drop-shadow(0 0 8px #3b82f6aa)",
  "Under Review": "drop-shadow(0 0 8px #a855f7aa)",
  Hire: "drop-shadow(0 0 8px #84cc16aa)",
  Reject: "drop-shadow(0 0 8px #0f766eaa)",
};

const CustomLegend = ({ data }: { data: any[] }) => (
  <ul className="flex flex-wrap justify-center gap-6 mt-6">
    {data.map((entry) => (
      <li key={entry.name} className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{
            backgroundColor: COLORS[entry.name as keyof typeof COLORS],
          }}
        />
        <span className="text-sm font-medium">{entry.name}</span>
      </li>
    ))}
  </ul>
);

const ApplicantStatusChart = ({ data }: { data: any[] }) => (
  <div className="w-full max-w-lg mx-auto p-4">
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={70}
          outerRadius={100}
          startAngle={180}
          endAngle={-180}
          paddingAngle={6}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[entry.name as keyof typeof COLORS]}
              style={{ filter: GLOWS[entry.name as keyof typeof GLOWS] }}
            />
          ))}
          <Label value="" position="centerBottom" className="text-center" />
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: "8px", backgroundColor: "#fff" }}
          formatter={(value, name) => [`${value}`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
    <CustomLegend data={data} />
  </div>
);

export default ApplicantStatusChart;

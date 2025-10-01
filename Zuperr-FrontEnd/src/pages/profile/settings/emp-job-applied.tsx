"use client";

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Card } from "@components/ui/card";

const jobs = Array(6).fill({
  title: "Senior UI/UX Designer",
  company: "Amazon",
  location: "Dombivli (East)",
  distance: "Approx distance",
  experience: "3–5 years",
  skills: ["Figma", "Adobe XD", "Prototype"],
  salary: "₹ 6–8.5 LPA",
  date: "20 May, 2023",
});

export default function EmpSavedAppliedJobs() {
  const [tab, setTab] = useState("saved");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {/* Tabs Header */}
        <TabsList className="bg-transparent p-0 mb-4 border-b border-gray-200">
          <TabsTrigger
            value="saved"
            className={`px-4 py-2 rounded-none border-b-2 ${
              tab === "saved"
                ? "border-black font-semibold"
                : "border-transparent"
            }`}
          >
            Saved Jobs
          </TabsTrigger>
          <TabsTrigger
            value="applied"
            className={`px-4 py-2 rounded-none border-b-2 ${
              tab === "applied"
                ? "border-black font-semibold"
                : "border-transparent"
            }`}
          >
            Applied Jobs
          </TabsTrigger>
        </TabsList>

        {/* Search Bar and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm rounded-full px-6"
          />
          <div className="flex gap-4 items-center text-sm text-gray-500">
            <span className="cursor-pointer">Sort</span>
            <span className="cursor-pointer">🗑️ Bin</span>
          </div>
        </div>

        {/* Job Cards Grid */}
        <TabsContent value="saved">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
            {jobs.map((job, idx) => (
              <JobCard key={idx} job={job} isApplied={false} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applied">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
            {jobs.map((job, idx) => (
              <JobCard key={idx} job={job} isApplied />
            ))}
          </div>
        </TabsContent>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 text-sm pt-4">
          <span className="text-muted-foreground cursor-pointer">Previous</span>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
                n === 1
                  ? "bg-orange-100 text-black font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {n}
            </span>
          ))}
          <span className="text-muted-foreground cursor-pointer">Next</span>
        </div>
      </Tabs>
    </div>
  );
}

function JobCard({ job, isApplied }: { job: any; isApplied: boolean }) {
  return (
    <Card
      className={`rounded-xl p-4 space-y-2 shadow-sm border ${
        isApplied ? "bg-green-50" : ""
      }`}
    >
      <div className="text-xs text-gray-500">{job.date}</div>
      <div className="flex justify-between items-start gap-4">
        <img
          src="/amazon.png"
          alt="company"
          className="w-12 h-12 object-contain rounded"
        />
        <div className="flex-1 space-y-1">
          <h3 className="text-base font-semibold">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <div className="flex items-center gap-2 text-sm">
            <span>📍 {job.location}</span>
            <span className="bg-[#8D6E63] text-white text-xs px-2 py-0.5 rounded">
              {job.distance}
            </span>
          </div>
          <div className="text-sm">Experience: {job.experience}</div>
          <div className="flex gap-2 flex-wrap">
            {job.skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="border text-xs rounded px-2 py-0.5 bg-gray-100"
              >
                {skill}
              </span>
            ))}
            <span className="text-sm text-muted-foreground">...</span>
          </div>
        </div>
        <div className="text-xl">🔖</div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <span className="font-medium text-sm">
          {job.salary}{" "}
          <span className="text-xs text-muted-foreground">CTC</span>
        </span>
        <Button className="text-white bg-blue-600 rounded-full px-6 h-8 text-sm">
          Apply
        </Button>
      </div>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Card, CardContent } from "@components/ui/card";
import ProfileJobPosts from "./profile-job-posts";

const SavedCandidateCard = () => (
  <Card className="w-full max-w-xs border rounded-xl shadow-sm">
    <CardContent className="p-4 flex flex-col gap-2">
      <div className="font-semibold text-sm text-gray-700">
        Job : UI/UX Designer
      </div>
      <div className="text-sm font-medium">Aman Gupta</div>
      <div className="text-sm text-gray-600">Experience : 3 years</div>
      <div className="text-sm text-gray-600">Last Active : Yesterday</div>
      <div className="text-sm text-gray-600">
        Tag : Good fit / Follow-up later
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <Button className="flex-1 text-white">Download</Button>
        <Button className="flex-1 text-white">Application View</Button>
      </div>
    </CardContent>
  </Card>
);

export default function CandidateManagement() {
  const [demoCandidates, setDemoCandidates] = useState(false);

  return (
    <div className="mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Candidate Management</h2>

      <Card>
        <CardContent className="p-4">
          <Accordion type="multiple" defaultValue={["saved", "history"]}>
            {/* ========== Saved Candidates ========== */}
            <AccordionItem value="saved">
              <AccordionTrigger className="font-semibold text-lg">
                Saved Candidates
              </AccordionTrigger>
              <AccordionContent>
                {demoCandidates ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <SavedCandidateCard key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center text-gray-500 p-8">
                    <p className="text-base">No Candidates Saved</p>
                    <Button
                      variant="outline"
                      onClick={() => setDemoCandidates(true)}
                    >
                      Show Demo Candidates
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* ========== Job History ========== */}
            <AccordionItem value="history">
              <AccordionTrigger className="font-semibold text-lg">
                Job History (Active/Closed Jobs)
              </AccordionTrigger>
              <AccordionContent>
                <Tabs defaultValue="active">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">Active Jobs</TabsTrigger>
                    <TabsTrigger value="closed">Closed Jobs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active">
                    <ProfileJobPosts />
                  </TabsContent>

                  <TabsContent value="closed">
                    <div className="text-center text-gray-500">
                      No closed jobs yet.
                    </div>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

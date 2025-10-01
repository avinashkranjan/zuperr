import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import LegalLayout from "./layout";

export default function AboutUs() {
  return (
    <LegalLayout>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">What is Zuperr?</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Welcome to Zuperr, where hiring meets innovation! We&apos;re
            transforming how job seekers, employers, and placement agencies
            connect—creating a smarter, faster, and more localized recruitment
            experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Discover What Makes Us Unique
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">AI-Powered Matching</h3>
                <p className="text-muted-foreground">
                  Our algorithms analyze profiles for accurate matches by
                  skills, experience, and cultural fit.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">
                  Personalized Recommendations
                </h3>
                <p className="text-muted-foreground">
                  Zuperr learns from your behavior to suggest roles tailored to
                  your goals and preferences.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">Simplify Hiring</h3>
                <p className="text-muted-foreground">
                  Keep communication smooth with our smart response management
                  tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p className="text-muted-foreground max-w-4xl mx-auto">
            To simplify recruitment by connecting businesses with skilled local
            talent, making hiring faster, more efficient, and more
            impactful—while supporting communities and real growth.
          </p>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground max-w-4xl mx-auto">
            To leverage AI-driven solutions to provide employers easy access to
            qualified local candidates, while offering job seekers a streamlined
            path to meaningful opportunities.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Our Values</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline">Integrity & Nobility</Badge>
            <Badge variant="outline">Sustainability & Innovation</Badge>
            <Badge variant="outline">Excellence & Resilience</Badge>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">AI-Powered Matching</h3>
                <p className="text-muted-foreground">
                  Smart, fast, and precise matchmaking between jobs and
                  candidates.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">Automated Screening</h3>
                <p className="text-muted-foreground">
                  Instantly identify the top candidates and save hours of manual
                  screening.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Gain valuable insights into your recruitment pipeline and
                  performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}

import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import LegalLayout from "../layout";

export default function TrustSafetyPolicy() {
  return (
    <LegalLayout>
      <div className="container mx-auto p-6 text-sm text-gray-800">
        <h1 className="text-xl font-semibold mb-4">
          Employee Side: Trust &amp; Safety
        </h1>

        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="mb-4">
              Zuperr is committed to maintaining a secure, respectful, and
              trustworthy environment for all Employees (“you” or “User”) using
              our platform. This Trust &amp; Safety Policy outlines your
              responsibilities, prohibited conduct, and how we address
              violations to ensure your safety and fair treatment.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              1. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Provide truthful, accurate, and complete information in your
                profile and job applications.
              </li>
              <li>
                Respect other users, including Employers and fellow job seekers.
              </li>
              <li>Use the platform solely for lawful job-seeking purposes.</li>
              <li>
                Protect your account credentials and report any unauthorized
                access.
              </li>
              <li>
                Promptly report any suspicious or harmful behavior encountered
                on the platform.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              2. Prohibited Conduct
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Submission of fraudulent, misleading, or false information.
              </li>
              <li>
                Harassment, discrimination, or abuse toward Employers or other
                Users.
              </li>
              <li>
                Engaging in or promoting illegal activities, including identity
                theft or document forgery.
              </li>
              <li>Sharing explicit, offensive, or inappropriate content.</li>
              <li>
                Attempting to manipulate or game the platform’s algorithms or
                systems.
              </li>
              <li>Impersonating other individuals or entities.</li>
              <li>
                Circumventing security measures or accessing unauthorized data.
              </li>
              <li>
                Using the platform for commercial solicitation unrelated to
                job-seeking.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              3. Reporting and Enforcement
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Users can report violations via the in-app reporting feature or
                by contacting support@zuperr.co
              </li>
              <li>
                Reports will be reviewed promptly and investigated thoroughly.
              </li>
              <li>
                Zuperr reserves the right to suspend, restrict, or permanently
                ban accounts found violating this policy.
              </li>
              <li>
                Serious offenses may be reported to law enforcement or relevant
                authorities.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              4. User Safety Measures
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                We employ advanced monitoring tools and AI to detect suspicious
                or harmful behavior.
              </li>
              <li>
                Personal data sharing is controlled and limited to legitimate
                recruitment interactions.
              </li>
              <li>
                We advise Users to avoid sharing sensitive personal details
                beyond the platform’s secure channels.
              </li>
              <li>
                Guidance on safe job search practices is provided through
                educational resources.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              5. Appeals and Dispute Resolution
            </h2>
            <p>
              Users may appeal enforcement actions by submitting a written
              request to support@zuperr.co within 14 days of notification.
              Appeals will be reviewed fairly and resolved in a timely manner.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              6. Platform Moderation
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Zuperr reserves the right to moderate content and user
                interactions to uphold safety and compliance.
              </li>
              <li>
                Automated and manual review systems will be used to identify and
                remove harmful content.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2">
              7. Policy Updates
            </h2>
            <p>
              This policy may be updated periodically to address emerging risks
              and improve protections. Users will be notified of significant
              changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </LegalLayout>
  );
}

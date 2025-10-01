import { Card, CardContent } from "../../../components/ui/card";
import React from "react";
import LegalLayout from "../layout";

export default function EmployerTrustSafety() {
  return (
    <LegalLayout>
      <main className="container mx-auto p-6 md:p-10">
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="space-y-8 p-8 text-gray-900 leading-relaxed text-sm sm:text-base">
            <header className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                Trust &amp; Safety Policy
              </h1>
              <p className="text-gray-600">
                Zuperr strives to provide Employers (“you” or “Employer”) with a
                reliable, professional, and secure recruitment environment. This
                Trust &amp; Safety Policy defines your obligations, prohibited
                behaviors, and enforcement procedures to maintain platform
                integrity and candidate protection.
              </p>
            </header>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                1. EMPLOYER RESPONSIBILITIES
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Provide accurate and lawful company information during
                  registration and job postings.
                </li>
                <li>Conduct recruitment practices ethically and fairly.</li>
                <li>
                  Respect candidates’ privacy and avoid discriminatory or
                  abusive behavior.
                </li>
                <li>
                  Protect login credentials and promptly report any unauthorized
                  access.
                </li>
                <li>
                  Use candidate data exclusively for legitimate recruitment
                  purposes.
                </li>
                <li>
                  Promptly address candidate grievances related to hiring
                  processes conducted via the platform.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                2. PROHIBITED CONDUCT
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Posting fraudulent, discriminatory, or misleading job
                  advertisements.
                </li>
                <li>
                  Harassment, threats, or abuse of candidates or other Users.
                </li>
                <li>
                  Using candidate data for unauthorized purposes, including
                  resale or spamming.
                </li>
                <li>
                  Manipulating platform systems, such as falsifying recruitment
                  outcomes.
                </li>
                <li>
                  Impersonation of other companies or misrepresentation of job
                  roles.
                </li>
                <li>
                  Soliciting candidates for activities unrelated to the posted
                  job or platform purpose.
                </li>
                <li>Breaching confidentiality or data protection laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                3. REPORTING AND ENFORCEMENT
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Employers can report suspicious or inappropriate behavior by
                  Users or other Employers to{" "}
                  <a
                    href="mailto:support@zuperr.co"
                    className="text-blue-600 underline"
                  >
                    support@zuperr.co
                  </a>
                </li>
                <li>
                  Zuperr will investigate complaints impartially and enforce
                  penalties including warnings, account suspension, or permanent
                  bans.
                </li>
                <li>
                  Serious violations may be escalated to law enforcement or
                  regulatory agencies.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                4. DATA AND CANDIDATE PROTECTION
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Employers must handle candidate information responsibly,
                  ensuring compliance with applicable data privacy laws.
                </li>
                <li>
                  Candidate data access is monitored and restricted to
                  authorized personnel.
                </li>
                <li>
                  We provide tools to manage candidate data securely and support
                  data retention compliance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                5. DISPUTE RESOLUTION AND APPEALS
              </h2>
              <p>
                Employers subject to enforcement actions may appeal by
                submitting a formal request to{" "}
                <a
                  href="mailto:support@zuperr.co"
                  className="text-blue-600 underline"
                >
                  support@zuperr.co
                </a>{" "}
                within 14 days. Appeals are reviewed transparently, with
                outcomes communicated promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                6. PLATFORM OVERSIGHT
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Zuperr reserves the right to monitor job postings and Employer
                  activities to prevent abuse and maintain quality standards.
                </li>
                <li>
                  Content or accounts violating this policy will be removed or
                  restricted as necessary.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                7. POLICY REVIEW AND UPDATES
              </h2>
              <p>
                We may revise this Trust &amp; Safety Policy to adapt to
                evolving challenges and regulatory requirements. Employers will
                be notified of significant updates.
              </p>
            </section>

            <footer className="pt-6 border-t border-gray-200 text-gray-600 text-sm">
              <p>Contact for Trust &amp; Safety issues:</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:support@zuperr.co"
                  className="text-blue-600 underline"
                >
                  support@zuperr.co
                </a>
              </p>
              <p>Postal Address: Mumbai, Maharashtra, India</p>
            </footer>
          </CardContent>
        </Card>
      </main>
    </LegalLayout>
  );
}

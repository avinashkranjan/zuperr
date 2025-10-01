import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import LegalLayout from "../layout";

export default function TermsAndConditions() {
  return (
    <LegalLayout>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Employee: Terms & Conditions
        </h1>

        <Card className="shadow-lg">
          <CardContent className="space-y-6 p-6 text-sm sm:text-base text-gray-800 leading-relaxed">
            <p className="text-gray-700">
              These Terms and Conditions (&quot;Terms&quot;) govern the access
              to and use of Zuperr’s services by Employees, Job Seekers,
              Workers, and Applicants (collectively, “Users”). By registering an
              account or using Zuperr’s platform and services, you
              (&quot;Employee&quot; or &quot;User&quot;) agree to comply with
              all terms set forth herein. Failure to comply may result in
              suspension, account termination, or legal consequences.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. ELIGIBILITY AND REGISTRATION
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Users must be individuals legally eligible to work in India or
                  any jurisdiction where Zuperr operates and must be at least 18
                  years old.
                </li>
                <li>
                  By registering on Zuperr, Users certify that all information
                  provided is true, accurate, and complete.
                </li>
                <li>
                  Zuperr reserves the right to verify identity and may restrict
                  accounts pending verification.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. DEFINITIONS
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Zuperr:</strong> AI-powered job matching platform
                  based in India.
                </li>
                <li>
                  <strong>Employee / User:</strong> Anyone using Zuperr to find
                  jobs or gigs.
                </li>
                <li>
                  <strong>AI Matching Engine:</strong> Zuperr’s intelligent
                  system recommending jobs.
                </li>
                <li>
                  <strong>Profile:</strong> Your personal job-seeking profile on
                  Zuperr.
                </li>
                <li>
                  <strong>Hyperlocal Matching:</strong> Location-based job
                  search feature.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. USER ACCOUNT RESPONSIBILITIES
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Maintain confidentiality of credentials.</li>
                <li>Keep profile info accurate and current.</li>
                <li>Use the platform legally and ethically.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                4. JOB SEARCH AND APPLICATION
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>You may apply for jobs at your discretion.</li>
                <li>No job or offer is guaranteed by Zuperr.</li>
                <li>Verify employer legitimacy independently.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                5. USE OF AI AND LOCATION-BASED SERVICES
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>AI uses your data to improve job matches.</li>
                <li>Location services enhance nearby results.</li>
                <li>You consent to use of location data.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                6. USER CONDUCT AND PROHIBITIONS
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>No fraudulent, illegal, or harassing behavior.</li>
                <li>No manipulation of listings or algorithms.</li>
                <li>Do not share confidential employer data.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                7. PRIVACY AND DATA PROTECTION
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Handled per Zuperr’s Privacy Policy.</li>
                <li>Shared only with relevant employers.</li>
                <li>Do not upload sensitive/unlawful content.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                8. INTELLECTUAL PROPERTY
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Zuperr content is protected.</li>
                <li>No reuse or reproduction without consent.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                9. PREMIUM SERVICES AND FEES
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Paid upgrades available.</li>
                <li>Fees and policies are subject to change.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                10. LIMITATION OF LIABILITY AND DISCLAIMERS
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>No guarantee of jobs or employer behavior.</li>
                <li>Use the platform at your own risk.</li>
                <li>Zuperr disclaims liability from misuse.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                11. ACCOUNT SUSPENSION AND TERMINATION
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Zuperr may suspend/terminate without notice.</li>
                <li>Fraud or complaints may trigger removal.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                12. GRIEVANCE REDRESSAL
              </h3>
              <p>
                For concerns or complaints, contact us at:
                <br />
                <span className="block mt-1">
                  Email:{" "}
                  <a
                    href="mailto:support@zuperr.co"
                    className="text-blue-600 underline"
                  >
                    support@zuperr.co
                  </a>
                </span>
                <span className="block">
                  Postal Address: Mumbai, Maharashtra, India
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                13. GOVERNING LAW AND JURISDICTION
              </h3>
              <p>
                These Terms are governed by Indian law. Disputes will be handled
                under the jurisdiction of Mumbai, India.
              </p>
            </div>

            <p className="mt-6 font-medium text-gray-800">
              By using Zuperr, you acknowledge that you have read, understood,
              and agree to these Terms and Conditions.
            </p>
          </CardContent>
        </Card>
      </section>
    </LegalLayout>
  );
}

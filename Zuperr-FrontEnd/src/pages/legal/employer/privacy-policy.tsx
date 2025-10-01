import { Card } from "../../../components/ui/card";
import React from "react";
import LegalLayout from "../layout";

export default function EmployerPrivacyPolicy() {
  return (
    <LegalLayout>
      <main className="container mx-auto p-6 md:p-10">
        <Card className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employer Privacy Policy
          </h1>

          <p className="text-gray-700 dark:text-gray-300">
            Zuperr (“we,” “our,” or “us”) respects the privacy of Employers
            (“you” or “Employer”) who use our platform to post jobs, source
            candidates, and manage recruitment activities. This Privacy Policy
            details how we collect, use, share, and protect your personal and
            business information.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              1. INFORMATION WE COLLECT
            </h2>

            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              1.1 Business Information
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
              <li>
                Company name, registration details (e.g., GST, PAN, Certificate
                of Incorporation)
              </li>
              <li>Contact information of authorized representatives</li>
              <li>Billing and payment information</li>
              <li>Recruitment activity logs and job postings</li>
            </ul>

            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              1.2 User Credentials and Activity Data
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We gather data on login activities, IP addresses, device
              information, and usage patterns.
            </p>

            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              1.3 Communications
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Records of communications exchanged on the platform between
              Employers and Candidates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              2. HOW WE USE YOUR INFORMATION
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We utilize your data to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>
                Provide recruitment platform services, including job posting and
                candidate matching
              </li>
              <li>Verify employer legitimacy and compliance with laws</li>
              <li>Manage billing, payments, and subscription services</li>
              <li>Communicate account updates, offers, and notifications</li>
              <li>
                Enhance platform security and detect fraudulent activities
              </li>
              <li>Fulfill legal and regulatory obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              3. DATA SHARING AND DISCLOSURE
            </h2>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              3.1 With Candidates
            </h3>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              Candidate profiles and applications shared with you are accessible
              only for legitimate recruitment purposes.
            </p>

            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              3.2 Service Providers
            </h3>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              We engage trusted third parties for payment processing, hosting,
              analytics, and customer support, bound by strict confidentiality
              and data protection obligations.
            </p>

            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              3.3 Legal Compliance
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Disclosure to authorities when required by law or to protect legal
              rights, safety, and platform integrity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              4. DATA RETENTION
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Employer data will be retained as long as your account remains
              active or as required for legal or business purposes. Upon account
              closure, data will be deleted or anonymized except where retention
              is mandated by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              5. SECURITY MEASURES
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We apply robust security protocols, including encryption, secure
              servers, and continuous monitoring, to protect your business and
              personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              6. YOUR RIGHTS AND CHOICES
            </h2>
            <p className="text-gray-700 dark:text-gray-300">You may request:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>Access, correction, or deletion of your personal data</li>
              <li>
                Restriction or objection to certain data processing activities
              </li>
            </ul>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Contact{" "}
              <a
                href="mailto:support@zuperr.co"
                className="text-blue-600 hover:underline"
              >
                support@zuperr.co
              </a>{" "}
              for any such requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              7. COOKIES AND TRACKING TECHNOLOGIES
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Cookies and tracking tools are used to improve service delivery,
              user experience, and platform analytics. Employers can manage
              preferences through browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              8. INTERNATIONAL DATA TRANSFERS
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Employer data may be processed or stored internationally where
              service providers operate, safeguarded in compliance with
              applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              9. CHANGES TO THIS POLICY
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right to amend this Privacy Policy. Notice of
              material changes will be provided through platform updates or
              email communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              10. CONTACT INFORMATION
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              For privacy-related questions or complaints:
              <br />
              Email:{" "}
              <a
                href="mailto:support@zuperr.co"
                className="text-blue-600 hover:underline"
              >
                support@zuperr.co
              </a>
              <br />
              Postal Address: Mumbai, Maharashtra, India
            </p>
          </section>
        </Card>
      </main>
    </LegalLayout>
  );
}

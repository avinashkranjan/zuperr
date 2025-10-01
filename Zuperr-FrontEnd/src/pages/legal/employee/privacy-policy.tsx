import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import LegalLayout from "../layout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy (Employee)</h1>

        <Card>
          <CardContent className="space-y-6 p-6 text-sm sm:text-base text-gray-800 leading-relaxed">
            <p className="text-gray-700">
              Zuperr (“we,” “our,” or “us”) values your privacy and is committed
              to protecting your personal information. This Privacy Policy
              explains how we collect, use, store, and protect the personal data
              of Employees (“you” or “User”) who register and use Zuperr’s
              platform and services.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. INFORMATION WE COLLECT
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Personal Information:</strong> Name, DOB, gender,
                  contact details, identity documents, education, skills,
                  resume, location data, login info.
                </li>
                <li>
                  <strong>Usage Data:</strong> Platform interactions,
                  device/browser info, cookies, and IP address.
                </li>
                <li>
                  <strong>Sensitive Data:</strong> Caste, disability status,
                  government IDs where legally required.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. HOW WE USE YOUR INFORMATION
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Deliver job matching and communication services.</li>
                <li>Verify identity and qualifications.</li>
                <li>Enhance platform experience with AI-driven features.</li>
                <li>
                  Meet legal requirements and send account updates or
                  promotional content (with consent).
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. DATA SHARING AND DISCLOSURE
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>With Employers:</strong> Profile and application data
                  for recruitment purposes.
                </li>
                <li>
                  <strong>With Service Providers:</strong> Under strict
                  confidentiality (e.g., hosting, analytics).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Government or regulatory
                  disclosures as required.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                4. DATA RETENTION
              </h3>
              <p>
                Personal data is retained as long as needed for the intended
                purpose or legal requirements. Data is deleted or anonymized
                after account deletion or extended inactivity, unless retained
                for compliance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                5. SECURITY MEASURES
              </h3>
              <p>
                We employ encryption, secure infrastructure, and regular audits
                to safeguard your data from unauthorized access or misuse.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                6. YOUR RIGHTS AND CHOICES
              </h3>
              <p>You may have the right to:</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>Access, correct, or delete your data</li>
                <li>Restrict or object to processing</li>
                <li>Withdraw consent</li>
                <li>Request data portability</li>
              </ul>
              <p>
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:support@zuperr.co"
                  className="text-blue-600 underline"
                >
                  support@zuperr.co
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                7. COOKIES AND TRACKING TECHNOLOGIES
              </h3>
              <p>
                Cookies are used for performance, analytics, and
                personalization. You can manage preferences through your browser
                settings.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                8. CHILDREN’S PRIVACY
              </h3>
              <p>
                Zuperr is not intended for individuals under 18. Any discovered
                data from minors will be promptly deleted.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                9. INTERNATIONAL DATA TRANSFERS
              </h3>
              <p>
                If you access Zuperr outside India, your data may be transferred
                to and processed in India or other countries under compliant
                safeguards.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                10. CHANGES TO THIS POLICY
              </h3>
              <p>
                This policy may be updated to reflect legal, technological, or
                business changes. Users will be notified of major changes via
                email or app alerts.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                11. CONTACT INFORMATION
              </h3>
              <p>
                For questions or complaints:
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
          </CardContent>
        </Card>
      </section>
    </LegalLayout>
  );
}

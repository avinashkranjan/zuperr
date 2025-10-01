import { Card, CardContent } from "../../../components/ui/card";
import React from "react";
import LegalLayout from "../layout";

export default function EmployerTermsConditions() {
  return (
    <LegalLayout>
      <main className="container mx-auto p-6 md:p-10">
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="space-y-8 p-8 text-gray-900 leading-relaxed text-sm sm:text-base">
            <header className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                Terms &amp; Conditions
              </h1>
              <p className="text-gray-600">
                These Terms and Conditions govern the access and use of Zuperr’s
                services by Employers (as defined below). By registering an
                account or posting job opportunities through the platform, you
                (the “Employer”) agree to abide by all the terms contained
                herein. Failure to comply may result in account suspension,
                legal consequences, or permanent termination.
              </p>
            </header>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                1. ELIGIBILITY AND VERIFICATION
              </h2>
              <p>
                1.1 Only legally recognized and duly registered business
                entities, firms, partnerships, or individuals authorized to
                recruit on behalf of such entities may create an Employer
                account on Zuperr.
              </p>
              <p>
                1.2 Zuperr reserves the right to request identity and
                registration documents (including but not limited to GST
                registration, PAN, Certificate of Incorporation, Trade License,
                and other relevant certificates) at any time before or after
                account creation. Full functionality of the account may be
                restricted until such verification is completed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. DEFINITIONS</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Employer:</strong> Any individual, company, recruiter,
                  staffing agency, or legal representative that creates an
                  account on Zuperr for sourcing candidates, posting job
                  vacancies, interacting with job seekers, or accessing
                  recruitment-related features. Employers must comply with
                  applicable laws including Indian labor, taxation, and
                  corporate laws.
                </li>
                <li>
                  <strong>Job Post:</strong> A job listing or advertisement
                  created by an Employer through Zuperr, describing employment
                  opportunities with clearly defined parameters including job
                  title, description, location, employment type, compensation,
                  eligibility, and terms.
                </li>
                <li>
                  <strong>AI Matching Engine:</strong> Zuperr’s proprietary AI
                  system evaluating job posts and candidate profiles via machine
                  learning, behavioral analytics, location data, and historical
                  insights to suggest matches. AI results are indicative only;
                  no warranties on accuracy or suitability.
                </li>
                <li>
                  <strong>Recruiter Dashboard:</strong> Secure, account-specific
                  digital interface for Employers to create/manage job listings,
                  review candidates, communicate, and access AI recommendations.
                </li>
                <li>
                  <strong>Candidate Profile:</strong> Aggregated structured job
                  seeker data including personal details, skills, education,
                  experience, resume, preferences, and location. Access granted
                  solely for recruitment.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                3. ACCOUNT RESPONSIBILITIES
              </h2>
              <p>
                3.1 Employers must ensure all information provided during
                registration and platform use is accurate, current, and
                complete.
              </p>
              <p>
                3.2 Employer accounts must be used solely for lawful hiring
                activities. Soliciting investments, marketing, or personal gain
                outside recruitment is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                4. JOB POSTING STANDARDS
              </h2>
              <p>4.1 All job postings must:</p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Be authentic, clearly written, and non-deceptive.</li>
                <li>
                  Comply with applicable Indian labor laws including Equal
                  Remuneration Act, The Code on Wages, and others.
                </li>
                <li>
                  Explicitly mention job role, responsibilities, skills,
                  location, salary range (if disclosed), employment type, and
                  other terms.
                </li>
              </ul>
              <p>
                4.2 Zuperr reserves the right to refuse, modify, or remove
                listings that are fraudulent, exploitative, misleading,
                incomplete, offensive, discriminatory, or suspected of violating
                laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                5. USE OF AI TOOLS AND HYPERLOCAL FEATURES
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Employers can use Zuperr’s AI tools for recommending
                  candidates based on relevance, location, skills, and
                  engagement history.
                </li>
                <li>
                  Hyperlocal filters and geofencing help reach candidates within
                  a selected geographic radius.
                </li>
                <li>
                  Zuperr disclaims liability for decisions or hires made solely
                  based on AI recommendations.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                6. PREMIUM EMPLOYER SERVICES
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Premium services include access to filtered candidate
                  databases, featured job listings, custom branding, analytics,
                  and ATS integration.
                </li>
                <li>Fees/pricing are subject to change with advance notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                7. PAYMENT, INVOICING, AND REFUND POLICY
              </h2>
              <p>
                7.1 Payments are processed via approved encrypted gateways;
                invoices sent to registered email.
              </p>
              <p>
                7.2 Refunds apply only for verified technical failures or
                unauthorized charges.
              </p>
              <p>
                7.3 Subscription cancellations must be made 7 calendar days
                before the next billing cycle to avoid auto-renewal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                8. LEGAL COMPLIANCE AND ETHICAL CONDUCT
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Employers must comply with Indian labor laws, minimum wage
                  regulations, equal opportunity mandates, and ethical hiring.
                </li>
                <li>
                  Prohibition on demands for deposits, gifts, or personal favors
                  from candidates.
                </li>
                <li>
                  Misconduct may result in suspension, ban, reporting to
                  authorities, or legal action.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                9. DATA USAGE AND PROTECTION
              </h2>
              <p>
                9.1 Candidate information must be used only for recruitment and
                per data protection laws.
              </p>
              <p>
                9.2 Employers cannot sell, transfer, share candidate data
                without consent or store beyond necessity; violations lead to
                termination and legal action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                10. COMMUNICATION AND INTERACTION
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  All communication must be professional, job-related,
                  respectful, and conducted via Zuperr unless otherwise agreed.
                </li>
                <li>
                  Redirecting candidates outside the platform without consent is
                  prohibited.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                11. TERMINATION AND ACCOUNT BAN
              </h2>
              <p>
                Zuperr may suspend, restrict, or disable Employer accounts
                without prior notice for breaches, fraudulent postings,
                falsified documents, repeated complaints, or unethical conduct.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                12. GRIEVANCE REDRESSAL
              </h2>
              <p>Employers may contact the Grievance Officer at:</p>
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
              <p>
                Resolution Timeline: Within 15 business days of complaint
                receipt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                13. GOVERNING LAW AND JURISDICTION
              </h2>
              <p>
                These Terms are governed by Indian law, with exclusive
                jurisdiction in Mumbai courts.
              </p>
              <p>By using Zuperr, you acknowledge acceptance of these Terms.</p>
            </section>
          </CardContent>
        </Card>
      </main>
    </LegalLayout>
  );
}

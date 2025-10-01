import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTypedSelector } from "../../src/redux/rootReducer";
import { AppSidebar } from "@base-components/Sidebar";

// Static pages
import HelpAndSupport from "@src/pages/help-and-support/help-and-support";
import Faqs from "@src/pages/faqs/faqs";
import BlogGrid from "@src/pages/blogs/blogs";
import BlogPage from "@src/pages/blogs/single-blog";
import LoginSecurityPage from "@src/pages/profile-settings/login-security";
import RecruiterPreferences from "@src/pages/profile-settings/recruiter-settings";
import BillingPage from "@src/pages/profile-settings/billing-page";
import CandidateManagement from "@src/pages/profile-settings/candidate-mangement";
import PrivacyVisibilityToggle from "@src/pages/profile-settings/privacy-settings";
import CompanyForm from "@src/pages/profile-settings/account-settings/company-settings";
import HiringPreferences from "@src/pages/profile-settings/account-settings/hiring-preference";
import RecruiterProfileForm from "@src/pages/profile-settings/account-settings/hr-profile";
import CompanyTrustBadges from "@src/pages/profile-settings/account-settings/trust-badges";
import EmpLoginSecurityPage from "@src/pages/profile/settings/emp-login-security";
import EmpPrivacyVisibilityToggle from "@src/pages/profile/settings/emp-privacy-settings";
import EmpJobPreferencesForm from "@src/pages/profile/settings/emp-job-preference";
import EmpSavedAppliedJobs from "@src/pages/profile/settings/emp-job-applied";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/dashboard"));
const Jobs = lazy(() => import("../pages/job-analytics/Jobs"));
const EmployeeJobs = lazy(() => import("../pages/jobs"));
const JobDetails = lazy(() => import("../pages/job-analytics/JobDetails"));
const CreateResume = lazy(() => import("../pages/create-resume"));
const Companies = lazy(() => import("../pages/company"));
const Profile = lazy(() => import("../pages/profile"));
const JobPost = lazy(() => import("../pages/job-analytics/JobPost"));
const Candidates = lazy(() => import("../pages/candidates"));
const Pacific = lazy(() => import("../pages/pacific"));
const SponsoredJobPost = lazy(() => import("../pages/sponsored"));

// Fallback 404 page
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <h1 className="text-3xl font-bold">404 - Not Found</h1>
    <p className="text-gray-500 mt-2">
      The page you are looking for does not exist.
    </p>
  </div>
);

const PageContainer: React.FC = () => {
  const { userType } = useTypedSelector((state) => state.App.sessionInfo);

  const isEmployer = userType === "employer";
  const isEmployee = userType === "employee";

  const [isProfile, setIsProfile] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setIsProfile(path.startsWith("/emp/account"));
  }, [location]);

  return (
    <div className="flex w-full h-full container mx-auto">
      {isEmployer && <AppSidebar />}
      {isEmployee && isProfile && <AppSidebar />}
      <main className="flex-1 p-4">
        <Suspense
          fallback={<div className="text-center py-10">Loading...</div>}
        >
          <Routes>
            {/* Redirect based on role after signin */}
            <Route
              path="/signin"
              element={
                <Navigate to={isEmployee ? "/jobs" : "/dashboard"} replace />
              }
            />

            {/* Common routes */}
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/blogs" element={<BlogGrid />} />
            <Route path="/blogs/:slug" element={<BlogPage />} />

            {/* Employee routes */}
            {isEmployee && (
              <>
                <Route path="/" element={<Navigate to="/jobs" replace />} />
                <Route path="/jobs" element={<EmployeeJobs />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/create-resume" element={<CreateResume />} />
                <Route
                  path="/analytics"
                  element={<Profile activeTabWindow="activity" />}
                />
                <Route
                  path="/profile"
                  element={<Profile activeTabWindow="view-and-edit" />}
                />
                <Route
                  path="/profile"
                  element={<Profile activeTabWindow="view-and-edit" />}
                />
                <Route
                  path="/emp/account/login-security"
                  element={<EmpLoginSecurityPage />}
                />
                <Route
                  path="/emp/account/preferences"
                  element={<EmpJobPreferencesForm />}
                />
                <Route
                  path="/emp/account/saved-applied-jobs"
                  element={<EmpSavedAppliedJobs />}
                />
                <Route
                  path="/emp/account/privacy"
                  element={<EmpPrivacyVisibilityToggle />}
                />
              </>
            )}

            {/* Employer routes */}
            {isEmployer && (
              <>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/job-analytics"
                  element={<Navigate to="/job-analytics/jobs" replace />}
                />
                <Route path="/job-analytics/jobs" element={<Jobs />} />
                <Route
                  path="/job-analytics/job-details"
                  element={<JobDetails />}
                />
                <Route path="/job-post" element={<JobPost />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/pacific" element={<Pacific />} />
                <Route path="/sponsored" element={<SponsoredJobPost />} />
                <Route path="/helpAndSupport" element={<HelpAndSupport />} />
                <Route
                  path="/account/login-security"
                  element={<LoginSecurityPage />}
                />
                <Route
                  path="/account/preferences"
                  element={<RecruiterPreferences />}
                />
                <Route path="/account/billing" element={<BillingPage />} />
                <Route
                  path="/account/candidates"
                  element={<CandidateManagement />}
                />
                <Route
                  path="/account/privacy"
                  element={<PrivacyVisibilityToggle />}
                />
                <Route path="/profile/company-info" element={<CompanyForm />} />
                <Route
                  path="/profile/hr-profile"
                  element={<RecruiterProfileForm />}
                />
                <Route
                  path="/profile/hiring-preferences"
                  element={<HiringPreferences />}
                />
                <Route
                  path="/profile/trust-badge"
                  element={<CompanyTrustBadges />}
                />
              </>
            )}

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default PageContainer;

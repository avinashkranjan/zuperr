/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import { Home, BarChart, Users, TrendingUp } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Job Analytics",
    url: "/job-analytics",
    icon: BarChart,
  },
  {
    title: "Candidates",
    url: "/candidates",
    icon: Users,
  },
  {
    title: "Sponsored",
    url: "/sponsored",
    icon: TrendingUp,
  },
];

const accountItems = [
  {
    title: "Login & Security",
    url: "/account/login-security",
  },
  {
    title: "Recruiter Preferences",
    url: "/account/preferences",
  },
  {
    title: "Billing & Subscription",
    url: "/account/billing",
  },
  {
    title: "Candidate Management",
    url: "/account/candidates",
  },
  {
    title: "Privacy & Visibility",
    url: "/account/privacy",
  },
];

const accountItemsEmp = [
  {
    title: "Login & Security",
    url: "/emp/account/login-security",
  },
  {
    title: "Job Preferences",
    url: "/emp/account/preferences",
  },
  {
    title: "Saved & Applied Jobs",
    url: "/emp/account/saved-applied-jobs",
  },
  {
    title: "Privacy & Visibility",
    url: "/emp/account/privacy",
  },
];

const profileItems = [
  {
    title: "Company Information",
    url: "/profile/company-info",
  },
  {
    title: "Recruiter/ HR Profile",
    url: "/profile/hr-profile",
  },
  {
    title: "Hiring Preferences",
    url: "/profile/hiring-preferences",
  },
  {
    title: "Company Trust Badge",
    url: "/profile/trust-badge",
  },
];

export function AppSidebar() {
  const [isProfile, setIsProfile] = useState("dashboard");

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setIsProfile(
      path.startsWith("/emp/account")
        ? "empaccount"
        : path.startsWith("/profile")
        ? "profile"
        : path.startsWith("/account")
        ? "account"
        : "dashboard"
    );
  }, [location]);

  return (
    <div className="flex gap-4">
      {/* Sidebar */}
      <aside className="h-[40rem] w-72 bg-white text-black rounded-b-md shadow-sm mb-4">
        <nav className="space-y-2">
          {isProfile === "empaccount"
            ? accountItemsEmp.map((item, index) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center justify-center px-3 py-3 transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                    } ${index === 0 ? "rounded-b-md" : "rounded-md"}`
                  }
                >
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              ))
            : isProfile === "profile"
            ? profileItems.map((item, index) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center justify-center px-3 py-3 transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                    } ${index === 0 ? "rounded-b-md" : "rounded-md"}`
                  }
                >
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              ))
            : isProfile === "account"
            ? accountItems.map((item, index) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center justify-center px-3 py-3  transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                    } ${index === 0 ? "rounded-b-md" : "rounded-md"}`
                  }
                >
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              ))
            : items.map((item, index) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center justify-center px-3 py-3 transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                    } ${index === 0 ? "rounded-b-md" : "rounded-md"}`
                  }
                >
                  <item.icon size={20} className="mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              ))}
        </nav>
      </aside>
    </div>
  );
}

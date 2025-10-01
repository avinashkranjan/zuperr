/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTypedSelector } from "@redux/rootReducer";
import CurrentLocation from "../../components/Location";
import Notifications from "./notifications";
import UserPopover from "./user";

type TNavItem = {
  name: string;
  link: string;
};

type TEmployeeNavItems = TNavItem[];
type TEmployerNavItems = TNavItem[];
interface IHeaderNavItems {
  employee: TEmployeeNavItems;
  employer: TEmployerNavItems;
}

const Header = () => {
  const userType = useTypedSelector((state) => state.App.sessionInfo.userType);

  const [activeTab, setActiveTab] = useState(
    userType === "employee" ? "Jobs" : "Dashboard"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: IHeaderNavItems = {
    employee: [
      { name: "Jobs", link: "/jobs" },
      { name: "Companies", link: "/companies" },
      { name: "Analytics", link: "/analytics?tab=activity" },
      { name: "Create Resume", link: "/create-resume" },
    ],
    employer: [
      { name: "Job Post", link: "/job-post" },
      { name: "Pacific", link: "/pacific" },
      { name: "Help & Support", link: "/helpAndSupport" },
    ],
  };

  return (
    <header className="bg-blue-600 text-white border-b border-blue-600 relative h-20">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-end md:items-center justify-between">
        <div className="relative flex items-center justify-between w-full md:w-auto mb-0">
          <Link
            to="/"
            className="text-2xl font-bold italic absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0"
          >
            Zuperr
          </Link>

          <nav className="ml-8 hidden md:flex relative">
            {navItems[userType as keyof IHeaderNavItems].map((item) => (
              <Link
                key={item.name}
                to={item.link}
                onClick={() => setActiveTab(item.name)}
                className="relative mx-3 text-blue-200 hover:text-white"
              >
                <span
                  className={`${activeTab === item.name ? "text-white" : ""}`}
                >
                  {item.name === "Pacific" ? (
                    <div className="flex items-center gap-1">
                      <span>{item.name}</span>
                      <div className="bg-gradient-to-r from-[#F9F295] to-[#B88A44] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        Premium
                      </div>
                    </div>
                  ) : (
                    item.name
                  )}
                </span>

                {activeTab === item.name && (
                  <span className="absolute bottom-0 top-12 left-0 w-full h-[2.5px] rounded-sm bg-white" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right-side Icons */}
          <div className="flex items-center gap-4 ml-auto md:hidden">
            <Notifications />
            <UserPopover />
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
          <CurrentLocation />

          <div className="hidden md:flex items-center gap-4">
            <Notifications />
            <UserPopover />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden z-50">
        <button
          className="py-2 px-3 bg-blue-500 rounded-md text-white flex items-center gap-1 absolute left-5 -mt-12 md:mt-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {isMenuOpen && (
          <nav className="md:hidden px-4 py-2 flex flex-col space-y-2 bg-blue-700 z-40">
            {navItems[userType as keyof IHeaderNavItems].map((item) => (
              <Link
                key={item.name}
                to={item.link}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsMenuOpen(false);
                }}
                className="py-2"
              >
                {item.name === "Pacific" ? (
                  <div className="flex items-center gap-1">
                    <span>{item.name}</span>
                    <div className="bg-gradient-to-r from-[#F9F295] to-[#B88A44] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      Premium
                    </div>
                  </div>
                ) : (
                  item.name
                )}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* // horizontal line */}
      <div className="absolute inset-x-0 bottom-2 h-[1px] bg-white" />
    </header>
  );
};

export default Header;

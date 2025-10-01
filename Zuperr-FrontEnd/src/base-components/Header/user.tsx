/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { JSX, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";
import { Cog, Edit, LogOut, Moon, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "@src/redux/rootReducer";

export type UserType = "employer" | "employee";

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  to?: string;
  className?: string;
  onClick?: () => void;
}

export const getUserMenuItems = (userType: UserType): MenuItem[] => [
  {
    label: "Edit & Update Profile",
    icon: <Edit />,
    to:
      userType === "employer"
        ? "/profile/company-info"
        : "/profile?tab=view-and-edit",
  },
  {
    label: "Account Settings",
    icon: <Cog />,
    to:
      userType === "employer"
        ? "/account/login-security"
        : "/emp/account/login-security",
  },
  {
    label: "Light Mode/Dark Mode",
    icon: <Moon />,
    to: "#",
  },
];

export const logoutItem: MenuItem = {
  label: "Log Out",
  icon: <LogOut />,
  className: "text-red-500",
};

export default function UserPopover() {
  const { userType } = useTypedSelector((state) => state.App.sessionInfo);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItems = getUserMenuItems(userType as "employer" | "employee");

  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    localStorage.clear();
    handleClose();
    await navigate("/");
    window.location.reload();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-8 h-8 text-white border border-white rounded-full flex items-center justify-center">
          <UserRound className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mt-7 p-2 space-y-2" align="end">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer flex px-3 py-2 rounded-md hover:bg-muted font-medium"
            onClick={() => {
              if (item.to && item.to !== "#") navigate(item.to);
              handleClose();
            }}
          >
            {item.icon}
            <span className="ml-4">{item.label}</span>
          </div>
        ))}

        <div className="border-t my-1" />

        <div
          className={`cursor-pointer flex px-3 py-2 rounded-md hover:bg-muted font-medium ${logoutItem.className}`}
          onClick={handleLogout}
        >
          {logoutItem.icon}
          <span className="ml-4">{logoutItem.label}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

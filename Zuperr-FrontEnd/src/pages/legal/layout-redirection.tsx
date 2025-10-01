import React, { useEffect } from "react";
import { useTypedSelector } from "@redux/rootReducer";
import { useLocation, useNavigate } from "react-router-dom";

export default function LayoutRedirection() {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = useTypedSelector((state) => state.App.sessionInfo.userType);

  useEffect(() => {
    if (userType === "employer") {
      navigate(`/employer-${location.pathname.replace("/", "")}`);
    } else {
      navigate(`/employee-${location.pathname.replace("/", "")}`);
    }
  }, []);

  return <div>Loading...</div>;
}

import React from "react";
import { useLocation } from "react-router-dom";
import OtpConfirmation from "@base-components/OtpConfirmation";

const SignUpOtp: React.FC = () => {
  const location = useLocation();
  const { email, userType } = location.state || {};
  return (
    <OtpConfirmation
      pagetype="Sign Up"
      otpLength={4}
      email={email}
      userType={userType}
      userID={""}
    />
  );
};

export default SignUpOtp;

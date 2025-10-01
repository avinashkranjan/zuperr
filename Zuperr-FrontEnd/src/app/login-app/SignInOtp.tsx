import React from "react";
import OtpConfirmation from "@base-components/OtpConfirmation";
import { useLocation } from "react-router-dom";

const SignInOtp: React.FC = () => {
  const location = useLocation();
  const { email, userType, userID } = location.state || {};
  return (
    <OtpConfirmation
      pagetype="Sign In"
      otpLength={4}
      email={email}
      userType={userType}
      userID={userID}
    />
  );
};

export default SignInOtp;

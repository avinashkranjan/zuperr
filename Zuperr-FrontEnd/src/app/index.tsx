import React, { Suspense, lazy } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { useTypedSelector } from "@redux/rootReducer";
import LayoutRedirection from "@src/pages/legal/layout-redirection";

const SignIn = lazy(() => import("./login-app"));
const SignUp = lazy(() => import("./signup-app"));
const BrowseApp = lazy(() => import("./browse-app"));
const SignUpOtp = lazy(() => import("./signup-app/SignUpOtp"));
const SignInOtp = lazy(() => import("./login-app/SignInOtp"));
const TrustSafetyPolicy = lazy(
  () => import("../pages/legal/employee/trust-safety-policy")
);
const TermsAndConditions = lazy(
  () => import("../pages/legal/employee/terms-and-conditions")
);
const PrivacyPolicy = lazy(
  () => import("../pages/legal/employee/privacy-policy")
);
const EmployerTrustSafety = lazy(
  () => import("../pages/legal/employer/trust-safety-policy")
);
const EmployerTermsConditions = lazy(
  () => import("../pages/legal/employer/terms-and-conditions")
);
const EmployerPrivacyPolicy = lazy(
  () => import("../pages/legal/employer/privacy-policy")
);
const AboutUs = lazy(() => import("../pages/legal/about-us"));
const ContactUs = lazy(() => import("../pages/legal/contact-us"));

const App: React.FC = () => {
  const sessionInfo = useTypedSelector((state) => state.App.sessionInfo);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router basename="/">
        <Routes>
          {sessionInfo?.sessionLoggedIn ? (
            <>
              <Route path="*" element={<BrowseApp />} />
            </>
          ) : (
            <>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin-otp" element={<SignInOtp />} />
              <Route path="/signup-otp" element={<SignUpOtp />} />
              {/* Redirect all other paths to /signin */}
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </>
          )}
          <Route path="/trust-safety" element={<LayoutRedirection />} />
          <Route path="/terms-conditions" element={<LayoutRedirection />} />
          <Route path="/privacy-policy" element={<LayoutRedirection />} />
          <Route
            path="/employee-trust-safety"
            element={<TrustSafetyPolicy />}
          />
          <Route
            path="/employee-terms-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/employee-privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/employer-trust-safety"
            element={<EmployerTrustSafety />}
          />
          <Route
            path="/employer-terms-conditions"
            element={<EmployerTermsConditions />}
          />
          <Route
            path="/employer-privacy-policy"
            element={<EmployerPrivacyPolicy />}
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;

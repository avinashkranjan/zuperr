/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { googleLogout, GoogleLogin } from "@react-oauth/google";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { ArrowRightToLineIcon } from "lucide-react";
import { useToast } from "@hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import leftPanelContent from "@base-components/LoginLeftPanel";
import { post } from "@api/index";
import { Toaster } from "@components/ui/toaster";
import Loader from "@base-components/Loader";
import { useDispatch } from "react-redux";
import ExperienceModal from "@base-components/Modal/ExperienceLevelModal";

interface LoginFormInputs {
  Email: string;
  Password: string;
}
interface SignInResponse {
  signInToken: string;
  message?: string;
  userID: string;
  userExperienceLevel: string;
}

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  { value: "employee", label: "Employee" },
  { value: "employer", label: "Employer" },
];

const Login: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ mode: "onBlur" });

  const [selectedStatus, setSelectedStatus] = useState<Status | null>(
    statuses.find((status) => status.value === "employee") || null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  // Check if URL contains token (from traditional sign-in)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userID = params.get("userID");
    const userExperienceLevel = params.get("userExperienceLevel");
    const userType = selectedStatus?.value || "employee";

    if (token && userID) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userID);
      localStorage.setItem("userType", userType);
      localStorage.setItem("sessionLoggedIn", "true");
      localStorage.setItem("sessionStarted", `${new Date()}`);

      if (userType === "employee" && !userExperienceLevel?.trim()) {
        setShowExperienceModal(true);
      } else {
        dispatch({
          type: "@@app/SET_SESSION",
          payload: {
            userId: userID,
            userType,
            sessionLoggedIn: true,
            sessionStarted: new Date(),
          },
        });
        navigate("/");
      }
    }
  }, [location, navigate, selectedStatus, dispatch]);

  // Traditional sign-in handler
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const userType = selectedStatus?.value;
      setLoader(true);
      const response = await post<SignInResponse>(`/${userType}/signin`, {
        email: data.Email,
        password: data.Password,
      });
      toast({
        title: "Success",
        description: response.message,
        variant: "success",
      });
      const { signInToken, userID, userExperienceLevel } = response;
      localStorage.setItem("authToken", signInToken);
      localStorage.setItem("userId", userID);
      localStorage.setItem("userType", userType ?? "");
      localStorage.setItem("sessionLoggedIn", "true");
      localStorage.setItem("sessionStarted", `${new Date()}`);

      if (userType === "employee" && !userExperienceLevel) {
        setShowExperienceModal(true);
      } else {
        dispatch({
          type: "@@app/SET_SESSION",
          payload: {
            userId: userID,
            userType,
            sessionLoggedIn: true,
            sessionStarted: new Date(),
          },
        });
        navigate("/");
      }
      setLoader(false);
    } catch (e) {
      setLoader(false);
      toast({
        title: "Error",
        description: `Invalid email or password ${e}`,
        variant: "destructive",
      });
    }
  };

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  // Pop-up flow for Google Login
  const handleGoogleSuccess = async (response: any) => {
    try {
      const userType = selectedStatus?.value ?? "employee";
      setLoader(true);
      // response.credential contains the token
      const backendResponse = await post<SignInResponse>(
        `${userType}/google/callback`,
        { token: response.credential, userType }
      );
      toast({
        title: "Success",
        description:
          backendResponse.message || "Google Authentication successful",
        variant: "success",
      });
      const { signInToken, userID, userExperienceLevel } = backendResponse;
      localStorage.setItem("authToken", signInToken);
      localStorage.setItem("userId", userID);
      localStorage.setItem("userType", userType);
      localStorage.setItem("sessionLoggedIn", "true");
      localStorage.setItem("sessionStarted", `${new Date()}`);
      if (selectedStatus?.value === "employee" && !userExperienceLevel) {
        setShowExperienceModal(true);
      } else {
        dispatch({
          type: "@@app/SET_SESSION",
          payload: {
            userId: userID,
            userType,
            sessionLoggedIn: true,
            sessionStarted: new Date(),
          },
        });
        navigate("/");
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      toast({
        title: "Error",
        description: "Google Authentication failed.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const handleGoogleError = () => {
    toast({
      title: "Error",
      description: "Google sign in failed",
      variant: "destructive",
    });
  };

  return (
    <>
      <Toaster />
      {loader ? (
        <Loader />
      ) : (
        <Card className="h-full w-screen p-0 overflow-hidden font-[Poppins]">
          <div className="flex h-full w-full flex-col md:flex-row">
            {leftPanelContent()}
            <div className="h-full w-full md:w-1/2 md:mx-24 flex flex-col justify-center items-center p-5 md:p-14 overflow-hidden">
              <div className="mb-5 md:absolute md:top-2 md:right-5 flex gap-2 sm:gap-4 justify-end items-center">
                <Button className="primary text-white w-full sm:w-auto md:px-2 md:py-1 md:text-sm lg:px-4 lg:py-2 lg:text-base">
                  <ArrowRightToLineIcon className="mr-2" /> Log In
                </Button>
                <Select
                  onValueChange={(value) => {
                    setSelectedStatus(
                      statuses.find((status) => status.value === value) || null
                    );
                  }}
                  defaultValue={selectedStatus?.value}
                >
                  <SelectTrigger className="w-full sm:w-auto border-primary text-primary">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <h2 className="md:mt-6 text-2xl sm:text-3xl font-semibold font-['Poppins'] my-1 md:self-start">
                Zuperr Sign In
              </h2>
              <p className="text-md md:text-base font-medium font-['Poppins'] text-gray-500 mb-6 md:self-start">
                To Zuperr
              </p>
              {!profile ? (
                <div className="w-full mb-3">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={profile.picture}
                    alt="User"
                    className="rounded-full mx-auto w-16 h-16 mb-4"
                  />
                  <p className="text-lg font-semibold">{profile.name}</p>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <Button
                    onClick={logOut}
                    className="bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 w-full mt-4"
                  >
                    Log out
                  </Button>
                </div>
              )}
              <p className="text-md md:text-base font-medium font-['Poppins'] text-gray-500 mb-6 flex items-center justify-center w-full">
                <span className="w-[20%] lg:w-[32%] border-t border-gray-500"></span>
                <span className="mx-4">Or Continue with</span>
                <span className="w-[20%] lg:w-[32%] border-t border-gray-500"></span>
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center w-full"
              >
                <div className="mb-4 w-full">
                  <Input
                    className={`w-full ${errors.Email ? "border-red-500" : ""}`}
                    type="email"
                    placeholder="Email"
                    {...register("Email", { required: "Email is required" })}
                  />
                  {errors.Email && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.Email.message}
                    </p>
                  )}
                </div>
                <div className="mb-4 w-full">
                  <div className="relative w-full">
                    <Input
                      className={`w-full ${
                        errors.Password ? "border-red-500" : ""
                      }`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("Password", {
                        required: "Password is required",
                      })}
                    />
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>

                  {errors.Password && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.Password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 w-full"
                >
                  Sign In
                </Button>
              </form>
              <p className="text-xs text-center mt-5 text-gray-500">
                Have Trouble Logging In?{" "}
                <span className="text-[#1877f2] font-bold cursor-pointer">
                  Get help
                </span>
              </p>
              <p className="text-xs text-center mt-5 text-gray-500">
                Don’t have an account?{" "}
                <NavLink replace={true} to={"/signup"}>
                  <span className="text-[#1877f2] font-bold cursor-pointer">
                    Sign Up
                  </span>
                </NavLink>
              </p>
            </div>
          </div>
        </Card>
      )}
      {showExperienceModal && <ExperienceModal />}
    </>
  );
};

export default Login;

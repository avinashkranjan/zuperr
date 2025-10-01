/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import leftPanelContent from "@base-components/LoginLeftPanel";
import { post } from "@api/index";
import { useToast } from "@src/hooks/use-toast";
import Loader from "@base-components/Loader";
import { Toaster } from "@components/ui/toaster";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { ArrowRightToLineIcon } from "lucide-react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useDispatch } from "react-redux";

interface SignupFormInputs {
  FirstName: string;
  LastName: string;
  companyName: string;
  Email: string;
  MobileNo: number;
  Password: string;
  ConfirmPassword: string;
  gstNo: string;
}
interface SignUpResponse {
  message?: string;
  status?: number;
  data?: any;
  OTP?: number;
  SignupToken: string;
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

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormInputs>({ mode: "onBlur" });

  const [showPassword, setShowPassword] = useState(false);

  //----------------------> Use States
  const [profile, setProfile] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(
    statuses.find((status) => status.value === "employee") || null
  );
  const [isGSTVerified, setIsGSTVerified] = useState<boolean>(false);
  const [gstName, setGstName] = useState<string>("");
  const [gstSearching, setGstSearching] = useState<boolean>(false);

  //----------------------> Callbacks

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      setLoader(true);
      let response;
      if (selectedStatus?.value === "employer") {
        console.log("Employer Sign-Up", isGSTVerified);
        // if (!isGSTVerified) {
        //   setLoader(false);
        //   toast({
        //     title: "Error",
        //     description: "Please verify your GST number before proceeding.",
        //     variant: "destructive",
        //   });
        //   return;
        // }
        response = await post<SignUpResponse>(
          `${selectedStatus?.value}/signup`,
          {
            firstname: data?.FirstName,
            lastname: data.LastName,
            email: data.Email,
            mobilenumber: data.MobileNo,
            gstNumber: data.gstNo,
            password: data.Password,
          }
        );
      } else if (selectedStatus?.value === "employee") {
        response = await post<SignUpResponse>(
          `${selectedStatus?.value}/signup`,
          {
            firstname: data?.FirstName,
            lastname: data.LastName,
            email: data.Email,
            mobilenumber: data.MobileNo,
            password: data.Password,
          }
        );
      }

      if (response?.message === "OTP sent to provided email" && response?.OTP) {
        setLoader(false);
        toast({
          title: "Success",
          description: "OTP sent to provided email",
          variant: "success",
        });
        const { SignupToken } = response;
        localStorage.setItem("authToken", SignupToken);
        navigate("/signup-otp", {
          state: {
            email: data.Email,
            userType: selectedStatus?.value,
          },
        });
      } else {
        setLoader(false);
        toast({
          title: "Error",
          description: `${response?.message}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);
      setLoader(false);
      toast({
        title: "Error",
        description: `${error?.response?.data?.message}`,
        variant: "destructive",
      });
    }
  };

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  //----------------------> Google Sign-Up Handler (Pop‑Up Flow)
  const handleGoogleSignupSuccess = async (response: any) => {
    try {
      const userType = selectedStatus?.value || "employee";
      setLoader(true);
      // response.credential contains the token returned by Google
      const backendResponse = await post<SignUpResponse>(
        `${userType}/google/signup`,
        { token: response.credential, userType }
      );
      toast({
        title: "Success",
        description: backendResponse.message || "Google Sign-Up Successful",
        variant: "success",
      });

      const { SignupToken, userID } = backendResponse;
      localStorage.setItem("authToken", SignupToken);
      localStorage.setItem("userId", userID);
      localStorage.setItem("userType", userType);
      localStorage.setItem("sessionLoggedIn", "true");
      localStorage.setItem("sessionStarted", `${new Date()}`);

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

      setLoader(false);
    } catch (err: any) {
      setLoader(false);
      toast({
        title: "Error",
        description: `${err?.response.data.message}`,
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const handleGoogleError = () => {
    toast({
      title: "Error",
      description: "Google sign up failed",
      variant: "destructive",
    });
  };

  async function handleGSTVerification(gstNo: string) {
    try {
      setGstSearching(true);
      const response = await post<any>("employer/validate-gst", {
        gstNumber: gstNo,
      });
      setIsGSTVerified(response.success);
      setGstName(response.gstDetails.lgnm || "");

      toast({
        title: "GST Verification",
        description: response.success
          ? "GST number is valid."
          : "GST number is invalid.",
        variant: response.success ? "success" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${error?.response?.data?.message}`,
        variant: "destructive",
      });
    } finally {
      setGstSearching(false);
    }
  }

  //----------------------> UseEffects
  // If needed, you can add an effect here to check query parameters (if any) similar to your sign-in component

  return loader ? (
    <Loader />
  ) : (
    <>
      <Toaster />
      <Card className="h-full rounded-none w-screen p-0 overflow-hidden font-[Poppins]">
        <div className="flex h-full w-full flex-col md:flex-row">
          {leftPanelContent()}
          <div className="h-full w-full md:w-1/2 md:mx-24 flex flex-col justify-center items-center p-5 lg:p-10">
            <div className="mb-5 md:absolute md:top-2 md:right-5 flex gap-2 sm:gap-4 justify-end items-center z-10">
              <Button className="primary text-white w-full sm:w-auto md:px-2 md:py-1 md:text-sm lg:px-4 lg:py-2 lg:text-base">
                <ArrowRightToLineIcon className="mr-2" /> Sign Up
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
              Zuperr Sign Up
            </h2>
            <p className="text-md md:text-base font-medium font-['Poppins'] text-gray-500 mb-6 md:self-start">
              To Zuperr
            </p>

            {!profile ? (
              <div className="w-full mb-3">
                <GoogleLogin
                  text="signup_with"
                  onSuccess={handleGoogleSignupSuccess}
                  onError={handleGoogleError}
                />
              </div>
            ) : (
              <div className="text-center">
                <img
                  src={profile.picture}
                  alt="User"
                  className="rounded-full mx-auto w-16 h-16 mb-3"
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

            <p className="text-md md:text-base font-medium font-['Poppins'] text-gray-500 mb-3 flex items-center justify-center w-full">
              <span className="w-[20%] lg:w-[34%] border-t border-gray-500"></span>
              <span className="mx-4">Or Continue with</span>
              <span className="w-[20%] lg:w-[34%] border-t border-gray-500"></span>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center w-full max-h-[calc(100vh-50px)]"
            >
              <div className="mb-3 w-full flex justify-evenly gap-3">
                <div className="flex flex-col w-full">
                  <Input
                    className={`w-full ${
                      errors?.FirstName ? "border-red-500" : ""
                    }`}
                    type="text"
                    placeholder="First Name"
                    {...register("FirstName", {
                      required: "First Name is required",
                    })}
                  />
                  {errors?.FirstName && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors?.FirstName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <Input
                    className={`w-full ${
                      errors.LastName ? "border-red-500" : ""
                    }`}
                    type="text"
                    placeholder="Last Name"
                    {...register("LastName", {
                      required: "Last Name is required",
                    })}
                  />
                  {errors.LastName && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.LastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-3 w-full">
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

              <div className="mb-3 w-full">
                <Input
                  className={`w-full ${
                    errors.MobileNo ? "border-red-500" : ""
                  }`}
                  type="number"
                  placeholder="Mobile No"
                  {...register("MobileNo", {
                    required: "Mobile No is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Mobile number must be 10 digits",
                    },
                  })}
                />
                {errors.MobileNo && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.MobileNo.message}
                  </p>
                )}
              </div>

              {selectedStatus?.value === "employer" && (
                <div className="mb-3 w-full">
                  <div className="flex">
                    <Input
                      className={`w-full ${
                        errors.gstNo ? "border-red-500" : ""
                      }`}
                      type="text"
                      placeholder="GST No"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        handleGSTVerification(watch("gstNo") || "")
                      }
                      disabled={!watch("gstNo") || gstSearching}
                      data-testid="verify-gst-button"
                      aria-label="Verify GST"
                      className="w-24 ml-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                    >
                      {gstSearching ? "Verifying..." : "Verify GST"}
                    </Button>
                  </div>
                  {gstName && (
                    <p className="text-green-700 text-xs mt-2">
                      Reg Name: {gstName}
                    </p>
                  )}
                  {errors.gstNo && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.gstNo.message}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-3 w-full">
                <div className="relative w-full">
                  <Input
                    className={`w-full pr-10 ${
                      errors.Password ? "border-red-500" : ""
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("Password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must be at least 8 characters, include an uppercase letter, a number, and a special character",
                      },
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

              <div className="mb-3 w-full">
                <Input
                  className={`w-full ${
                    errors.ConfirmPassword ? "border-red-500" : ""
                  }`}
                  type="password"
                  placeholder="Confirm Password"
                  {...register("ConfirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === watch("Password") || "Passwords do not match",
                  })}
                />
                {errors.ConfirmPassword && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.ConfirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="mt-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 w-full"
              >
                Create Account
              </Button>
            </form>

            <p className="text-xs text-center mt-5 text-gray-500">
              By continuing, I confirm that I have read the{" "}
              <span className="text-[#1877f2] cursor-pointer">
                Cancellation Policy
              </span>
              ,{" "}
              <span className="text-[#1877f2] cursor-pointer">
                User Agreement
              </span>
              , and{" "}
              <span className="text-[#1877f2] cursor-pointer">
                Privacy Policy
              </span>{" "}
              of Zuperr.
            </p>

            <p className="text-sm text-center mt-4 text-gray-600">
              Don’t have an account?{" "}
              <a href="/signin" className="text-[#007bff] hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default SignUp;

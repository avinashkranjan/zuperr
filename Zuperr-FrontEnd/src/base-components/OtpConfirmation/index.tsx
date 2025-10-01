import React, { useRef } from "react";
import { XIcon } from "lucide-react";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import leftPanelContent from "@base-components/LoginLeftPanel";
import { post } from "@api/index";
import { Toaster } from "@components/ui/toaster";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useToast } from "@src/hooks/use-toast";

interface IOtpConfirmationProps {
  pagetype: string;
  otpLength: number;
  email: string;
  userType: string;
  userID: string;
}

interface OtpConfirmationResponse {
  message?: string;
  status?: number;
  data?: any;
}

interface OtpFormData {
  otp: string[];
}

const OtpConfirmation: React.FC<IOtpConfirmationProps> = ({
  pagetype,
  otpLength,
  email,
  userType,
  userID,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({ mode: "onBlur" });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleVerify: SubmitHandler<OtpFormData> = async (data) => {
    try {
      const otpValue = data.otp.join("");
      const response = await post<OtpConfirmationResponse>(
        `${userType}/verifyotp`,
        {
          email,
          otp: otpValue,
          token: localStorage.getItem("authToken"),
        }
      );

      if (response?.message === "OTP verified successfully") {
        localStorage.setItem("userId", userID);
        localStorage.setItem("userType", userType);
        localStorage.setItem("sessionLoggedIn", "true");
        localStorage.setItem("sessionStarted", `${new Date()}`);

        dispatch({
          type: "@@app/SET_SESSION",
          payload: {
            userId: "1",
            userType,
            sessionLoggedIn: true,
            sessionStarted: new Date(),
          },
        });

        navigate("/");
        toast({
          title: "Success",
          description: "OTP Verified Successfully!",
          variant: "success",
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Invalid OTP",
        variant: "destructive",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await post<OtpConfirmationResponse>(
        `${userType}/resendotp`,
        { email }
      );
      toast({
        title: "Success",
        description: response?.message || "OTP resent successfully",
        variant: "success",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Toaster />
      <Card className="h-full w-screen rounded-none p-0 overflow-hidden font-[Poppins]">
        <div className="flex h-full w-full flex-col md:flex-row">
          {leftPanelContent()}
          <div className="h-full w-full md:w-1/2 flex flex-col justify-center items-center p-5 md:p-14">
            <h2 className="md:mt-6 text-2xl sm:text-3xl font-semibold my-1 md:self-start">
              Zuperr {pagetype}
            </h2>
            <p className="text-md md:text-base font-medium text-gray-500 mb-6 md:self-start">
              To Zuperr
            </p>
            <form
              onSubmit={handleSubmit(handleVerify)}
              className="flex flex-col items-center"
            >
              <div className="flex space-x-2 mt-6">
                {Array.from({ length: otpLength }).map((_, index) => (
                  <Controller
                    key={index}
                    name={`otp.${index}`}
                    control={control}
                    rules={{
                      required: "OTP is required",
                      validate: (value) =>
                        /^\d$/.test(value) || "Only numbers are allowed",
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id={`otp-input-${index}`}
                        maxLength={1}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(e);

                          // Focus the next input if a value is entered
                          if (value && index < otpLength - 1) {
                            inputRefs.current[index + 1]?.focus();
                          }

                          // Focus the previous input if value is deleted
                          if (!value && index > 0) {
                            inputRefs.current[index - 1]?.focus();
                          }
                        }}
                        // eslint-disable-next-line no-nested-ternary
                        className={`w-12 h-12 text-center text-lg border rounded focus:ring focus:ring-blue-500 focus:outline-none ${
                          // eslint-disable-next-line no-nested-ternary
                          errors.otp?.[index]
                            ? "border-red-500 bg-red-100"
                            : field.value
                            ? "border-green-500 bg-green-100"
                            : "border-gray-300"
                        }`}
                        type="text"
                        inputMode="numeric"
                      />
                    )}
                  />
                ))}
              </div>

              {errors.otp &&
                Object.keys(errors.otp).some(
                  (key) => errors.otp && errors.otp[parseInt(key)]?.message
                ) && (
                  <div className="text-sm text-red-500 mt-6 flex items-center">
                    <XIcon className="mr-2" />
                    <p>
                      {
                        errors.otp[parseInt(Object.keys(errors.otp)[0])]
                          ?.message
                      }
                    </p>
                  </div>
                )}

              <Button
                type="submit"
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 w-full"
              >
                Verify OTP
              </Button>
              <Button
                onClick={handleResendOtp}
                className="text-primary bg-white hover:bg-gray-100 mt-4 hover:underline font-bold"
              >
                Resend OTP
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </>
  );
};

export default OtpConfirmation;

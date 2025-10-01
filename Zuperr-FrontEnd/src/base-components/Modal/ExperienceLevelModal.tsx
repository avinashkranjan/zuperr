import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import ueseExperienceImage from "../../assets/images/ueseExperienceImage.png";
import { post } from "@api/index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function ExperienceModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);

  const handleOptionClick = async (experienceLevel: string) => {
    try {
      const body = {
        updatedFields: {
          userExperienceLevel: experienceLevel,
        },
        userId: localStorage.getItem("userId"),
      };
      const response = await post("/employee/saveuserexperiencelevel", body);
      if (!response) {
        throw new Error("Network response was not ok");
      }
      // Close modal on success.
      dispatch({
        type: "@@app/SET_SESSION",
        payload: {
          userId: "1",
          userType: localStorage.getItem("userType"),
          sessionLoggedIn: true,
          sessionStarted: new Date(),
        },
      });
      navigate("/");
      setOpen(false);
    } catch (error) {
      console.error("Error saving experience level:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        // Prevent closing the modal if the user tries to close it externally.
        if (!val) {
          setOpen(true);
        }
      }}
    >
      <DialogContent className="max-w-3xl mx-auto p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Experience Level
          </DialogTitle>
          <DialogDescription>
            Choose your current experience level.
          </DialogDescription>
        </DialogHeader>

        {/* Body of the modal */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4">
          <div className="w-full md:w-1/3 flex justify-center">
            <img
              src={ueseExperienceImage}
              alt="User Experience"
              className="max-h-48 object-contain rounded-lg"
            />
          </div>

          {/* Three option cards */}
          <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-4">
            <button
              onClick={() => handleOptionClick("Fresher")}
              className="flex-1 bg-[#fdece4] rounded-lg p-4 text-center shadow hover:shadow-md transition"
            >
              I’m a Fresher
            </button>

            <button
              onClick={() => handleOptionClick("ExpereincedUnemployed")}
              className="flex-1 bg-[#f2f8fd] rounded-lg p-4 text-center shadow hover:shadow-md transition"
            >
              I’m a Working Professional, but Not Employed
            </button>

            <button
              onClick={() => handleOptionClick("ExperiencedEmployed")}
              className="flex-1 bg-[#fdf5e4] rounded-lg p-4 text-center shadow hover:shadow-md transition"
            >
              I’m a Working Professional
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExperienceModal;

import React, { useState } from "react";
import { Delete, Download, Eye, Trash, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";
import { post } from "@api/index";
import { BACKEND_API_URL } from "@src/lib/config";

type ParsedResumeData = Record<string, any>;

export default function Resume({
  onUpdateProfile,
}: {
  onUpdateProfile: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [parseResumeData, setParseResumeData] =
    useState<ParsedResumeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit.");
        return;
      }
      setFile(uploadedFile);
      setError(null);
      console.log("File selected:", uploadedFile.name);
    }
  };

  const parseResume = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("User not authenticated.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch(
        `${BACKEND_API_URL}/api/employee/upload-cv/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to parse resume.");
      }

      const data: ParsedResumeData = await response.json();
      setParseResumeData(data.parsedData);
      setUploadedResumeUrl(data.url);
      console.log("Parsed resume data:", data.parsedData);
    } catch (err: any) {
      console.error("Error parsing resume:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  async function UpdateProfileWithResumeData(
    data: ParsedResumeData,
    fileUrl: string | null
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...rest } = data;

    await post("/employee/updatecandidatedata/resume", {
      updatedFields: {
        ...rest,
        resume: fileUrl,
      },
    });

    onUpdateProfile();
  }

  const handleRemoveFile = () => {
    setFile(null);
    setParseResumeData(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="p-4 w-full mx-auto border rounded-lg shadow-sm bg-gray-200 mb-6">
      <h2 className="text-lg font-semibold mb-2">Upload Resume</h2>
      <p className="text-sm text-gray-500 mb-4">
        Upload Your Professional Resume: Highlight your skills, experience, and
        achievements to unlock opportunities tailored to your career
        aspirations. Let employers discover your potential effortlessly.
      </p>

      <div className="border-dashed border-2 border-gray-700 rounded-lg p-6 flex flex-col items-center gap-3 text-center">
        {file ? (
          <>
            <p className="text-sm text-gray-700">
              Uploaded: <strong>{file.name}</strong>
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Download size={16} className="mr-1" /> View
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                <Trash size={16} className="mr-1" /> Remove
              </Button>
            </div>
          </>
        ) : (
          <>
            <Upload size={24} className="text-gray-400" />
            <p className="text-sm text-gray-500">
              Drag & drop or click to upload.
            </p>
            <Button
              variant="secondary"
              className="text-white bg-blue-600 font-semibold flex items-center"
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              Upload Resume
            </Button>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </>
        )}

        {file && (
          <Button
            variant="default"
            className="text-white flex"
            onClick={parseResume}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <Eye size={16} className="mr-1" />
                View Resume Data
              </>
            )}
          </Button>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-4 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {parseResumeData && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold mb-2">Parsed Resume Data</h3>
            <Button variant="secondary" size="sm" onClick={handleRemoveFile}>
              <Delete size={16} className="mr-1" /> Clear
            </Button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-[400px]">
            {JSON.stringify(parseResumeData, null, 2)}
          </pre>
          <Button
            variant="default"
            className="mt-4 text-white"
            onClick={() =>
              UpdateProfileWithResumeData(parseResumeData, uploadedResumeUrl)
            }
          >
            <Upload size={16} className="mr-1" />
            Update Profile with Resume Data
          </Button>
        </div>
      )}
    </div>
  );
}

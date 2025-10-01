const fetch = require("node-fetch");

const resumeParsingService = {
  /**
   * Parses resume text using an LLM to extract structured data.
   * @param {string} resumeText - The raw text extracted from the resume.
   * @returns {Promise<object>} - A promise that resolves to the parsed resume JSON.
   * @throws {Error} - If the LLM call fails or returns an unexpected format.
   */
  parseWithLLM: async (resumeText) => {
    const prompt = `Take the following resume text and parse it to extract relevant information. Provide the output strictly in the following JSON format. Do not include any explanatory text before or after the JSON. If you cannot find information for a field, use null for its value. Ensure the output is a valid JSON object.

      Resume Text:

      ---

      ${resumeText}

      ---

      JSON Output Format Example (ensure your output strictly matches this structure):

      {
        "firstname": "string or null",
        "lastname": "string or null",
        "email": "string or null",
        "mobilenumber": "string or null",
        "noticePeriod": "string or null",
        "password": "string or null",
        "userExperienceLevel": "string or null",
        "minimumExperienceInYears": number or null,
        "maximumExperienceInYears": number or null,
        "profilePicture": "string or null",
        "resume": "string or null",
        "dateOfBirth": "YYYY-MM-DD or null",
        "gender": "string or null",
        "maritalStatus": "string or null",
        "profileSummary": "string or null",
        "address": {
          "line1": "string or null",
          "landmark": "string or null",
          "district": "string or null",
          "state": "string or null",
          "country": "string or null",
          "pincode": "string or null"
        },
        "permanentAddress": {
          "line1": "string or null",
          "landmark": "string or null",
          "district": "string or null",
          "state": "string or null",
          "country": "string or null",
          "pincode": "string or null"
        },
        "hasPermanentAddress": boolean or null,
        "languages": [
          {
            "language": "string or null",
            "proficiencyLevel": "string or null"
          }
        ],
        "educationAfter12th": [
          {
            "educationLevel": "string or null",
            "courseName": "string or null",
            "specialization": "string or null",
            "grading": "string or null",
            "gradeValue": "string or number or null",
            "instituteName": "string or null",
            "courseDuration": {
              "from": "YYYY-MM-DD or null",
              "to": "YYYY-MM-DD or null"
            },
            "courseType": "string or null",
            "examinationBoard": "string or null",
            "skills": "string or null",
            "passingYear": number or null
          }
        ],
        "educationTill12th": [
          {
            "education": "string or null",
            "examinationBoard": "string or null",
            "mediumOfStudy": "string or null",
            "gradeType": "string or null",
            "gradingOutOf": "string or null",
            "gradeValue": "string or null",
            "passingYear": "string or null"
          }
        ],
        "internships": [
          {
            "companyName": "string or null",
            "role": "string or null",
            "duration": {
              "from": "YYYY-MM-DD or null",
              "to": "YYYY-MM-DD or null"
            },
            "projectName": "string or null",
            "description": "string or null",
            "keySkills": "string or null",
            "projectURL": "string or null"
          }
        ],
        "projects": [
          {
            "projectName": "string or null",
            "duration": {
              "from": "YYYY-MM-DD or null",
              "to": "YYYY-MM-DD or null"
            },
            "description": "string or null",
            "keySkills": "string or null",
            "endResult": "string or null",
            "projectURL": "string or null"
          }
        ],
        "employmentHistory": [
          {
            "workExperience": {
              "years": number or null,
              "months": number or null
            },
            "companyName": "string or null",
            "duration": {
              "from": "YYYY-MM-DD or null",
              "to": "YYYY-MM-DD or null"
            },
            "position": "string or null",
            "keyAchievements": "string or null",
            "annualSalary": "string or null",
            "isCurrentJob": boolean or null,
            "description": "string or null"
          }
        ],
        "accomplishments": [
          {
            "certificationName": "string or null",
            "certificationID": "string or null",
            "certificationURL": "string or null",
            "certificationValidity": {
              "month": "string or null",
              "year": "string or null"
            },
            "noExpiry": boolean or null,
            "awards": "string or null",
            "clubs": "string or null",
            "positionHeld": "string or null",
            "educationalReference": "string or null",
            "duration": {
              "from": "YYYY-MM-DD or null",
              "to": "YYYY-MM-DD or null"
            },
            "isCurrent": boolean or null,
            "responsibilities": "string or null",
            "mediaUpload": "string or null"
          }
        ],
        "competitiveExams": [
          {
            "examName": "string or null",
            "examYear": "string or null",
            "obtainedScore": "string or null",
            "maxScore": "string or null"
          }
        ],
        "academicAchievements": [
          {
            "achievement": "string or null",
            "receivedDuring": "string or null",
            "educationReference": "string or null",
            "topRank": "string or null"
          }
        ],
        "careerPreference": {
          "jobTypes": ["string", "..."] or null,
          "availability": "string or null",
          "preferredLocation": "string or null",
          "minimumSalaryLPA": number or null,
          "maximumSalaryLPA": number or null,
          "jobRoles": ["string", "..."]
        },
        "selectedJobCategories": ["string", "..."] or null
      }
      `;

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = {
      contents: chatHistory,
    };

    const apiKey = process.env.GoogleGeminiApiKey;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${apiKey}`;

    try {
      console.log(`Sending request to LLM API (${apiUrl})...`);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("LLM API Error Response Body:", errorBody);
        let parsedErrorBody;
        try {
          parsedErrorBody = JSON.parse(errorBody);
        } catch (e) {
          parsedErrorBody = errorBody;
        }
        throw new Error(
          `LLM API request failed with status ${
            response.status
          }: ${JSON.stringify(parsedErrorBody)}`
        );
      }

      const result = await response.json();
      console.log("Received response from LLM API.");

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0 &&
        typeof result.candidates[0].content.parts[0].text === "string"
      ) {
        let jsonText = result.candidates[0].content.parts[0].text.trim();
        console.log("Raw LLM response text (trimmed):", jsonText);

        try {
          const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
          if (match && match[1]) {
            console.log(
              "Found JSON within markdown backticks. Attempting to parse."
            );
            jsonText = match[1].trim();
          } else {
            console.log(
              "No JSON markdown backticks found. Assuming the entire text is JSON."
            );
          }

          const parsedJson = JSON.parse(jsonText);
          console.log("Successfully parsed JSON from LLM response.");
          return parsedJson;
        } catch (e) {
          console.error("Failed to parse LLM response text as JSON:", e);
          console.error(
            "Original problematic text from LLM:",
            result.candidates[0].content.parts[0].text
          );
          throw new Error(
            "LLM returned text that could not be parsed as JSON. Check the console for the raw text from the model."
          );
        }
      } else {
        console.error(
          "Unexpected LLM API response structure or missing text:",
          JSON.stringify(result, null, 2)
        );
        throw new Error(
          "LLM API response structure was unexpected, content was missing, or text part was not a string."
        );
      }
    } catch (error) {
      console.error("Error calling LLM for resume parsing:", error.message);
      // Log stack for more details if available
      if (error.stack) {
        console.error(error.stack);
      }
      throw error; // Re-throw to be caught by the controller
    }
  },
};

module.exports = resumeParsingService;

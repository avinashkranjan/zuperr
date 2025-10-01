const fetch = require("node-fetch");

const LLM_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent";

/**
 * Builds a prompt for the LLM to generate a job description.
 * @param {object} jdParams - Parameters for the job description.
 * @param {string} jdParams.jobTitle - The title of the job.
 * @param {string} jdParams.companyName - The name of the company.
 * @param {string} [jdParams.companyOverview] - A brief overview of the company.
 * @param {string[]} [jdParams.keyResponsibilities] - Array of key responsibilities.
 * @param {string[]} [jdParams.requiredSkills] - Array of required skills and qualifications.
 * @param {string} [jdParams.experienceLevel] - Required experience level (e.g., "3+ years").
 * @param {string} [jdParams.location] - Job location (e.g., "Remote", "New York, NY").
 * @param {string} [jdParams.jobType] - Type of job (e.g., "Full-time", "Part-time", "Contract").
 * @param {string} [jdParams.salaryRange] - Optional salary range (e.g., "$80,000 - $120,000 per year").
 * @param {string} [jdParams.companyCulture] - Optional details about company culture.
 * @param {string[]} [jdParams.benefits] - Optional array of benefits.
 * @returns {string} - The constructed prompt string.
 */
function buildGenerateJDPropmpt(jdParams) {
  const {
    title,
    companyName,
    companyOverview,
    jobCategory,
    jobType,
    workMode,
    location,
    keyResponsibilities,
    skills,
    minimumExperienceInYears,
    maximumExperienceInYears,
    education,
    degree,
    industry,
    salaryRange,
    companyCulture,
    benefits,
  } = jdParams;

  // Normalize skills: handle comma-separated string or array
  const normalizedSkills =
    typeof skills === "string"
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : Array.isArray(skills)
      ? skills.map((s) => String(s).trim()).filter((s) => s)
      : [];

  // Normalize experience values to numbers
  const minExp = Number(minimumExperienceInYears) || undefined;
  const maxExp = Number(maximumExperienceInYears) || undefined;

  let prompt = `Please generate a comprehensive, engaging, and professional job description for the role of "${
    title || "this role"
  }"`;
  if (companyName) {
    prompt += ` at "${companyName}"`;
  }
  prompt += ".\n\n";

  if (companyName) {
    prompt += `Company: ${companyName}\n`;
  }
  if (industry) {
    prompt += `Industry: ${industry}\n`;
  }
  if (companyOverview) {
    prompt += `Company Overview:\n${companyOverview.trim()}\n\n`;
  }

  prompt += `Role: ${title || "Not specified"}\n`;
  if (jobCategory) {
    prompt += `Category: ${jobCategory}\n`;
  }
  if (jobType) {
    prompt += `Job Type: ${jobType}\n`;
  }
  if (workMode) {
    prompt += `Work Mode: ${workMode}\n`;
  }
  if (location) {
    prompt += `Location: ${location}\n`;
  }
  prompt += "\n";

  if (keyResponsibilities && keyResponsibilities.length > 0) {
    prompt += "Key Responsibilities:\n";
    keyResponsibilities.forEach((resp) => {
      prompt += `- ${String(resp).trim()}\n`;
    });
    prompt += "\n";
  }

  prompt += "Qualifications & Skills:\n";
  if (normalizedSkills.length > 0) {
    normalizedSkills.forEach((skill) => {
      prompt += `- ${skill}\n`;
    });
  }

  let experienceString = "";
  if (minExp !== undefined && maxExp !== undefined) {
    experienceString =
      minExp === maxExp
        ? `${minExp} years of experience.`
        : `${minExp}-${maxExp} years of experience.`;
  } else if (minExp !== undefined) {
    experienceString = `Minimum ${minExp} years of experience.`;
  } else if (maxExp !== undefined) {
    experienceString = `Up to ${maxExp} years of experience.`;
  }

  if (experienceString) {
    prompt +=
      normalizedSkills.length > 0
        ? `- ${experienceString}\n`
        : `${experienceString}\n`;
  }

  if (degree) {
    prompt +=
      normalizedSkills.length > 0 || experienceString
        ? `- ${degree.trim()}\n`
        : `${degree.trim()}\n`;
  }
  if (education) {
    prompt +=
      normalizedSkills.length > 0 || experienceString || degree
        ? `- ${education.trim()}\n`
        : `${education.trim()}\n`;
  }
  prompt += "\n";

  if (
    salaryRange &&
    salaryRange.minimumSalary !== undefined &&
    salaryRange.maximumSalary !== undefined &&
    salaryRange.currency
  ) {
    prompt += `Salary Range: ${salaryRange.minimumSalary} - ${
      salaryRange.maximumSalary
    } ${salaryRange.currency.toUpperCase()}\n\n`;
  } else if (
    salaryRange &&
    salaryRange.minimumSalary !== undefined &&
    salaryRange.currency
  ) {
    prompt += `Salary: Starting from ${
      salaryRange.minimumSalary
    } ${salaryRange.currency.toUpperCase()}\n\n`;
  }

  if (benefits && benefits.length > 0) {
    prompt += "What We Offer (Benefits):\n";
    benefits.forEach((benefit) => {
      prompt += `- ${String(benefit).trim()}\n`;
    });
    prompt += "\n";
  }

  if (companyCulture) {
    prompt += `About Our Culture:\n${companyCulture.trim()}\n\n`;
  }

  prompt +=
    "Please ensure the job description is well-structured, clearly outlines the role's expectations, uses inclusive language, and has a professional yet inviting tone to attract a diverse pool of qualified candidates.\n";
  prompt +=
    "The output should be the complete job description as a single block of text, suitable for direct use.";

  return prompt;
}

/**
 * Calls the LLM API to generate a job description.
 * @param {object} jdParams - Parameters for the job description (see buildGenerateJDPropmpt JSDoc for details of the expected structure).
 * @returns {Promise<string>} - A promise that resolves to the generated job description text.
 * @throws {Error} - Throws an error if the LLM API request fails or returns an invalid response.
 */
async function generateJobDescriptionLlm(jdParams) {
  const prompt = buildGenerateJDPropmpt(jdParams);

  const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
  const payload = {
    contents: chatHistory,
  };

  const apiKey = process.env.GoogleGeminiApiKey;
  if (!apiKey) {
    throw new Error("GoogleGeminiApiKey is not set in environment variables.");
  }

  const apiUrlWithKey = `${LLM_API_URL}?key=${apiKey}`;

  try {
    const response = await fetch(apiUrlWithKey, {
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

    const data = await response.json();

    const llmRawText =
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!llmRawText) {
      throw new Error("LLM response did not contain expected text content.");
    }

    try {
      return llmRawText.trim();
    } catch (parseError) {
      console.error("Failed to parse LLM response as JSON:", llmRawText);
      throw new Error(`LLM response was not valid JSON: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error in getLlmAnalysis service:", error.message);
    throw error;
  }
}

module.exports = {
  generateJobDescriptionLlm,
};

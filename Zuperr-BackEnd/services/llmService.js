// src/services/llmService.js
const fetch = require("node-fetch"); // For making HTTP requests
const { buildLlmPrompt } = require("../utils/promptBuilder");

const LLM_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent";

/**
 * Calls the LLM API to get analysis for job description and candidate profile.
 * @param {string} jobDescription - The job description text.
 * @param {string} candidateProfile - The candidate's profile text.
 * @returns {Promise<object>} - A promise that resolves to the parsed LLM response.
 * @throws {Error} - Throws an error if the LLM API request fails or returns an invalid response.
 */
async function getLlmAnalysis(jobDescription, candidateProfile) {
  const prompt = buildLlmPrompt(jobDescription, candidateProfile);

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
    console.log(`Sending request to LLM API (${apiUrlWithKey})...`);
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
    // Assuming the LLM response structure contains `candidates[0].content.parts[0].text`
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

    // Attempt to parse the LLM's raw text response as JSON
    try {
      // The LLM might return the JSON wrapped in markdown code block (e.g., ```json...```)
      const cleanedText = llmRawText.replace(/```json\n?|```/g, "").trim();
      const parsedData = JSON.parse(cleanedText);
      return parsedData;
    } catch (parseError) {
      console.error("Failed to parse LLM response as JSON:", llmRawText);
      throw new Error(`LLM response was not valid JSON: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error in getLlmAnalysis service:", error.message);
    throw error; // Re-throw to be caught by the controller
  }
}

module.exports = {
  getLlmAnalysis,
};

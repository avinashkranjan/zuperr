// src/utils/promptBuilder.js

/**
 * Builds the prompt for the LLM based on job description and candidate profile.
 * @param {string} jobDescription - The job description text.
 * @param {string} candidateProfile - The candidate's profile text (e.g., resume summary, skills).
 * @returns {string} The constructed prompt for the LLM.
 */
function buildLlmPrompt(jobDescription, candidateProfile) {
  return `
    You are an AI assistant specialized in analyzing job descriptions and candidate profiles.
    Your task is to provide a comprehensive analysis, identifying key matches, missing skills, and actionable suggestions.

    Here is the Job Description:
    ---
    ${JSON.stringify(jobDescription, null, 2)}
    ---

    Here is the Candidate Profile:
    ---
    ${JSON.stringify(candidateProfile, null, 2)}
    ---

    **IMPORTANT:** Your response MUST be a valid JSON object ONLY. Do NOT include any conversational text, explanations, or markdown fences (like \`\`\`json). Just the JSON object itself.

    The JSON object should have the following structure:
    {
      "aiSummary": "A concise (1-2 sentences) summary of how well the candidate meets the job requirements.",
      "topSkills": ["Only include this field if there are actual matches. List up to 5 highly relevant and differentiated skills the candidate possesses, matched specifically to this job."],
      "missingSkills": ["Up to 3 key skills or experiences required by the job that the candidate lacks or could improve upon."],
      "suggestedActions": ["Up to 3 clear, actionable steps the candidate could take to improve their fit for this job or similar roles."]
    }

    Now, generate the JSON response based on the provided Job Description and Candidate Profile.
    `;
}

module.exports = {
  buildLlmPrompt,
};

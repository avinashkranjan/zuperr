const getStructuredResume = (text) => {
  const name = extractName(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const location = extractLocation(text);
  const summary = extractSummary(text);
  const skills = extractSkills(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);
  const certifications = extractCertifications(text);
  const projects = extractProjects(text);
  const keywords = extractKeywords(text);

  return {
    name,
    email,
    phone,
    location,
    summary,
    skills,
    experience,
    education,
    certifications,
    projects,
    keywords,
  };
};

module.exports = { getStructuredResume };

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : null;
}

function extractPhone(text) {
  const match = text.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/
  );
  return match ? match[0] : null;
}

function extractName(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const likelyName = lines[0];
  if (/^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(likelyName)) {
    return likelyName;
  }
  return null;
}

function extractLocation(text) {
  const locationRegex = /(Address|Location|Based in)[:\-]?\s*(.+)/i;
  const match = text.match(locationRegex);
  return match ? match[2].split("\n")[0] : null;
}

function extractSummary(text) {
  const summaryStart = text.indexOf("Summary");
  if (summaryStart !== -1) {
    const after = text.slice(summaryStart + 7).split("\n\n")[0];
    return after.trim();
  }
  return null;
}

function extractSkills(text) {
  const skillSection = text.match(
    /Skills(?:\s*:?)([\s\S]*?)(\n{2,}|Experience|Education|Projects)/i
  );
  if (!skillSection) return [];
  return skillSection[1]
    .split(/[\n,•-]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function extractExperience(text) {
  const expRegex =
    /(Company|Employer|Organization)[\s\S]{0,100}?(Title|Role|Position)[\s\S]{0,100}?(Duration|Date|Year)[\s\S]{0,300}/gi;
  const matches = [...text.matchAll(expRegex)];

  return matches.map((match) => ({
    company:
      match[0].match(/(Company|Employer|Organization):?\s*(.*)/i)?.[2] ?? null,
    title: match[0].match(/(Title|Role|Position):?\s*(.*)/i)?.[2] ?? null,
    duration: match[0].match(/(Duration|Date|Year):?\s*(.*)/i)?.[2] ?? null,
    responsibilities: extractBulletPoints(match[0]),
  }));
}

function extractEducation(text) {
  const eduRegex =
    /(B\.?Tech|B\.?Sc|M\.?Tech|M\.?Sc|MBA|Bachelor|Master)[\s\S]{0,100}/gi;
  const matches = [...text.matchAll(eduRegex)];
  return matches.map((match) => ({
    degree: match[0],
    institution: extractInstitution(match[0]),
    location: null,
    year: match[0].match(/\b(20\d{2}|19\d{2})\b/)?.[0] ?? null,
  }));
}

function extractInstitution(line) {
  const knownWords = ["University", "Institute", "College"];
  for (const word of knownWords) {
    const match = line.match(
      new RegExp(`\\b([\\w\\s]*${word}[\\w\\s]*)\\b`, "i")
    );
    if (match) return match[1];
  }
  return null;
}

function extractCertifications(text) {
  const certRegex =
    /(?:Certifications?|Courses?)[:\-]?\s*([\s\S]*?)(\n{2,}|Projects|Skills|Education)/i;
  const match = text.match(certRegex);
  if (!match) return [];

  return match[1]
    .split(/[\n•,-]/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((name) => ({ name, issuer: null }));
}

function extractProjects(text) {
  const projRegex =
    /Projects?[:\-]?\s*([\s\S]*?)(\n{2,}|Experience|Skills|Education)/i;
  const match = text.match(projRegex);
  if (!match) return [];

  const lines = match[1].split("\n").filter(Boolean);
  return lines.map((line) => ({
    title: line.split("–")[0]?.trim(),
    description: line.split("–")[1]?.trim() ?? null,
    technologies: [],
  }));
}

function extractBulletPoints(section) {
  return section
    .split(/\n/)
    .filter((line) => /[-•*]/.test(line))
    .map((line) => line.replace(/[-•*]\s?/, "").trim());
}

function extractKeywords(text) {
  const techKeywords = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Django",
    "SQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "HTML",
    "CSS",
    "Git",
    "CI/CD",
  ];
  const found = techKeywords.filter((k) =>
    text.toLowerCase().includes(k.toLowerCase())
  );
  return found;
}

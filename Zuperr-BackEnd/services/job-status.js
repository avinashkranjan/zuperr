const JOB_STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pending",
};

const BLACKLISTED_DOMAINS = [
  "bit.ly",
  "tinyurl.com",
  "cut.ly",
  "t.co",
  "rebrand.ly",
  "shorturl.at",
  "wa.me",
  "api.whatsapp.com",
  "chat.whatsapp.com",
  "t.me",
  "telegram.me",
  "telegram.org",
  "signal.org",
  "snapchat.com",
  "bip.me",
  "imo.im",
  "workfromhome.xyz",
  "quickmoneyjob.in",
  "earnathome.today",
  "mlmplans.in",
];

const BANNED_KEYWORDS = [
  "casino",
  "betting",
  "porn",
  "escort",
  "MLM",
  "pyramid",
  "forex",
  "gambling",
  "adult",
  "work from home & earn ₹50k",
  "pharma",
  "miracle",
  "viagra",
  "Cialis",
  "guaranteed selection",
  "no investment",
  "no training needed",
  "registration fees",
  "direct joining",
  "earn from home",
  "100% earning",
  "zero effort",
  "click here to apply",
  "get paid instantly",
  "make ₹50,000/day",
  "paid promotion",
  "apply on WhatsApp",
  "Telegram link",
  "bit.ly link",
  "adult chat operator",
  "Earn ₹1 Lakh/Week",
  "Work From Home – No Skills Needed",
  "Part-Time – ₹5000 per Day!",
  "Easy Money",
  "Just 1 Hour Work",
  "No Boss – Be Your Own",
  "Guaranteed Job",
];

const SUSPICIOUS_PHRASES = [
  "earn extra cash",
  "no interview",
  "start today",
  "easy work",
  "act now",
  "limited time",
  "full refund",
  "risk free",
  "instant",
  "bonus",
  "winner",
  "get paid",
  "apply fast",
  "no catch",
  "Join Immediately!",
  "Start Today – Zero Experience",
  "urgent hiring",
  "immediate start",
];

const HIGH_RISK_CATEGORIES = [
  "crypto jobs",
  "forex trading",
  "work from home",
  "data entry",
  "affiliate marketing",
  "pharma sales (without license)",
  "part-time calling",
  "loan recovery",
  "escort services",
  "adult chat",
  "modelling offers (without agency name)",
  "surveys and form filling",
  "reselling schemes",
];

function evaluateJobPost(job, employer) {
  if (hasBannedKeywords(job)) {
    return {
      status: JOB_STATUS.REJECTED,
      reason: "Contains banned keywords/phrases",
    };
  }

  if (hasBlacklistedLinks(job)) {
    return {
      status: JOB_STATUS.REJECTED,
      reason: "Contains blacklisted external links",
    };
  }

  if (isMisleadingTitle(job)) {
    return {
      status: JOB_STATUS.REJECTED,
      reason: "Title contains misleading claims",
    };
  }

  if (job.title.length < 5) {
    return {
      status: JOB_STATUS.REJECTED,
      reason: "Title is too short (less than 5 characters)",
    };
  }

  if (!job.jobDescription || job.jobDescription.length < 100) {
    return {
      status: JOB_STATUS.REJECTED,
      reason: "Description is missing or too short (less than 100 characters)",
    };
  }

  if (!employer.isPANVerified || !employer.isGSTVerified) {
    return {
      status: JOB_STATUS.REJECTED,
      reason: "Company PAN/GST not verified",
    };
  }

  if (job.minimumSalaryLPA > job.maximumSalaryLPA) {
    return {
      status: JOB_STATUS.REJECTED,
      reason: "Invalid salary range (minimum > maximum)",
    };
  }

  if (employer.trustScore >= 3.5 && employer.trustScore < 7) {
    return {
      status: JOB_STATUS.PENDING,
      reason: "Employer trust score between 3.5-6.9",
    };
  }

  if (hasSuspiciousPhrases(job)) {
    return {
      status: JOB_STATUS.PENDING,
      reason: "Contains suspicious phrases that need review",
    };
  }

  if (HIGH_RISK_CATEGORIES.includes(job.jobCategory)) {
    return {
      status: JOB_STATUS.PENDING,
      reason: "Job category flagged as high-risk",
    };
  }

  if (containsEmojis(job.title)) {
    return {
      status: JOB_STATUS.PENDING,
      reason: "Title contains emojis",
    };
  }

  if (hasExternalLinks(job)) {
    return {
      status: JOB_STATUS.PENDING,
      reason: "Contains external links that need verification",
    };
  }

  if (
    employer.trustScore >= 7 &&
    job.title.length >= 5 &&
    !hasBannedKeywords(job) &&
    job.minimumSalaryLPA < job.maximumSalaryLPA &&
    job.jobDescription &&
    job.jobDescription.length >= 100 &&
    employer.isPANVerified &&
    employer.isGSTVerified &&
    !hasSuspiciousPatterns(job)
  ) {
    return {
      status: JOB_STATUS.APPROVED,
      reason: "Meets all auto-approval criteria",
    };
  }

  return {
    status: JOB_STATUS.PENDING,
    reason: "Needs manual review",
  };
}

function hasBannedKeywords(job) {
  const textToCheck = `${job.title} ${job.jobDescription}`.toLowerCase();
  return BANNED_KEYWORDS.some((keyword) =>
    textToCheck.includes(keyword.toLowerCase())
  );
}

function hasBlacklistedLinks(job) {
  const textToCheck = `${job.title} ${job.jobDescription}`.toLowerCase();
  return BLACKLISTED_DOMAINS.some((domain) =>
    textToCheck.includes(domain.toLowerCase())
  );
}

function hasExternalLinks(job) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return urlRegex.test(`${job.title} ${job.jobDescription}`);
}

function isMisleadingTitle(job) {
  const misleadingPhrases = [
    "Earn ₹1 lakh/week",
    "No interview",
    "Guaranteed job",
    "100% earning",
    "make ₹50,000/day",
    "Paid promotion",
  ];
  return misleadingPhrases.some((phrase) => job.title.includes(phrase));
}

function hasSuspiciousPhrases(job) {
  const textToCheck = `${job.title} ${job.jobDescription}`.toLowerCase();
  return SUSPICIOUS_PHRASES.some((phrase) =>
    textToCheck.includes(phrase.toLowerCase())
  );
}

function hasSuspiciousPatterns(job) {
  const pushyRegex = /(urgent|immediate|apply now|limited time|act fast)/gi;
  const symbolRegex = /[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]{3,}/g;
  const emojiRegex = /[\u{1F600}-\u{1F6FF}]/gu;

  return (
    pushyRegex.test(job.title) ||
    symbolRegex.test(job.title) ||
    emojiRegex.test(job.title)
  );
}

function containsEmojis(text) {
  const emojiRegex = /[\u{1F600}-\u{1F6FF}]/gu;
  return emojiRegex.test(text);
}

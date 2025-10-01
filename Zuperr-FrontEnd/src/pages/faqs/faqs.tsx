import { useTypedSelector } from "@src/redux/rootReducer";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";

function Faqs() {
  const userType = useTypedSelector((state) => state.App.sessionInfo.userType);
  const isEmployer = userType === "employer";

  const employeeFaqs = [
    {
      question:
        "What is Zuperr, and how is it different from other job platforms?",
      answer:
        "Zuperr is an AI-powered, hyperlocal job discovery platform designed for your city, area, and even your neighborhood. We bring jobs closer to you, not just in your industry but also within your reachable distance.",
    },
    {
      question: "How do I apply for jobs on Zuperr?",
      answer:
        "Just click on the “Apply Now” button on any job. Some jobs will let you apply directly within Zuperr; others may redirect you to the company’s official application portal.",
    },
    {
      question: "What is “Hyperlocal Job Matching”?",
      answer:
        "Hyperlocal means we match you with jobs based on your current location or preferred area—like within 5–10 km—saving commute time and helping you find jobs where you actually live.",
    },
    {
      question: "Is Zuperr free to use?",
      answer:
        "Yes, Zuperr is 100% free for job seekers. You can search, apply, track applications, and even build a resume—all without paying anything.",
    },
    {
      question: "What if I don’t have a resume?",
      answer:
        "No problem! Zuperr includes a free, AI-powered resume builder. Just answer a few questions, and it will generate a clean, professional resume for you in minutes.",
    },
    {
      question: "How are job recommendations personalized?",
      answer:
        "Zuperr uses AI-based algorithms that study your profile, job search behavior, applied jobs, and preferred categories to recommend jobs uniquely suited to you—not just the latest ones.",
    },
    {
      question: "What are “Top Candidate Alerts”?",
      answer:
        "If you’re missing key profile details, Zuperr alerts you and suggests how to improve your visibility. This helps you appear in employer searches more often.",
    },
    {
      question: "How do I track my job applications?",
      answer:
        "Your dashboard shows all the jobs you’ve applied to, including the date of application and status (e.g., viewed, shortlisted, pending).",
    },
    {
      question: "What are Sponsored Jobs?",
      answer:
        "Sponsored Jobs are featured job listings paid for by employers. These jobs are promoted for more visibility, but you can apply to them just like any other job.",
    },
    {
      question: "Can I apply for jobs posted on other platforms from Zuperr?",
      answer:
        "Yes, if a job is sourced from platforms like company career pages, Zuperr will redirect you to the original link to complete your application.",
    },
    {
      question: "How can I contact a recruiter or employer directly?",
      answer:
        "If the employer has enabled communication, you’ll see a “Message” or “Contact HR” button on the job listing or in your application tracker.",
    },
    {
      question: "Is my data and profile information secure?",
      answer:
        "Absolutely. Zuperr uses industry-standard encryption and security practices to ensure your personal information is safe and never shared without your consent.",
    },
    {
      question: "How does Zuperr summarize job descriptions for me?",
      answer:
        "Zuperr’s AI Summary Tool reads every job and gives you a short, clear summary: Key responsibilities, required qualifications, and benefits. This helps you decide faster and saves reading time.",
    },
  ];

  const employerFaqs = [
    {
      question: "Why should I use Zuperr for hiring?",
      answer:
        "Zuperr focuses on hyperlocal recruitment, meaning your job posts reach candidates within a nearby radius, cutting down on travel friction and improving joining rates. Also, our AI targeting brings you better-fit applicants.",
    },
    {
      question: "Is job posting free?",
      answer:
        "Zuperr offers both free and premium plans. Free jobs get decent reach, while premium/sponsored jobs appear higher in listings and get more views and applications.",
    },
    {
      question: "What is “Hyperlocal Targeting”?",
      answer:
        "Zuperr automatically boosts visibility to candidates located within your selected area (e.g., 5 km, same city, or exact pin code), helping you hire faster and more reliably.",
    },
    {
      question:
        "How does Zuperr ensure better visibility than other platforms?",
      answer:
        "Through:\n• AI-based matching\n• Hyperlocal display\n• Smart “Recommended Candidate” engine\n• Candidate profile scoring to show you top matches first",
    },
    {
      question: "How does hyperlocal targeting help me?",
      answer:
        "You can target applicants based on exact pin code, city zone, or nearby radius (e.g., 10km). This improves joining probability and reduces backouts by matching candidates who actually live nearby.",
    },
    {
      question: "What is AI Match Scoring, and how does it work?",
      answer:
        // eslint-disable-next-line quotes
        'Zuperr\'s AI Match Score compares your job description with the applicant’s profile, ranking candidates on a score out of 100. It uses weights (set by you or default logic) across parameters like:\n• Skills\n• Experience\n• Education\n• Location match\n• Availability\n\nExample:\nIf "React JS" is marked critical and a candidate has 3 years of React experience near your location, they’ll get a high score (e.g., 87/100). This helps you prioritize the top fits instantly without reading every resume.',
    },
    {
      question:
        "How does Zuperr ensure better visibility than other platforms?",
      answer:
        "Through:\n• AI-based matching\n• Hyperlocal display\n• Smart “Recommended Candidate” engine\n• Candidate profile scoring to show you top matches first",
    },
    {
      question: "What is a Sponsored Job?",
      answer:
        "A Sponsored Job gets priority placement on Zuperr, increasing visibility and application volume. It appears at the top of search results and in “Recommended Jobs.”",
    },
    {
      question: "Can I screen candidates before shortlisting?",
      answer:
        "Yes. Use custom screening questions, auto-match filters, and the Match Score to shortlist faster. You can even set knockout questions during job creation.",
    },
    {
      question: "Is candidate data secure and confidential?",
      answer:
        "Yes. All data is encrypted and only accessible by verified company users. We strictly follow data protection norms and give you full control over your recruitment panel.",
    },
  ];

  const faqs = isEmployer ? employerFaqs : employeeFaqs;

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default Faqs;

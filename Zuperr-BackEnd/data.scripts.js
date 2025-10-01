const mongoose = require("mongoose");
const User = require("./model/employee/employee");
const Employer = require("./model/employer/employer.model");
const Job = require("./model/job/job");
const Skill = require("./model/skill/skill");

(async function createSampleData() {
  try {
    // Connect to MongoDB (adjust the connection string as needed)
    await mongoose.connect("mongodb://localhost:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Employer.deleteMany({}),
      Job.deleteMany({}),
      Skill.deleteMany({}),
    ]);

    // 1. Get Skills
    const skillNames = ["JavaScript", "Python", "Java", "Node.js", "MongoDB"];
    const skillDocs = [];
    for (const name of skillNames) {
      const skill = await Skill.create({ Name: name });
      skillDocs.push(skill);
    }
    // Get array of skill _ids for Job references
    const skillIds = skillDocs.map((skill) => skill._id);

    // 2. Create Employers (2)
    const employersData = [
      {
        firstname: "Alice",
        lastname: "Smith",
        companyName: "Alice Tech",
        email: "ansarifarhan517@gmail.com",
        mobileNumber: "1234567890",
        gstNumber: "12ABCDE1234F1Z2", // must match regex: 2 digits, 5 letters, 4 digits, 1 letter, 1 alphanumeric, 'Z', 1 alphanumeric
        password: "Farhan@123",
        otp: "000000",
        isGstVerified: true,
        isverified: true,
      },
      {
        firstname: "Bob",
        lastname: "Johnson",
        companyName: "Bob Enterprises",
        email: "ansarifarhan813@example.com",
        mobileNumber: "0987654321",
        gstNumber: "34FGHIJ5678K2Z3",
        password: "Farhan@123",
        otp: "111111",
        isGstVerified: true,
        isverified: true,
      },
    ];

    const employers = [];
    for (const empData of employersData) {
      const employer = await Employer.create(empData);
      employers.push(employer);
    }

    // 3. Create Jobs (20 per employer)
    const jobPromises = [];
    employers.forEach((employer) => {
      for (let i = 1; i <= 20; i++) {
        const jobData = {
          title: `Job Title ${i} by ${employer?.firstname}`,
          experienceLevel: i % 2 == 0 ? "Entry-Level" : "Senior-Level",
          jobCategory: "Software Development",
          jobType: "Full Time",
          workMode: "Remote",
          salaryRange: "40k-70k",
          skills: skillIds,
          education: "Bachelor's Degree",
          industry: ["IT", "Software"],
          degree: "B.Tech",
          fromAge: "21",
          toAge: "35",
          gender: "Any",
          jobDescription:
            "This is a sample job description for testing purposes.",
          walkIn: "No",
          location: "Remote",
          distance: 0,
          previewed: true,
          isDeleted: false,
          isActive: true,
          createdBy: employer._id,
          applicants: [],
        };
        jobPromises.push(Job.create(jobData));
      }
    });
    await Promise.all(jobPromises);

    // 4. Create Users (5)
    const usersData = [
      {
        firstname: "John",
        lastname: "Doe",
        email: "ansarifarhan517@gmail.com",
        mobilenumber: "1111111111",
        password: "Farhan@123",
        isverified: true,
        userExperienceLevel: "Senior-Level",
        profilePicture: "http://example.com/profile1.jpg",
        resume: "http://example.com/resume1.pdf",
        educationAfter12th: [
          {
            educationLevel: "Post Graduate",
            courseName: "Computer Science",
            specialization: "Software Engineering",
            grading: "CGPA",
            gradeValue: 8.5,
            instituteName: "University A",
            courseDuration: {
              from: new Date("2015-08-01"),
              to: new Date("2019-05-30"),
            },
            courseType: "Full-time",
            examinationBoard: "NA",
            skills: "JavaScript, Node.js",
            passingYear: 2019,
          },
        ],
        educationTill12th: [
          {
            education: "High School",
            examinationBoard: "State Board",
            mediumOfStudy: "English",
            gradeType: "Percentage",
            gradingOutOf: "100",
            gradeValue: "90",
            passingYear: "2015",
          },
        ],
        careerPreference: {
          jobTypes: ["Full Time"],
          availability: "Immediate",
          preferredLocation: "Chennai",
          salaryRange: "50k-60k",
        },
        keySkills: ["JavaScript", "React"],
        dateOfBirth: new Date("1997-01-15"),
        gender: "Male",
        languages: [{ language: "English", proficiencyLevel: "Fluent" }],
        internships: [
          {
            companyName: "Tech Corp",
            role: "Intern",
            duration: {
              from: new Date("2018-06-01"),
              to: new Date("2018-08-01"),
            },
            projectName: "Project A",
            description: "Worked on frontend development",
            keySkills: "React",
            projectURL: "http://example.com/projectA",
          },
        ],
        projects: [
          {
            projectName: "Portfolio Website",
            duration: {
              from: new Date("2019-01-01"),
              to: new Date("2019-03-01"),
            },
            description: "Developed a personal portfolio website",
            keySkills: "HTML, CSS, JavaScript",
            endResult: "Successfully deployed",
            projectURL: "http://example.com/portfolio",
          },
        ],
        profileSummary: "Enthusiastic software developer.",
        accomplishments: [
          {
            certificationName: "Certification A",
            certificationID: "CERT123",
            certificationURL: "http://example.com/certA",
            certificationValidity: { month: "12", year: "2022" },
            awards: "Best Intern",
            clubs: "Coding Club",
            positionHeld: "Member",
            educationalReference: "University A",
            duration: {
              from: new Date("2018-01-01"),
              to: new Date("2018-12-31"),
            },
            responsibilities: "Various tasks",
            mediaUpload: "http://example.com/media",
          },
        ],
        competitiveExams: [
          {
            examName: "GRE",
            examYear: "2019",
          },
        ],
        employmentHistory: [
          {
            workExperience: { years: 1, months: 6 },
            companyName: "Startup Inc",
            duration: {
              from: new Date("2019-06-01"),
              to: new Date("2020-12-01"),
            },
            keyAchievements: "Developed key features",
            annualSalary: "$60k",
            isCurrentJob: false,
            description: "Worked as a developer",
          },
        ],
        academicAchievements: [
          {
            achievement: "Dean's List",
            receivedDuring: "Undergrad",
            topRank: "1",
          },
        ],
      },
      {
        firstname: "Jane",
        lastname: "Smith",
        email: "ansarifarhan813@gmail.com",
        mobilenumber: "2222222222",
        password: "Farhan@123",
        isverified: true,
        userExperienceLevel: "Senior-Level",
        profilePicture: "http://example.com/profile2.jpg",
        resume: "http://example.com/resume2.pdf",
        educationAfter12th: [
          {
            educationLevel: "Master's",
            courseName: "Information Technology",
            specialization: "Data Science",
            grading: "Percentage",
            gradeValue: 85,
            instituteName: "University B",
            courseDuration: {
              from: new Date("2016-08-01"),
              to: new Date("2018-05-30"),
            },
            courseType: "Full-time",
            examinationBoard: "NA",
            skills: "Python, R",
            passingYear: 2018,
          },
        ],
        educationTill12th: [
          {
            education: "High School",
            examinationBoard: "Central Board",
            mediumOfStudy: "English",
            gradeType: "CGPA",
            gradingOutOf: "10",
            gradeValue: "9",
            passingYear: "2016",
          },
        ],
        careerPreference: {
          jobTypes: ["Contract"],
          availability: "1 month notice",
          preferredLocation: "Hyderabad",
          salaryRange: "$70k-$90k",
        },
        keySkills: ["Python", "Data Analysis"],
        dateOfBirth: new Date("1990-05-20"),
        gender: "Female",
        languages: [
          { language: "English", proficiencyLevel: "Fluent" },
          { language: "Spanish", proficiencyLevel: "Intermediate" },
        ],
        internships: [
          {
            companyName: "Data Inc",
            role: "Data Analyst Intern",
            duration: {
              from: new Date("2017-06-01"),
              to: new Date("2017-08-01"),
            },
            projectName: "Project Data",
            description: "Analyzed data sets",
            keySkills: "SQL, Python",
            projectURL: "http://example.com/projectData",
          },
        ],
        projects: [
          {
            projectName: "Data Visualization",
            duration: {
              from: new Date("2018-01-01"),
              to: new Date("2018-04-01"),
            },
            description: "Built dashboards",
            keySkills: "Tableau, Python",
            endResult: "Implemented dashboards",
            projectURL: "http://example.com/dashboards",
          },
        ],
        profileSummary: "Data enthusiast with strong analytical skills.",
        accomplishments: [
          {
            certificationName: "Certification Data",
            certificationID: "CERT456",
            certificationURL: "http://example.com/certData",
            certificationValidity: { month: "06", year: "2023" },
            awards: "Top Analyst",
            clubs: "Data Club",
            positionHeld: "President",
            educationalReference: "University B",
            duration: {
              from: new Date("2017-01-01"),
              to: new Date("2017-12-31"),
            },
            responsibilities: "Led data projects",
            mediaUpload: "http://example.com/media2",
          },
        ],
        competitiveExams: [
          {
            examName: "GMAT",
            examYear: "2018",
          },
        ],
        employmentHistory: [
          {
            workExperience: { years: 3, months: 0 },
            companyName: "Big Data Co",
            duration: {
              from: new Date("2018-07-01"),
              to: new Date("2021-07-01"),
            },
            keyAchievements: "Led multiple projects",
            annualSalary: "$80k",
            isCurrentJob: false,
            description: "Senior data analyst",
          },
        ],
        academicAchievements: [
          {
            achievement: "Best Thesis",
            receivedDuring: "Master's",
            topRank: "1",
          },
        ],
      },
      {
        firstname: "Sam",
        lastname: "Wilson",
        email: "sam.wilson@example.com",
        mobilenumber: "3333333333",
        password: "Farhan@123",
        isverified: true,
        userExperienceLevel: "Entry-Level",
        profilePicture: "http://example.com/profile3.jpg",
        resume: "http://example.com/resume3.pdf",
        educationAfter12th: [
          {
            educationLevel: "Bachelor's",
            courseName: "Engineering",
            specialization: "Mechanical",
            grading: "Percentage",
            gradeValue: 75,
            instituteName: "Institute X",
            courseDuration: {
              from: new Date("2014-08-01"),
              to: new Date("2018-05-30"),
            },
            courseType: "Full-time",
            examinationBoard: "NA",
            skills: "CAD, MATLAB",
            passingYear: 2018,
          },
        ],
        educationTill12th: [
          {
            education: "High School",
            examinationBoard: "State Board",
            mediumOfStudy: "English",
            gradeType: "Percentage",
            gradingOutOf: "100",
            gradeValue: "85",
            passingYear: "2014",
          },
        ],
        careerPreference: {
          jobTypes: ["Internship"],
          availability: "2 weeks",
          preferredLocation: "Banglore",
          salaryRange: "$30k-$40k",
        },
        keySkills: ["CAD", "MATLAB"],
        dateOfBirth: new Date("1996-07-10"),
        gender: "Male",
        languages: [{ language: "English", proficiencyLevel: "Fluent" }],
        internships: [
          {
            companyName: "Manufacturing Inc",
            role: "Intern",
            duration: {
              from: new Date("2017-06-01"),
              to: new Date("2017-08-01"),
            },
            projectName: "Project Mechanical",
            description: "Worked on machine design",
            keySkills: "SolidWorks",
            projectURL: "http://example.com/projectMech",
          },
        ],
        projects: [
          {
            projectName: "Engine Design",
            duration: {
              from: new Date("2018-01-01"),
              to: new Date("2018-03-01"),
            },
            description: "Designed an engine",
            keySkills: "AutoCAD",
            endResult: "Prototype built",
            projectURL: "http://example.com/engine",
          },
        ],
        profileSummary: "Mechanical engineer with internship experience.",
        accomplishments: [
          {
            certificationName: "Certification Mech",
            certificationID: "CERT789",
            certificationURL: "http://example.com/certMech",
            certificationValidity: { month: "09", year: "2022" },
            awards: "Best Intern",
            clubs: "Robotics Club",
            positionHeld: "Vice President",
            educationalReference: "Institute X",
            duration: {
              from: new Date("2017-01-01"),
              to: new Date("2017-12-31"),
            },
            responsibilities: "Assisted in design tasks",
            mediaUpload: "http://example.com/media3",
          },
        ],
        competitiveExams: [
          {
            examName: "SAT",
            examYear: "2014",
          },
        ],
        employmentHistory: [
          {
            workExperience: { years: 0, months: 6 },
            companyName: "Startups Ltd",
            duration: {
              from: new Date("2018-06-01"),
              to: new Date("2018-12-01"),
            },
            keyAchievements: "Contributed to product design",
            annualSalary: "$35k",
            isCurrentJob: false,
            description: "Junior intern",
          },
        ],
        academicAchievements: [
          {
            achievement: "Best Project",
            receivedDuring: "Undergrad",
            topRank: "1",
          },
        ],
      },
      {
        firstname: "Emily",
        lastname: "Brown",
        email: "emily.brown@example.com",
        mobilenumber: "4444444444",
        password: "Farhan@123",
        isverified: true,
        userExperienceLevel: "Entry-Level",
        profilePicture: "http://example.com/profile4.jpg",
        resume: "http://example.com/resume4.pdf",
        educationAfter12th: [
          {
            educationLevel: "Bachelor's",
            courseName: "Design",
            specialization: "Graphic Design",
            grading: "Percentage",
            gradeValue: 88,
            instituteName: "Design School",
            courseDuration: {
              from: new Date("2013-08-01"),
              to: new Date("2017-05-30"),
            },
            courseType: "Full-time",
            examinationBoard: "NA",
            skills: "Photoshop, Illustrator",
            passingYear: 2017,
          },
        ],
        educationTill12th: [
          {
            education: "High School",
            examinationBoard: "Central Board",
            mediumOfStudy: "English",
            gradeType: "Percentage",
            gradingOutOf: "100",
            gradeValue: "92",
            passingYear: "2013",
          },
        ],
        careerPreference: {
          jobTypes: ["Full Time"],
          availability: "Immediate",
          preferredLocation: "Mumbai",
          salaryRange: "$40k-$50k",
        },
        keySkills: ["Photoshop", "Illustrator"],
        dateOfBirth: new Date("1995-09-25"),
        gender: "Female",
        languages: [{ language: "English", proficiencyLevel: "Fluent" }],
        internships: [
          {
            companyName: "Design Studio",
            role: "Intern",
            duration: {
              from: new Date("2016-06-01"),
              to: new Date("2016-08-01"),
            },
            projectName: "Brand Redesign",
            description: "Worked on brand identity",
            keySkills: "Photoshop",
            projectURL: "http://example.com/brand",
          },
        ],
        projects: [
          {
            projectName: "Logo Design",
            duration: {
              from: new Date("2017-01-01"),
              to: new Date("2017-03-01"),
            },
            description: "Designed logos for local businesses",
            keySkills: "Illustrator",
            endResult: "Successful rebranding",
            projectURL: "http://example.com/logo",
          },
        ],
        profileSummary: "Creative graphic designer with internship experience.",
        accomplishments: [
          {
            certificationName: "Certification Design",
            certificationID: "CERT101",
            certificationURL: "http://example.com/certDesign",
            certificationValidity: { month: "11", year: "2023" },
            awards: "Best Designer",
            clubs: "Art Club",
            positionHeld: "Member",
            educationalReference: "Design School",
            duration: {
              from: new Date("2016-01-01"),
              to: new Date("2016-12-31"),
            },
            responsibilities: "Led design projects",
            mediaUpload: "http://example.com/media4",
          },
        ],
        competitiveExams: [
          {
            examName: "SAT",
            examYear: "2013",
          },
        ],
        employmentHistory: [
          {
            workExperience: { years: 1, months: 0 },
            companyName: "Creative Agency",
            duration: {
              from: new Date("2017-06-01"),
              to: new Date("2018-06-01"),
            },
            keyAchievements: "Redesigned client websites",
            annualSalary: "$45k",
            isCurrentJob: false,
            description: "Junior designer",
          },
        ],
        academicAchievements: [
          {
            achievement: "Top Designer",
            receivedDuring: "Undergrad",
            topRank: "1",
          },
        ],
      },
    ];

    for (const userData of usersData) {
      await User.create(userData);
    }

    console.log("Sample data created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating sample data:", err);
    process.exit(1);
  }
})();

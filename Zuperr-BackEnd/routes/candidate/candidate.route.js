const express = require('express');
const { getJobsByEmployerId, getcandidatesData } = require('../../controller/employer/employer.controller');
const router = express.Router();



// const statuses = ['Under Review', 'Rejected', 'Shortlisted', 'Hired'];
// const candidatesData = [];

// // Generate 100 dummy records
// for (let i = 1; i <= 100; i++) {
//   candidatesData.push({
//     id: i,
//     name: `Candidate ${i}`,
//     location: `${(Math.random() * 30).toFixed(1)}km`,
//     score: `${Math.floor(Math.random() * 100)}%`,
//     experience: `${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 10)} Yr`,
//     ctc: `${(Math.random() * 12).toFixed(1)} CTC`,
//     cv: 'Click here',
//     status: statuses[Math.floor(Math.random() * statuses.length)],
//   });
// }


// // Dummy data for candidates
// const candidatesData = [
//     {
//         id: 1,
//         name: 'Shubham Telvane',
//         location: '27.3km',
//         score: '60%',
//         experience: '2-3 Yr',
//         ctc: '5.5 CTC',
//         cv: 'Click here',
//         status: 'Under Review',
//     },
//     {
//         id: 2,
//         name: 'Shivam Banerjee',
//         location: '25km',
//         score: '72%',
//         experience: '3-5 Yr',
//         ctc: '7.5 CTC',
//         cv: 'Click here',
//         status: 'Rejected',
//     },
//     {
//         id: 3,
//         name: 'Ashish Gupta',
//         location: '29.7km',
//         score: '80%',
//         experience: '1-2 Yr',
//         ctc: '3.5 CTC',
//         cv: 'Click here',
//         status: 'Shortlisted',
//     },
//     {
//         id: 4,
//         name: 'Sumit Verma',
//         location: '28.9km',
//         score: '95%',
//         experience: '1-2 Yr',
//         ctc: '11.2 CTC',
//         cv: 'Click here',
//         status: 'Shortlisted',
//     },
// ];

router.get('/getcandidatesData', getcandidatesData);
router.post('/getJobsByEmployerId', getJobsByEmployerId);


module.exports = router;

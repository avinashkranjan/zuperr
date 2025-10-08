# Job Recommendation, Job Sharing, and Similar Job Features

This document describes the newly implemented job recommendation, job sharing, and similar job features.

## Overview

Three new features have been added to enhance the job discovery and sharing experience:

1. **Personalized Job Recommendations** - Shows jobs tailored to the user's profile, skills, and preferences
2. **Job Sharing** - Allows users to share job listings via social media, email, or link copying
3. **Similar Jobs** - Displays jobs similar to the one being viewed

## Backend API Endpoints

### 1. Get Job Recommendations
**Endpoint:** `GET /api/employee/jobs/recommendations`  
**Authentication:** Required (Bearer token)  
**Description:** Returns personalized job recommendations based on user profile, skills, experience level, and selected job categories.

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "_id": "job_id",
      "title": "Software Engineer",
      "companyName": "Tech Corp",
      "skills": [...],
      "skillMatchCount": 5,
      ...
    }
  ],
  "count": 10
}
```

**Recommendation Algorithm:**
- Matches user's experience level with job requirements
- Filters by user's selected job categories
- Prioritizes jobs with overlapping skills
- Excludes jobs the user has already applied to
- Returns top 10 matches sorted by skill match count

### 2. Get Similar Jobs
**Endpoint:** `GET /api/employee/jobs/similar/:jobId`  
**Authentication:** Optional (but recommended)  
**Description:** Returns jobs similar to the specified job based on category, skills, and location.

**Response:**
```json
{
  "success": true,
  "similarJobs": [
    {
      "_id": "job_id",
      "title": "Senior Developer",
      "similarityScore": 8,
      ...
    }
  ],
  "count": 6
}
```

**Similarity Algorithm:**
- +3 points for matching job category
- +1 point per matching skill
- +2 points for matching location
- Returns top 6 jobs with similarity score > 0
- Excludes the reference job and jobs user has applied to

### 3. Share Job
**Endpoint:** `POST /api/employee/jobs/share`  
**Authentication:** Optional  
**Description:** Tracks job sharing events for analytics.

**Request Body:**
```json
{
  "jobId": "job_id",
  "platform": "linkedin" // Options: linkedin, twitter, facebook, whatsapp, email, clipboard
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job shared successfully",
  "jobId": "job_id",
  "platform": "linkedin"
}
```

## Frontend Components

### 1. JobRecommendations Component
**Location:** `Zuperr-FrontEnd/src/components/JobRecommendations.tsx`

**Usage:**
```tsx
import JobRecommendations from "@components/JobRecommendations";

<JobRecommendations onJobClick={handleJobClick} />
```

**Features:**
- Automatically fetches personalized recommendations on mount
- Shows loading skeleton while fetching
- Displays recommendations in a grid layout
- Includes "Recommended for You" header with sparkle icon
- Only renders if recommendations are available

### 2. JobShareButton Component
**Location:** `Zuperr-FrontEnd/src/components/JobShareButton.tsx`

**Usage:**
```tsx
import JobShareButton from "@components/JobShareButton";

<JobShareButton 
  jobId={job._id} 
  jobTitle={job.title}
  companyName={job.companyName}
  variant="outline"
  size="default"
/>
```

**Features:**
- Share via LinkedIn, Twitter, Facebook, WhatsApp, Email
- Copy job link to clipboard with visual feedback
- Tracks sharing events via API
- Modal dialog with social media icons
- Toast notifications for user feedback

### 3. SimilarJobs Component
**Location:** `Zuperr-FrontEnd/src/components/SimilarJobs.tsx`

**Usage:**
```tsx
import SimilarJobs from "@components/SimilarJobs";

<SimilarJobs jobId={job._id} onJobClick={handleJobClick} />
```

**Features:**
- Automatically fetches similar jobs based on jobId
- Shows loading skeleton while fetching
- Displays up to 6 similar jobs in a grid
- Includes "Similar Jobs" header with layers icon
- Only renders if similar jobs are found

## Integration Points

### Jobs Page (`/jobs`)
- **JobRecommendations** component added below Categories section
- Shows personalized job recommendations at the top of the jobs listing
- Updates when user profile changes

### Job Modal (Job Detail View)
- **JobShareButton** added to action buttons alongside Bookmark and Apply
- **SimilarJobs** component added at the bottom of the modal
- Allows users to share jobs and discover related opportunities

## User Experience Flow

### Job Recommendations Flow
1. User logs in and navigates to jobs page
2. System fetches user profile (skills, experience, preferences)
3. Backend calculates personalized recommendations
4. Recommendations displayed prominently with visual indicators
5. User can click any recommendation to view details

### Job Sharing Flow
1. User clicks "Share" button on a job
2. Modal opens with sharing options
3. User selects preferred platform or copies link
4. System tracks the share event
5. User redirected to chosen platform or sees success message

### Similar Jobs Flow
1. User opens a job detail modal
2. System fetches similar jobs based on current job
3. Similar jobs displayed at bottom of modal
4. User can click to view similar job details
5. Process repeats for newly selected job

## Technical Implementation Details

### Backend
- Controllers: `Zuperr-BackEnd/controller/employee/employee.controller.js`
- Routes: `Zuperr-BackEnd/routes/employee/employee.route.js`
- Uses MongoDB aggregation pipeline for efficient querying
- Leverages indexes on job fields for performance
- Implements scoring algorithms for recommendations and similarity

### Frontend
- TypeScript/React components with hooks
- Uses existing UI components (Button, Dialog, Badge)
- Integrates with toast notifications for feedback
- Responsive design with Tailwind CSS
- Loading states and error handling

## Future Enhancements

### Recommendations
- Machine learning-based recommendations
- User feedback loop (like/dislike)
- Time-based recommendations (trending jobs)
- Location-based filtering with distance

### Sharing
- Share analytics dashboard
- Track conversion rates
- Referral bonuses
- Custom share messages

### Similar Jobs
- Industry-specific similarity scoring
- Salary range matching
- Company culture matching
- Career path suggestions

## Testing

To test the features:

1. **Recommendations:**
   - Log in as a user with profile data
   - Navigate to `/jobs`
   - Verify recommendations appear
   - Check that jobs match user's profile

2. **Job Sharing:**
   - Open any job detail modal
   - Click "Share" button
   - Test each sharing platform
   - Verify copy link functionality

3. **Similar Jobs:**
   - Open any job detail modal
   - Scroll to bottom
   - Verify similar jobs are displayed
   - Click a similar job to verify navigation

## API Documentation

For complete API documentation, refer to:
- Postman Collection: (to be added)
- Swagger/OpenAPI: (to be added)

## Dependencies

### Backend
- mongoose (for database operations)
- express (for routing)
- jsonwebtoken (for authentication)

### Frontend
- react (component library)
- lucide-react (icons)
- @components/ui/* (UI components)
- tailwindcss (styling)

## Support

For issues or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the FAQ section

---

Last Updated: January 2025

# Zuperr API Documentation - Company Refactor

This document describes the new APIs introduced as part of the Employer → Company refactoring.

## Company APIs

### List Companies
```
GET /api/company
```
Returns a list of all active companies.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "company_id",
      "companyName": "Tech Corp",
      "companyLogo": "logo_url",
      "averageRating": 4.5,
      "totalReviews": 10,
      "trustScore": 8.5,
      ...
    }
  ]
}
```

### Get Company Details
```
GET /api/company/:id
```
Get detailed information about a specific company including recent reviews.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "company_id",
    "companyName": "Tech Corp",
    "description": "Leading tech company...",
    "averageRating": 4.5,
    "totalReviews": 10,
    "recentReviews": [...]
  }
}
```

### Update Company (Admin Only)
```
PUT /api/company/:id
Authorization: Bearer {token}
```
Update company details. Requires authenticated employer with admin role.

**Request Body:**
```json
{
  "companyName": "Updated Name",
  "description": "New description",
  "companyWebsite": "https://example.com"
}
```

### Delete Company (Admin Only)
```
DELETE /api/company/:id
Authorization: Bearer {token}
```
Soft delete a company. Requires admin role.

**Request Body:**
```json
{
  "reason": "Duplicate company"
}
```

### Get Company Team
```
GET /api/company/:id/employers
```
List all employers (team members) associated with a company.

---

## Company Review APIs

### Create Review
```
POST /api/company/:id/reviews
Authorization: Bearer {token}
```
Submit a review for a company. One review per user per company.

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great place to work",
  "content": "I really enjoyed working here...",
  "pros": "Good culture, great benefits",
  "cons": "Long hours sometimes"
}
```

### Get Company Reviews
```
GET /api/company/:id/reviews?page=1&limit=10&sortBy=-createdAt
```
Get paginated reviews for a company.

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

### Update Review
```
PUT /api/company/reviews/:reviewId
Authorization: Bearer {token}
```
Update your own review.

### Delete Review
```
DELETE /api/company/reviews/:reviewId
Authorization: Bearer {token}
```
Delete your own review.

### Vote Review as Helpful
```
POST /api/company/reviews/:reviewId/helpful
```
Increment the helpful count for a review.

---

## Comment APIs (Reddit-style)

### Create Comment
```
POST /api/comments
Authorization: Bearer {token}
```
Create a new comment or reply to an existing comment.

**Request Body:**
```json
{
  "resourceType": "Company",
  "resourceId": "company_id",
  "parentId": "comment_id", // Optional, for replies
  "content": "This is a great company!"
}
```

### Get Comments
```
GET /api/comments?resourceType=Company&resourceId={id}&sortBy=-score
```
Get comments for a resource (Company, Job, etc.).

**Query Parameters:**
- `resourceType`: Type of resource (Company, Job, Post, Review)
- `resourceId`: ID of the resource
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `sortBy`: Sort field (-score for best, -createdAt for newest)

### Update Comment
```
PUT /api/comments/:id
Authorization: Bearer {token}
```
Update your own comment.

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

### Delete Comment
```
DELETE /api/comments/:id
Authorization: Bearer {token}
```
Soft delete your own comment.

### Vote on Comment
```
POST /api/comments/:id/vote
Authorization: Bearer {token}
```
Upvote or downvote a comment (Reddit-style).

**Request Body:**
```json
{
  "vote": 1  // 1 for upvote, -1 for downvote
}
```
Voting the same way again removes the vote (toggle).

### Get Comment Replies
```
GET /api/comments/:id/replies?page=1&limit=20
```
Get paginated replies for a specific comment.

---

## Employer Bookmark APIs

### Bookmark Candidate
```
POST /api/employer/:id/bookmark
Authorization: Bearer {token}
```
Bookmark a candidate for later review.

**Request Body:**
```json
{
  "candidateId": "user_id"
}
```

### Remove Bookmark
```
DELETE /api/employer/:id/bookmark
Authorization: Bearer {token}
```
Remove a candidate from bookmarks.

**Request Body:**
```json
{
  "candidateId": "user_id"
}
```

---

## Mail Service APIs

### Send Single Email
```
POST /api/mail/single
Authorization: Bearer {token}
```
Send a single email.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Subject line",
  "text": "Plain text content",
  "html": "<p>HTML content</p>"
}
```

### Send Bulk Emails
```
POST /api/mail/bulk
Authorization: Bearer {token}
```
Send multiple emails in batch (with rate limiting).

**Request Body:**
```json
{
  "emails": [
    {
      "to": "recipient1@example.com",
      "subject": "Subject 1",
      "text": "Content 1"
    },
    {
      "to": "recipient2@example.com",
      "subject": "Subject 2",
      "text": "Content 2"
    }
  ]
}
```

### Send Template Email
```
POST /api/mail/template
Authorization: Bearer {token}
```
Send an email using a predefined template.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "template": "welcome",
  "data": {
    "name": "John Doe"
  }
}
```

**Available Templates:**
- `welcome`: Welcome email for new users
- `jobPosted`: Confirmation email for job posting
- `applicationReceived`: Notification for new application

---

## Migration

### Running the Migration Script

Before running the migration, ensure you have:
1. A backup of your database
2. The `MONGO_URI` or `MONGODB_URI` environment variable set

```bash
cd Zuperr-BackEnd
node migrations/migrate-employer-to-company.js
```

The migration script:
- Is idempotent (safe to run multiple times)
- Groups employers by company name
- Creates Company documents from employer data
- Links employers to companies via `companyId`
- Assigns the first employer in each group as "admin", others as "member"
- Skips employers already migrated (have `companyId`)

---

## Backward Compatibility

All existing employer APIs remain functional:
- Employer registration/login unchanged
- Existing employer endpoints work as before
- Company data can be accessed via employer (for backward compatibility) or directly via company endpoints

---

## Authentication

Most endpoints require authentication via JWT token:
```
Authorization: Bearer {token}
```

The token contains:
- `userId`: ID of the authenticated user
- `userType`: "User" or "Employer"

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad request
- `401`: Unauthorized (no token)
- `403`: Forbidden (no permission)
- `404`: Not found
- `409`: Conflict (e.g., duplicate review)
- `500`: Server error

---

## Integration Hooks

The following placeholders are included for future features:

### Analytics
Company model includes:
- `analyticsEnabled`: Boolean flag
- Can be extended with telemetry data

### Sponsored Features
Company model includes:
- `sponsoredTier`: "none", "basic", "premium"
- Can be extended with sponsorship analytics


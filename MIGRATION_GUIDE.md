# Employer → Company Migration Guide

This guide describes the changes made in the Employer → Company refactoring and how to safely migrate your data.

## Overview

This update refactors the `Employer` model to extract a new `Company` model, enabling multi-user support where multiple employers can be associated with a single company. It also introduces:

- **Company APIs**: CRUD operations for companies with admin permissions
- **Company Reviews**: User reviews and ratings for companies
- **Reddit-style Comments**: Threaded comment system with voting
- **Bookmark System**: Employers can bookmark candidates
- **Mail Service**: Single and bulk email sending capabilities

## What Changed

### 1. Database Models

#### New Models Created:
- **Company** (`model/company/company.model.js`)
  - Stores company-level information (name, logo, address, GST, etc.)
  - Aggregates trust metrics and ratings
  - Supports soft delete
  - Includes analytics and sponsorship hooks

- **CompanyReview** (`model/company/companyReview.model.js`)
  - User reviews for companies
  - Star ratings (1-5)
  - Pros/cons sections
  - Helpful voting system

- **Comment** (`model/comment/comment.model.js`)
  - Polymorphic comments (can attach to any resource)
  - Threaded replies with depth tracking
  - Upvote/downvote system
  - Soft delete support

#### Updated Models:
- **Employer** (`model/employer/employer.model.js`)
  - Added `companyId` field (reference to Company)
  - Added `role` field ("admin" or "member")
  - Added `bookmarkedCandidates` array
  - All company-specific fields retained for backward compatibility

### 2. Backend APIs

#### New Endpoints:

**Company APIs:**
```
GET    /api/company              - List all companies
GET    /api/company/:id          - Get company details
PUT    /api/company/:id          - Update company (admin only)
DELETE /api/company/:id          - Delete company (admin only)
GET    /api/company/:id/employers - Get company team
```

**Review APIs:**
```
POST   /api/company/:id/reviews       - Create review
GET    /api/company/:id/reviews       - Get reviews
PUT    /api/company/reviews/:reviewId - Update review
DELETE /api/company/reviews/:reviewId - Delete review
POST   /api/company/reviews/:reviewId/helpful - Vote helpful
```

**Comment APIs:**
```
POST   /api/comments           - Create comment/reply
GET    /api/comments           - Get comments
GET    /api/comments/:id       - Get single comment
PUT    /api/comments/:id       - Update comment
DELETE /api/comments/:id       - Delete comment
POST   /api/comments/:id/vote  - Vote on comment
GET    /api/comments/:id/replies - Get replies
```

**Bookmark APIs:**
```
POST   /api/employer/:id/bookmark - Bookmark candidate
DELETE /api/employer/:id/bookmark - Remove bookmark
```

**Mail APIs:**
```
POST   /api/mail/single   - Send single email
POST   /api/mail/bulk     - Send bulk emails
POST   /api/mail/template - Send template email
```

### 3. Frontend Components

#### New Pages/Components:
- **CompanyDetails** (`pages/company/CompanyDetails.tsx`)
  - Full company profile page
  - Tabbed interface (Overview, Reviews, Discussion)
  - Rating display
  - Trust score visualization

- **ReviewList** (`pages/company/ReviewList.tsx`)
  - Paginated review list
  - Star rating display
  - Helpful voting
  - Pros/cons sections

- **CommentThread** (`pages/comment/CommentThread.tsx`)
  - Reddit-style threaded comments
  - Upvote/downvote buttons
  - Reply functionality
  - Sort by best/new

#### Updated Pages:
- **Companies** (`pages/company/index.tsx`)
  - Now links to CompanyDetails page
  - Falls back to modal for non-migrated employers

#### New Routes:
```
/companies           - List of companies (existing)
/company/:id         - Company details page (new)
```

## Migration Process

### Prerequisites

1. **Backup your database**
   ```bash
   mongodump --uri="your_mongo_uri" --out=/backup/path
   ```

2. **Set environment variables**
   Ensure your `.env` file contains:
   ```
   MONGO_URI=your_mongodb_connection_string
   # or
   MONGODB_URI=your_mongodb_connection_string
   ```

### Running the Migration

1. **Install dependencies** (if not already done)
   ```bash
   cd Zuperr-BackEnd
   npm install
   ```

2. **Run the migration script**
   ```bash
   node migrations/migrate-employer-to-company.js
   ```

3. **Verify the migration**
   The script will output:
   - Number of companies created
   - Number of employers updated
   - Number of employers skipped (already migrated)

### Migration Details

The migration script:

1. **Groups employers by company name**
   - Employers with the same `companyName` are grouped together

2. **Creates Company documents**
   - Extracts company data from the first employer in each group
   - Creates a new `Company` document with this data

3. **Links employers to companies**
   - Sets the `companyId` field on each employer
   - Assigns the first employer as "admin", others as "member"

4. **Is idempotent**
   - Safe to run multiple times
   - Skips employers that already have a `companyId`

### Post-Migration Verification

1. **Check company creation**
   ```bash
   # In MongoDB shell or Compass
   db.companies.countDocuments()
   ```

2. **Verify employer links**
   ```bash
   db.employers.find({ companyId: { $exists: true } }).count()
   ```

3. **Test API endpoints**
   ```bash
   curl http://localhost:5000/api/company
   ```

## Backward Compatibility

All existing functionality is preserved:

- ✅ Employer registration/login unchanged
- ✅ Employer profile updates work as before
- ✅ Company data accessible via employer (for backward compatibility)
- ✅ Existing employer APIs continue to function
- ✅ Frontend components gracefully handle non-migrated data

## Testing Checklist

### Backend Tests:
- [ ] Migration script runs without errors
- [ ] Companies created correctly
- [ ] Employers linked with correct roles
- [ ] Company CRUD endpoints work
- [ ] Admin permission checks enforced
- [ ] Review creation and aggregation work
- [ ] Comment threading and voting work
- [ ] Bookmark endpoints function
- [ ] Mail service can send emails

### Frontend Tests:
- [ ] CompanyDetails page loads
- [ ] Reviews display correctly
- [ ] Comment thread renders with nesting
- [ ] Voting buttons work
- [ ] Navigation between pages works
- [ ] Backward compatibility with non-migrated employers

### Integration Tests:
- [ ] Employer can create company
- [ ] Multiple employers can join same company
- [ ] Admin can update company
- [ ] Non-admin cannot update company
- [ ] Users can post reviews
- [ ] Comments support threading
- [ ] Voting updates scores correctly

## Rollback Plan

If you need to rollback:

1. **Restore database from backup**
   ```bash
   mongorestore --uri="your_mongo_uri" /backup/path
   ```

2. **Revert code changes**
   ```bash
   git checkout previous_version
   ```

3. **Restart services**
   ```bash
   npm start
   ```

## Configuration

### Environment Variables

The following environment variables are used:

```bash
# Database
MONGO_URI=mongodb://...
# or
MONGODB_URI=mongodb://...

# Mail Service (optional, falls back to console logging)
nodemailClientId=your_oauth_client_id
clientSecret=your_oauth_client_secret
redirectUri=your_redirect_uri
refereshToken=your_refresh_token
EMAIL_USER=noreply@zuperr.co
```

### Feature Flags

To enable/disable features:

```javascript
// In company.model.js
analyticsEnabled: true/false  // Enable analytics tracking
sponsoredTier: "none"|"basic"|"premium"  // Sponsorship level
```

## Performance Considerations

1. **Indexes Created:**
   - Company: companyName, isDeleted, averageRating
   - CompanyReview: companyId + userId (unique)
   - Comment: resourceType + resourceId, parentId, score, authorId

2. **Aggregation:**
   - Review ratings are aggregated and cached on Company documents
   - Comment scores are calculated on-the-fly

3. **Rate Limiting:**
   - Bulk mail sends are rate-limited (10 per batch, 1s delay)

## Support

For issues or questions:

1. Check the API documentation: `API_DOCUMENTATION.md`
2. Review migration logs for errors
3. Open an issue on GitHub
4. Contact the development team

## Future Enhancements

This PR includes integration hooks for:

- **Analytics**: Track user behavior, engagement metrics
- **Sponsorship**: Premium company features, promoted listings
- **Advanced Comments**: Markdown support, file attachments
- **Review Moderation**: AI-powered content filtering
- **Multi-tenant**: Support for company hierarchies

These features can be added in future iterations without breaking changes.

---

**Version**: 1.0.0  
**Date**: 2025-10-01  
**Status**: Ready for Production

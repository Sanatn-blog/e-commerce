# Newsletter Subscription Feature

## Overview

Complete newsletter subscription system with email confirmation and admin management panel.

## Features

### User Features

- ✅ Newsletter subscription form on homepage
- ✅ Email validation
- ✅ Automatic welcome email after subscription
- ✅ Duplicate email prevention
- ✅ Reactivation of inactive subscriptions
- ✅ Loading states and error handling
- ✅ Toast notifications for feedback

### Admin Features

- ✅ View all newsletter subscribers
- ✅ Statistics dashboard (Total, Active, Inactive)
- ✅ Search subscribers by email
- ✅ Toggle subscriber status (Active/Inactive)
- ✅ Delete subscribers
- ✅ Export subscribers to CSV
- ✅ Responsive design

## Files Created

### Models

- `models/Newsletter.ts` - Newsletter subscriber database schema

### API Routes

- `app/api/newsletter/subscribe/route.ts` - Public subscription endpoint
- `app/api/admin/newsletter/route.ts` - Admin management endpoints (GET, DELETE, PATCH)

### Components

- `app/components/Newsletter.tsx` - Updated with API integration
- `app/admin/newsletter/page.tsx` - Admin panel for managing subscribers

### Utilities

- `lib/email.ts` - Email sending utility with HTML template
- `lib/auth.ts` - Added `verifyAdminToken` function

### Navigation

- `app/admin/components/AdminSidebar.tsx` - Added Newsletter menu item

## Database Schema

```typescript
{
  email: String (required, unique, lowercase)
  subscribedAt: Date (default: now)
  isActive: Boolean (default: true)
}
```

## API Endpoints

### Public Endpoints

#### POST `/api/newsletter/subscribe`

Subscribe to newsletter

```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "message": "Successfully subscribed to newsletter!",
  "subscriber": { ... }
}
```

### Admin Endpoints (Requires Authentication)

#### GET `/api/admin/newsletter`

Get all subscribers with statistics

```json
Response:
{
  "subscribers": [...],
  "stats": {
    "total": 100,
    "active": 95,
    "inactive": 5
  }
}
```

#### DELETE `/api/admin/newsletter?id={subscriberId}`

Remove a subscriber

#### PATCH `/api/admin/newsletter`

Toggle subscriber status

```json
Request:
{
  "id": "subscriberId",
  "isActive": false
}
```

## Email Configuration

The newsletter feature includes email functionality. Currently, emails are logged to the console for development.

### Production Setup

To send actual emails in production, integrate one of these services:

#### Option 1: Resend (Recommended)

```bash
npm install resend
```

Add to `.env`:

```
RESEND_API_KEY=your_api_key
```

Update `lib/email.ts`:

```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send(emailContent);
```

#### Option 2: SendGrid

```bash
npm install @sendgrid/mail
```

Add to `.env`:

```
SENDGRID_API_KEY=your_api_key
```

Update `lib/email.ts`:

```typescript
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
await sgMail.send(emailContent);
```

#### Option 3: Nodemailer

```bash
npm install nodemailer
```

Configure SMTP settings in `.env` and update `lib/email.ts` accordingly.

## Usage

### For Users

1. Navigate to the homepage
2. Scroll to the "Subscribe to Our Newsletter" section
3. Enter email address
4. Click "Subscribe"
5. Receive confirmation email

### For Admins

1. Login to admin panel
2. Click "Newsletter" in the sidebar
3. View subscriber statistics
4. Search, manage, or export subscribers
5. Toggle subscriber status or delete as needed

## Admin Panel Features

### Statistics Cards

- Total Subscribers
- Active Subscribers
- Inactive Subscribers

### Subscriber Management

- Search by email
- View subscription date
- Toggle active/inactive status
- Delete subscribers
- Export to CSV

### Export Functionality

Click "Export CSV" to download all subscribers with:

- Email address
- Subscription date
- Status (Active/Inactive)

## Security

- Admin endpoints protected with JWT authentication
- Email validation on both client and server
- Duplicate prevention
- SQL injection protection via Mongoose
- XSS protection in email templates

## Future Enhancements

Potential improvements:

- [ ] Bulk email sending to subscribers
- [ ] Email templates management
- [ ] Unsubscribe link in emails
- [ ] Subscriber preferences/categories
- [ ] Email campaign tracking
- [ ] A/B testing for emails
- [ ] Scheduled email campaigns
- [ ] Subscriber segmentation
- [ ] Email analytics (open rates, click rates)

## Testing

### Test Subscription

1. Go to homepage
2. Enter test email
3. Check console for email log
4. Verify in admin panel

### Test Admin Panel

1. Login as admin
2. Navigate to `/admin/newsletter`
3. Test search functionality
4. Test status toggle
5. Test delete functionality
6. Test CSV export

## Troubleshooting

### Emails not sending

- Check email service configuration in `lib/email.ts`
- Verify API keys in `.env`
- Check console logs for errors

### Admin panel not accessible

- Verify admin authentication
- Check JWT token in cookies
- Ensure admin is logged in

### Duplicate email error

- This is expected behavior
- User will see "already subscribed" message
- Inactive subscriptions can be reactivated

## Notes

- Email sending is currently logged to console for development
- Configure a real email service before production deployment
- The welcome email includes a 10% discount offer
- CSV export includes all subscribers regardless of status
- Deleted subscribers cannot be recovered

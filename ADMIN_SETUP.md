# Admin Login Setup Guide

## Security Features Implemented

1. **Password Hashing**: Using bcryptjs with 12 salt rounds
2. **JWT Authentication**: Secure token-based authentication with jose library
3. **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
4. **Route Protection**: Middleware protects all admin routes
5. **Session Management**: 24-hour session expiration

## Setup Instructions

### 1. Add JWT Secret to .env

Add this to your `.env` file:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Generate a strong random string for production!

### 2. Create Your First Admin Account

Use this curl command or Postman to create an admin:

```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "YourSecurePassword123!",
    "name": "Admin Name"
  }'
```

**Security Note**: After creating your admin account, you should either:

- Delete the `/app/api/admin/create/route.ts` file, OR
- Add authentication to protect this endpoint

### 3. Login

Navigate to: `http://localhost:3000/admin/login`

Use the credentials you created in step 2.

## Routes

- `/admin/login` - Login page
- `/admin` - Protected admin dashboard (requires authentication)
- All `/admin/*` routes are protected by middleware

## API Endpoints

- `POST /api/admin/create` - Create new admin (should be protected/removed)
- `POST /api/admin/login` - Login endpoint
- `POST /api/admin/logout` - Logout endpoint

## Security Best Practices

1. **Change JWT_SECRET**: Use a strong, random secret in production
2. **HTTPS Only**: Enable secure cookies in production (already configured)
3. **Rate Limiting**: Consider adding rate limiting to login endpoint
4. **Remove Create Endpoint**: Delete or protect the admin creation endpoint after setup
5. **Strong Passwords**: Enforce strong password requirements
6. **Regular Updates**: Keep dependencies updated for security patches

## Testing

1. Start your development server: `npm run dev`
2. Create an admin account using the API
3. Visit `/admin/login` and sign in
4. You'll be redirected to `/admin` dashboard
5. Try accessing `/admin` without logging in - you'll be redirected to login
6. Click the logout button in the header to sign out

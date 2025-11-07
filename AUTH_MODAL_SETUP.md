# Auth Modal with Admin-Managed Image

## Overview

The login/registration modal now features a two-column layout with an image on the left side that can be updated from the admin panel.

## Features

- Two-column responsive layout (image on left, form on right)
- Admin-configurable auth modal image
- Fallback to default image if none is set
- Mobile-responsive (image hidden on small screens)

## Admin Configuration

### Access Settings Page

Navigate to: `/admin/settings`

### Update Auth Modal Image

1. Go to Admin Settings page
2. Upload a new image or enter an image URL
3. Click "Save Settings"
4. The image will be displayed on the left side of the login/register modal

### Recommended Image Specifications

- Aspect Ratio: 9:16 or similar portrait orientation
- Minimum Resolution: 800x1200px
- Format: JPG, PNG, or WebP
- File Size: Under 2MB for optimal loading

## API Endpoints

### Public Endpoint

- `GET /api/settings` - Fetch auth modal image (public access)

### Admin Endpoints

- `GET /api/admin/settings` - Fetch all settings (requires admin auth)
- `PUT /api/admin/settings` - Update settings (requires admin auth)

### Request Format (PUT)

```json
{
  "key": "authModalImage",
  "value": "https://example.com/image.jpg"
}
```

## Database Schema

The Settings model stores key-value pairs:

- `key`: String (unique identifier)
- `value`: Mixed (can store any type)
- `timestamps`: Created/Updated dates

## Default Appearance

When no image is configured, the modal displays a beautiful gradient background (blue to purple).
Once you upload an image from the admin panel, it will replace the gradient.

## Component Usage

The AuthModal component automatically fetches and displays the configured image. No additional configuration needed.

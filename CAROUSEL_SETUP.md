# Carousel Feature Setup

## Overview

A scrolling carousel has been added to the home page with admin panel management for uploading and managing carousel images.

## Features

### Frontend (Home Page)

- **Auto-scrolling carousel** with 5-second intervals
- **Manual navigation** with previous/next arrows
- **Dot indicators** for slide position
- **Responsive design** for all screen sizes
- **Optional links** on carousel slides
- **Smooth transitions** between slides
- Falls back to Hero component if no carousel items exist

### Admin Panel

- **Upload images** via Cloudinary integration
- **Add/Edit/Delete** carousel slides
- **Set order** for slide display
- **Toggle active/inactive** status
- **Add titles and subtitles** with overlay text
- **Optional links** for clickable slides

## Files Created

1. **models/Carousel.ts** - MongoDB schema for carousel items
2. **app/api/admin/carousel/route.ts** - API for GET and POST carousel items
3. **app/api/admin/carousel/[id]/route.ts** - API for PUT and DELETE carousel items
4. **app/admin/carousel/page.tsx** - Admin page for managing carousel
5. **app/components/Carousel.tsx** - Frontend carousel component

## Files Modified

1. **app/page.tsx** - Added carousel data fetching
2. **app/components/HomePageClient.tsx** - Integrated carousel component
3. **app/admin/components/AdminSidebar.tsx** - Added carousel menu item

## Usage

### Admin Panel

1. Navigate to `/admin/carousel`
2. Click "Add New Slide"
3. Fill in the form:
   - **Title** (required): Main heading text
   - **Subtitle** (optional): Secondary text
   - **Image** (required): Upload via Cloudinary
   - **Link** (optional): URL to navigate when clicked
   - **Order**: Display order (lower numbers first)
   - **Active**: Toggle visibility
4. Click "Create" to save

### Home Page

- Carousel automatically displays on the home page
- Auto-scrolls every 5 seconds
- Users can manually navigate with arrows or dots
- Clicking a slide navigates to its link (if set)

## Database Schema

```typescript
{
  title: String (required),
  subtitle: String (optional),
  image: String (required),
  link: String (optional),
  order: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

- `GET /api/admin/carousel` - Fetch all carousel items
- `POST /api/admin/carousel` - Create new carousel item (admin only)
- `PUT /api/admin/carousel/[id]` - Update carousel item (admin only)
- `DELETE /api/admin/carousel/[id]` - Delete carousel item (admin only)

## Notes

- Cloudinary is already configured in your `.env` file
- Only active carousel items are displayed on the home page
- Items are sorted by the `order` field
- If no carousel items exist, the original Hero component is shown

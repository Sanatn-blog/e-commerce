# Product Management System

## Overview

A complete product management system with MongoDB and Cloudinary integration for your e-commerce platform.

## Features Implemented

### 1. Add Product Page (`/admin/products/add`)

- Modern, user-friendly form design
- Image upload with preview (multiple images supported)
- Automatic upload to Cloudinary
- Size selection (common sizes + custom sizes)
- Color management
- Category selection (men, women, kids, shoes, accessories)
- Stock and price management
- Form validation

### 2. Edit Product Page (`/admin/products/edit/[id]`)

- Load existing product data
- Update all product fields
- Manage existing images (view and delete)
- Add new images while keeping existing ones
- Same features as add page

### 3. Products List Page (`/admin/products`)

- Display all products from MongoDB
- Product thumbnail images
- Real-time stock status
- Edit and delete actions
- Responsive table design
- Loading states

### 4. API Routes

#### `POST /api/products`

- Create new product
- Saves to MongoDB
- Returns created product

#### `GET /api/products`

- Fetch all products
- Sorted by creation date (newest first)

#### `GET /api/products/[id]`

- Fetch single product by ID

#### `PUT /api/products/[id]`

- Update product by ID
- Validates data

#### `DELETE /api/products/[id]`

- Delete product by ID
- Automatically deletes associated images from Cloudinary

#### `POST /api/upload`

- Upload images to Cloudinary
- Returns public_id and URL

## Database Schema (MongoDB)

```typescript
{
  name: string (required, max 100 chars)
  description: string (required)
  price: number (required, min 0)
  category: enum ["men", "women", "kids", "shoes", "accessories"]
  images: [{ public_id: string, url: string }]
  stock: number (required, min 0, default 0)
  sizes: string[]
  colors: string[]
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## Environment Variables Required

Make sure these are set in your `.env` file:

```
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Usage

1. **Add Product**: Navigate to `/admin/products` and click "Add Product"
2. **Edit Product**: Click the edit icon on any product in the list
3. **Delete Product**: Click the delete icon (confirms before deletion)

## Image Management

- Images are uploaded to Cloudinary in the "products" folder
- Multiple images per product supported
- Images are automatically deleted from Cloudinary when product is deleted
- Supports drag-and-drop and click-to-upload

## Validation

- All required fields must be filled
- Price must be non-negative
- Stock must be non-negative
- Product name limited to 100 characters
- Category must be one of the predefined options

## UI Features

- Responsive design
- Loading states for all async operations
- Image previews before upload
- Tag-based size and color management
- Confirmation dialogs for destructive actions
- Success/error notifications

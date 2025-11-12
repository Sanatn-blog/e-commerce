# Saved Addresses Feature

## Overview

Added functionality to display and manage saved addresses on the checkout page with default address support.

## Changes Made

### 1. Customer Model (`models/Customer.ts`)

- Added `IAddress` interface with fields: label, name, phone, address, address2, city, state, zipCode, landmark, isDefault
- Added `savedAddresses` array field to Customer schema
- Maintains backward compatibility with existing single address fields

### 2. Address API (`app/api/auth/addresses/route.ts`)

- **GET**: Fetch all saved addresses for logged-in user
- **POST**: Add new address (auto-sets as default if first address)
- **PUT**: Update existing address (can change default)
- **DELETE**: Remove saved address

### 3. Checkout Page (`app/checkout/page.tsx`)

- Displays all saved addresses in card format
- Highlights default address with "Default" badge
- Shows selected address with blue border and checkmark
- Allows switching between saved addresses
- "Add New" button to add additional addresses
- Auto-selects default address on page load
- Falls back to first address if no default is set
- Shows address form for new users or when adding new address

## Features

### For Logged-In Users:

1. **View Saved Addresses**: All saved addresses displayed as selectable cards
2. **Default Address**: Automatically selected on checkout page load
3. **Quick Selection**: Click any address card to select it
4. **Add New Address**: Button to add additional delivery addresses
5. **Visual Feedback**: Selected address highlighted with blue border and checkmark

### Address Card Display:

- Address label (Home, Office, etc.)
- Recipient name and phone
- Full address with landmark
- City, State, and PIN code
- Default badge for default address

## Usage

1. User logs in and goes to checkout
2. Saved addresses are automatically loaded
3. Default address is pre-selected
4. User can click any address to select it
5. User can add new address using "Add New" button
6. Selected address is used for order delivery

## Future Enhancements

- Edit saved addresses
- Set/change default address from checkout
- Delete addresses from checkout
- Add address labels (Home, Office, Other)
- Address validation

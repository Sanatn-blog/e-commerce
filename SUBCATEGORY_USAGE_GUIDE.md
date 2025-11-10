# Subcategory Usage Guide

## Quick Start Guide for Admin Users

### Step 1: Create Main Categories First

Before creating subcategories, you need to have main categories. Here's how:

1. Navigate to **Admin Panel** → **Categories**
2. Click **"Add Category"** button
3. Create your main categories:

**Example Main Categories:**

- Men
- Women
- Kids
- Accessories
- Shoes

**For each main category:**

- Enter **Name**: "Men"
- **Slug** will auto-generate: "men"
- Add **Description** (optional): "Men's clothing and accessories"
- Upload **Image** (optional)
- **Parent Category**: Leave as "None (Main Category)"
- Check **Active Category**
- Click **"Create"**

### Step 2: Create Subcategories

Now you can create subcategories under your main categories:

1. Navigate to **Admin Panel** → **Categories**
2. Click **"Add Category"** button
3. Create subcategories:

**Example: Creating "Shirts" under "Men"**

- Enter **Name**: "Shirts"
- **Slug** will auto-generate: "shirts"
- Add **Description** (optional): "Men's shirts collection"
- Upload **Image** (optional)
- **Parent Category**: Select "Men" from dropdown
- Check **Active Category**
- Click **"Create"**

**Repeat for other subcategories:**

Under **Men**:

- Shirts
- Pants
- Jackets
- T-Shirts
- Jeans

Under **Women**:

- Dresses
- Tops
- Skirts
- Blouses
- Pants

Under **Kids**:

- Boys
- Girls
- Toddlers
- Infants

Under **Shoes**:

- Sneakers
- Boots
- Sandals
- Formal Shoes

Under **Accessories**:

- Bags
- Belts
- Hats
- Jewelry
- Watches

### Step 3: Assign Products to Categories

When adding or editing products:

1. Go to **Admin Panel** → **Products** → **Add New Product**
2. Fill in product details
3. In the **Category** dropdown, you'll see:
   - Main categories: "Men", "Women", "Kids"
   - Subcategories: "Men > Shirts", "Men > Pants", "Women > Dresses"
4. Select the most specific category for your product
5. Save the product

**Example:**

- Product: "Blue Cotton Shirt"
- Category: Select "Men > Shirts"

### Step 4: Managing Categories

#### Viewing Categories

- The categories table shows:
  - **Image**: Category thumbnail
  - **Name**: Category name with "Has subcategories" badge if applicable
  - **Slug**: URL-friendly identifier
  - **Parent**: Shows parent category name (or "-" for main categories)
  - **Status**: Active/Inactive toggle
  - **Order**: Display order number
  - **Actions**: Edit and Delete buttons

#### Editing Categories

1. Click the **Edit** icon (pencil) next to any category
2. Modify the details
3. You can change the parent category to reorganize your structure
4. Click **"Update"**

#### Deleting Categories

- You can delete any category that has NO subcategories
- If a category has subcategories, you must delete the subcategories first
- The system will prevent deletion and show an error message

### Best Practices

1. **Plan Your Structure**: Think about your category hierarchy before creating
2. **Keep It Simple**: Don't go more than 2 levels deep (Main → Sub)
3. **Use Clear Names**: Make category names descriptive and easy to understand
4. **Add Images**: Category images help users navigate your store
5. **Set Order**: Use the order field to control how categories appear
6. **Stay Organized**: Regularly review and clean up unused categories

### Common Use Cases

#### Fashion Store

```
Men
├── Shirts
├── Pants
├── Jackets
└── Accessories

Women
├── Dresses
├── Tops
├── Bottoms
└── Accessories

Kids
├── Boys
└── Girls
```

#### Electronics Store

```
Computers
├── Laptops
├── Desktops
└── Accessories

Mobile
├── Smartphones
├── Tablets
└── Accessories

Audio
├── Headphones
├── Speakers
└── Accessories
```

#### Home & Living

```
Furniture
├── Living Room
├── Bedroom
└── Office

Decor
├── Wall Art
├── Lighting
└── Textiles

Kitchen
├── Cookware
├── Appliances
└── Utensils
```

## Troubleshooting

**Q: I can't delete a category**
A: Check if it has subcategories. Delete all subcategories first, then delete the parent.

**Q: I don't see my new category in the product dropdown**
A: Make sure the category is marked as "Active" and refresh the page.

**Q: Can I move a subcategory to a different parent?**
A: Yes! Edit the subcategory and change the "Parent Category" dropdown.

**Q: Can I make a subcategory into a main category?**
A: Yes! Edit the subcategory and set "Parent Category" to "None (Main Category)".

**Q: How many subcategories can I create?**
A: There's no limit, but keep it manageable for better user experience.

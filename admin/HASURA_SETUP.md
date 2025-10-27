# Hasura Setup for Image Management

## ✅ **Required Hasura Configuration**

### 1. Create `planche_images` Table

```sql
-- Create the table
CREATE TABLE planche_images (
  id SERIAL PRIMARY KEY,
  planche_id INTEGER NOT NULL REFERENCES planches(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_planche_images_planche_id ON planche_images(planche_id);
CREATE INDEX idx_planche_images_is_default ON planche_images(is_default);

-- Ensure only one primary image per planche
CREATE UNIQUE INDEX idx_planche_images_unique_default 
ON planche_images(planche_id) 
WHERE is_default = TRUE;
```

### 2. Set Up Hasura Relationships

#### In Hasura Console → Data → planche_images → Relationships

**From planche_images to planches:**
```
Name: planche
Table: planches
ForeignKey: planche_id
```

**From planches to planche_images:**
```
Name: planche_images
Table: planche_images  
ForeignKey: planche_id (automatic)
```

### 3. Hasura Permissions

#### For `planche_images` table:

**Insert Permissions:**
```yaml
role: admin
columns: ["id", "planche_id", "url", "is_default", "created_at", "updated_at"]
check: {} # Or add custom check if needed
```

**Select Permissions:**
```yaml
role: admin
columns: ["*"]
filter: {} # Or add custom filter if needed
```

**Update Permissions:**
```yaml
role: admin
columns: ["url", "is_default"]
filter: {} # Or add custom filter if needed
```

**Delete Permissions:**
```yaml
role: admin
columns: []
filter: {} # Or add custom filter if needed
```

### 4. Update planches Query to Include Images

Go to Hasura Console → API → GraphQL

Update the list query for planches to include nested images:

```graphql
query fetchPlanches {
  planches {
    id
    name
    price
    number_people
    visit_date
    restaurant_id
    category_id
    planche_images {
      id
      url
      is_default
      created_at
      updated_at
    }
    restaurant {
      id
      name
      city
    }
    planche_category {
      id
      name
    }
  }
}
```

## 🧪 **Testing the Setup**

### 1. Test Creating a Planche with Images

In the admin panel:
1. Go to Planches → Create
2. Fill in planche details
3. Upload some images
4. Set one as primary
5. Click Save

### 2. Check Hasura Console

Go to Hasura Console → Data → planche_images

You should see:
- All uploaded images with their URLs
- The primary image with `is_default = true`
- Correct `planche_id` foreign key

### 3. Test Editing Images

1. Go to a planche in the list
2. Click Edit
3. You should see existing images loaded
4. Add/remove images
5. Change primary image
6. Click "Save Images"

### 4. Verify List View

Go back to Planches list:
- You should see image thumbnails
- Primary images should display
- "No Image" placeholder for planches without images

## 🔍 **Common Issues**

### Images Not Loading in Edit Mode

**Problem:** Images don't appear when editing

**Solution:**
- Check Hasura relationship is properly configured
- Verify the planche has images in the `planche_images` table
- Check browser console for GraphQL errors
- Ensure the query includes nested `planche_images`

### Primary Image Not Saving

**Problem:** Primary image flag doesn't update

**Solution:**
- Check unique constraint on `planche_id` and `is_default`
- Verify Hasura update permissions
- Check console for GraphQL errors
- Ensure only one image has `is_default = true` per planche

### Images Not Deleting

**Problem:** Images remain in Hasura after deletion

**Solution:**
- Check Hasura delete permissions
- Verify cascade delete is configured
- Check GraphQL mutation is executed
- Look for errors in browser console

## 📊 **Hasura Console Verification**

### Check Table Structure

Go to Hasura Console → Data → planche_images → Modify

You should see:
- `id` (serial, primary key)
- `planche_id` (integer, foreign key to planches)
- `url` (text, not null)
- `is_default` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Check Relationships

Go to Hasura Console → Data → planche_images → Relationships

You should see:
- `planche` → references `planches` table

Go to Hasura Console → Data → planches → Relationships

You should see:
- `planche_images` → references `planche_images` table (array)

### Check Permissions

Go to Hasura Console → Data → planche_images → Permissions

You should see permissions for:
- `admin` role with all CRUD operations enabled
- Or custom roles if you have additional security

## 🎉 **Success Indicators**

You'll know the setup is working when:

1. ✅ **Creating** a planche with images saves successfully
2. ✅ **Editing** a planche shows existing images
3. ✅ **Adding** new images works smoothly  
4. ✅ **Deleting** images removes them from both Firebase and Hasura
5. ✅ **Primary image** flag updates correctly
6. ✅ **List view** displays image thumbnails

## 📚 **Additional Resources**

- Hasura Documentation: https://hasura.io/docs/
- Firebase Storage: https://firebase.google.com/docs/storage
- React Admin Docs: https://marmelab.com/react-admin/

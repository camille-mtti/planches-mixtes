# Schema Changes Required for Planche Image Management

## 🗄️ **Hasura Database Changes**

### 1. Create `planche_images` table

```sql
-- Create the planche_images table
CREATE TABLE planche_images (
  id SERIAL PRIMARY KEY,
  planche_id INTEGER NOT NULL REFERENCES planches(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_planche_images_planche_id ON planche_images(planche_id);
CREATE INDEX idx_planche_images_is_default ON planche_images(is_default);

-- Add unique constraint to ensure only one default image per planche
CREATE UNIQUE INDEX idx_planche_images_unique_default 
ON planche_images(planche_id) 
WHERE is_default = TRUE;
```

### 2. Update existing `planches` table (if needed)

```sql
-- Add a primary_image_url field to planches table (optional)
ALTER TABLE planches ADD COLUMN primary_image_url TEXT;

-- Add created_at and updated_at if they don't exist
ALTER TABLE planches ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE planches ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

### 3. Set up Hasura permissions

```yaml
# In your Hasura metadata, add these permissions:

# For planche_images table
- table:
    schema: public
    name: planche_images
  select_permissions:
  - role: admin
    permission:
      columns: "*"
      filter: {}
  - role: user
    permission:
      columns: "*"
      filter: {}
  insert_permissions:
  - role: admin
    permission:
      columns: "*"
      filter: {}
  update_permissions:
  - role: admin
    permission:
      columns: "*"
      filter: {}
  delete_permissions:
  - role: admin
    permission:
      columns: "*"
      filter: {}
```

### 4. Create relationships in Hasura

```yaml
# Add these relationships to your Hasura metadata:

# In planches table
- name: planche_images
  using:
    foreign_key_constraint_on: planche_id
  table:
    schema: public
    name: planche_images

# In planche_images table  
- name: planche
  using:
    foreign_key_constraint_on: planche_id
  table:
    schema: public
    name: planches
```

## 🔥 **Firebase Storage Changes**

### 1. Firebase Storage Rules

```javascript
// In Firebase Console > Storage > Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all planche images
    match /planches/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

### 2. Firebase Storage Structure

```
planches-mixtes.appspot.com/
└── planches/
    ├── planche_1234567890_image1.jpg
    ├── planche_1234567890_image2.jpg
    └── planche_1234567891_image1.jpg
```

## 🔧 **Environment Variables**

### Admin (.env)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id_here

# Hasura Configuration
VITE_HASURA_GRAPHQL_URL=your_hasura_graphql_url_here
VITE_HASURA_GRAPHQL_ADMIN_SECRET=your_hasura_admin_secret_here
```

## 📝 **GraphQL Queries to Add**

### 1. Fetch planches with images

```graphql
query fetchPlanchesWithImages {
  planches {
    id
    name
    price
    number_people
    visit_date
    primary_image_url
    planche_images {
      id
      url
      is_default
      created_at
    }
    planche_category {
      name
    }
    restaurant {
      name
      city
    }
  }
}
```

### 2. Create planche with images

```graphql
mutation createPlancheWithImages($planche: planches_insert_input!, $images: [planche_images_insert_input!]!) {
  insert_planches_one(object: $planche) {
    id
  }
  insert_planche_images(objects: $images) {
    affected_rows
  }
}
```

### 3. Update planche images

```graphql
mutation updatePlancheImages($planche_id: Int!, $images: [planche_images_insert_input!]!, $delete_ids: [Int!]!) {
  # Delete old images
  delete_planche_images(where: {id: {_in: $delete_ids}}) {
    affected_rows
  }
  # Insert new images
  insert_planche_images(objects: $images) {
    affected_rows
  }
  # Update planche primary image
  update_planches(where: {id: {_eq: $planche_id}}, _set: {primary_image_url: $primary_url}) {
    affected_rows
  }
}
```

## 🚀 **Implementation Steps**

1. **Run the SQL migrations** in your Hasura database
2. **Update Hasura metadata** with the new table and relationships
3. **Set up Firebase Storage rules** for image access
4. **Add environment variables** to admin .env file
5. **Test the image upload functionality** in the admin interface

## 🔍 **Testing the Implementation**

1. **Create a new planche** with images
2. **Edit an existing planche** and add/remove images
3. **Set primary image** for a planche
4. **Verify images appear** in the client application
5. **Test image deletion** and cleanup

## 📋 **Additional Considerations**

- **Image optimization**: Consider adding image resizing/compression
- **File size limits**: Set reasonable limits (e.g., 5MB per image)
- **Image formats**: Support common formats (JPEG, PNG, WebP)
- **Cleanup**: Implement cleanup for orphaned images
- **CDN**: Consider using Firebase CDN for better performance

# Firebase Configuration for Admin Authentication

## 🔐 **Firebase Authentication Setup**

### 1. Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `planches-mixtes`
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Google** and enable it
5. Add your support email
6. Save the changes

### 2. Add Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your local development domain: `localhost`
3. Add your production domain when deploying

### 3. Firebase Storage Rules (Updated)

Update your Firebase Storage rules to require authentication:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Planche images - authenticated users only
    match /planches/{allPaths=**} {
      allow read: if request.auth != null; // Only authenticated users
      allow write: if request.auth != null; // Only authenticated users
    }
    
    // Public read access for client app
    match /planches/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🔑 **Firebase Authentication Rules**

If you want to restrict access to specific admins, you can add custom claims:

### Option 1: Email-based Authorization

Update your `authProvider.ts` to check admin emails:

```typescript
export const authProvider: AuthProvider = {
  login: async () => {
    const user = await signInWithGoogle();
    const allowedEmails = [
      'admin@planches-mixtes.com',
      'your-email@gmail.com'
    ];
    
    if (!allowedEmails.includes(user.email || '')) {
      await signOut();
      throw new Error('Unauthorized access');
    }
    
    return Promise.resolve();
  },
  // ... rest of the code
};
```

### Option 2: Custom Claims (Recommended for Production)

Use Firebase Cloud Functions to set custom claims:

```typescript
// cloud-functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setAdminClaim = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  const isAdmin = data.isAdmin;
  
  if (context.auth?.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only super admins can set admin claims'
    );
  }
  
  await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
  return { success: true };
});
```

Then check claims in your auth provider:

```typescript
getPermissions: async () => {
  const user = getCurrentUser();
  if (user) {
    const token = await user.getIdTokenResult();
    if (token.claims.admin) {
      return Promise.resolve('admin');
    }
  }
  return Promise.reject();
}
```

## 🛡️ **Environment Variables**

Make sure you have all required Firebase environment variables in your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📱 **Testing the Authentication**

1. **Start your admin app**:
   ```bash
   yarn dev
   ```

2. **Access the admin panel** at `http://localhost:3001`

3. **You should see the login page** with Google Sign-In button

4. **Click "Sign in with Google"**

5. **Select your Google account**

6. **You'll be redirected to the admin dashboard**

## 🔒 **Security Considerations**

### 1. Domain Restriction
- Only allow specific email domains
- Whitelist admin emails in your code

### 2. Role-Based Access
- Use custom claims for different admin roles
- Restrict sensitive operations to super admins

### 3. Session Management
- Firebase handles session tokens automatically
- Set appropriate session length in Firebase settings

### 4. Hasura Permissions
Update your Hasura permissions to require authentication:

```yaml
- table:
    schema: public
    name: planches
  select_permissions:
  - role: admin
    permission:
      columns: "*"
      filter: {}
      check:
        user_id: "X-Hasura-User-Id"
```

## 🚀 **Deployment Considerations**

1. **Update authorized domains** in Firebase Console for your production domain
2. **Set up environment variables** in your hosting platform
3. **Configure CORS** if needed for cross-origin requests
4. **Add error tracking** for authentication failures
5. **Set up monitoring** for unauthorized access attempts

## 📝 **Debugging Tips**

### Check Authentication State
```typescript
import { auth } from './libs/firebase/auth';
console.log('Current user:', auth.currentUser);
```

### Listen to Auth Changes
```typescript
import { onAuthStateChange } from './libs/firebase/auth';
onAuthStateChange((user) => {
  console.log('Auth state changed:', user);
});
```

### Get User Token
```typescript
import { getUserToken } from './libs/firebase/auth';
const token = await getUserToken();
console.log('User token:', token);
```

## ✅ **Next Steps**

1. **Enable Google Sign-In** in Firebase Console
2. **Update storage rules** for authenticated access
3. **Configure authorized domains**
4. **Test the authentication flow**
5. **Add email whitelist** if needed for production
6. **Deploy and update production settings**

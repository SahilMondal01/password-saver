# Google Authentication Setup Guide

To enable Google Login authentication for your Password Manager, follow these steps.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top and select **"New Project"**
4. Enter a project name (e.g., "Password Manager")
5. Click **"Create"**
6. Wait for the project to be created

## Step 2: Enable Google Sign-In API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for **"Google Identity Services API"** (or "OAuth 2.0 API")
3. Click on it and then click **"Enable"**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **"+ Create Credentials"** > **"OAuth client ID"**
3. If prompted, first configure the **OAuth consent screen**:
   - Select **"External"** user type
   - Fill in the app name, email, and other required fields
   - Click **"Save and Continue"**
   - Add scopes if needed (for basic auth, skip)
   - Click **"Save and Continue"**
4. Return to create credentials
5. Select **Application type: "Web application"**
6. Give it a name (e.g., "Password Manager Web")
7. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (for local development)
   - `http://localhost:5500` (for VS Code Live Server)
   - `http://localhost:8000` (for Python server)
   - Your actual domain when deployed (e.g., `https://yourdomain.com`)
8. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/` (for local development)
   - Your actual domain when deployed
9. Click **"Create"**
10. Copy the **Client ID** from the popup

## Step 4: Add Client ID to Your App

1. Open `script.js` in your password manager folder
2. Find this line (around line 30):
   ```javascript
   client_id: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
   ```
3. Replace it with your actual Client ID:
   ```javascript
   client_id: 'YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com',
   ```
4. Save the file

## Step 5: Test Your Setup

1. Open `index.html` in your browser
2. You should see a Google Sign-In button on the login page
3. Click the button and sign in with your Google account
4. After login, you should see the password manager app with your profile info

## Troubleshooting

### "This app can't be verified" error
- This is normal for development
- Google shows this because the app isn't verified yet
- Just click "Advanced" > "Go to [your app] (unsafe)"

### OAuth origin mismatch
- Make sure the URL you're using matches one of your authorized origins
- If using Live Server: Add `http://localhost:5500` to authorized origins
- If using local port: Add that port to authorized origins

### Button not showing up
- Make sure you added the Google API script: `<script src="https://accounts.google.com/gsi/client" async defer></script>`
- Check browser console for errors (F12)
- Make sure your Client ID is correct

### "The OAuth client was not found"
- Double-check your Client ID is copied correctly
- Make sure there are no extra spaces

## Security Notes

⚠️ **Important:**
- Never commit your Client ID to public repositories (it's safe to share, but it's a good practice)
- Client IDs are public, so keep them in `script.js` is fine
- Your passwords are NEVER sent to Google - they're stored locally
- Google only verifies your identity, not your passwords

## For Deployment

When deploying to a production server:
1. Add your domain to **Authorized JavaScript origins**
   - Example: `https://mypasswordmanager.com`
2. Add your domain to **Authorized redirect URIs**
3. Update the Client ID if using a different OAuth app for production

## API Quota

- By default, Google gives you generous free quotas for authentication
- You can monitor usage in **APIs & Services** > **Quotas**

## Need Help?

- [Google Sign-In Documentation](https://developers.google.com/identity/gsi)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)

---

Once you've completed these steps, your password manager will be fully private with Google authentication! 🎉

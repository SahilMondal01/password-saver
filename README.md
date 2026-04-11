# Secure Password Manager 🔐

A modern, secure web-based password manager with **Google authentication** that allows you to store and manage all your passwords in one place. All data is stored locally in your browser - nothing is sent to any server except for user authentication.

## 🔒 Key Highlight: Private & Secure per User

✅ **Google Authentication** - Only you can access your passwords  
✅ **User-Specific Storage** - Each user's passwords are isolated  
✅ **Zero Server Storage** - Passwords stay on your device only  
✅ **No Password Sharing** - Even with your other devices

## Features

✨ **Authentication & Security:**
- ✅ **Google Sign-In** - Secure login with your Google account
- ✅ **User-Specific Vaults** - Each user's passwords stored separately
- ✅ **Private Access** - Only you can access your passwords
- ✅ **Logout Support** - Easily sign out when done
- ✅ **User Profile Display** - See your profile picture and name

✨ **Core Features:**
- ✅ Add new passwords with website name, username/email, and password
- ✅ View all stored passwords in beautiful cards
- ✅ Edit existing passwords
- ✅ Delete passwords securely
- ✅ Search passwords by website name or username
- ✅ Filter passwords by category
- ✅ Organize passwords by categories (Social Media, Banking, Email, Entertainment, Work, Shopping, Other)
- ✅ Add optional notes to each password
- ✅ Show/hide password visibility
- ✅ Copy password to clipboard with one click
- ✅ Password strength indicator
- ✅ Responsive design that works on desktop, tablet, and mobile

🔒 **Security Features:**
- ✅ All data stored locally in browser (localStorage)
- ✅ Per-user encryption via unique storage keys
- ✅ No server uploads - your passwords never leave your device
- ✅ Masked password display by default
- ✅ HTML sanitization to prevent XSS attacks
- ✅ Google authentication for identity verification
- ✅ Never stores payment information

📱 **User Experience:**
- ✅ Modern, clean, gradient UI
- ✅ Intuitive password cards
- ✅ Toast notifications for confirmations
- ✅ Confirmation dialogs for deletions
- ✅ Real-time password strength feedback
- ✅ Quick edit modal
- ✅ Mobile-responsive design
- ✅ Beautiful login page with Google Sign-In

## How to Use

### Getting Started - Setup Google Authentication

1. **Get a Google Client ID:**
   - Follow the detailed guide in [SETUP_GOOGLE_AUTH.md](SETUP_GOOGLE_AUTH.md)
   - This takes about 5-10 minutes
   - Get your free Client ID from Google Cloud Console

2. **Add Your Client ID:**
   - Open `script.js`
   - Find the line with `client_id: '1234567890-...'`
   - Replace it with your actual Client ID

3. **Open the App:**
   - Open `index.html` in your browser
   - You'll see a Google Sign-In button on the login page
   - Click to sign in with your Google account

4. **Your Password Vault:**
   - After login, you'll see your private password vault
   - Your passwords are now stored securely and privately
   - Each user who logs in has their own separate vault

### Adding a Password
1. Fill in the **Website/App Name** (e.g., "Gmail", "Netflix")
2. Enter your **Username/Email**
3. Enter your **Password**
4. Select a **Category** (optional, defaults to "Other")
5. Add any **Notes** (optional)
6. Click the **Add Password** button
7. You'll see a confirmation notification

### Viewing Passwords
- All your passwords are displayed as cards below the form
- Each card shows:
  - Website/App name and category tag
  - Username/Email
  - Masked password (shown as dots by default)
  - Notes (if added)
  - Action buttons

### Managing Passwords

**Show/Hide Password:**
- Click the 👁️ "Show" button to reveal the password
- Click the 🙈 "Hide" button to mask it again

**Copy Password:**
- Click the 📋 "Copy Pass" button
- The password is copied to your clipboard
- A confirmation message appears

**Edit Password:**
- Click the ✏️ "Edit" button on any password card
- Update any field in the modal that appears
- Click "Save Changes" to update
- Click "Cancel" to close without saving

**Delete Password:**
- Click the 🗑️ "Delete" button
- Confirm the deletion in the popup
- The password will be permanently removed

### Searching and Filtering

**Search:**
- Use the search box at the top to find passwords by:
  - Website/App name
  - Username/Email
- Results update instantly as you type

**Filter by Category:**
- Use the dropdown next to search to show only passwords from a specific category
- Select "All Categories" to show all

**Combine Search & Filter:**
- You can search and filter at the same time
- Great for finding specific passwords quickly

## Password Storage

Your passwords are stored in your browser's **localStorage**. This means:
- ✅ Passwords persist even after closing the browser
- ✅ Passwords remain local to your computer
- ✅ No internet connection needed to access your passwords
- ⚠️ If you clear browser data/cache, passwords will be deleted
- ⚠️ Passwords are unique to each browser and device

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge

## Security Recommendations

⚠️ **Important Security Tips:**
1. **Keep your computer secure** - Lock your computer when you're away
2. **Use your Google account** - Your Google account is your authentication, keep it secure
3. **Don't share your device** - Anyone with access to your device can access your vault (when logged in)
4. **Don't share your screen** - Disable screen sharing when showing sensitive info
5. **Use strong passwords** - Use the password strength indicator for guidance
6. **Logout when done** - Click the logout button when finished, especially on shared devices
7. **Verify SSL/HTTPS** - When deployed online, always use HTTPS
8. **Never store payment info** - This is for login passwords only, NOT for payment cards or PIN codes

## How Google Authentication Works

✅ **What Google Does:**
- Verifies your identity using your Google account
- Provides your name and profile picture
- Issues a secure token

⚠️ **What Google Does NOT Do:**
- Access your passwords
- Store your passwords
- See your password list
- Upload your data

✅ **How Your Passwords Stay Private:**
- After Google authentication, all data stays on your device
- Each user has their own storage key
- No server receives your passwords
- Logout doesn't affect stored passwords (still on your device)
- Clearing cache might delete passwords (use browser backup)

## Password Strength Indicator

The password strength meter shows:
- **Red (Weak):** Less than 3 criteria met
- **Yellow (Medium):** 3-4 criteria met
- **Green (Strong):** 5+ criteria met

Criteria:
- Length (8+ characters, better with 12+)
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special characters (!@#$%^&*...)

## Privacy & Data Usage

✅ **What happens with your data:**
- Your passwords are stored ONLY in your browser's localStorage
- NO data is sent to any server
- NO tracking or analytics
- NO third-party services
- You have complete control and ownership of your data

## Keyboard Shortcuts

- Press **Tab** to navigate between form fields
- Press **Enter** in the form to submit
- Press **Escape** to close the edit modal

## Tips & Tricks

💡 **Pro Tips:**
1. Use categories to organize passwords by type
2. Add helpful notes (like security questions answers, backup codes)
3. Regularly review and update weak passwords
4. Use the search feature to quickly find passwords
5. Copy passwords directly instead of typing them
6. Consider creating backup browser sessions for important accounts

## Limitations & Notes

⚠️ **Current Limitations:**
- Passwords are stored in browser localStorage only (not cloud synced)
- No master password required (secure your computer instead)
- No audit log of access history
- No password generation tool (use external password generator)
- No multi-browser sync

## Future Enhancements

Potential features for future versions:
- Master password protection
- Password generator
- Import/Export functionality
- Dark mode
- Cloud backup option
- Multi-device sync
- Usage analytics
- Breach notification alerts

## Troubleshooting

**Q: Where are my passwords stored?**
A: In your browser's localStorage. They stay on your device only.

**Q: What if I clear my browser cache?**
A: Your passwords will be deleted. Make sure to backup if you clear cache regularly.

**Q: Can I access passwords on another device?**
A: Not with this version. Each device has its own separate storage.

**Q: Is this as secure as commercial password managers?**
A: This is good for personal use, but commercial managers like 1Password or Bitwarden offer additional features like cloud backup with encryption, master password protection, and device sync. Use those for highly sensitive accounts.

**Q: Can I export my passwords?**
A: Currently not built in. You can use browser developer tools to access localStorage.

## Support

For issues or suggestions, feel free to modify the code and customize it to your needs!

## License

This is a free, open-source password manager. Use it freely for personal use.

---

**Remember:** Keep your computer secure! This password manager is only as secure as your device. 🔒

// Password Manager App with Google Authentication
class PasswordManager {
    constructor() {
        this.user = null;
        this.passwords = [];
        this.initAuth();
    }

    initAuth() {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('pm_user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.loadPasswords();
            this.showApp();
        } else {
            this.showLoginPage();
        }

        // Initialize Google Sign-In
        setTimeout(() => {
            this.initGoogleSignIn();
        }, 1000);
    }

    initGoogleSignIn() {
        try {
            // Wait for Google API to load
            if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                google.accounts.id.initialize({
                    client_id: 'REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
                    callback: (response) => this.handleGoogleLogin(response),
                    auto_select: false,
                    itp_support: true
                });

                // Render the Google Sign-In button
                const buttonElement = document.getElementById('googleSignInButton');
                if (buttonElement) {
                    google.accounts.id.renderButton(
                        buttonElement,
                        {
                            theme: 'filled_blue',
                            size: 'large',
                            width: '300',
                            text: 'signin',
                            locale: 'en'
                        }
                    );
                }
            } else {
                console.warn('Google Sign-In not available. Please ensure Google API is loaded.');
                this.showDemoLoginOption();
            }
        } catch (e) {
            console.error('Error initializing Google Sign-In:', e);
            this.showDemoLoginOption();
        }
    }

    showDemoLoginOption() {
        const buttonContainer = document.getElementById('googleSignInButton');
        if (buttonContainer) {
            buttonContainer.innerHTML = `
                <button class="btn btn-primary demo-login-btn" style="width: 100%; padding: 12px 24px; font-size: 16px;">
                    Login with Demo Account
                </button>
            `;
            buttonContainer.querySelector('.demo-login-btn').addEventListener('click', () => {
                this.handleDemoLogin();
            });
        }
    }

    handleDemoLogin() {
        // Demo login - use for testing
        this.user = {
            id: 'demo_user_' + Date.now(),
            name: 'Demo User',
            email: 'demo@example.com',
            picture: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23667eea" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="50" fill="white" text-anchor="middle" dy=".3em"%3ED%3C/text%3E%3C/svg%3E',
            token: 'demo_token_' + Date.now()
        };

        // Save user info
        localStorage.setItem('pm_user', JSON.stringify(this.user));
        
        // Load and show app
        this.loadPasswords();
        this.showApp();
        this.showToast(`Welcome, ${this.user.name}! (Demo Mode)`, 'success');
    }

    handleGoogleLogin(response) {
        if (response.credential) {
            // Decode the JWT token to get user info
            const userInfo = this.parseJwt(response.credential);
            
            if (userInfo) {
                this.user = {
                    id: userInfo.sub,
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture,
                    token: response.credential
                };

                // Save user info to localStorage
                localStorage.setItem('pm_user', JSON.stringify(this.user));

                // Load user's passwords
                this.loadPasswords();
                this.showApp();
                this.showToast(`Welcome, ${this.user.name}!`, 'success');
            }
        }
    }

    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error parsing JWT:', e);
            return null;
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear user data
            this.user = null;
            this.passwords = [];
            localStorage.removeItem('pm_user');

            // Google sign out
            try {
                if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                    google.accounts.id.disableAutoSelect();
                }
            } catch (e) {
                console.log('Google sign out not needed');
            }

            // Show login page
            this.showLoginPage();
            this.showToast('You have been logged out', 'success');
        }
    }

    showLoginPage() {
        const loginPage = document.getElementById('loginPage');
        const appContainer = document.getElementById('appContainer');
        if (loginPage) loginPage.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
    }

    showApp() {
        const loginPage = document.getElementById('loginPage');
        const appContainer = document.getElementById('appContainer');
        if (loginPage) loginPage.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        
        // Update user info in header
        if (this.user) {
            const userNameEl = document.getElementById('userName');
            const userProfilePicEl = document.getElementById('userProfilePic');
            if (userNameEl) userNameEl.textContent = this.user.name;
            if (userProfilePicEl) userProfilePicEl.src = this.user.picture;
        }

        // Setup event listeners
        this.setupEventListeners();
        this.renderPasswords();
        this.updatePasswordCount();
    }

    getStorageKey() {
        return this.user ? `pm_passwords_${this.user.id}` : null;
    }

    setupEventListeners() {
        // Form submission
        const passwordForm = document.getElementById('passwordForm');
        const editForm = document.getElementById('editForm');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (passwordForm) passwordForm.addEventListener('submit', (e) => this.addPassword(e));
        if (editForm) editForm.addEventListener('submit', (e) => this.updatePassword(e));

        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const editTogglePassword = document.getElementById('editTogglePassword');
        if (togglePassword) togglePassword.addEventListener('click', (e) => this.togglePasswordVisibility(e, 'password'));
        if (editTogglePassword) editTogglePassword.addEventListener('click', (e) => this.togglePasswordVisibility(e, 'editPassword'));

        // Password strength indicator
        const passwordInput = document.getElementById('password');
        if (passwordInput) passwordInput.addEventListener('input', (e) => this.updatePasswordStrength(e.target));

        // Search and filter
        const searchInput = document.getElementById('searchInput');
        const filterCategory = document.getElementById('filterCategory');
        if (searchInput) searchInput.addEventListener('input', () => this.filterPasswords());
        if (filterCategory) filterCategory.addEventListener('change', () => this.filterPasswords());

        // Logout button
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

        // Modal close buttons
        const closeBtn = document.querySelector('.close');
        const closeEditModal = document.getElementById('closeEditModal');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeEditModal());
        if (closeEditModal) closeEditModal.addEventListener('click', () => this.closeEditModal());
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('editModal');
            if (e.target === modal) {
                this.closeEditModal();
            }
        });
    }

    // Add new password
    addPassword(e) {
        e.preventDefault();

        const website = document.getElementById('website').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const category = document.getElementById('category').value;
        const notes = document.getElementById('notes').value.trim();

        if (!website || !username || !password) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        const newPassword = {
            id: Date.now(),
            website,
            username,
            password,
            category,
            notes,
            createdAt: new Date().toLocaleString()
        };

        this.passwords.push(newPassword);
        this.savePasswords();
        this.renderPasswords();
        this.updatePasswordCount();
        this.resetForm();
        this.showToast(`Password for ${website} added successfully!`, 'success');
    }

    // Update password
    updatePassword(e) {
        e.preventDefault();

        const id = document.getElementById('editId').value;
        const website = document.getElementById('editWebsite').value.trim();
        const username = document.getElementById('editUsername').value.trim();
        const password = document.getElementById('editPassword').value;
        const category = document.getElementById('editCategory').value;
        const notes = document.getElementById('editNotes').value.trim();

        const passwordIndex = this.passwords.findIndex(p => p.id == id);
        if (passwordIndex !== -1) {
            this.passwords[passwordIndex] = {
                ...this.passwords[passwordIndex],
                website,
                username,
                password,
                category,
                notes,
                updatedAt: new Date().toLocaleString()
            };

            this.savePasswords();
            this.renderPasswords();
            this.closeEditModal();
            this.showToast('Password updated successfully!', 'success');
        }
    }

    // Delete password
    deletePassword(id) {
        if (confirm('Are you sure you want to delete this password? This action cannot be undone.')) {
            this.passwords = this.passwords.filter(p => p.id !== id);
            this.savePasswords();
            this.renderPasswords();
            this.updatePasswordCount();
            this.showToast('Password deleted successfully', 'success');
        }
    }

    // Edit password
    editPassword(id) {
        const password = this.passwords.find(p => p.id === id);
        if (password) {
            document.getElementById('editId').value = password.id;
            document.getElementById('editWebsite').value = password.website;
            document.getElementById('editUsername').value = password.username;
            document.getElementById('editPassword').value = password.password;
            document.getElementById('editPassword').type = 'password';
            document.getElementById('editTogglePassword').textContent = '👁️';
            document.getElementById('editCategory').value = password.category;
            document.getElementById('editNotes').value = password.notes || '';

            document.getElementById('editModal').classList.add('show');
        }
    }

    // Toggle password visibility
    togglePasswordVisibility(e, inputId) {
        e.preventDefault();
        const input = document.getElementById(inputId);
        const button = e.target;

        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
        } else {
            input.type = 'password';
            button.textContent = '👁️';
        }
    }

    // Copy to clipboard
    copyToClipboard(text, label) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(`${label} copied to clipboard!`, 'success');
        }).catch(() => {
            this.showToast('Failed to copy to clipboard', 'error');
        });
    }

    // Update password strength indicator
    updatePasswordStrength(input) {
        const password = input.value;
        const strengthDiv = document.getElementById('passwordStrength');

        if (!password) {
            strengthDiv.className = 'password-strength';
            return;
        }

        let strength = 0;

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

        strengthDiv.classList.remove('weak', 'medium', 'strong');

        if (strength < 3) {
            strengthDiv.classList.add('weak');
        } else if (strength < 5) {
            strengthDiv.classList.add('medium');
        } else {
            strengthDiv.classList.add('strong');
        }
    }

    // Filter passwords
    filterPasswords() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('filterCategory').value;

        const filtered = this.passwords.filter(p => {
            const matchesSearch = p.website.toLowerCase().includes(searchTerm) ||
                                 p.username.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || p.category === category;

            return matchesSearch && matchesCategory;
        });

        this.renderPasswords(filtered);
    }

    // Render passwords
    renderPasswords(passwordsToRender = null) {
        const list = passwordsToRender || this.passwords;
        const container = document.getElementById('passwordsList');

        if (!container) return;

        if (list.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>🔒 No passwords ${passwordsToRender ? 'match your search' : 'stored yet'}. ${!passwordsToRender ? 'Add your first password above!' : ''}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = list.map(p => `
            <div class="password-card">
                <div class="card-category">${p.category}</div>
                <div class="card-website">${this.escapeHtml(p.website)}</div>
                
                <div class="card-info">
                    <div class="card-info-row">
                        <span class="card-label">Username:</span>
                        <span class="card-value">${this.escapeHtml(p.username)}</span>
                    </div>
                    
                    <div class="card-info-row">
                        <span class="card-label">Password:</span>
                        <span class="card-value hidden" data-password="${this.escapeHtml(p.password)}">••••••••</span>
                    </div>
                </div>

                ${p.notes ? `<div class="card-notes"><strong>Notes:</strong> ${this.escapeHtml(p.notes)}</div>` : ''}

                <div class="card-actions">
                    <button class="card-action-btn action-copy" onclick="app.copyToClipboard('${p.password.replace(/'/g, "\\'")}', 'Password')">
                        📋 Copy Pass
                    </button>
                    <button class="card-action-btn action-toggle" onclick="app.toggleCardPassword(this)">
                        👁️ Show
                    </button>
                    <button class="card-action-btn action-edit" onclick="app.editPassword(${p.id})">
                        ✏️ Edit
                    </button>
                    <button class="card-action-btn action-delete" onclick="app.deletePassword(${p.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Toggle card password visibility
    toggleCardPassword(button) {
        const card = button.closest('.password-card');
        const passwordSpan = card.querySelector('.card-value.hidden');

        if (passwordSpan && passwordSpan.dataset.password) {
            if (passwordSpan.classList.contains('hidden')) {
                passwordSpan.classList.remove('hidden');
                passwordSpan.textContent = passwordSpan.dataset.password;
                button.textContent = '🙈 Hide';
            } else {
                passwordSpan.classList.add('hidden');
                passwordSpan.textContent = '••••••••';
                button.textContent = '👁️ Show';
            }
        }
    }

    // Update password count
    updatePasswordCount() {
        const count = this.passwords.length;
        const countEl = document.getElementById('passwordCount');
        if (countEl) {
            countEl.textContent = `${count} password${count !== 1 ? 's' : ''} stored`;
        }
    }

    // Close edit modal
    closeEditModal() {
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        if (modal) modal.classList.remove('show');
        if (form) form.reset();
    }

    // Reset form
    resetForm() {
        const form = document.getElementById('passwordForm');
        if (form) form.reset();
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const strengthDiv = document.getElementById('passwordStrength');
        if (passwordInput) passwordInput.type = 'password';
        if (toggleBtn) toggleBtn.textContent = '👁️';
        if (strengthDiv) strengthDiv.className = 'password-strength';
    }

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Save passwords to localStorage (per user)
    savePasswords() {
        const storageKey = this.getStorageKey();
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(this.passwords));
        }
    }

    // Load passwords from localStorage (per user)
    loadPasswords() {
        const storageKey = this.getStorageKey();
        if (storageKey) {
            const stored = localStorage.getItem(storageKey);
            this.passwords = stored ? JSON.parse(stored) : [];
        } else {
            this.passwords = [];
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PasswordManager();
});

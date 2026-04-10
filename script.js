// Password Manager App
class PasswordManager {
    constructor() {
        this.passwords = this.loadPasswords();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPasswords();
        this.updatePasswordCount();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('passwordForm').addEventListener('submit', (e) => this.addPassword(e));
        document.getElementById('editForm').addEventListener('submit', (e) => this.updatePassword(e));

        // Toggle password visibility
        document.getElementById('togglePassword').addEventListener('click', (e) => this.togglePasswordVisibility(e, 'password'));
        document.getElementById('editTogglePassword').addEventListener('click', (e) => this.togglePasswordVisibility(e, 'editPassword'));

        // Password strength indicator
        document.getElementById('password').addEventListener('input', (e) => this.updatePasswordStrength(e.target));

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => this.filterPasswords());
        document.getElementById('filterCategory').addEventListener('change', () => this.filterPasswords());

        // Modal close buttons
        document.querySelector('.close').addEventListener('click', () => this.closeEditModal());
        document.getElementById('closeEditModal').addEventListener('click', () => this.closeEditModal());
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

        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Uppercase check
        if (/[A-Z]/.test(password)) strength++;

        // Lowercase check
        if (/[a-z]/.test(password)) strength++;

        // Number check
        if (/[0-9]/.test(password)) strength++;

        // Special character check
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
        document.getElementById('passwordCount').textContent = 
            `${count} password${count !== 1 ? 's' : ''} stored`;
    }

    // Close edit modal
    closeEditModal() {
        document.getElementById('editModal').classList.remove('show');
        document.getElementById('editForm').reset();
    }

    // Reset form
    resetForm() {
        document.getElementById('passwordForm').reset();
        document.getElementById('password').type = 'password';
        document.getElementById('togglePassword').textContent = '👁️';
        document.getElementById('passwordStrength').className = 'password-strength';
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

    // Save passwords to localStorage
    savePasswords() {
        localStorage.setItem('passwords', JSON.stringify(this.passwords));
    }

    // Load passwords from localStorage
    loadPasswords() {
        const stored = localStorage.getItem('passwords');
        return stored ? JSON.parse(stored) : [];
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

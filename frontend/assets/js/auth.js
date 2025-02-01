class Auth {
    constructor() {
        this.baseURL = 'http://localhost:5000/api/users';
        this.token = localStorage.getItem('token');
        this.user = null;
        
        // Try to parse user data from localStorage
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                this.user = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user'); // Clear invalid data
        }

        this.updateAuthUI();
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message);
            }

            this.token = data.token;
            this.user = data.user;

            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            
            this.updateAuthUI();

            // Redirect based on role
            if (this.user.roles.includes('admin')) {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'find-jobs.html';
            }

            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    logout() {
        try {
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Reset class properties
            this.token = null;
            this.user = null;
            
            // Update UI
            this.updateAuthUI();
            
            // Get the current path to determine the correct redirect
            const currentPath = window.location.pathname;
            const isInAdminFolder = currentPath.includes('/admin/');
            
            // Adjust path based on current location
            if (isInAdminFolder) {
                window.location.href = '../../pages/login.html';
            } else {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        const navItems = document.querySelectorAll('.nav-item');
        if (!authButtons) return;

        if (this.user && this.user.roles) { // Check if user and roles exist
            // Hide all role-specific nav items first
            navItems.forEach(item => {
                if (item.classList.contains('admin-only') || 
                    item.classList.contains('job-poster-only') || 
                    item.classList.contains('job-seeker-only')) {
                    item.style.display = 'none';
                }
            });

            // Show navigation based on roles
            if (this.user.roles.includes('admin')) {
                document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
            } else if (this.user.roles.includes('job_poster')) {
                document.querySelectorAll('.job-poster-only').forEach(el => el.style.display = 'block');
            } else if (this.user.roles.includes('job_seeker')) {
                document.querySelectorAll('.job-seeker-only').forEach(el => el.style.display = 'block');
            }

            // Update auth buttons with username and primary role
            const primaryRole = this.user.roles[0] || 'user'; // Fallback to 'user' if no role
            authButtons.innerHTML = `
                <span class="navbar-text me-3">
                    Welcome, ${this.user.username} (${primaryRole})
                </span>
                <button onclick="window.auth.logout()" class="btn btn-light">Logout</button>
            `;
        } else {
            // Show default navigation for non-logged in users
            navItems.forEach(item => {
                if (!item.classList.contains('public-only')) {
                    item.style.display = 'none';
                }
            });

            // Get the current path
            const currentPath = window.location.pathname;
            const isInAdminFolder = currentPath.includes('/admin/');
            const prefix = isInAdminFolder ? '../../pages/' : '';

            authButtons.innerHTML = `
                <a href="${prefix}login.html" class="btn btn-outline-light me-2">Login</a>
                <a href="${prefix}register.html" class="btn btn-light">Register</a>
            `;
        }
    }

    isAuthenticated() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }

    checkAccess(allowedRoles = []) {
        // Get the current path
        const currentPath = window.location.pathname;
        const isInAdminFolder = currentPath.includes('/admin/');
        const prefix = isInAdminFolder ? '../../pages/' : '';

        if (!this.isAuthenticated()) {
            window.location.href = `${prefix}login.html`;
            return false;
        }

        // Check if user has any of the allowed roles
        if (allowedRoles.length > 0 && !this.user.roles.some(role => allowedRoles.includes(role))) {
            window.location.href = `${prefix}error.html`;
            return false;
        }

        return true;
    }

    checkAdminAccess() {
        return this.checkAccess(['admin']);
    }

    checkJobPosterAccess() {
        return this.checkAccess(['admin', 'job_poster']);
    }

    checkJobSeekerAccess() {
        return this.checkAccess(['job_seeker']);
    }

    // Add this new method for checking page access
    checkPageAccess() {
        const currentPath = window.location.pathname;
        
        // Define page access rules
        const pageRules = {
            '/admin/': ['admin'],
            'post-job.html': ['admin', 'job_poster'],
            'my-applications.html': ['job_seeker']
        };

        // Check each rule
        for (const [page, roles] of Object.entries(pageRules)) {
            if (currentPath.includes(page)) {
                return this.checkAccess(roles);
            }
        }

        return true; // Allow access to pages without specific rules
    }
}

// Make auth globally available
window.auth = new Auth(); 
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.toggleBtn = document.getElementById('themeToggle');
        this.initialize();
    }

    initialize() {
        // Set initial theme
        this.setTheme(this.theme);
        
        // Setup toggle button
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
            this.updateToggleButton();
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
        this.updateToggleButton();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateToggleButton() {
        if (this.toggleBtn) {
            const icon = this.toggleBtn.querySelector('i');
            if (icon) {
                icon.className = this.theme === 'light' 
                    ? 'bi bi-moon-fill' 
                    : 'bi bi-sun-fill';
            }
        }
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
}); 
class ThemeToggle {
    constructor() {
        this.toggleBtn = document.getElementById('themeToggle');
        this.icon = this.toggleBtn?.querySelector('i');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.toggleBtn?.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.body.style.backgroundColor = theme === 'dark' ? '#1F2937' : '#ffffff';
        document.body.style.color = theme === 'dark' ? '#ffffff' : '#1F2937';
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        if (this.icon) {
            this.icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Initialize theme toggle
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
}); 
class Navigation {
    static setActiveNavItem() {
        // Get current page path
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop();

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page's nav link
        const navLinks = {
            'index.html': '<i class="bi bi-house me-1"></i>Home',
            'find-jobs.html': '<i class="bi bi-search me-1"></i>Find Jobs',
            'post-job.html': '<i class="bi bi-plus-circle me-1"></i>Post Job',
            'about.html': '<i class="bi bi-info-circle me-1"></i>About',
            'contact.html': '<i class="bi bi-envelope me-1"></i>Contact',
            'dashboard.html': '<i class="bi bi-speedometer2 me-1"></i>Admin'
        };

        if (navLinks[pageName]) {
            const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(
                link => link.innerHTML.includes(navLinks[pageName])
            );
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    static init() {
        // Call this after DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            Navigation.setActiveNavItem();
        });
    }
}

// Initialize navigation
Navigation.init(); 
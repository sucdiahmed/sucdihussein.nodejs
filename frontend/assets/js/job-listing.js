class JobListing {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.jobsContainer = document.getElementById('jobsContainer');
        this.searchForm = document.getElementById('jobSearchForm');
        this.searchInput = document.getElementById('jobSearchInput');
        this.locationInput = document.getElementById('locationInput');
        this.sortSelect = document.getElementById('jobSortSelect');
        
        this.jobs = []; // Store all jobs
        this.filters = {
            jobType: [],
            experienceLevel: [],
            salary: null
        };
        
        if (this.jobsContainer) {
            this.loadJobs();
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Search form
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        // Job type filters
        document.querySelectorAll('input[name="jobType"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleFilters());
        });

        // Experience level filters
        document.querySelectorAll('input[name="experienceLevel"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleFilters());
        });

        // Salary range filter
        const salaryRange = document.getElementById('salaryRange');
        if (salaryRange) {
            salaryRange.addEventListener('input', (e) => {
                const salaryValue = document.getElementById('salaryValue');
                if (salaryValue) {
                    salaryValue.textContent = `$${e.target.value}`;
                }
                this.handleFilters();
            });
        }

        // Sort dropdown
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => this.handleSort());
        }
    }

    async loadJobs() {
        try {
            console.log('Fetching jobs...');
            const response = await fetch(`${this.baseURL}/jobs`);
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Received data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch jobs');
            }

            this.jobs = Array.isArray(data.jobs) ? data.jobs : [];
            
            if (this.jobs.length === 0) {
                this.showNoJobs();
            } else {
                this.displayJobs(this.jobs);
            }

        } catch (error) {
            console.error('Error loading jobs:', error);
            this.showError(error.message);
        }
    }

    handleSearch() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const locationTerm = document.getElementById('locationInput')?.value.toLowerCase() || '';

        let filteredJobs = this.jobs.filter(job => {
            const matchesSearch = !searchTerm || 
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm);

            const matchesLocation = !locationTerm ||
                job.location.toLowerCase().includes(locationTerm);

            return matchesSearch && matchesLocation;
        });

        this.applyFiltersAndSort(filteredJobs);
    }

    handleFilters() {
        // Get selected job types
        this.filters.jobType = Array.from(document.querySelectorAll('input[name="jobType"]:checked'))
            .map(cb => cb.value);

        // Get selected experience levels
        this.filters.experienceLevel = Array.from(document.querySelectorAll('input[name="experienceLevel"]:checked'))
            .map(cb => cb.value);

        // Get salary range
        this.filters.salary = parseInt(document.getElementById('salaryRange').value);

        this.applyFiltersAndSort(this.jobs);
    }

    handleSort() {
        const sortBy = this.sortSelect.value;
        let sortedJobs = [...this.jobs];

        switch (sortBy) {
            case 'recent':
                sortedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'salary-high':
                sortedJobs.sort((a, b) => this.parseSalary(b.salary) - this.parseSalary(a.salary));
                break;
            case 'salary-low':
                sortedJobs.sort((a, b) => this.parseSalary(a.salary) - this.parseSalary(b.salary));
                break;
        }

        this.displayJobs(sortedJobs);
    }

    applyFiltersAndSort(jobs) {
        let filteredJobs = jobs.filter(job => {
            const matchesJobType = this.filters.jobType.length === 0 || 
                this.filters.jobType.includes(job.jobType);

            const matchesExperience = this.filters.experienceLevel.length === 0 || 
                this.filters.experienceLevel.includes(job.experienceLevel);

            const matchesSalary = !this.filters.salary || 
                this.parseSalary(job.salary) >= this.filters.salary;

            return matchesJobType && matchesExperience && matchesSalary;
        });

        // Apply current sort
        this.handleSort(filteredJobs);
    }

    parseSalary(salaryString) {
        // Extract the first number from salary string (assuming format like "$50,000" or "$50,000-$70,000")
        const match = salaryString.match(/\$?(\d+(?:,\d+)?)/);
        return match ? parseInt(match[1].replace(',', '')) : 0;
    }

    displayJobs(jobs) {
        this.jobsContainer.innerHTML = jobs.map(job => `
            <div class="col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title text-primary">
                            <i class="bi bi-briefcase me-2"></i>${job.title}
                        </h5>
                        <h6 class="company-name">
                            <i class="bi bi-building me-2"></i>${job.company}
                        </h6>
                        <div class="job-details mb-3">
                            <span class="badge bg-primary me-2">
                                <i class="bi bi-clock me-1"></i>${job.jobType}
                            </span>
                            <span class="text-muted">
                                <i class="bi bi-geo-alt me-1"></i>${job.location}
                            </span>
                        </div>
                        <p class="card-text text-muted">
                            <i class="bi bi-currency-dollar me-1"></i>${job.salary}
                        </p>
                        <p class="card-text description">${this.truncateText(job.description, 150)}</p>
                        <div class="text-end mt-3">
                            <a href="job-details.html?id=${job._id}" class="btn btn-outline-primary">
                                <i class="bi bi-eye me-1"></i>View Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showNoJobs() {
        this.jobsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    No jobs available at the moment. Please check back later.
                </div>
            </div>
        `;
    }

    showError(message) {
        this.jobsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    ${message || 'Failed to load jobs. Please try again later.'}
                </div>
            </div>
        `;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        return 'Just now';
    }
}

// Initialize job listing only when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JobListing();
}); 
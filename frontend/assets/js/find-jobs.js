class JobListing {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.jobsContainer = document.getElementById('jobsContainer');
        this.searchForm = document.getElementById('jobSearchForm');
        this.filterForm = document.getElementById('filterForm');
        this.jobs = [];
        
        this.loadJobs();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search form
        this.searchForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

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
            salaryRange.addEventListener('input', () => this.handleFilters());
        }
    }

    async loadJobs() {
        try {
            const response = await fetch(`${this.baseURL}/jobs`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch jobs');
            }

            this.jobs = data.jobs || [];
            this.displayJobs(this.jobs);
        } catch (error) {
            console.error('Error loading jobs:', error);
            this.showError(error.message);
        }
    }

    handleSearch() {
        const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';
        const locationTerm = document.getElementById('locationInput')?.value?.toLowerCase() || '';

        let filteredJobs = this.jobs.filter(job => {
            const matchesSearch = !searchTerm || 
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm);

            const matchesLocation = !locationTerm ||
                job.location.toLowerCase().includes(locationTerm);

            return matchesSearch && matchesLocation;
        });

        this.applyFilters(filteredJobs);
    }

    handleFilters() {
        const selectedJobTypes = Array.from(document.querySelectorAll('input[name="jobType"]:checked'))
            .map(cb => cb.value);

        const selectedExperienceLevels = Array.from(document.querySelectorAll('input[name="experienceLevel"]:checked'))
            .map(cb => cb.value);

        const salaryRange = document.getElementById('salaryRange')?.value;

        let filteredJobs = this.jobs.filter(job => {
            const matchesJobType = selectedJobTypes.length === 0 || 
                selectedJobTypes.includes(job.jobType);

            const matchesExperience = selectedExperienceLevels.length === 0 || 
                selectedExperienceLevels.includes(job.experienceLevel);

            const matchesSalary = !salaryRange || 
                this.parseSalary(job.salary) >= parseInt(salaryRange);

            return matchesJobType && matchesExperience && matchesSalary;
        });

        this.displayJobs(filteredJobs);
    }

    applyFilters(jobs) {
        const selectedJobTypes = Array.from(document.querySelectorAll('input[name="jobType"]:checked'))
            .map(cb => cb.value);

        const selectedExperienceLevels = Array.from(document.querySelectorAll('input[name="experienceLevel"]:checked'))
            .map(cb => cb.value);

        const salaryRange = document.getElementById('salaryRange')?.value;

        const filteredJobs = jobs.filter(job => {
            const matchesJobType = selectedJobTypes.length === 0 || 
                selectedJobTypes.includes(job.jobType);

            const matchesExperience = selectedExperienceLevels.length === 0 || 
                selectedExperienceLevels.includes(job.experienceLevel);

            const matchesSalary = !salaryRange || 
                this.parseSalary(job.salary) >= parseInt(salaryRange);

            return matchesJobType && matchesExperience && matchesSalary;
        });

        this.displayJobs(filteredJobs);
    }

    displayJobs(jobs) {
        if (!this.jobsContainer) return;

        if (jobs.length === 0) {
            this.jobsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>No jobs found matching your criteria.
                    </div>
                </div>
            `;
            return;
        }

        this.jobsContainer.innerHTML = jobs.map(job => {
            // Define background color based on job type
            const bgColorClass = this.getJobCardColor(job.jobType);
            
            return `
                <div class="col-md-6 mb-4">
                    <div class="card h-100 shadow-sm ${bgColorClass}">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${job.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${job.company}</h6>
                            <p class="card-text mb-2">
                                <i class="bi bi-geo-alt me-2"></i>${job.location}
                            </p>
                            <div class="mb-3">
                                <span class="badge bg-primary me-2">${job.jobType}</span>
                                <span class="badge bg-secondary">${job.experienceLevel}</span>
                            </div>
                            <p class="card-text">${this.truncateText(job.description, 150)}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="text-muted">
                                    <i class="bi bi-clock me-2"></i>${this.timeAgo(new Date(job.createdAt))}
                                </span>
                                <a href="job-details.html?id=${job._id}" class="btn btn-outline-primary">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    parseSalary(salaryString) {
        const match = salaryString.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
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

    // Add this new method to determine card background color
    getJobCardColor(jobType) {
        switch (jobType.toLowerCase()) {
            case 'full-time':
                return 'bg-soft-primary';
            case 'part-time':
                return 'bg-soft-success';
            case 'contract':
                return 'bg-soft-warning';
            case 'remote':
                return 'bg-soft-info';
            default:
                return 'bg-white';
        }
    }
}

// Initialize job listing
document.addEventListener('DOMContentLoaded', () => {
    new JobListing();
}); 
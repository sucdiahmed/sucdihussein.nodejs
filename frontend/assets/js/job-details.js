class JobDetails {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.jobId = new URLSearchParams(window.location.search).get('id');
        this.jobDetailsContainer = document.getElementById('jobDetails');
        this.applicationForm = document.getElementById('applicationForm');
        
        this.loadJobDetails();
        this.setupEventListeners();
    }

    async loadJobDetails() {
        try {
            const response = await fetch(`${this.baseURL}/jobs/${this.jobId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch job details');
            }

            this.displayJobDetails(data.job);
        } catch (error) {
            console.error('Error loading job details:', error);
            this.showError(error.message);
        }
    }

    displayJobDetails(job) {
        this.jobDetailsContainer.innerHTML = `
            <h3 class="text-primary mb-4">
                <i class="bi bi-briefcase me-2"></i>${job.title}
            </h3>
            <div class="company-info mb-4">
                <h5><i class="bi bi-building me-2"></i>${job.company}</h5>
                <p class="text-muted">
                    <i class="bi bi-geo-alt me-2"></i>${job.location}
                </p>
            </div>
            <div class="job-meta mb-4">
                <span class="badge bg-primary me-2">
                    <i class="bi bi-clock me-1"></i>${job.jobType}
                </span>
                <span class="badge bg-secondary">
                    <i class="bi bi-currency-dollar me-1"></i>${job.salary}
                </span>
            </div>
            <div class="job-description">
                <h5 class="mb-3"><i class="bi bi-file-text me-2"></i>Job Description</h5>
                <p>${job.description}</p>
            </div>
        `;
    }

    setupEventListeners() {
        this.applicationForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitApplication(e.target);
        });
    }

    async submitApplication(form) {
        try {
            const formData = new FormData(form);
            formData.append('jobId', this.jobId);

            const response = await fetch(`${this.baseURL}/applications`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.auth.getToken()}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit application');
            }

            // Show success message
            alert('Application submitted successfully!');
            window.location.href = 'find-jobs.html';

        } catch (error) {
            console.error('Error submitting application:', error);
            alert(error.message || 'Failed to submit application. Please try again.');
        }
    }

    showError(message) {
        this.jobDetailsContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${message || 'Failed to load job details. Please try again later.'}
            </div>
        `;
    }
}

// Initialize job details
document.addEventListener('DOMContentLoaded', () => {
    new JobDetails();
}); 
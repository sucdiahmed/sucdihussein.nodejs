class JobPoster {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.checkAuth();
        this.form = document.getElementById('postJobForm');
        this.setupEventListeners();
    }

    checkAuth() {
        if (!window.auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        const user = window.auth.getUser();
        // Check if user has job_poster or admin role
        if (!user.roles.includes('job_poster') && !user.roles.includes('admin')) {
            window.location.href = 'index.html';
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.postJob();
        });
    }

    async postJob() {
        const alertDiv = document.getElementById('jobAlert');
        
        try {
            // Get form data
            const jobData = {
                title: document.getElementById('title').value.trim(),
                company: document.getElementById('company').value.trim(),
                location: document.getElementById('location').value.trim(),
                jobType: document.getElementById('jobType').value,
                experienceLevel: document.getElementById('experienceLevel').value,
                salary: document.getElementById('salary').value.trim(),
                description: document.getElementById('description').value.trim()
            };

            // Validate required fields
            for (const [field, value] of Object.entries(jobData)) {
                if (!value) {
                    throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                }
            }

            const response = await fetch(`${this.baseURL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.auth.getToken()}`
                },
                body: JSON.stringify(jobData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to post job');
            }

            alertDiv.className = 'alert alert-success';
            alertDiv.style.display = 'block';
            alertDiv.textContent = 'Job posted successfully!';
            
            // Clear form
            this.form.reset();

            // Redirect to jobs page after 2 seconds
            setTimeout(() => {
                window.location.href = 'find-jobs.html';
            }, 2000);

        } catch (error) {
            console.error('Error posting job:', error);
            alertDiv.className = 'alert alert-danger';
            alertDiv.style.display = 'block';
            alertDiv.textContent = error.message || 'Failed to post job. Please try again.';
        }
    }
}

// Initialize job poster
const jobPoster = new JobPoster();

// Form validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('postJobForm');
    const inputs = form.querySelectorAll('input, textarea, select');

    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateInput(input);
            }
        });
    });

    function validateInput(input) {
        const validationRules = {
            title: {
                minLength: 3,
                maxLength: 100
            },
            company: {
                minLength: 2,
                maxLength: 50
            },
            location: {
                minLength: 2,
                maxLength: 100
            },
            jobType: {
                custom: {
                    validate: value => ['full-time', 'part-time', 'contract', 'remote'].includes(value),
                    message: 'Please select a valid job type'
                }
            },
            salary: {
                pattern: /^\$\d{1,3}(,\d{3})*(\s*-\s*\$\d{1,3}(,\d{3})*)?$/
            },
            description: {
                minLength: 50,
                maxLength: 5000
            },
            experienceLevel: {
                custom: {
                    validate: value => ['entry', 'mid', 'senior'].includes(value),
                    message: 'Please select a valid experience level'
                }
            }
        };

        return FormValidator.validateInput(input, validationRules[input.id]);
    }
}); 
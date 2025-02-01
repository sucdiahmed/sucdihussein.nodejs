class ContactForm {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.form = document.getElementById('contactForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    }

    async handleSubmit() {
        try {
            const formData = {
                name: this.form.querySelector('input[name="name"]').value,
                email: this.form.querySelector('input[name="email"]').value,
                subject: this.form.querySelector('input[name="subject"]').value,
                message: this.form.querySelector('textarea[name="message"]').value
            };

            // Add loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
            submitBtn.disabled = true;

            const response = await fetch(`${this.baseURL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send message');
            }

            const data = await response.json();
            this.showAlert('success', 'Message sent successfully! We will get back to you soon.');
            this.form.reset();

        } catch (error) {
            console.error('Error sending message:', error);
            this.showAlert('danger', error.message || 'Failed to send message. Please try again.');
        } finally {
            // Reset button state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Send Message';
            submitBtn.disabled = false;
        }
    }

    showAlert(type, message) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Insert alert before the form
        this.form.parentNode.insertBefore(alert, this.form);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }, 5000);
    }
}

// Initialize contact form
const contactForm = new ContactForm(); 
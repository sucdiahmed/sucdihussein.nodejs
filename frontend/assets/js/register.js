document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input, select');

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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        try {
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Registering...';
            submitBtn.disabled = true;

            const userData = {
                username: username.trim(),
                email: email.trim(),
                password: password,
                role: role
            };

            const result = await window.auth.register(userData);
            
            // If registration successful, store token and user data
            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Update auth state
                window.auth.token = result.token;
                window.auth.user = result.user;
                window.auth.updateAuthUI();

                // Redirect based on role
                if (result.user.roles.includes('admin')) {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'find-jobs.html';
                }
            }
        } catch (error) {
            // Show error message
            const alertDiv = document.getElementById('registerAlert');
            alertDiv.className = 'alert alert-danger';
            alertDiv.textContent = error.message;
            alertDiv.style.display = 'block';
        } finally {
            // Reset button state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="bi bi-person-plus me-2"></i>Register';
            submitBtn.disabled = false;
        }
    });

    function validateInput(input) {
        const validationRules = {
            username: {
                minLength: 3,
                maxLength: 20,
                pattern: /^[a-zA-Z0-9_]+$/
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            password: {
                minLength: 6,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
            },
            role: {
                custom: {
                    validate: value => ['job_seeker', 'job_poster'].includes(value),
                    message: 'Please select a valid role'
                }
            }
        };

        return FormValidator.validateInput(input, validationRules[input.id]);
    }
}); 
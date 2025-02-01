document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input');

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

        // Validate all inputs and show errors for empty fields
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                FormValidator.showError(input, `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required`);
                isValid = false;
            } else if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        const alertDiv = document.getElementById('loginAlert');
        
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            await auth.login(email, password);
        } catch (error) {
            alertDiv.className = 'alert alert-danger';
            alertDiv.style.display = 'block';
            alertDiv.textContent = error.message;
        }
    });

    function validateInput(input) {
        const validationRules = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            password: {
                minLength: 6
            }
        };

        return FormValidator.validateInput(input, validationRules[input.id]);
    }
}); 
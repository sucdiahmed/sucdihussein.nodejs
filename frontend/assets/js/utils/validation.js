class FormValidator {
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidUsername(username) {
        // Allow letters, numbers, underscore, min 3 chars, max 20
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    static isValidPassword(password) {
        // Minimum 6 chars, at least one letter and one number
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return passwordRegex.test(password);
    }

    static isValidSalary(salary) {
        // Format: $X,XXX or $X,XXX-$Y,YYY
        const salaryRegex = /^\$\d{1,3}(,\d{3})*(\s*-\s*\$\d{1,3}(,\d{3})*)?$/;
        return salaryRegex.test(salary);
    }

    static isValidPhoneNumber(phone) {
        // Format: +X-XXX-XXX-XXXX or (XXX) XXX-XXXX
        const phoneRegex = /^(\+\d{1,3}-\d{3}-\d{3}-\d{4}|\(\d{3}\)\s\d{3}-\d{4})$/;
        return phoneRegex.test(phone);
    }

    static showError(input, message) {
        const formGroup = input.closest('.mb-3');
        const errorDiv = formGroup.querySelector('.invalid-feedback') || document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.classList.add('is-invalid');
        
        if (!formGroup.querySelector('.invalid-feedback')) {
            formGroup.appendChild(errorDiv);
        }
    }

    static showSuccess(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    static clearValidation(input) {
        input.classList.remove('is-invalid', 'is-valid');
        const formGroup = input.closest('.mb-3');
        const errorDiv = formGroup.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    static validateInput(input, validationRules) {
        this.clearValidation(input);
        
        if (input.required && !input.value.trim()) {
            this.showError(input, `${input.name || 'Field'} is required`);
            return false;
        }

        if (validationRules) {
            for (const [rule, params] of Object.entries(validationRules)) {
                switch (rule) {
                    case 'minLength':
                        if (input.value.length < params) {
                            this.showError(input, `Minimum ${params} characters required`);
                            return false;
                        }
                        break;
                    case 'maxLength':
                        if (input.value.length > params) {
                            this.showError(input, `Maximum ${params} characters allowed`);
                            return false;
                        }
                        break;
                    case 'pattern':
                        if (!params.test(input.value)) {
                            this.showError(input, input.dataset.errorMessage || 'Invalid format');
                            return false;
                        }
                        break;
                    case 'custom':
                        if (!params.validate(input.value)) {
                            this.showError(input, params.message);
                            return false;
                        }
                        break;
                }
            }
        }

        this.showSuccess(input);
        return true;
    }
} 
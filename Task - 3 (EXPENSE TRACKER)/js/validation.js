/**
 * Validation Module
 * Validates inputs for transactions, users, and setup forms.
 */

class ValidationManager {
    static validateTransaction(data) {
        const errors = {};

        // Title validation
        if (!data.title || data.title.trim() === '') {
            errors.title = 'Title is required';
        } else if (data.title.length > 50) {
            errors.title = 'Title must be under 50 characters';
        }

        // Amount validation
        if (data.amount === undefined || data.amount === null || data.amount === '') {
            errors.amount = 'Amount is required';
        } else {
            const parsedAmount = parseFloat(data.amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                errors.amount = 'Amount must be a positive number';
            }
        }

        // Date validation
        if (!data.date) {
            errors.date = 'Date is required';
        } else {
            const parsedDate = new Date(data.date);
            if (isNaN(parsedDate.getTime())) {
                errors.date = 'Please select a valid date';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    static validateSignUp(fullName, email, password, confirmPassword) {
        const errors = {};

        if (!fullName || fullName.trim() === '') {
            errors.fullName = 'Full Name is required';
        }

        if (!email || email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!this.validateEmail(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static validateSignIn(email, password) {
        const errors = {};

        if (!email || email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!this.validateEmail(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

window.ValidationManager = ValidationManager;

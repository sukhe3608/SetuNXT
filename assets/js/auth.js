document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Check which page we're on
    const isLoginPage = window.location.pathname.includes('login.html') || 
                        document.getElementById('loginForm') !== null;
    const isSignupPage = window.location.pathname.includes('signup.html') || 
                         document.getElementById('signupForm') !== null;
    
    // Initialize page based animations
    if (isLoginPage) {
        initLoginPage();
    } else if (isSignupPage) {
        initSignupPage();
    }
    
    // Initialize form fields
    function initFormFields() {
        const formFields = document.querySelectorAll('.floating-input');
        formFields.forEach((field, index) => {
            field.style.setProperty('--field-index', index);
        });
    }
    
    
    function initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        const submitBtn = document.querySelector('.submit-btn');
        
        initFormFields();
        
        // Toggle password visibility
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                this.innerHTML = type === 'password' ? 
                    '<i class="fas fa-eye"></i>' : 
                    '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Form validation
        function validateForm() {
            let isValid = true;
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Reset previous errors
            document.querySelectorAll('.error-message').forEach(el => {
                el.remove();
            });
            
            emailInput.style.borderColor = '';
            passwordInput.style.borderColor = '';
            
            // Email validation
            if (!email) {
                showFieldError(emailInput, 'Email or phone is required');
                isValid = false;
            } else if (!isValidEmail(email) && !isValidPhone(email)) {
                showFieldError(emailInput, 'Please enter a valid email or phone');
                isValid = false;
            }
            
            // Password validation
            if (!password) {
                showFieldError(passwordInput, 'Password is required');
                isValid = false;
            }
            
            return isValid;
        }
        
        function showFieldError(input, message) {
            input.style.borderColor = 'var(--danger)';
            
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            error.style.cssText = `
                color: var(--danger);
                font-size: 12px;
                margin-top: 4px;
                padding-left: 16px;
            `;
            
            input.parentNode.appendChild(error);
        }
        
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
        
        function isValidPhone(phone) {
            return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/[\D]/g, '').length >= 8;
        }
        
        // Form submission
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            await simulateAPIRequest();
            
            // Show success notification
            showNotification('Login successful! Redirecting...', 'success');
            
            // Reset button
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Simulate redirect
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }, 1500);
        });
        
        // Social login
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.classList.contains('google-btn') ? 'Google' : 'Apple';
                showNotification(`${platform} login would be implemented here`, 'info');
            });
        });
    }
    
    
    function initSignupPage() {
        const signupForm = document.getElementById('signupForm');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirmPassword');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const matchIndicator = document.getElementById('matchIndicator');
        const togglePassword = document.getElementById('togglePassword');
        const submitBtn = document.querySelector('.submit-btn');
        
        initFormFields();
        
        // Toggle password visibility
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                this.innerHTML = type === 'password' ? 
                    '<i class="fas fa-eye"></i>' : 
                    '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Password strength checker
        function checkPasswordStrength(password) {
            let score = 0;
            const hasMinLength = password.length >= 8;
            const hasNumber = /[0-9]/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            
            if (hasMinLength) score++;
            if (hasNumber) score++;
            if (hasUpper) score++;
            if (hasLower) score++;
            if (hasSpecial) score++;
            
            return {
                score,
                hasMinLength,
                hasNumber,
                hasUpper,
                hasLower,
                hasSpecial
            };
        }
        
        // Password strength indicator
        function updateStrengthIndicator(password) {
            const strength = checkPasswordStrength(password);
            const percentage = (strength.score / 5) * 100;
            
            // Update bar
            strengthFill.style.width = `${percentage}%`;
            
            // Update color and text
            let color = 'var(--danger)';
            let text = 'Weak';
            
            if (percentage >= 60) {
                color = 'var(--warning)';
                text = 'Good';
            }
            if (percentage >= 80) {
                color = 'var(--success)';
                text = 'Strong';
            }
            
            strengthFill.style.background = color;
            strengthText.textContent = text;
            strengthText.style.color = color;
        }
        
        // Password match checker
        function checkPasswordMatch() {
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            
            if (!confirm) {
                matchIndicator.style.opacity = '0';
                confirmInput.style.borderColor = '';
                return false;
            }
            
            if (password === confirm && password.length >= 8) {
                // Match success
                matchIndicator.style.opacity = '1';
                matchIndicator.style.background = 'var(--success)';
                matchIndicator.innerHTML = '<i class="fas fa-check"></i>';
                confirmInput.style.borderColor = 'var(--success)';
                return true;
            } else {
                // Match error
                matchIndicator.style.opacity = '1';
                matchIndicator.style.background = 'var(--danger)';
                matchIndicator.innerHTML = '<i class="fas fa-times"></i>';
                confirmInput.style.borderColor = 'var(--danger)';
                return false;
            }
        }
        
        // Real-time password validation
        passwordInput.addEventListener('input', function() {
            updateStrengthIndicator(this.value);
            checkPasswordMatch();
        });
        
        confirmInput.addEventListener('input', checkPasswordMatch);
        
        // Form validation
        function validateSignupForm() {
            let isValid = true;
            const requiredFields = signupForm.querySelectorAll('[required]');
            
            // Reset errors
            document.querySelectorAll('.error-message').forEach(el => {
                el.remove();
            });
            
            signupForm.querySelectorAll('input').forEach(input => {
                input.style.borderColor = '';
            });
            
            // Check required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                }
            });
            
            // Check password strength
            const strength = checkPasswordStrength(passwordInput.value);
            if (strength.score < 3) {
                showFieldError(passwordInput, 'Password must be stronger (min 8 chars with mix of letters, numbers)');
                isValid = false;
            }
            
            // Check password match
            if (!checkPasswordMatch()) {
                showFieldError(confirmInput, 'Passwords do not match');
                isValid = false;
            }
            
            // Check terms
            const terms = document.getElementById('terms');
            if (!terms.checked) {
                showNotification('Please accept the Terms and Privacy Policy', 'warning');
                isValid = false;
            }
            
            return isValid;
        }
        
        function showFieldError(input, message) {
            input.style.borderColor = 'var(--danger)';
            
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            error.style.cssText = `
                color: var(--danger);
                font-size: 12px;
                margin-top: 4px;
                padding-left: 16px;
            `;
            
            input.parentNode.appendChild(error);
        }
        
        // Form submission
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateSignupForm()) return;
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            await simulateAPIRequest();
            
            // Show success notification
            showNotification('Account created successfully!', 'success');
            
            // Reset button
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Redirect to login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }, 1500);
        });
    }
    
    
    // Simulate API request
    function simulateAPIRequest() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            danger: 'times-circle',
            info: 'info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 12px 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid var(--${type});
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Add animation styles
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
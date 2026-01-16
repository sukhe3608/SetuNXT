// SetuNXT Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Check which page we're on
    const isLoginPage = window.location.pathname.includes('login.html') || 
                        document.getElementById('loginForm') !== null;
    const isSignupPage = window.location.pathname.includes('signup.html') || 
                         document.getElementById('signupForm') !== null;
    
    if (isLoginPage) {
        initLoginPage();
    } else if (isSignupPage) {
        initSignupPage();
    }
    
    // ============================================
    // LOGIN PAGE FUNCTIONS
    // ============================================
    
    function initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const googleBtn = document.querySelector('.auth-google-btn');
        const appleBtn = document.querySelector('.auth-apple-btn');
        const forgotPasswordLink = document.querySelector('.auth-forgot-password');
        
        // Function to validate email/phone input
        function validateEmail() {
            const email = emailInput.value.trim();
            
            // Check if empty
            if (email === '') {
                emailError.textContent = 'Please enter your email or phone number';
                emailError.style.display = 'block';
                emailInput.style.borderColor = 'var(--auth-danger)';
                emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                return false;
            }
            
            // Simple validation for email or phone
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            const isPhone = /^[\d\s\-\+\(\)]+$/.test(email) && email.replace(/[\D]/g, '').length >= 8;
            
            if (!isEmail && !isPhone) {
                emailError.textContent = 'Please enter a valid email or phone number';
                emailError.style.display = 'block';
                emailInput.style.borderColor = 'var(--auth-danger)';
                emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                return false;
            }
            
            // Valid input
            emailError.style.display = 'none';
            emailInput.style.borderColor = 'var(--auth-success)';
            emailInput.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            return true;
        }
        
        // Function to validate password
        function validatePassword() {
            const password = passwordInput.value.trim();
            
            // Check if empty
            if (password === '') {
                passwordError.textContent = 'Please enter your password';
                passwordError.style.display = 'block';
                passwordInput.style.borderColor = 'var(--auth-danger)';
                passwordInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                return false;
            }
            
            // Valid input
            passwordError.style.display = 'none';
            passwordInput.style.borderColor = 'var(--auth-success)';
            passwordInput.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            return true;
        }
        
        // Event listeners for real-time validation
        emailInput.addEventListener('blur', validateEmail);
        passwordInput.addEventListener('blur', validatePassword);
        
        // Clear error styling on focus
        emailInput.addEventListener('focus', function() {
            emailError.style.display = 'none';
            emailInput.style.borderColor = 'var(--auth-border)';
            emailInput.style.boxShadow = 'none';
        });
        
        passwordInput.addEventListener('focus', function() {
            passwordError.style.display = 'none';
            passwordInput.style.borderColor = 'var(--auth-border)';
            passwordInput.style.boxShadow = 'none';
        });
        
        // Event listener for form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate both fields
            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();
            
            // If all validations pass
            if (isEmailValid && isPasswordValid) {
                // Simulate login process
                const submitBtn = document.querySelector('.auth-submit-btn');
                const originalText = submitBtn.textContent;
                
                // Show loading state
                submitBtn.textContent = 'Logging in...';
                submitBtn.disabled = true;
                
                // Simulate API call delay
                setTimeout(() => {
                    // Show success notification
                    showNotification('Login successful! Welcome back to SetuNXT.', 'success');
                    
                    // Reset button state
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // In a real app, you would redirect to dashboard
                    // window.location.href = 'index.html';
                }, 1500);
            }
        });
        
        // Social login button handlers
        if (googleBtn) {
            googleBtn.addEventListener('click', function() {
                showNotification('Google login would be implemented here', 'info');
            });
        }
        
        if (appleBtn) {
            appleBtn.addEventListener('click', function() {
                showNotification('Apple login would be implemented here', 'info');
            });
        }
        
        // Forgot password modal handler
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
                // Modal is handled by Bootstrap data attributes
            });
        }
        
        // Forgot password form submission
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('resetEmail').value.trim();
                
                if (!email) {
                    showNotification('Please enter your email address', 'warning');
                    return;
                }
                
                const sendBtn = document.getElementById('sendResetLinkBtn');
                const originalText = sendBtn.textContent;
                
                sendBtn.textContent = 'Sending...';
                sendBtn.disabled = true;
                
                setTimeout(() => {
                    sendBtn.textContent = originalText;
                    sendBtn.disabled = false;
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
                    if (modal) modal.hide();
                    
                    showNotification(`Password reset link sent to ${email}. Please check your inbox.`, 'success');
                }, 1500);
            });
        }
    }
    
    // ============================================
    // SIGNUP PAGE FUNCTIONS
    // ============================================
    
    function initSignupPage() {
        const signupForm = document.getElementById('signupForm');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordRequirements = document.getElementById('passwordRequirements');
        const passwordMatch = document.getElementById('passwordMatch');
        
        // Requirement elements
        const reqLength = document.getElementById('reqLength');
        const reqNumber = document.getElementById('reqNumber');
        const reqUppercase = document.getElementById('reqUppercase');
        const reqSpecial = document.getElementById('reqSpecial');
        
        // Variable to track if password field is currently focused
        let passwordFieldFocused = false;
        
        // Function to show password requirements
        function showPasswordRequirements() {
            passwordRequirements.style.display = 'block';
        }
        
        // Function to hide password requirements (if empty and not focused)
        function hidePasswordRequirements() {
            if (passwordInput.value === '' && !passwordFieldFocused) {
                passwordRequirements.style.display = 'none';
            }
        }
        
        // Function to validate password in real-time
        function validatePassword() {
            const password = passwordInput.value;
            
            // Show requirements when user starts typing
            if (password.length > 0) {
                showPasswordRequirements();
            } else {
                hidePasswordRequirements();
            }
            
            // Check each requirement
            const hasMinLength = password.length >= 8;
            const hasNumber = /[0-9]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            
            // Update requirement indicators
            updateRequirement(reqLength, hasMinLength);
            updateRequirement(reqNumber, hasNumber);
            updateRequirement(reqUppercase, hasUppercase);
            updateRequirement(reqSpecial, hasSpecialChar);
            
            // Check if passwords match
            validatePasswordConfirm();
        }
        
        // Function to update individual requirement display
        function updateRequirement(element, isValid) {
            if (isValid) {
                element.className = 'auth-requirement valid';
                element.querySelector('span').textContent = '✓';
            } else {
                element.className = 'auth-requirement invalid';
                element.querySelector('span').textContent = '•';
            }
        }
        
        // Function to validate password confirmation
        function validatePasswordConfirm() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword === '') {
                confirmPasswordInput.style.borderColor = 'var(--auth-border)';
                confirmPasswordInput.style.boxShadow = 'none';
                passwordMatch.textContent = '';
                passwordMatch.className = 'auth-password-match';
                return;
            }
            
            if (password !== confirmPassword) {
                confirmPasswordInput.style.borderColor = 'var(--auth-danger)';
                confirmPasswordInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                passwordMatch.textContent = 'Passwords do not match';
                passwordMatch.className = 'auth-password-match not-matching';
            } else {
                confirmPasswordInput.style.borderColor = 'var(--auth-success)';
                confirmPasswordInput.style.boxShadow = '0 0 0 3px rgba(46, 204, 113, 0.1)';
                passwordMatch.textContent = 'Passwords match';
                passwordMatch.className = 'auth-password-match matching';
            }
        }
        
        // Function to validate all form fields
        function validateSignupForm() {
            let isValid = true;
            
            // Required fields
            const requiredFields = signupForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--auth-danger)';
                    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    isValid = false;
                }
            });
            
            // Check if terms are accepted
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox.checked) {
                showNotification('Please accept the Terms of Service and Privacy Policy', 'warning');
                isValid = false;
            }
            
            // Validate password requirements
            const password = passwordInput.value;
            const hasMinLength = password.length >= 8;
            const hasNumber = /[0-9]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            
            if (!hasMinLength || !hasNumber || !hasUppercase || !hasSpecialChar) {
                showNotification('Password does not meet all requirements. Please check the password guidelines.', 'warning');
                showPasswordRequirements();
                passwordInput.focus();
                isValid = false;
            }
            
            // Check password confirmation
            if (password !== confirmPasswordInput.value) {
                showNotification('Passwords do not match. Please check and try again.', 'warning');
                confirmPasswordInput.focus();
                isValid = false;
            }
            
            return isValid;
        }
        
        // Event listeners for password field
        passwordInput.addEventListener('focus', function() {
            passwordFieldFocused = true;
            showPasswordRequirements();
        });
        
        passwordInput.addEventListener('blur', function() {
            passwordFieldFocused = false;
            // Don't hide requirements if there's content
            if (passwordInput.value === '') {
                setTimeout(hidePasswordRequirements, 300);
            }
        });
        
        passwordInput.addEventListener('input', validatePassword);
        
        // Event listener for confirm password field
        confirmPasswordInput.addEventListener('input', validatePasswordConfirm);
        
        // Event listener for form submission
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateSignupForm()) {
                const submitBtn = document.querySelector('.auth-submit-btn');
                const originalText = submitBtn.textContent;
                
                // Show loading state
                submitBtn.textContent = 'Creating Account...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Show success notification
                    showNotification('Account created successfully! Welcome to SetuNXT.', 'success');
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Redirect to login page after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                }, 2000);
            }
        });
        
        // Initialize - requirements hidden by default
        hidePasswordRequirements();
    }
    
    // ============================================
    // SHARED FUNCTIONS
    // ============================================
    
    // Show notification function (shared between both pages)
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.auth-notification');
        existing.forEach(notif => {
            notif.style.animation = 'slideOutNotification 0.3s ease forwards';
            setTimeout(() => notif.remove(), 300);
        });
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'auth-notification';
        
        const icon = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            danger: 'times-circle',
            info: 'info-circle'
        }[type] || 'info-circle';
        
        const color = {
            success: 'var(--auth-success)',
            warning: 'var(--auth-warning)',
            danger: 'var(--auth-danger)',
            info: 'var(--auth-primary)'
        }[type] || 'var(--auth-primary)';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 1.25rem;
            right: 1.25rem;
            background: white;
            border-left: 4px solid ${color};
            padding: 1rem 1.25rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            max-width: 400px;
            z-index: 9999;
            animation: slideInNotification 0.3s ease;
            border: 1px solid var(--auth-border);
            font-size: 0.875rem;
        `;
        
        document.body.appendChild(notification);
        
        // Add animation styles if not already present
        if (!document.querySelector('#auth-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-notification-styles';
            style.textContent = `
                @keyframes slideInNotification {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutNotification {
                    to {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }
                
                .notification-content i {
                    font-size: 1rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.25rem;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                
                .notification-close:hover {
                    background: #f1f5f9;
                    color: #1e293b;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutNotification 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutNotification 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
});
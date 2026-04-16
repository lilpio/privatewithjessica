// Form Switching
function switchForm(event) {
    event.preventDefault();
    
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
}

// Form Submission
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit(this);
    });
});

function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate email
    if (!validateEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // For signup form, validate password match
    if (form.querySelector('#signup-password')) {
        if (data.password !== data.confirm) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        if (data.password.length < 6) {
            showNotification('Password must be at least 6 characters long', 'error');
            return;
        }
        if (!data.terms) {
            showNotification('You must agree to the Terms & Conditions', 'error');
            return;
        }
        handleSignup(data);
    } else {
        handleLogin(data);
    }
}

function handleLogin(data) {
    console.log('Login attempt:', data.email);
    
    // Check if user exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find(u => u.email === data.email);
    
    if (!user) {
        showNotification('Email not found. Please create an account.', 'error');
        return;
    }

    if (user.password !== data.password) {
        showNotification('Incorrect password. Please try again.', 'error');
        return;
    }
    
    // Simulate API call
    showNotification('Logging in...', 'info');
    
    setTimeout(() => {
        // Store user session
        localStorage.setItem('user', JSON.stringify({
            email: data.email,
            loginTime: new Date().toISOString()
        }));
        
        // Check if user has subscription
        const subscription = localStorage.getItem('subscription');
        
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            // If has subscription, go to content page, otherwise go to subscription page
            if (subscription) {
                window.location.href = 'content.html';
            } else {
                window.location.href = 'subscription.html';
            }
        }, 1500);
    }, 1000);
}

function handleSignup(data) {
    console.log('Signup attempt:', data.email);
    
    // Check if user already exists (in real app, this would be server-side)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some(user => user.email === data.email)) {
        showNotification('Email already registered. Please login instead.', 'error');
        return;
    }
    
    showNotification('Creating account...', 'info');
    
    setTimeout(() => {
        // Store new user
        existingUsers.push({
            email: data.email,
            fullname: data.fullname,
            password: data.password,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Auto-login
        localStorage.setItem('user', JSON.stringify({
            email: data.email,
            loginTime: new Date().toISOString()
        }));
        
        showNotification('Account created! Redirecting to subscription plans...', 'success');
        
        setTimeout(() => {
            // Redirect to subscription page
            window.location.href = 'subscription.html';
        }, 1500);
    }, 1500);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notification if present
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set colors based on type
    const colors = {
        success: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
        error: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
        info: { bg: '#dbeafe', text: '#0c2340', border: '#93c5fd' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    notification.style.borderLeft = `4px solid ${color.border}`;
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Social login buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const provider = this.textContent.trim();
        showNotification(`${provider} login coming soon!`, 'info');
    });
});

// Forgot password link
document.querySelectorAll('.forgot-password').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Password reset email sent to your inbox', 'success');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth page loaded successfully');
    
    // You can add more initialization here
    // For example: check if user is already logged in
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
        console.log('User already logged in:', currentUser);
    }
});

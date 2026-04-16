// Handle subscription plan selection
function handleSubscription(planName, price) {
    document.getElementById('selected-plan').textContent = planName;
    document.getElementById('selected-price').textContent = '$' + price.toFixed(2);
    openPaymentModal();
}

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('user')) {
        showNotification('Please login first to choose a subscription plan', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});

// Open payment modal
function openPaymentModal() {
    document.getElementById('payment-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close payment modal
function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Process payment form
function processPayment(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('card-name').value,
        email: document.getElementById('card-email').value,
        cardNumber: document.getElementById('card-number').value,
        expiry: document.getElementById('card-expiry').value,
        cvc: document.getElementById('card-cvc').value,
        plan: document.getElementById('selected-plan').textContent,
        price: document.getElementById('selected-price').textContent
    };

    // Validate form
    if (!validatePaymentForm(formData)) {
        return;
    }

    // Show processing message
    showNotification('Processing your payment...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
        // Store subscription data
        const subscriptionData = {
            email: formData.email,
            plan: formData.plan,
            price: formData.price,
            subscriptionDate: new Date().toISOString(),
            status: 'active'
        };

        localStorage.setItem('subscription', JSON.stringify(subscriptionData));
        
        showNotification('Subscription successful! Redirecting to your content...', 'success');
        
        setTimeout(() => {
            // Redirect to content page
            window.location.href = 'content.html';
        }, 1500);
    }, 2000);
}

// Validate payment form
function validatePaymentForm(data) {
    // Validate name
    if (!data.name || data.name.length < 3) {
        showNotification('Please enter a valid name', 'error');
        return false;
    }

    // Validate email
    if (!validateEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    // Validate card number (basic check)
    const cardNumber = data.cardNumber.replace(/\s/g, '');
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        showNotification('Please enter a valid 16-digit card number', 'error');
        return false;
    }

    // Validate expiry date
    if (!data.expiry.match(/^\d{2}\/\d{2}$/)) {
        showNotification('Expiry date must be in MM/YY format', 'error');
        return false;
    }

    // Validate CVC
    if (!data.cvc || data.cvc.length !== 3 || isNaN(data.cvc)) {
        showNotification('Please enter a valid 3-digit CVC', 'error');
        return false;
    }

    return true;
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        font-weight: 600;
        z-index: 2000;
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

// Format card number input
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        });
    }

    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Add animation styles
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
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        closePaymentModal();
    }
});

// Check if user is logged in and subscribed
function checkSubscription() {
    const currentUser = localStorage.getItem('user');
    const subscription = localStorage.getItem('subscription');

    if (!currentUser) {
        showNotification('Please log in to access this content', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }

    if (!subscription) {
        showNotification('Please subscribe to access this content', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }

    return true;
}

// Initialize content page
document.addEventListener('DOMContentLoaded', function() {
    if (!checkSubscription()) {
        return;
    }

    const subscription = JSON.parse(localStorage.getItem('subscription'));
    
    // Display subscription plan
    document.getElementById('subscription-plan').textContent = `Subscribed: ${subscription.plan}`;
    
    // Display welcome message
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = `Welcome back! You're currently on the ${subscription.plan} plan. Enjoy exclusive content!`;

    // Add click handlers to gallery items
    const items = document.querySelectorAll('.content-item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('.item-image img');
            viewContent(img.src);
        });
    });
});

// Filter content by type
function filterContent(event, type) {
    const items = document.querySelectorAll('.content-item');
    const noContent = document.getElementById('no-content');
    let hasVisibleItems = false;

    items.forEach(item => {
        if (type === 'all' || item.dataset.type === type) {
            item.style.display = 'grid';
            hasVisibleItems = true;
        } else {
            item.style.display = 'none';
        }
    });

    // Show/hide no content message
    if (!hasVisibleItems) {
        noContent.style.display = 'block';
    } else {
        noContent.style.display = 'none';
    }

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeButton = event && (event.currentTarget || event.target);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// View content in fullscreen
function viewContent(imageSrc) {
    const viewer = document.getElementById('content-viewer');
    const viewerImage = document.getElementById('viewer-image');
    viewerImage.src = imageSrc;
    viewer.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close content viewer
function closeContentViewer() {
    const viewer = document.getElementById('content-viewer');
    viewer.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('subscription');
        localStorage.removeItem('user');
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

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

    const colors = {
        success: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
        error: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
        info: { bg: '#dbeafe', text: '#0c2340', border: '#93c5fd' }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    notification.style.borderLeft = `4px solid ${color.border}`;

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Close viewer when clicking outside
window.addEventListener('click', function(event) {
    const viewer = document.getElementById('content-viewer');
    if (event.target === viewer) {
        closeContentViewer();
    }
});

// Keyboard shortcut to close viewer
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeContentViewer();
    }
});

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

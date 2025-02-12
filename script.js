// Cart functionality
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

// Update cart count
function updateCartCount(count) {
    cartCount += count;
    cartCountElement.textContent = cartCount;
}

// Menu Tab Functionality
function initializeMenuTabs() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('.menu-items');

    if (menuTabs.length > 0) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and items
                menuTabs.forEach(t => t.classList.remove('active'));
                menuItems.forEach(item => item.classList.remove('active'));

                // Add active class to clicked tab and corresponding items
                tab.classList.add('active');
                const category = tab.dataset.category;
                document.querySelector(`.menu-items.${category}`).classList.add('active');
            });
        });
    }
}

// Add click event listeners to all order buttons
document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', () => {
        updateCartCount(1);
        // Show a small notification
        const restaurantName = button.closest('.restaurant-info').querySelector('h3').textContent;
        showNotification(`Added item from ${restaurantName} to cart!`);
    });
});

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'error' ? '#ff4757' : '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - sectionHeight/3)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Background Slideshow
function startSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Search functionality
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    let lastHighlightedItem = null;

    function searchAndScroll() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            showNotification('Please enter a dish name to search', 'warning');
            return;
        }

        // Find all menu item titles and descriptions
        const menuItems = document.querySelectorAll('.menu-item');
        let found = false;
        let partialMatches = [];

        // Remove previous highlight if exists
        if (lastHighlightedItem) {
            lastHighlightedItem.style.animation = '';
            lastHighlightedItem = null;
        }

        for (const item of menuItems) {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';

            // Check for exact or partial matches
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                if (title === searchTerm || title.startsWith(searchTerm)) {
                    // Exact or start-of-word match
                    scrollToAndHighlight(item);
                    found = true;
                    break;
                } else {
                    // Partial match - save for later if no exact match is found
                    partialMatches.push(item);
                }
            }
        }

        // If no exact match but have partial matches, use the first partial match
        if (!found && partialMatches.length > 0) {
            scrollToAndHighlight(partialMatches[0]);
            showNotification(`Found similar item: ${partialMatches[0].querySelector('h3').textContent}`, 'info');
            found = true;
        }

        if (!found) {
            showNotification('No matching dishes found. Try a different search term.', 'error');
            // Shake the search box to indicate no results
            searchInput.classList.add('shake');
            setTimeout(() => searchInput.classList.remove('shake'), 500);
        }
    }

    function scrollToAndHighlight(item) {
        // Show the category containing this item
        const category = item.closest('.menu-items');
        const categoryId = category.classList[1]; // afghan, turkish, etc.
        const categoryTab = document.querySelector(`[data-category="${categoryId}"]`);
        
        if (categoryTab) {
            // Activate the correct category tab
            document.querySelectorAll('.menu-tab').forEach(tab => tab.classList.remove('active'));
            categoryTab.classList.add('active');
            
            // Show the correct category items
            document.querySelectorAll('.menu-items').forEach(items => items.style.display = 'none');
            category.style.display = 'grid';
        }

        // Scroll to the item with smooth animation
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Apply highlight animation
        item.style.animation = 'none';
        item.offsetHeight; // Trigger reflow
        item.style.animation = 'highlightItem 2s ease';
        lastHighlightedItem = item;

        // Clear the search input
        searchInput.value = '';
        searchInput.blur(); // Remove focus
    }

    // Search when button is clicked
    searchBtn.addEventListener('click', searchAndScroll);

    // Search when Enter key is pressed
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchAndScroll();
        }
    });

    // Clear previous highlight when typing new search
    searchInput.addEventListener('input', () => {
        if (lastHighlightedItem) {
            lastHighlightedItem.style.animation = '';
            lastHighlightedItem = null;
        }
    });
}

// Lazy loading for images
function handleLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Add animations to the styles
const style = document.createElement('style');
style.textContent = `
    @keyframes highlightItem {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
        10% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(255, 107, 0, 0.2); }
        20% { transform: scale(1); box-shadow: 0 0 15px 8px rgba(255, 107, 0, 0.3); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    .shake {
        animation: shake 0.5s ease-in-out;
    }

    .search-input:focus {
        outline: none;
        box-shadow: 0 0 0 2px #ff6b00;
        transform: scale(1.02);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavLink();
    handleSearch();
    initializeMenuTabs();
    startSlideshow();
    handleLazyLoading();
});

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Search functionality
const searchButton = document.querySelector('.search-bar button');
const searchInput = document.querySelector('.search-bar input');

searchButton.addEventListener('click', () => {
    const address = searchInput.value.trim();
    if (address) {
        showNotification('Searching for restaurants near: ' + address);
        // Here you would typically make an API call to search for restaurants
        // For demo purposes, we're just showing a notification
    } else {
        showNotification('Please enter a delivery address');
    }
});

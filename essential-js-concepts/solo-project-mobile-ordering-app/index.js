// Menu data
const menuItems = [
    {
        id: 1,
        name: "Pizza",
        description: "pepperoni, mushroom, mozzarella",
        price: 14,
        originalPrice: 14
    },
    {
        id: 2,
        name: "Hamburger",
        description: "beef, cheese, lettuce",
        price: 12,
        originalPrice: 12
    },
    {
        id: 3,
        name: "Beer",
        description: "grain, hops, yeast, water",
        price: 12,
        originalPrice: 12
    }
];

// State
let order = [];
let currentRating = 0;
let isDarkTheme = false;
let mealDealActive = false;

// DOM Elements
const menuItemsContainer = document.getElementById('menu-items');
const orderItemsContainer = document.getElementById('order-items');
const subtotalElement = document.getElementById('subtotal');
const discountElement = document.getElementById('discount');
const totalPriceElement = document.getElementById('total-price');
const completeOrderBtn = document.getElementById('complete-order');
const paymentModal = document.getElementById('payment-modal');
const ratingModal = document.getElementById('rating-modal');
const confirmationModal = document.getElementById('confirmation-modal');
const paymentForm = document.getElementById('payment-form');
const cancelPaymentBtn = document.getElementById('cancel-payment');
const closeRatingBtn = document.getElementById('close-rating');
const closeConfirmationBtn = document.getElementById('close-confirmation');
const themeToggle = document.getElementById('theme-toggle');
const mealDealToggle = document.getElementById('meal-deal');
const ratingToggle = document.getElementById('rating-toggle');
const confirmationItems = document.getElementById('confirmation-items');
const confirmationTotal = document.getElementById('confirmation-total');

// Initialize the app
function init() {
    renderMenuItems();
    updateOrderSummary();
    
    // Event Listeners
    completeOrderBtn.addEventListener('click', openPaymentModal);
    cancelPaymentBtn.addEventListener('click', closePaymentModal);
    closeRatingBtn.addEventListener('click', closeRatingModal);
    closeConfirmationBtn.addEventListener('click', closeConfirmationModal);
    
    paymentForm.addEventListener('submit', processPayment);
    
    // Stretch goals event listeners
    themeToggle.addEventListener('change', toggleTheme);
    mealDealToggle.addEventListener('change', toggleMealDeal);
    ratingToggle.addEventListener('change', toggleRatingFeature);
    
    // Disable complete order button initially
    completeOrderBtn.disabled = true;
}

// Render menu items
function renderMenuItems() {
    menuItemsContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p class="description">${item.description}</p>
            <div class="price">$${item.price}</div>
            <div class="item-controls">
                <div class="quantity-controls">
                    <button class="decrease-btn" data-id="${item.id}">-</button>
                    <span class="quantity" id="quantity-${item.id}">0</span>
                    <button class="increase-btn" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
        
        menuItemsContainer.appendChild(menuItemElement);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToOrder(id);
        });
    });
    
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            removeFromOrder(id);
        });
    });
}

// Add item to order
function addToOrder(itemId) {
    const menuItem = menuItems.find(item => item.id === itemId);
    const existingItem = order.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        order.push({
            ...menuItem,
            quantity: 1
        });
    }
    
    updateOrderDisplay();
    updateOrderSummary();
    
    // Update quantity display in menu
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    const orderItem = order.find(item => item.id === itemId);
    quantityElement.textContent = orderItem ? orderItem.quantity : 0;
}

// Remove item from order
function removeFromOrder(itemId) {
    const itemIndex = order.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (order[itemIndex].quantity > 1) {
            order[itemIndex].quantity--;
        } else {
            order.splice(itemIndex, 1);
        }
    }
    
    updateOrderDisplay();
    updateOrderSummary();
    
    // Update quantity display in menu
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    const orderItem = order.find(item => item.id === itemId);
    quantityElement.textContent = orderItem ? orderItem.quantity : 0;
}

// Update order display
function updateOrderDisplay() {
    orderItemsContainer.innerHTML = '';
    
    if (order.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-order">Your order is empty. Add some items from the menu!</p>';
        completeOrderBtn.disabled = true;
        return;
    }
    
    order.forEach(item => {
        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'order-item';
        orderItemElement.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${item.price} each</span>
            </div>
            <div class="order-controls">
                <button class="remove-btn" data-id="${item.id}">-</button>
                <span class="order-quantity">${item.quantity}</span>
                <button class="add-btn" data-id="${item.id}">+</button>
            </div>
        `;
        
        orderItemsContainer.appendChild(orderItemElement);
    });
    
    // Add event listeners to order control buttons
    document.querySelectorAll('.order-item .add-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToOrder(id);
        });
    });
    
    document.querySelectorAll('.order-item .remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            removeFromOrder(id);
        });
    });
    
    completeOrderBtn.disabled = false;
}

// Update order summary
function updateOrderSummary() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = subtotal - discount;
    
    subtotalElement.textContent = `$${subtotal}`;
    discountElement.textContent = `-$${discount}`;
    totalPriceElement.textContent = `$${total}`;
    
    // Show/hide discount row
    const discountRow = document.getElementById('discount-row');
    discountRow.style.display = discount > 0 ? 'flex' : 'none';
}

// Calculate subtotal
function calculateSubtotal() {
    return order.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calculate discount
function calculateDiscount(subtotal) {
    if (!mealDealActive) return 0;
    
    // Meal deal: 10% discount if total is over $20
    if (subtotal >= 20) {
        return subtotal * 0.1;
    }
    
    return 0;
}

// Open payment modal
function openPaymentModal() {
    paymentModal.style.display = 'flex';
}

// Close payment modal
function closePaymentModal() {
    paymentModal.style.display = 'none';
    // Reset form
    paymentForm.reset();
    clearFormErrors();
}

// Process payment
function processPayment(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    
    // Validation
    let isValid = true;
    
    if (name === '') {
        showError('name-error', 'Please enter your name');
        isValid = false;
    } else {
        clearError('name-error');
    }
    
    if (cardNumber === '' || !/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        showError('card-error', 'Please enter a valid 16-digit card number');
        isValid = false;
    } else {
        clearError('card-error');
    }
    
    if (cvv === '' || !/^\d{3,4}$/.test(cvv)) {
        showError('cvv-error', 'Please enter a valid CVV (3 or 4 digits)');
        isValid = false;
    } else {
        clearError('cvv-error');
    }
    
    if (isValid) {
        // Process payment (simulated)
        setTimeout(() => {
            closePaymentModal();
            showConfirmation();
            
            // Show rating modal if enabled
            if (ratingToggle.checked) {
                setTimeout(() => {
                    ratingModal.style.display = 'flex';
                    setupRatingStars();
                }, 1000);
            }
        }, 1000);
    }
}

// Show confirmation modal
function showConfirmation() {
    // Update confirmation details
    confirmationItems.innerHTML = '';
    
    order.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-row';
        itemElement.innerHTML = `
            <span>${item.name} (x${item.quantity}):</span>
            <span>$${item.price * item.quantity}</span>
        `;
        confirmationItems.appendChild(itemElement);
    });
    
    const total = calculateSubtotal() - calculateDiscount(calculateSubtotal());
    confirmationTotal.textContent = `$${total}`;
    
    confirmationModal.style.display = 'flex';
    
    // Clear order
    order = [];
    updateOrderDisplay();
    updateOrderSummary();
    
    // Reset menu quantities
    menuItems.forEach(item => {
        const quantityElement = document.getElementById(`quantity-${item.id}`);
        if (quantityElement) {
            quantityElement.textContent = '0';
        }
    });
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.style.display = 'none';
}

// Setup rating stars
function setupRatingStars() {
    const stars = document.querySelectorAll('.rating-stars i');
    
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            currentRating = rating;
            
            // Update star display
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            // Store rating (in a real app, this would be sent to a server)
            console.log(`User rating: ${rating} stars`);
        });
        
        star.addEventListener('mouseover', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#ffc107';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
        
        star.addEventListener('mouseout', () => {
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.style.color = '#ffc107';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
}

// Close rating modal
function closeRatingModal() {
    ratingModal.style.display = 'none';
    // Reset stars
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach(star => {
        star.classList.remove('active');
        star.style.color = '#ddd';
    });
    currentRating = 0;
}

// Toggle theme
function toggleTheme() {
    isDarkTheme = themeToggle.checked;
    
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Toggle meal deal
function toggleMealDeal() {
    mealDealActive = mealDealToggle.checked;
    
    if (mealDealActive) {
        // Apply discounted prices
        menuItems.forEach(item => {
            item.price = Math.floor(item.originalPrice * 0.7); // 30% discount for meal deal
        });
    } else {
        // Restore original prices
        menuItems.forEach(item => {
            item.price = item.originalPrice;
        });
    }
    
    // Re-render menu with updated prices
    renderMenuItems();
    updateOrderSummary();
    
    // Update existing order items with new prices
    order.forEach(orderItem => {
        const menuItem = menuItems.find(item => item.id === orderItem.id);
        if (menuItem) {
            orderItem.price = menuItem.price;
        }
    });
    
    updateOrderDisplay();
}

// Toggle rating feature
function toggleRatingFeature() {
    // This just enables/disables the rating modal after payment
    // The functionality is already implemented
    console.log(`Rating feature ${ratingToggle.checked ? 'enabled' : 'disabled'}`);
}

// Form error handling
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    
    // Highlight the input field
    const inputId = elementId.replace('-error', '');
    const inputElement = document.getElementById(inputId);
    inputElement.classList.add('error');
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    
    // Remove error highlight
    const inputId = elementId.replace('-error', '');
    const inputElement = document.getElementById(inputId);
    inputElement.classList.remove('error');
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => {
        input.classList.remove('error');
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
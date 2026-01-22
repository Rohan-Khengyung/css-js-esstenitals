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
    console.log("App initializing...");
    renderMenuItems();
    updateOrderSummary();
    
    // Event Listeners
    completeOrderBtn.addEventListener('click', openPaymentModal);
    cancelPaymentBtn.addEventListener('click', closePaymentModal);
    closeRatingBtn.addEventListener('click', closeRatingModal);
    closeConfirmationBtn.addEventListener('click', closeConfirmationModal);
    
    paymentForm.addEventListener('submit', handlePaymentSubmit);
    
    // Stretch goals event listeners
    themeToggle.addEventListener('change', toggleTheme);
    mealDealToggle.addEventListener('change', toggleMealDeal);
    ratingToggle.addEventListener('change', toggleRatingFeature);
    
    // Disable complete order button initially
    completeOrderBtn.disabled = true;
    
    console.log("App initialized successfully");
}

// Render menu items
function renderMenuItems() {
    console.log("Rendering menu items...");
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
                    <button type="button" class="decrease-btn" data-id="${item.id}">-</button>
                    <span class="quantity" id="quantity-${item.id}">0</span>
                    <button type="button" class="increase-btn" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
        
        menuItemsContainer.appendChild(menuItemElement);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            console.log(`Adding item ${id} to order`);
            addToOrder(id);
        });
    });
    
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            console.log(`Removing item ${id} from order`);
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
    console.log(`Order updated. Current items: ${order.length}`);
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
    console.log(`Order updated. Current items: ${order.length}`);
}

// Update order display
function updateOrderDisplay() {
    console.log("Updating order display...");
    orderItemsContainer.innerHTML = '';
    
    if (order.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-order">Your order is empty. Add some items from the menu!</p>';
        completeOrderBtn.disabled = true;
        console.log("Order is empty, button disabled");
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
                <button type="button" class="remove-btn" data-id="${item.id}">-</button>
                <span class="order-quantity">${item.quantity}</span>
                <button type="button" class="add-btn" data-id="${item.id}">+</button>
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
    console.log("Order display updated, button enabled");
}

// Update order summary
function updateOrderSummary() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = subtotal - discount;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    discountElement.textContent = `-$${discount.toFixed(2)}`;
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
    
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
        return Math.round(subtotal * 0.1 * 100) / 100;
    }
    
    return 0;
}

// Open payment modal
function openPaymentModal() {
    console.log("Opening payment modal");
    paymentModal.style.display = 'flex';
    console.log("Payment modal display set to:", paymentModal.style.display);
}

// Close payment modal
function closePaymentModal() {
    console.log("Closing payment modal");
    paymentModal.style.display = 'none';
    // Reset form
    paymentForm.reset();
    clearFormErrors();
}

// Handle payment form submission
function handlePaymentSubmit(e) {
    e.preventDefault();
    console.log("Payment form submitted");
    processPayment();
}

// Process payment
function processPayment() {
    console.log("Processing payment...");
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    
    console.log("Form values:", { name, cardNumber, cvv });
    
    // Validation
    let isValid = true;
    
    // Name validation
    if (name === '') {
        showError('name-error', 'Please enter your name');
        isValid = false;
    } else {
        clearError('name-error');
    }
    
    // Card number validation
    const cardDigits = cardNumber.replace(/\s/g, '');
    if (cardNumber === '' || !/^\d{16}$/.test(cardDigits)) {
        showError('card-error', 'Please enter a valid 16-digit card number');
        isValid = false;
    } else {
        clearError('card-error');
    }
    
    // CVV validation
    if (cvv === '' || !/^\d{3,4}$/.test(cvv)) {
        showError('cvv-error', 'Please enter a valid CVV (3 or 4 digits)');
        isValid = false;
    } else {
        clearError('cvv-error');
    }
    
    if (!isValid) {
        console.log("Form validation failed");
        return;
    }
    
    console.log("Form validation passed");
    
    // Show processing animation on Pay button
    const payBtn = paymentForm.querySelector('.pay-btn');
    const originalText = payBtn.textContent;
    payBtn.textContent = 'Processing...';
    payBtn.disabled = true;
    
    console.log("Payment button updated to Processing...");
    
    // Simulate payment processing
    setTimeout(() => {
        console.log("Payment processing complete");
        
        // Store the current order for confirmation BEFORE clearing it
        const orderForConfirmation = JSON.parse(JSON.stringify(order));
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount(subtotal);
        const total = subtotal - discount;
        
        console.log("Order for confirmation:", orderForConfirmation);
        console.log("Totals:", { subtotal, discount, total });
        
        // Reset button
        payBtn.textContent = originalText;
        payBtn.disabled = false;
        
        // Close payment modal
        closePaymentModal();
        console.log("Payment modal closed");
        
        // Show confirmation modal with the stored order
        showConfirmation(orderForConfirmation, subtotal, discount, total);
        console.log("Confirmation modal should be visible");
        
        // Clear the current order from the main view
        order = [];
        updateOrderDisplay();
        updateOrderSummary();
        console.log("Main order cleared");
        
        // Reset menu quantities
        menuItems.forEach(item => {
            const quantityElement = document.getElementById(`quantity-${item.id}`);
            if (quantityElement) {
                quantityElement.textContent = '0';
            }
        });
        
        // Show rating modal if enabled (after a short delay)
        if (ratingToggle.checked) {
            console.log("Rating feature enabled, will show rating modal in 3 seconds");
            setTimeout(() => {
                console.log("Showing rating modal");
                closeConfirmationModal();
                ratingModal.style.display = 'flex';
                setupRatingStars();
            }, 3000);
        } else {
            console.log("Rating feature not enabled");
        }
    }, 1500);
}

// Show confirmation modal
function showConfirmation(orderForConfirmation, subtotal, discount, total) {
    console.log("Showing confirmation modal");
    
    // Update confirmation details
    confirmationItems.innerHTML = '';
    
    if (orderForConfirmation.length === 0) {
        confirmationItems.innerHTML = '<p class="empty-order">No items in order</p>';
    } else {
        // Display each item in the confirmation
        orderForConfirmation.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-row';
            itemElement.innerHTML = `
                <span>${item.name} (x${item.quantity}):</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            confirmationItems.appendChild(itemElement);
        });
        
        // Add discount if applicable
        if (discount > 0) {
            const discountElement = document.createElement('div');
            discountElement.className = 'order-row';
            discountElement.innerHTML = `
                <span>Meal Deal Discount:</span>
                <span>-$${discount.toFixed(2)}</span>
            `;
            confirmationItems.appendChild(discountElement);
        }
        
        // Add total
        confirmationTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Show confirmation modal
    confirmationModal.style.display = 'flex';
    console.log("Confirmation modal display set to:", confirmationModal.style.display);
}

// Close confirmation modal
function closeConfirmationModal() {
    console.log("Closing confirmation modal");
    confirmationModal.style.display = 'none';
}

// Setup rating stars
function setupRatingStars() {
    console.log("Setting up rating stars");
    const stars = document.querySelectorAll('.rating-stars i');
    
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            currentRating = rating;
            
            // Update star display
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                    s.style.color = '#ffc107';
                } else {
                    s.classList.remove('active');
                    s.style.color = '#ddd';
                }
            });
            
            console.log(`User rating: ${rating} stars`);
            
            // Show thank you message
            const ratingText = document.querySelector('.rating-text');
            ratingText.textContent = `Thank you for your ${rating} star rating! We appreciate your feedback.`;
            ratingText.style.color = '#38b000';
            ratingText.style.fontWeight = 'bold';
            
            // Auto-close after 3 seconds
            setTimeout(() => {
                closeRatingModal();
            }, 3000);
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
    console.log("Closing rating modal");
    ratingModal.style.display = 'none';
    // Reset stars
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach(star => {
        star.classList.remove('active');
        star.style.color = '#ddd';
    });
    currentRating = 0;
    
    // Reset rating text
    const ratingText = document.querySelector('.rating-text');
    ratingText.textContent = 'Thank you for your order! How was your experience?';
    ratingText.style.color = '';
    ratingText.style.fontWeight = '';
}

// Toggle theme
function toggleTheme() {
    isDarkTheme = themeToggle.checked;
    
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        console.log("Dark theme enabled");
    } else {
        document.body.classList.remove('dark-theme');
        console.log("Dark theme disabled");
    }
}

// Toggle meal deal
function toggleMealDeal() {
    mealDealActive = mealDealToggle.checked;
    
    if (mealDealActive) {
        // Apply discounted prices
        menuItems.forEach(item => {
            item.price = Math.floor(item.originalPrice * 0.7);
        });
        console.log("Meal deal enabled - 30% discount applied");
    } else {
        // Restore original prices
        menuItems.forEach(item => {
            item.price = item.originalPrice;
        });
        console.log("Meal deal disabled - original prices restored");
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
let cart = JSON.parse(localStorage.getItem("glassshop_cart")) || [];
let currentUser = JSON.parse(localStorage.getItem("glassshop_user")) || null;

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  updateUserUI();
  updateCartCount();
  setupEventListeners();
  loadCartPage();
  showPage("cart");
}

// Event 
function setupEventListeners() {
  // Mobile menu
  document
    .getElementById("mobile-menu-btn")
    .addEventListener("click", openMobileMenu);
  document
    .getElementById("mobile-menu-close")
    .addEventListener("click", closeMobileMenu);
  document
    .getElementById("mobile-menu-overlay")
    .addEventListener("click", closeMobileMenu);
}

// Mobile menu 
function openMobileMenu() {
  document.getElementById("mobile-menu").classList.add("active");
  document.getElementById("mobile-menu-overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  document.getElementById("mobile-menu").classList.remove("active");
  document.getElementById("mobile-menu-overlay").classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Page navigation
function showPage(page) {
  document.getElementById("cart-page").classList.remove("hidden");
  loadCartPage();
}

// Cart 
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("mobile-cart-count").textContent = count;
}

function loadCartPage() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartContent = document.getElementById("cart-content");
  const cartTotalItems = document.getElementById("cart-total-items");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartTotal = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartEmpty.classList.remove("hidden");
    cartContent.classList.add("hidden");
  } else {
    cartEmpty.classList.add("hidden");
    cartContent.classList.remove("hidden");

    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
                <div class="glass p-4 rounded-xl flex items-center space-x-4">
                    <div class="w-16 h-16 flex-shrink-0">
                        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover rounded-lg">
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-white mb-1">${item.title}</h3>
                        <p class="text-sm text-white text-opacity-80">$${item.price}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="btn-secondary px-2 py-1">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="text-white font-medium">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="btn-secondary px-2 py-1">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `
      )
      .join("");

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
    const total = (parseFloat(subtotal) + 10).toFixed(2); 

    cartTotalItems.textContent = `${totalItems} item${
      totalItems !== 1 ? "s" : ""
    }`;
    cartSubtotal.textContent = `$${subtotal}`;
    cartTotal.textContent = `$${total}`;
  }
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== productId);
    }
    localStorage.setItem("glassshop_cart", JSON.stringify(cart));
    updateCartCount();
    loadCartPage();
    showNotification(
      change > 0
        ? "Quantity increased!"
        : item.quantity > 0
        ? "Quantity decreased!"
        : "Item removed from cart!"
    );
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("glassshop_cart", JSON.stringify(cart));
  updateCartCount();
  loadCartPage();
  showNotification("Item removed from cart!");
}

// Authentication
function updateUserUI() {
  const userInfo = document.getElementById("user-info");
  const userName = document.getElementById("user-name");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const mobileUserInfo = document.getElementById("mobile-user-info");
  const mobileUserName = document.getElementById("mobile-user-name");
  const mobileLoginBtn = document.getElementById("mobile-login-btn");
  const mobileSignupBtn = document.getElementById("mobile-signup-btn");
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");

  if (currentUser) {
    userInfo.classList.remove("hidden");
    userInfo.classList.add("flex");
    userName.textContent = currentUser.name;
    loginBtn.classList.add("hidden");
    signupBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");

    mobileUserInfo.classList.remove("hidden");
    mobileUserName.textContent = currentUser.name;
    mobileLoginBtn.classList.add("hidden");
    mobileSignupBtn.classList.add("hidden");
    mobileLogoutBtn.classList.remove("hidden");
  } else {
    userInfo.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    signupBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");

    mobileUserInfo.classList.add("hidden");
    mobileLoginBtn.classList.remove("hidden");
    mobileSignupBtn.classList.remove("hidden");
    mobileLogoutBtn.classList.add("hidden");
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("glassshop_user");
  updateUserUI();
  showNotification("Logged out successfully!");
}

// Notification system
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `fixed top-20 right-4 z-50 glass-strong p-4 rounded-xl text-white max-w-sm transition-all duration-300 transform translate-x-full`;
  notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i class="fas fa-${
                      type === "success"
                        ? "check-circle text-green-400"
                        : "exclamation-circle text-red-400"
                    }"></i>
                    <span>${message}</span>
                </div>
            `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

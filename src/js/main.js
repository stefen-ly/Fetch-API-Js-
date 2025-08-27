let products = [];
let cart = JSON.parse(localStorage.getItem("glassshop_cart")) || [];
let currentUser = JSON.parse(localStorage.getItem("glassshop_user")) || null;

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

async function initializeApp() {
  updateUserUI();
  updateCartCount();
  setupEventListeners();
  await fetchProducts();
  showPage("home");
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

// Mobile menu functions
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
  const pageMap = {
    home: "../index.html",
    products: "../src/app/products.html",
    about: "../src/app/about.html",
    contact: "../src/app/contact.html",
    cart: "../src/app/cart.html",
    login: "../src/app/login.html",
    signup: "./src/app/signup.html",
  };

  // Navigate to the corresponding page if it exists in the pageMap
  if (pageMap[page]) {
    window.location.href = pageMap[page];
  } else {
    console.error(`Page "${page}" not found.`);
    // Optionally, show the home page or handle the error
    document.getElementById("home-page").classList.remove("hidden");
  }
}

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    loadFeaturedProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Load featured products
function loadFeaturedProducts() {
  const container = document.getElementById("featured-products");
  const featuredProducts = products.slice(0, 4);

  container.innerHTML = featuredProducts
    .map(
      (product) => `
                <div class="glass rounded-xl card-hover overflow-hidden">
                    <div class="aspect-square overflow-hidden">
                        <img src="${product.image}" alt="${product.title}" 
                             class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-white mb-2 line-clamp-2">${
                          product.title
                        }</h3>
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-lg font-bold text-gradient">$${product.price.toFixed(
                              2
                            )}</span>
                            <div class="flex items-center space-x-1">
                                <i class="fas fa-star text-yellow-400"></i>
                                <span class="text-sm text-white text-opacity-80">${
                                  product.rating.rate
                                }</span>
                            </div>
                        </div>
                        <button onclick="addToCart(${
                          product.id
                        })" class="btn-primary w-full">
                            <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            `
    )
    .join("");
}

// Cart functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("glassshop_cart", JSON.stringify(cart));
  updateCartCount();
  showNotification("Product added to cart!");
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("mobile-cart-count").textContent = count;
}

// Authentication functions
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

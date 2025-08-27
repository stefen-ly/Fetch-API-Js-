let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem("glassshop_cart")) || [];
let currentUser = JSON.parse(localStorage.getItem("glassshop_user")) || null;
let selectedCategory = "all";
let searchTerm = "";
let viewMode = "grid";

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

async function initializeApp() {
  updateUserUI();
  updateCartCount();
  setupEventListeners();
  await fetchProducts();
  showPage("products");
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

  // Search
  document
    .getElementById("search-input")
    .addEventListener("input", function (e) {
      searchTerm = e.target.value;
      filterProducts();
    });
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
  document.getElementById("products-page").classList.remove("hidden");
  loadProductsPage();
}

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    filteredProducts = [...products];
    loadCategories();
    loadProductsPage();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Load categories
function loadCategories() {
  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const categoriesList = document.getElementById("categories-list");

  categoriesList.innerHTML = categories
    .map(
      (category) => `
                <button onclick="selectCategory('${category}')" 
                        class="category-btn w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-purple-500 text-white"
                            : "text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10"
                        }">
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
            `
    )
    .join("");
}

// Select category
function selectCategory(category) {
  selectedCategory = category;
  filterProducts();
  loadCategories();
}

// Filter products
function filterProducts() {
  filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  loadProductsPage();
}

// Load products page
function loadProductsPage() {
  const container = document.getElementById("products-container");
  const count = document.getElementById("products-count");

  count.textContent = filteredProducts.length;

  if (viewMode === "grid") {
    container.className =
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
    container.innerHTML = filteredProducts
      .map(
        (product) => `
                    <div class="glass rounded-xl card-hover overflow-hidden">
                        <div class="aspect-square overflow-hidden">
                            <img src="${product.image}" alt="${product.title}" 
                                 class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                        </div>
                        <div class="p-4">
                            <span class="inline-block bg-purple-500 bg-opacity-20 text-purple-200 text-xs px-2 py-1 rounded-full mb-2">
                                ${product.category}
                            </span>
                            <h3 class="font-semibold text-white mb-2 line-clamp-2">${
                              product.title
                            }</h3>
                            <p class="text-sm text-white text-opacity-80 mb-3 line-clamp-2">${
                              product.description
                            }</p>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-lg font-bold text-gradient">$${product.price.toFixed(
                                  2
                                )}</span>
                                <div class="flex items-center space-x-1">
                                    <i class="fas fa-star text-yellow-400"></i>
                                    <span class="text-sm text-white text-opacity-80">${
                                      product.rating.rate
                                    } (${product.rating.count})</span>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="addToCart(${
                                  product.id
                                })" class="btn-primary flex-1">Add to Cart</button>
                                <button onclick="viewProduct(${
                                  product.id
                                })" class="btn-secondary px-3">View</button>
                            </div>
                        </div>
                    </div>
                `
      )
      .join("");
  } else {
    container.className = "space-y-4";
    container.innerHTML = filteredProducts
      .map(
        (product) => `
                    <div class="glass p-4 rounded-xl">
                        <div class="flex space-x-4">
                            <div class="w-24 h-24 flex-shrink-0">
                                <img src="${product.image}" alt="${
          product.title
        }" 
                                     class="w-full h-full object-cover rounded-lg">
                            </div>
                            <div class="flex-1">
                                <span class="inline-block bg-purple-500 bg-opacity-20 text-purple-200 text-xs px-2 py-1 rounded-full mb-2">
                                    ${product.category}
                                </span>
                                <h3 class="font-semibold text-white mb-1">${
                                  product.title
                                }</h3>
                                <p class="text-sm text-white text-opacity-80 mb-2 line-clamp-2">${
                                  product.description
                                }</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-lg font-bold text-gradient">$${product.price.toFixed(
                                      2
                                    )}</span>
                                    <div class="flex items-center space-x-2">
                                        <div class="flex items-center space-x-1">
                                            <i class="fas fa-star text-yellow-400"></i>
                                            <span class="text-sm text-white text-opacity-80">${
                                              product.rating.rate
                                            }</span>
                                        </div>
                                        <button onclick="addToCart(${
                                          product.id
                                        })" class="btn-primary text-sm px-4 py-2">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
      )
      .join("");
  }
}

// Set view mode
function setViewMode(mode) {
  viewMode = mode;
  document.getElementById("grid-view").className =
    mode === "grid" ? "btn-primary p-2" : "btn-secondary p-2";
  document.getElementById("list-view").className =
    mode === "list" ? "btn-primary p-2" : "btn-secondary p-2";
  loadProductsPage();
}

// Cart 
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

// Placeholder navigation
function showPage(page) {
  console.log(`Navigating to ${page} page (not implemented in this version)`);
}

function logout() {
  currentUser = null;
  localStorage.removeItem("glassshop_user");
  updateUserUI();
  showNotification("Logged out successfully!");
}

function viewProduct(productId) {
  console.log(`Viewing product ${productId} (not implemented in this version)`);
}

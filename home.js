// ===================================================
// Planto. - Plant E-Commerce Website
// Main JavaScript - home.js
// ===================================================

// ===== DOM Elements =====
const showProduct = document.getElementById("show-product");
const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total");
const productCon = document.getElementById("productsCon");

// ===== State =====
let cart = {};
let wishlist = new Set();
let allProducts = [];

// ===================================================
// Toast Notification System
// ===================================================
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
        success: "bx-check-circle",
        error: "bx-error-circle",
        info: "bx-info-circle",
        warning: "bx-error",
    };

    toast.innerHTML = `
        <i class='bx ${icons[type] || icons.info}'></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("toast-show");
    });

    setTimeout(() => {
        toast.classList.remove("toast-show");
        toast.classList.add("toast-hide");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===================================================
// Product Loading & Display
// ===================================================
async function loadProducts() {
    // Show skeleton loading
    productCon.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "product-moves skeleton-card";
        skeleton.innerHTML = `
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-price"></div>
        `;
        productCon.appendChild(skeleton);
    }

    try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        allProducts = data;

        // Small delay to show skeleton effect
        setTimeout(() => showData(data), 600);
    } catch (error) {
        productCon.innerHTML =
            '<p class="error-msg">เกิดข้อผิดพลาดในการโหลดสินค้า</p>';
        console.error("Failed to load products:", error);
    }
}

function showData(data) {
    productCon.innerHTML = "";

    if (data.length === 0) {
        productCon.innerHTML =
            '<p class="error-msg">ไม่พบสินค้าที่ค้นหา</p>';
        return;
    }

    data.forEach((product, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "product-moves scroll-reveal";
        cardDiv.style.animationDelay = `${index * 0.08}s`;

        const isWished = wishlist.has(product.id);

        cardDiv.innerHTML = `
            <div class="product-top">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="wishlist-btn ${isWished ? "active" : ""}" data-id="${product.id}">
                <i class='bx ${isWished ? "bxs-heart" : "bx-heart"}'></i>
            </div>
            <div class="product-tile">
                <h2>${product.name}</h2>
                <p>${product.description || "Premium quality indoor plant"}</p>
                <div class="item-product-btn-button">
                    <h3>Rs. ${product.price}/-</h3>
                    <div class="item-product-btn-icon add-to-cart-btn" data-id="${product.id}">
                        <i class='bx bx-shopping-bag'></i>
                    </div>
                </div>
            </div>
        `;

        // Add to cart — ใช้ addEventListener แทน inline onclick เพื่อป้องกันบัค
        const cartBtn = cardDiv.querySelector(".add-to-cart-btn");
        cartBtn.addEventListener("click", function () {
            addToCart(product);
            this.classList.add("cart-btn-animate");
            setTimeout(() => this.classList.remove("cart-btn-animate"), 600);
        });

        // Wishlist toggle
        const wishBtn = cardDiv.querySelector(".wishlist-btn");
        wishBtn.addEventListener("click", function () {
            toggleWishlist(product.id, this);
        });

        productCon.appendChild(cardDiv);
    });

    // Re-observe scroll reveal
    observeElements();
}

// ===================================================
// Cart System
// ===================================================
function addToCart(productOrId) {
    let product;
    if (typeof productOrId === 'object') {
        product = productOrId;
    } else {
        product = allProducts.find(p => p.id == productOrId);
    }
    
    if (!product) {
        showToast("ไม่พบข้อมูลสินค้า", "error");
        return;
    }

    if (!cart[product.id]) {
        cart[product.id] = { ...product, quantity: 1 };
    } else {
        cart[product.id].quantity++;
    }
    updateCart();

    // Badge bounce animation
    const badge = document.querySelector(".shopping-cart");
    if (badge) {
        badge.classList.add("badge-bounce");
        setTimeout(() => badge.classList.remove("badge-bounce"), 600);
    }

    showToast(`${product.name} เพิ่มลงตะกร้าแล้ว!`, "success");
}

function updateCart() {
    showProduct.innerHTML = "";
    let total = 0;
    let count = 0;

    for (let id in cart) {
        const item = cart[id];
        total += item.price * item.quantity;
        count += item.quantity;

        const productDiv = document.createElement("div");
        productDiv.className = "show-product-data cart-item-enter";
        productDiv.innerHTML = `
            <div class="shoe-product-title">
                <img src="${item.image}" alt="${item.name}">
                <div class="show-choose">
                    <div class="show-data-choose">
                        <span>${item.name}</span>
                        <p>Price : Rs. ${item.price}</p>
                        <div class="end-show" data-id="${id}">
                            <p><i class='bx bx-trash'></i> Delete</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="number-product">
                <div class="number-product-choose">
                    <input type="number" min="1" value="${item.quantity}" data-id="${id}">
                </div>
            </div>
        `;

        // Delete event — ใช้ addEventListener แทน inline onclick
        const deleteBtn = productDiv.querySelector(".end-show");
        deleteBtn.addEventListener("click", function () {
            const itemId = parseInt(this.dataset.id);
            productDiv.classList.add("cart-item-exit");
            setTimeout(() => removeItem(itemId), 300);
        });

        // Quantity change event
        const quantityInput = productDiv.querySelector("input");
        quantityInput.addEventListener("change", function () {
            updateQuantity(parseInt(this.dataset.id), this.value);
        });

        showProduct.appendChild(productDiv);
    }

    cartCount.textContent = count;
    totalPrice.textContent = `Total : Rs. ${total}`;
}

function updateQuantity(id, value) {
    if (cart[id]) {
        if (value <= 0) {
            delete cart[id];
            showToast("ลบสินค้าออกจากตะกร้าแล้ว", "info");
        } else {
            cart[id].quantity = parseInt(value);
        }
        updateCart();
    }
}

function removeItem(id) {
    const name = cart[id]?.name || "สินค้า";
    delete cart[id];
    updateCart();
    showToast(`${name} ลบออกจากตะกร้าแล้ว`, "info");
}

// ===================================================
// Wishlist System
// ===================================================
function toggleWishlist(id, element) {
    const icon = element.querySelector("i");
    if (wishlist.has(id)) {
        wishlist.delete(id);
        element.classList.remove("active");
        icon.className = "bx bx-heart";
        showToast("ลบออกจากรายการโปรดแล้ว", "info");
    } else {
        wishlist.add(id);
        element.classList.add("active");
        icon.className = "bx bxs-heart";
        element.classList.add("wishlist-animate");
        setTimeout(
            () => element.classList.remove("wishlist-animate"),
            600
        );
        showToast("เพิ่มในรายการโปรดแล้ว! ❤️", "success");
    }
}

// ===================================================
// Search System
// ===================================================
function initSearch() {
    const searchIcon = document.getElementById("search-icon");
    const searchOverlay = document.getElementById("search-overlay");
    const searchInput = document.getElementById("search-input");
    const searchClose = document.getElementById("search-close");

    if (!searchIcon || !searchOverlay || !searchInput || !searchClose)
        return;

    searchIcon.addEventListener("click", () => {
        searchOverlay.classList.add("active");
        setTimeout(() => searchInput.focus(), 300);
    });

    searchClose.addEventListener("click", () => {
        searchOverlay.classList.remove("active");
        searchInput.value = "";
        showData(allProducts);
    });

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query === "") {
            showData(allProducts);
            return;
        }
        const filtered = allProducts.filter(
            (p) =>
                p.name.toLowerCase().includes(query) ||
                (p.description &&
                    p.description.toLowerCase().includes(query))
        );
        showData(filtered);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
        if (
            e.key === "Escape" &&
            searchOverlay.classList.contains("active")
        ) {
            searchOverlay.classList.remove("active");
            searchInput.value = "";
            showData(allProducts);
        }
    });
}

// ===================================================
// Scroll Reveal Animation (IntersectionObserver)
// ===================================================
function observeElements() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document
        .querySelectorAll(".scroll-reveal:not(.revealed)")
        .forEach((el) => {
            observer.observe(el);
        });
}

// ===================================================
// Header Scroll Behavior
// ===================================================
const topHeader = document.querySelector(".top-header");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        topHeader.classList.add("hide");
        topHeader.classList.remove("back-top-header");
    } else {
        topHeader.classList.remove("hide");
        if (window.scrollY > 50) {
            topHeader.classList.add("back-top-header");
        } else {
            topHeader.classList.remove("back-top-header");
        }
    }
    lastScrollY = window.scrollY;

    // Back-to-top button
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    }
});

// ===================================================
// Cart / Menu Toggles
// ===================================================
function toggleCart() {
    document.querySelector(".nav-product").classList.add("active");
    const overlay = document.getElementById("cart-overlay");
    if (overlay) overlay.classList.add("active");
}

function closeCart() {
    document.querySelector(".nav-product").classList.remove("active");
    const overlay = document.getElementById("cart-overlay");
    if (overlay) overlay.classList.remove("active");
}

function toggleMenu() {
    document
        .querySelector(".nav-menus")
        .classList.toggle("nav-menus-active");
}

// ===================================================
// Back to Top
// ===================================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===================================================
// Floating Leaf Particles
// ===================================================
function createParticles() {
    const container = document.getElementById("particles");
    if (!container) return;

    const leafChars = ["🍃", "🌿", "☘️", "🌱"];

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.textContent =
            leafChars[Math.floor(Math.random() * leafChars.length)];
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDuration =
            Math.random() * 15 + 12 + "s";
        particle.style.animationDelay = Math.random() * 10 + "s";
        particle.style.fontSize = Math.random() * 12 + 10 + "px";
        particle.style.opacity = Math.random() * 0.25 + 0.08;
        container.appendChild(particle);
    }
}

// ===================================================
// Scroll Reveal for Static Sections
// ===================================================
function initScrollRevealSections() {
    const sections = document.querySelectorAll(
        ".box-con-left, .box-right, .our-trendy-plants-items, .customer-review-products, .our-best-o2-con, .footer-con"
    );
    sections.forEach((el, index) => {
        el.classList.add("scroll-reveal");
        el.style.animationDelay = `${index * 0.1}s`;
    });
    observeElements();
}

// ===================================================
// Initialize
// ===================================================
loadProducts();
initSearch();
createParticles();

setTimeout(() => {
    initScrollRevealSections();
}, 100);

const backToTopBtn = document.getElementById("back-to-top");
if (backToTopBtn) {
    backToTopBtn.addEventListener("click", scrollToTop);
}
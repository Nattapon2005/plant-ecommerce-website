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

    let data = null;

    // 1. พยายามดึงจาก SQLite Backend API (http://localhost:5000/api/products)
    try {
        // ใช้ relative path "/api/products" เพื่อให้ทำงานได้ทั้งบน localhost:5000 และ Vercel
        const apiUrl = window.location.protocol.startsWith("http")
            ? "/api/products"
            : "http://localhost:5000/api/products";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
            data = await response.json();
            console.log("🌿 Loaded products from SQLite database API (port 5000)");
        }
    } catch (apiErr) {
        console.warn("Backend server (server.js) is not running on port 5000, checking fallback...");
    }

    // 2. ถ้าเซิร์ฟเวอร์ยังไม่ได้เปิด ให้ดึงข้อมูลสำรองจาก product.json
    if (!data || data.length === 0) {
        try {
            const jsonResp = await fetch("product.json");
            if (jsonResp.ok) {
                data = await jsonResp.json();
                console.log("🌿 Loaded products from product.json fallback");
            }
        } catch (jsonErr) {
            console.warn("product.json fetch failed, using internal dataset");
        }
    }

    // 3. Fallback อัตโนมัติป้องกันเคสเปิดตรงๆ ด้วย file:/// บนบราวเซอร์
    if (!data || data.length === 0) {
        data = [
            {
                id: 1,
                name: "Calathea Orbifolia",
                price: 359,
                image: "images/1.png",
                description: "Beautiful prayer plant with round silvery-green leaves"
            },
            {
                id: 2,
                name: "Monstera Deliciosa",
                price: 499,
                image: "images/2.png",
                description: "Iconic tropical plant with stunning split leaves"
            },
            {
                id: 3,
                name: "Snake Plant",
                price: 299,
                image: "images/3.png",
                description: "Hardy air-purifying plant perfect for beginners"
            },
            {
                id: 4,
                name: "Fiddle Leaf Fig",
                price: 599,
                image: "images/4.png",
                description: "Elegant statement plant with large violin-shaped leaves"
            },
            {
                id: 5,
                name: "Peace Lily",
                price: 249,
                image: "images/5.png",
                description: "Graceful white flowering indoor plant"
            },
            {
                id: 6,
                name: "Pothos Golden",
                price: 199,
                image: "images/6.png",
                description: "Easy-care trailing vine with golden-green leaves"
            },
            {
                id: 7,
                name: "Bird of Paradise",
                price: 699,
                image: "images/7.png",
                description: "Dramatic tropical plant that makes a bold statement"
            }
        ];
    }

    allProducts = data;
    setTimeout(() => showData(data), 350);
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
        cardDiv.style.transitionDelay = `${index * 0.08}s`;

        const isWished = wishlist.has(product.id);

        cardDiv.innerHTML = `
            <div class="product-top">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="wishlist-btn ${isWished ? "active" : ""}" data-id="${product.id}" title="Wishlist">
                <i class='bx ${isWished ? "bxs-heart" : "bx-heart"}'></i>
            </div>
            <div class="product-tile">
                <h2>${product.name}</h2>
                <p>${product.description || "Premium quality indoor plant"}</p>
                <div class="item-product-btn-button">
                    <h3>Rs. ${product.price}/-</h3>
                    <div class="item-product-btn-icon add-to-cart-btn" data-id="${product.id}" title="Add to Cart">
                        <i class='bx bx-shopping-bag'></i>
                    </div>
                </div>
            </div>
        `;

        // Add to cart — ใช้ addEventListener แทน inline onclick เพื่อป้องกันบัค
        const cartBtn = cardDiv.querySelector(".add-to-cart-btn");
        if (cartBtn) {
            cartBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                addToCart(product, this);
                this.classList.add("cart-btn-animate");
                setTimeout(() => this.classList.remove("cart-btn-animate"), 600);
            });
        }

        // Wishlist toggle
        const wishBtn = cardDiv.querySelector(".wishlist-btn");
        if (wishBtn) {
            wishBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleWishlist(product.id, this);
            });
        }

        productCon.appendChild(cardDiv);
    });

    // Re-observe scroll reveal
    observeElements();
}

// ===================================================
// Cart System
// ===================================================
function addToCart(productOrId, fromEl = null) {
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

    // ✈️ ภาพสินค้าบินเข้าตะกร้า
    if (fromEl) flyToCart(product.image, fromEl);

    showToast(`${product.name} เพิ่มลงตะกร้าแล้ว!`, "success");
}

// ===================================================
// Fly-to-Cart Animation — ภาพสินค้าบินเข้าตะกร้า
// ===================================================
function flyToCart(imageSrc, sourceEl) {
    try {
        const cartIcon = document.querySelector(".shopping-cart-icon");
        if (!cartIcon) return;

        const cartRect = cartIcon.getBoundingClientRect();
        const sourceImg = sourceEl
            .closest(
                ".product-moves, .our-trendy-plants-items-product, .box-contant"
            )
            ?.querySelector("img");
        const startRect = (sourceImg || sourceEl).getBoundingClientRect();

        const size = 60;
        const startX = startRect.left + startRect.width / 2 - size / 2;
        const startY = startRect.top + startRect.height / 2 - size / 2;

        const ghost = document.createElement("img");
        ghost.src = imageSrc;
        ghost.className = "fly-plant-ghost";
        ghost.style.left = `${startX}px`;
        ghost.style.top = `${startY}px`;

        // กันภาพเสียโชว์บนหน้าจอ
        ghost.addEventListener("error", () => ghost.remove());
        document.body.appendChild(ghost);

        // Force reflow เพื่อให้เบราว์เซอร์จำตำแหน่งเริ่มต้นก่อน แล้วค่อย animate
        void ghost.offsetWidth;

        const dx =
            cartRect.left + cartRect.width / 2 - (startX + size / 2);
        const dy =
            cartRect.top + cartRect.height / 2 - (startY + size / 2);

        ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.15) rotate(30deg)`;
        ghost.style.opacity = "0.1";

        setTimeout(() => ghost.remove(), 900);
    } catch (err) {
        /* เงียบไว้ ไม่ให้ UI พังเพราะเอฟเฟกต์ */
    }
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

                    // เคลียร์ delay หลัง reveal เสร็จ เพื่อไม่ให้ hover transition ช้าลง
                    const delay =
                        parseFloat(getComputedStyle(entry.target).transitionDelay) * 1000 || 0;
                    setTimeout(() => {
                        entry.target.style.transitionDelay = "";
                    }, delay + 900);

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
// Scroll Spy — ไฮไลต์ลิงก์ navbar ตาม section ที่กำลังดู
// ===================================================
function initScrollSpy() {
    const navLinks = document.querySelectorAll(".nav-menus ul li > a");

    const sections = [...navLinks]
        .map((link) => {
            const id = (link.getAttribute("href") || "").replace("#", "");
            return id ? document.getElementById(id) : null;
        })
        .filter(Boolean);

    if (!sections.length) return;

    const spy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            "active-link",
                            (link.getAttribute("href") || "").replace("#", "") ===
                                entry.target.id
                        );
                    });
                }
            });
        },
        { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => spy.observe(section));
}

// ===================================================
// Scroll Effects — Sticky Navbar + Progress Bar + Parallax
// ===================================================
const stickyHeader = document.querySelector("header");
const progressBar = document.getElementById("scroll-progress");

// เก็บตำแหน่งภาพต้นไม้ที่จะให้ขยับตาม scroll (parallax)
const parallaxItems = [];
document
    .querySelectorAll(".box-img-right img, .item-img")
    .forEach((el) => {
        const wrapper =
            el.closest(".box-img-right") ||
            el.closest(".item-product-img") ||
            el.parentElement;
        parallaxItems.push({
            el,
            wrapper,
            speed: el.closest(".box-img-right") ? 0.1 : 0.06,
        });
    });

function updateParallax() {
    parallaxItems.forEach(({ el, wrapper, speed }) => {
        if (!el || !wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const offset =
            (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
        const clamped = Math.max(-70, Math.min(70, offset));
        el.style.setProperty("--py", `${clamped.toFixed(1)}px`);
    });
}

function handleScroll() {
    const scrollY = window.scrollY;

    // แถบความคืบหน้าการ scroll ด้านบนสุด
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) {
        progressBar.style.transform = `scaleX(${
            maxScroll > 0 ? scrollY / maxScroll : 0
        })`;
    }

    // Sticky navbar: เลื่อนแล้วยังค้างอยู่ + ใส่พื้นหลัง glass เมื่อเลื่อนพ้น 40px
    if (stickyHeader) {
        if (scrollY > 40) stickyHeader.classList.add("scrolled");
        else stickyHeader.classList.remove("scrolled");
    }

    // Back-to-top button
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        if (scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    }

    updateParallax();
    scrollTicking = false;
}

let scrollTicking = false;

window.addEventListener(
    "scroll",
    () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(handleScroll);
        }
    },
    { passive: true }
);

handleScroll();

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
    // กลุ่ม section ทั่วไป (hero ใช้ CSS entrance ของตัวเองแล้ว)
    document
        .querySelectorAll(
            ".our-trendy-plants-items, .our-best-o2-con, .footer-con, .our-trendy-plants-header, .marquee-section"
        )
        .forEach((el, i) => {
            el.classList.add("scroll-reveal");
            el.style.transitionDelay = `${(i % 3) * 0.08}s`;
        });

    // การ์ดรีวิว — Fade up สวยงามตามลำดับ (staggered delay) ไม่ใช้ transform แนวนอนเพื่อความแม่นยำของ Grid
    document.querySelectorAll(".customer-review-products").forEach((el, i) => {
        el.classList.add("scroll-reveal");
        el.style.transitionDelay = `${i * 0.12}s`;
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

// ===================================================
// Preloader — ซ่อนหน้าจอโหลดเมื่อหน้าเว็บพร้อม
// ===================================================
function hidePreloader() {
    const pre = document.getElementById("preloader");
    if (!pre || pre.classList.contains("done")) return;
    pre.classList.add("done");
    setTimeout(() => pre.remove(), 700);
}

window.addEventListener("load", () => setTimeout(hidePreloader, 300));
setTimeout(hidePreloader, 2600); // กันโหลดค้างนานเกินไป

// ===================================================
// Hero Title — แยกคำให้โผล่ทีละคำ (word by word)
// ===================================================
function initHeroTitle() {
    const h1 = document.querySelector(".box-left h1");
    if (!h1 || h1.dataset.animated) return;
    h1.dataset.animated = "true";

    const words = h1.textContent.trim().split(/\s+/);
    h1.innerHTML = words
        .map(
            (word, i) =>
                `<span class="hero-word" style="--wi:${i}">${word}</span>`
        )
        .join(" ");
}

// ===================================================
// Product Card Spotlight — แสงเขียวตามตำแหน่งเมาส์บนการ์ด
// ===================================================
function initSpotlight() {
    if (!productCon) return;

    productCon.addEventListener("mousemove", (e) => {
        const card = e.target.closest(".product-moves");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });

    productCon.addEventListener("mouseleave", () => {
        productCon
            .querySelectorAll(".product-moves")
            .forEach((card) => {
                card.style.setProperty("--mx", "50%");
                card.style.setProperty("--my", "50%");
            });
    });
}

// ===================================================
// Hero Card 3D Tilt — การ์ดเอียงตามเมาส์
// ===================================================
function initTilt() {
    const card = document.querySelector(".box-contant");
    if (!card || window.matchMedia("(hover: none)").matches) return;

    const MAX_TILT = 7;

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = "transform 0.08s linear";
        card.style.transform = `rotateX(${(-y * MAX_TILT).toFixed(
            2
        )}deg) rotateY(${(x * MAX_TILT).toFixed(2)}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transition =
            "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}

// ===================================================
// Magnetic Footer Icons — ไอคอนโซเชียลล้วงตามเมาส์
// ===================================================
function initMagnetic() {
    if (window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll(".footer-logo-end h2").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `translate(${(x * 10).toFixed(1)}px, ${(
                y * 10
            ).toFixed(1)}px)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = "";
        });
    });
}

// ===================================================
// Button Ripple — คลื่นกระแทกทุกปุ่มเวลาคลิก
// ===================================================
function initRipple() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;

        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
}

// ===================================================
// Newsletter — Subscribe พร้อม validate
// ===================================================
function initNewsletter() {
    const btn = document.getElementById("newsletter-btn");
    const input = document.getElementById("newsletter-input");
    if (!btn || !input) return;

    btn.addEventListener("click", () => {
        const value = input.value.trim();
        const isValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

        if (!isValid) {
            input.classList.add("input-shake");
            showToast("กรุณากรอกอีเมลให้ถูกต้อง", "error");
            setTimeout(() => input.classList.remove("input-shake"), 500);
        } else {
            showToast("Subscribe สำเร็จแล้ว! 🌿", "success");
            input.value = "";
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") btn.click();
    });
}

// ===================================================
// Review Cards 3D Interactive Tilt & Spotlight
// ===================================================
function initReviewCards3D() {
    const cards = document.querySelectorAll(".customer-review-products");
    if (!cards.length || window.matchMedia("(hover: none)").matches) return;

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // ส่งพิกัดเมาส์เข้า CSS variables สำหรับทำเอฟเฟกต์ Spotlight แสงนีออน
            card.style.setProperty("--rx", `${x}px`);
            card.style.setProperty("--ry", `${y}px`);

            // คำนวณองศาเอียง 3D Tilt แบบนุ่มนวล
            const xOffset = x / rect.width - 0.5;
            const yOffset = y / rect.height - 0.5;
            const maxTilt = 7;
            const rotateX = (-yOffset * maxTilt).toFixed(2);
            const rotateY = (xOffset * maxTilt).toFixed(2);

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
            card.style.removeProperty("--rx");
            card.style.removeProperty("--ry");
        });
    });
}

// ===================================================
// Initialize new features
// ===================================================
initScrollSpy();
initHeroTitle();
initSpotlight();
initTilt();
initReviewCards3D();
initMagnetic();
initRipple();
initNewsletter();
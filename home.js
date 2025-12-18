

// window.onload = function () {
//     const user = JSON.parse(localStorage.getItem("currentUser"));

//     if (!user) {
//         window.location.href = "index.html";
//         return;
//     }

//     document.getElementById("showData").innerHTML = `
//     <h1>ยินดีต้อนรับ, ${user.firstName} ${user.lastName}</h1>
//      <p><strong>อีเมล:</strong> ${user.email}</p>
//      <button onclick="logout()">ออกจากระบบ</button>`;
// }

// function logout() {
//     localStorage.removeItem("currentUser");
//     window.location.href = "index.html";
// }

const showProduct = document.getElementById("show-product");
const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total");
let productCon = document.getElementById('productsCon');


// API

async function loadProducts() {
    try {
        const response = await fetch('product.json')
        const data = await response.json();

        showData(data);
    } catch (error) {
        productCon.innerHTML = "<p>เกิดข้อผิดพลาดในการโหลดสินค้า</p>";
        console.error(error);
    }
}

function showData(data) {
    productCon.innerHTML = "";

    data.forEach((product) => {
        let cardDiv = document.createElement('div');
        cardDiv.className = 'product-moves'
        cardDiv.innerHTML += `
                    <div class="product-top">
                        <img src="${product.image}" alt="">
                    </div>
                    <div class="product-tile">
                        <h2>
                            For Small Decs Ai Plat
                        </h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        </p>
                        <div class="item-product-btn-button">
                            <h3>
                                Rs.  ${product.price}/-
                            </h3>
                            <div class="item-product-btn-icon" onclick='addToCart(${JSON.stringify(product)})'>
                                <i class='bx bx-shopping-bag'></i>
                            </div>
                        </div>
                    </div>
        `
            //         🔥 JavaScript/HTML ไม่สามารถมี string ซ้อนกันแบบมั่ว ๆ ได้ (quote ซ้อน quote)
            // ✅ ใช้ data-attribute แล้ว JSON.parse() ดึงข้อมูลมาใช้ → ปลอดภัยและจัดการง่ายสุด
            //   <div class="item-product-btn-icon" onclick='addToCart(${JSON.stringify(product)})'>
            //                     <i class='bx bx-shopping-bag'></i>
            //   </div>


            // ตรงฟังก์ชัน showData(data) ซึ่ง
            // productCon.appendChild(card); ถูกเรียก แค่ครั้งเดียว
            // ภายนอกลูป forEach แทนที่จะอยู่ ภายใน ลูป
            // ซึ่งทำให้แสดงสินค้าได้แค่ตัวสุดท้ายเท่านั้น
            productCon.appendChild(cardDiv);
    })
}

loadProducts();// ฟังก์ชันนี้จะถูกเรียกเมื่อโหลดหน้าเว็บ

// cart object to store products
let cart = {};

// add to cart

function addToCart(cartProduct) {
    if (!cart[cartProduct.id]) {
        cart[cartProduct.id] = { ...cartProduct, quantity: 1 };
    } else {
        cart[cartProduct.id].quantity++;
    }
    updateCart();
}

function updateCart() {
    showProduct.innerHTML = "";
    let total = 0;
    let count = 0;

    for (let id in cart) {
        let item = cart[id];
        total += item.price * item.quantity;
        count += item.quantity;
        let productDiv = document.createElement('div');
        productDiv.className = 'show-product-data'
        productDiv.innerHTML = `
                            <div class="shoe-product-title">
                                <img src="${item.image}" alt="">
                                <div class="show-choose">
                                    <div class="show-data-choose">
                                        <span>${item.name}</span>
                                        <p>price : ${item.price}</p>
                                        <div class="end-show" onclick="removeItem(${id})">
                                            <p>
                                                Delete
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="number-product">
                                <div class="number-product-choose">
                                    <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
                                </div>
                            </div>
        `
        showProduct.appendChild(productDiv);
    }

    cartCount.textContent = count;
    totalPrice.textContent = `Total : ${total} bath.`;
}

function updateQuantity(id, value) {
    if (cart[id]) {
        if (value <= 0) {
            delete cart[id];
        } else {
            cart[id].quantity = parseInt(value);
        }
        updateCart();
    }
}

function removeItem(id) {
    delete cart[id];
    updateCart();
}

// scroll event
let topHeader = document.querySelector('.top-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        topHeader.classList.add('hide');
        topHeader.classList.remove('back-top-header');
    } else {
        topHeader.classList.remove('hide');
        topHeader.classList.add('back-top-header');
    }

    lastScrollY = window.scrollY;
});




// getElementById('someId') → สำหรับ id="someId"
// querySelector('.someClass') → สำหรับ class="someClass"
// querySelector('#someId') → ก็ใช้กับ id ได้เช่นกัน (ใช้ #)
function toggleCart() {
    document.querySelector('.nav-product').classList.add('active');
}

function closeCart() {
    document.querySelector('.nav-product').classList.remove('active');
}

function toggleMenu() {
    document.querySelector('.nav-menus').classList.toggle('nav-menus-active');
}
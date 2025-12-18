
let a = document.getElementById("loginBtn");
let b = document.getElementById("registerBtn");
let x = document.getElementById("login");
let y = document.getElementById("register");
let formLogin = document.getElementById("formLogin");
let formRegister = document.getElementById("formRegister");



function login() {
    x.style.left = "4px";
    y.style.right = "-520px";
    a.classList.add("white-btn");
    b.classList.remove("white-btn");
    x.style.opacity = 1;
    y.style.opacity = 0;
}

function register() {
    x.style.left = "-510px";
    y.style.right = "5px";
    a.classList.remove("white-btn");
    b.classList.add("white-btn");
    x.style.opacity = 0;
    y.style.opacity = 1;
}

function loginFunction(event) {
    event.preventDefault();  // หยุดการรีเฟรชหน้า
    // const form = event.currentTarget;  // อ้างอิงถึงฟอร์ม
    // const email = form.elements["email"];  // เข้าถึงฟิลด์ที่มี name="email"
    // const password = form.elements["password"];  // เข้าถึงฟิลด์ที่มี name="password"
    let email = event.currentTarget.elements["email"].value;
    let password = event.currentTarget.elements["password"].value;
    console.log("Email:", email);  // แสดงค่าของฟิลด์ email
    console.log("Password:", password);  // แสดงค่าของฟิลด์ password


       // ดึงข้อมูลผู้ใช้จาก localStorage
    const storedUser = JSON.parse(localStorage.getItem(email));  // ใช้ email เป็น key
    // จะต้องเก็บข้อมูลเป็น JSON string ดังนั้นจะต้องแปลงข้อมูลจาก JSON.parse() เพื่อใช้กับรหัสผ่านที่เก็บไว้ใน localStorage

     // ตรวจสอบว่ารหัสผ่านที่กรอกตรงกับรหัสผ่านที่เก็บใน localStorage หรือไม่
    if (storedUser === password) {
        alert("เข้าสู่ระบบสำเร็จ!");
        document.body.innerHTML = `<h1 style="text-align:center">ยินดีต้อนรับ, ${username}!</h1><p style="text-align:center"><a href="#" onclick="location.reload()">ออกจากระบบ</a></p>`;
    } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }


    event.currentTarget.elements["email"].value = '';
    event.currentTarget.elements["password"].value = '';
    // ถ้าคุณอยากเลื่อนโฟกัสไปยังช่อง input Firstname ให้ทำแบบนี้
    // .value → เอาข้อความ
    // ถ้าจะใช้ .focus() ต้องเรียกจาก input element (ไม่ใช่ข้อความ)
    event.currentTarget.elements["email"].focus();
}


function registerFunction(event) {
    event.preventDefault();
    let firstName = event.currentTarget.elements["Firstname"];
    let lastName = event.currentTarget.elements["Lastname"];
    let email = event.currentTarget.elements["email"];
    let password = event.currentTarget.elements["password"];

    console.log("Firstname:", firstName.value);
    console.log("Lastname:", lastName);
    console.log("Email:", email.value);
    console.log("Password:", password.value);

    if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value.trim()) {
        alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        return;
    }
    //     🔍 ถ้า input มีค่า → .trim() ไม่ว่าง → ! จะเป็น false
    // จะไม่เข้า if
    // 🔍 ถ้า input ว่าง (หรือใส่แค่ช่องว่าง) → .trim() จะเป็น "" → !"" = true
    // จะเข้า if แล้ว return ออกจากฟังก์ชัน
    // สิ่งที่พิมพ์ในช่อง firstName	.trim()	      ! .trim()	      จะเข้า if ไหม?
    // "John"	              "John"	    false	        ❌ ไม่เข้า
    // " "	                  ""	        true	        ✅ เข้า
    // ""	                  ""	        true	        ✅ เข้า

    console.log(localStorage.getItem(firstName.value))

     // ตรวจสอบว่า email หรือ firstName ถูกใช้แล้วหรือไม่
    if (localStorage.getItem(firstName.value)) {
        alert("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
        console.log(firstName.value)
        return;
    } else {
        // ซึ่งไม่ถูกต้อง เพราะ localStorage.setItem() รับเพียงแค่ 2 พารามิเตอร์: key และ value เท่านั้น และพารามิเตอร์ที่ใช้ก็ไม่ถูกต้อง

         // เก็บข้อมูลผู้ใช้ใน localStorage โดยใช้ firstName เป็น key
        localStorage.setItem(firstName.value, JSON.stringify({
            lastName: lastName.value,
            email: email.value,
            password: password.value
        }));
        // ถ้าชื่อผู้ใช้ยังไม่เคยใช้, ข้อมูล (ชื่อ, นามสกุล, อีเมล์, รหัสผ่าน)
        // จะถูกเก็บใน localStorage โดยใช้ firstName.value เป็น key
        // และข้อมูลที่เหลือจะถูกแปลงเป็น JSON string เพื่อเก็บเป็น value
    }


    firstName.value = '';
    lastName.value = '';
    email.value = '';
    password.value = '';
    event.currentTarget.elements["Firstname"].focus();
}

formLogin.addEventListener('submit', loginFunction)
formRegister.addEventListener('submit', registerFunction)

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
    let email = event.currentTarget.elements["email"].value;
    let password = event.currentTarget.elements["password"].value;
    console.log("Email:", email);  // แสดงค่าของฟิลด์ email
    console.log("Password:", password);  // แสดงค่าของฟิลด์ password

    // ดึงข้อมูลผู้ใช้จาก localStorage
    const storedUser = JSON.parse(localStorage.getItem(email));  // ใช้ email เป็น key

    console.log("Stored User:", storedUser); // ตรวจสอบว่าได้ข้อมูลจาก localStorage หรือไม่

    // ตรวจสอบว่าผู้ใช้พบใน localStorage หรือไม่
    if (!storedUser) {
        alert("ไม่พบผู้ใช้นี้");
        return;
    }

    // ตรวจสอบว่ารหัสผ่านที่กรอกตรงกับรหัสผ่านที่เก็บใน localStorage หรือไม่
    if (storedUser.password === password) {
        localStorage.setItem("currentUser", JSON.stringify(storedUser));
        alert("เข้าสู่ระบบสำเร็จ!");

        window.location.href = "/home.html"
    } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }

    // เคลียร์ค่าฟอร์ม
    event.currentTarget.elements["email"].value = '';
    event.currentTarget.elements["password"].value = '';
    event.currentTarget.elements["email"].focus();
}



function registerFunction(event) {
    event.preventDefault();
    let firstName = event.currentTarget.elements["Firstname"];
    let lastName = event.currentTarget.elements["Lastname"];
    let email = event.currentTarget.elements["email"];
    let password = event.currentTarget.elements["password"];

    if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value.trim()) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    console.log(`FirstName :  ${firstName.value}`);
    console.log(`LastName :  ${lastName.value}`);
    console.log(`email :  ${email.value}`);
    console.log(`password :  ${password.value}`);

    console.log(localStorage.getItem(email)); // ตรวจสอบอีเมลใน localStorage

    // ตรวจสอบว่า email ถูกใช้แล้วหรือไม่
    if (localStorage.getItem(email.value)) {
        alert("อีเมลนี้ถูกใช้แล้ว");
        return;
    } else {
        // เก็บข้อมูลผู้ใช้ใน localStorage โดยใช้ email เป็น key
        localStorage.setItem(email.value, JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        }));
        alert('คุณลงทะเบียนเสร็จเรียบร้อยแล้ว')
    }

    // เคลียร์ค่าฟอร์ม
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    password.value = '';
    event.currentTarget.elements["Firstname"].focus();

    login();
}


// ฟังค์ชั่นการลงทะเบียนและเข้าสู่ระบบ
formLogin.addEventListener('submit', loginFunction);
formRegister.addEventListener('submit', registerFunction);



// home.html

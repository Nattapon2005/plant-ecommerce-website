# Planto - Premium Indoor Plants E-Commerce 🌿

Planto เป็นเว็บไซต์ E-Commerce สำหรับจำหน่ายต้นไม้ประดับภายในบ้าน (Indoor Plants) ที่ถูกออกแบบมาด้วย UI/UX ที่ทันสมัย (Modern Design) รองรับ Responsive และมีระบบ Animation ที่นุ่มนวล พร้อมทั้งจำลองการทำงานเชื่อมต่อกับฐานข้อมูลผ่าน API ครบวงจร

## ✨ ฟีเจอร์หลัก (Key Features)

- **Dynamic Product Loading**: ดึงข้อมูลสินค้าจากฐานข้อมูล (API) มาแสดงผลอัตโนมัติ
- **Shopping Cart System**: ระบบตะกร้าสินค้า (เพิ่ม/ลดจำนวน/ลบสินค้า) พร้อมคำนวณราคารวม
- **Search System**: ระบบค้นหาสินค้าแบบ Real-time พร้อม UI แบบ Glassmorphism Overlay
- **Wishlist System**: ระบบบันทึกสินค้าที่ชอบ (กดหัวใจ)
- **Toast Notifications**: ระบบแจ้งเตือนที่สวยงามและใช้งานง่าย แทนที่การใช้ `alert()` แบบเดิม
- **Modern UI & Animations**: 
  - การโหลดข้อมูลแบบ Skeleton Loading
  - Scroll Reveal (เนื้อหาเลื่อนและค่อยๆ ปรากฏเมื่อเลื่อนจอ)
  - เอฟเฟกต์โฮเวอร์ (Hover Effects) และ Particle พื้นหลังใบไม้ลอย
- **Database Integration**: รองรับการใช้งานฐานข้อมูลจริง (มีไฟล์ `database.sql` สำหรับ MySQL และรองรับ SQLite สำหรับการทดสอบ Local)

---

## 🛠️ โครงสร้างเทคโนโลยี (Tech Stack)

**Frontend:**
- HTML5, CSS3 (SCSS)
- Vanilla JavaScript (ES6+)
- Boxicons (สำหรับไอคอน)

**Backend (API Server):**
- Node.js
- Express.js
- CORS

**Database:**
- SQLite (สำหรับ Development: ผ่านไฟล์ `database.sqlite`)
- MySQL (สำหรับ Production: สามารถนำไฟล์ `database.sql` ไปติดตั้งได้)

---

## 📁 โครงสร้างไฟล์ในโปรเจกต์ (Project Structure)

```text
/
├── index.html          # หน้าหลักของเว็บไซต์
├── home.js             # ควบคุมการทำงานของเว็บ (Cart, Search, Fetch Data, Animations)
├── app.js / script.js  # ควบคุมระบบ Login / Register (จำลองผ่าน LocalStorage)
├── product.json        # ข้อมูลดิบตั้งต้น
│
├── api/                
│   └── get_products.php# (ตัวเลือก) ไฟล์ API สำหรับเซิร์ฟเวอร์ PHP/MySQL
├── server.js           # API Server (Node.js/Express) สำหรับดึงข้อมูลจากฐานข้อมูล
├── init-db.js          # สคริปต์สำหรับสร้างและแปลงข้อมูลจาก JSON ลง SQLite
├── database.sqlite     # ฐานข้อมูล SQLite (จำลองใช้งานฝั่ง Backend)
├── database.sql        # โค้ดฐานข้อมูล MySQL (สำหรับใช้งานบนเซิร์ฟเวอร์จริง)
│
├── src/                
│   ├── scss/           # ซอร์สโค้ด CSS ของโปรเจกต์ (SCSS)
│   └── public/css/     # ไฟล์ CSS ที่ผ่านการ Compile แล้ว นำไปใช้ใน index.html
│
└── images/ และ imgs/    # โฟลเดอร์เก็บรูปภาพต้นไม้และรูปประกอบอื่นๆ
```

---

## 🚀 การติดตั้งและเรียกใช้งาน (Installation & Setup)

### 1. การตั้งค่า Backend (API Server)
เพื่อให้ระบบดึงข้อมูลต้นไม้มาแสดงผลได้ ต้องเปิด API Server ขึ้นมาก่อน:

1. เปิด Terminal ในโฟลเดอร์ของโปรเจกต์
2. ติดตั้ง Dependencies ที่จำเป็น:
   ```bash
   npm install express cors sqlite3
   ```
3. (ทำครั้งแรก) สร้างฐานข้อมูล SQLite จากไฟล์ JSON:
   ```bash
   node init-db.js
   ```
4. เปิดใช้งาน API Server:
   ```bash
   node server.js
   ```
   > เซิร์ฟเวอร์จะรันที่ `http://localhost:5000`

### 2. การเปิดใช้งาน Frontend
1. ต้องรันหน้าเว็บผ่าน Live Server (เช่น โหมด Live Server ใน VS Code) หรือใช้เครื่องมืออื่นๆ
2. เข้าไปที่ URL เช่น `http://127.0.0.1:3000/index.html` 
3. หน้าเว็บจะทำการดึงข้อมูลจาก `http://localhost:5000/api/products` (API Server) มาแสดงผล

---

## 🔌 API Endpoints (Node.js Express)

- `GET /api/products` : ดึงข้อมูลต้นไม้ทั้งหมด
- `GET /api/products/:id` : ดึงข้อมูลต้นไม้ตาม ID

---

## ⚙️ การคอมไพล์ SCSS (สำหรับการพัฒนา)
หากมีการแก้ไขสไตล์ในโฟลเดอร์ `src/scss` จำเป็นต้อง Compile ให้เป็นไฟล์ CSS ธรรมดา:
```bash
npx sass src/scss/home.scss:src/public/css/home.css src/scss/responsive.scss:src/public/css/responsive.css --no-source-map
```

---

## 💾 นำไปใช้งานกับฐานข้อมูลจริง (MySQL / PHP)
หากไม่ต้องการใช้ Node.js และต้องการรันบน Hosting จริงที่มี PHP และ MySQL:
1. นำไฟล์ `database.sql` ไป **Import** เข้าฐานข้อมูล MySQL (เช่น ผ่าน phpMyAdmin)
2. แก้ไขข้อมูลการเชื่อมต่อฐานข้อมูลในไฟล์ `api/get_products.php` (ตั้งค่า DB Name, Username, Password)
3. ไปที่ไฟล์ `home.js` และเปลี่ยน URL การดึงข้อมูลจาก `http://localhost:5000/api/products` เป็น `api/get_products.php` 
<?php
// ไฟล์ get_products.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. ตั้งค่าการเชื่อมต่อฐานข้อมูล
$host = 'localhost';
$dbname = 'planto_db'; // เปลี่ยนเป็นชื่อฐานข้อมูลของคุณ
$username = 'root';    // เปลี่ยนเป็น username ของคุณ
$password = '';        // เปลี่ยนเป็นรหัสผ่านของคุณ

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. ดึงข้อมูลต้นไม้
    $stmt = $pdo->query("SELECT * FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. ส่งข้อมูลกลับไปเป็น JSON ให้ home.js
    echo json_encode($products);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

-- ==========================================
-- Planto E-Commerce Database SQL Dump
-- ==========================================

-- 1. สร้างตารางสำหรับเก็บข้อมูลต้นไม้ (Products)
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL COMMENT 'Path รูปภาพต้นไม้ (เช่น images/1.png)',
  `category` varchar(50) DEFAULT 'Trendy Plant',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. เพิ่มข้อมูลต้นไม้ตั้งต้น (ใช้ path จากโฟลเดอร์ images)
INSERT INTO `products` (`id`, `name`, `price`, `description`, `image_url`, `category`) VALUES
(1, 'Calathea Orbifolia', 359.00, 'Beautiful prayer plant with round silvery-green leaves', 'images/1.png', 'Top Selling'),
(2, 'Monstera Deliciosa', 499.00, 'Iconic tropical plant with stunning split leaves', 'images/2.png', 'Trendy Plant'),
(3, 'Snake Plant', 299.00, 'Hardy air-purifying plant perfect for beginners', 'images/3.png', 'Top Selling'),
(4, 'Fiddle Leaf Fig', 599.00, 'Tall indoor tree with large violin-shaped leaves', 'images/4.png', 'Top Selling'),
(5, 'Peace Lily', 249.00, 'Elegant plant with white blooms and excellent air purification', 'images/5.png', 'O2 Plant'),
(6, 'Pothos Golden', 199.00, 'Fast-growing trailing vine that thrives in most conditions', 'images/6.png', 'Top Selling'),
(7, 'Bird of Paradise', 699.00, 'Large tropical plant with banana-like leaves', 'images/7.png', 'Trendy Plant');


-- ==========================================
-- 3. สร้างตารางสำหรับเก็บข้อมูลรีวิว (Customer Reviews)
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL COMMENT 'Path รูปภาพคนรีวิว (เช่น imgs/review1.jpg)',
  `rating` int(1) NOT NULL DEFAULT 5 COMMENT 'คะแนน 1-5 ดาว',
  `comment` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. เพิ่มข้อมูลรีวิว (ใช้ path จากโฟลเดอร์ imgs)
INSERT INTO `reviews` (`id`, `customer_name`, `avatar_url`, `rating`, `comment`) VALUES
(1, 'Alena Patel', 'imgs/review1.jpg', 4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'),
(2, 'James Wilson', 'imgs/review2.jpg', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'),
(3, 'Sophie Chen', 'imgs/review3.jpg', 4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'),
(4, 'Alena Patel (Hero Section)', 'imgs/aiony-haust-3TLl_97HNJo-unsplash.jpg', 4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...');

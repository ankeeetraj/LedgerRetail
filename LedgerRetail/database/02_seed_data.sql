-- ============================================================
--  Ledger Retail — Seed Data (Indian Rupee pricing ₹)
--  Run AFTER 01_schema.sql
-- ============================================================

USE ledger_retail;

-- ─────────────────────────────────────────────────────────────
-- USERS  (passwords are BCrypt of the plain text shown)
--   admin@ledger.com   → admin123
--   cashier@ledger.com → cash123
-- ─────────────────────────────────────────────────────────────
INSERT INTO users (name, email, password, role) VALUES
('Alex Sterling',  'admin@ledger.com',
 '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE36EZgt2unUs1zFO',
 'ADMIN'),
('Jamie Cashier', 'cashier@ledger.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHwR9Gyp2',
 'CASHIER'),
('Rahul Sharma',  'rahul@ledger.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHwR9Gyp2',
 'USER');

-- ─────────────────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────────────────
INSERT INTO categories (name) VALUES
('Electronics'),
('Audio'),
('Accessories'),
('Photography'),
('Furniture'),
('Clothing'),
('Mobile Phones'),
('Home Appliances'),
('Sports & Fitness'),
('Books & Stationery');

-- ─────────────────────────────────────────────────────────────
-- PRODUCTS  (all prices in Indian Rupees ₹)
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (name, description, price, stock_quantity, sku, category_id) VALUES

-- Electronics
('Lenovo IdeaPad 5 Laptop',
 '15.6" FHD IPS, AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD',
 58999.00, 25, 'LEN-IP5-001', 1),

('Dell XPS 13 Ultrabook',
 '13.3" OLED, Intel Core i7, 16GB RAM, 1TB SSD',
 124999.00, 8, 'DEL-XPS-042', 1),

('Samsung 27" 4K Monitor',
 '27" IPS 4K UHD, 60Hz, USB-C, HDR10',
 28999.00, 40, 'SAM-MON-27K', 1),

('HP LaserJet Pro Printer',
 'Wireless monochrome laser printer, 22 ppm',
 14999.00, 15, 'HP-LJP-M404', 1),

-- Audio
('boAt Rockerz 550 Headphones',
 'Wireless Bluetooth, 20h battery, 40mm drivers',
 1799.00, 120, 'BOA-ROC-550', 2),

('Sony WH-1000XM5',
 'Industry-leading noise cancellation, 30h battery',
 26990.00, 35, 'SNY-WH1000XM5', 2),

('JBL Charge 5 Speaker',
 'Portable Bluetooth speaker, IP67 waterproof, 20h playtime',
 13999.00, 55, 'JBL-CHG-5', 2),

-- Accessories
('Logitech MX Master 3S Mouse',
 'Ergonomic wireless mouse, 8000 DPI, USB-C charging',
 8295.00, 80, 'LGT-MXM-3S', 3),

('Keychron K2 Mechanical Keyboard',
 'Wireless TKL, Gateron Brown switches, RGB backlight',
 7999.00, 45, 'KEY-K2-V2', 3),

('Portronics Toad 25 Mouse Pad',
 'Extended XXL gaming mouse pad, non-slip base',
 799.00, 200, 'POR-TOD-25', 3),

('Zebronics USB-C Hub 7-in-1',
 'HDMI 4K, 3×USB-A 3.0, SD/TF card, 100W PD',
 1999.00, 90, 'ZEB-HUB-7IN1', 3),

-- Photography
('Canon EOS 1500D DSLR',
 '24.1MP APS-C sensor, Full HD video, 18-55mm kit lens',
 34999.00, 12, 'CAN-EOS-1500D', 4),

('Sony Alpha ZV-E10',
 'APS-C mirrorless, 24.2MP, 4K video, vlog-optimised',
 59990.00, 6, 'SNY-ZVE10', 4),

('Sandisk Extreme 128GB SD Card',
 'UHS-I U3, V30, up to 160MB/s read',
 1899.00, 150, 'SND-EXT-128', 4),

-- Mobile Phones
('Samsung Galaxy M34 5G',
 '6.5" sAMOLED, 50MP camera, 6000mAh, 25W charging',
 18999.00, 60, 'SAM-M34-5G', 7),

('Redmi Note 13 Pro+',
 '200MP camera, 5000mAh, 120W HyperCharge, 6.67" AMOLED',
 31999.00, 45, 'XMI-N13PP', 7),

('iPhone 15',
 'A16 Bionic, 48MP main camera, Dynamic Island, USB-C',
 79900.00, 20, 'APL-IP15-128', 7),

-- Home Appliances
('Philips Air Fryer HD9200',
 '4.1L capacity, rapid air technology, 7 presets',
 5999.00, 30, 'PHI-AF-HD9200', 8),

('Havells Instanio Geyser 15L',
 '15L storage water heater, BEE 4-star rating, ISI mark',
 7499.00, 18, 'HAV-GYS-15L', 8),

-- Sports & Fitness
('Boldfit Adjustable Dumbbell Set',
 '20kg pair, chrome plated, with storage stand',
 3499.00, 35, 'BLF-DBL-20KG', 9),

('Decathlon Domyos Yoga Mat',
 '8mm thick, non-slip, 183×61cm',
 999.00, 100, 'DCA-YGA-8MM', 9),

-- Books & Stationery
('Clean Code – Robert C. Martin',
 'A Handbook of Agile Software Craftsmanship',
 699.00, 40, 'BK-CLEANCODE', 10),

('System Design Interview Vol 2',
 'An Insider\'s Guide by Alex Xu & Sahn Lam',
 849.00, 30, 'BK-SDI-VOL2', 10);

-- ─────────────────────────────────────────────────────────────
-- CUSTOMERS
-- ─────────────────────────────────────────────────────────────
INSERT INTO customers (name, email, phone, address, company, status) VALUES
('Arjun Mehta',      'arjun.mehta@techcorp.in',    '+91 98765 43210',
 '42, MG Road, Bengaluru, Karnataka 560001', 'TechCorp India Pvt Ltd', 'ENTERPRISE'),

('Priya Sharma',     'priya.sharma@startup.io',    '+91 87654 32109',
 'Flat 5B, Hiranandani Estate, Thane, Maharashtra 400607', 'StartUp.io', 'ACTIVE'),

('Ravi Kiran',       'ravi.kiran@bizhouse.com',    '+91 76543 21098',
 '12, Connaught Place, New Delhi 110001', 'BizHouse Solutions', 'DELINQUENT'),

('Sneha Patel',      'sneha.p@globallogistics.in', '+91 65432 10987',
 'Plot 9, GIDC Industrial Area, Surat, Gujarat 395010', 'Global Logistics India', 'ENTERPRISE'),

('Vikram Nair',      'vikram.nair@freelance.dev',  '+91 54321 09876',
 '88, Anna Salai, Chennai, Tamil Nadu 600002', NULL, 'ACTIVE'),

('Anjali Gupta',     'anjali.g@retail24.com',      '+91 43210 98765',
 '101, Sector 18, Noida, Uttar Pradesh 201301', 'Retail24 Enterprises', 'ACTIVE'),

('Mohammed Farouk',  'farouk.m@exports.in',        '+91 32109 87654',
 '7, Ballard Estate, Mumbai, Maharashtra 400001', 'Farouk Exports', 'ENTERPRISE'),

('Kavitha Reddy',    'kavitha.r@edtech.co',        '+91 21098 76543',
 '33, Jubilee Hills, Hyderabad, Telangana 500033', 'EduTech Solutions', 'ACTIVE');

-- ─────────────────────────────────────────────────────────────
-- SAMPLE ORDERS  (₹ pricing)
-- ─────────────────────────────────────────────────────────────

-- Order 1: Arjun buys laptop + mouse
INSERT INTO orders (customer_id, subtotal, tax, discount, total_amount, status, payment_method)
VALUES (1, 67294.00, 5383.52, 0.00, 72677.52, 'DELIVERED', 'card');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 58999.00),   -- Lenovo IdeaPad
(1, 8, 1, 8295.00);    -- Logitech MX Master 3S

INSERT INTO invoices (invoice_number, order_id, issue_date, due_date, status, notes)
VALUES ('INV-2024-0001', 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'PAID',
        'Thank you for your business. All prices include GST.');

-- Order 2: Priya buys headphones + speaker
INSERT INTO orders (customer_id, subtotal, tax, discount, total_amount, status, payment_method)
VALUES (2, 28789.00, 2303.12, 500.00, 30592.12, 'DELIVERED', 'upi');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(2, 6, 1, 26990.00),   -- Sony WH-1000XM5
(2, 7, 1, 13999.00);   -- JBL Charge 5

INSERT INTO invoices (invoice_number, order_id, issue_date, due_date, status, notes)
VALUES ('INV-2024-0002', 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'PAID',
        'Loyalty discount applied: ₹500');

-- Order 3: Ravi buys Canon DSLR (canceled)
INSERT INTO orders (customer_id, subtotal, tax, discount, total_amount, status, payment_method)
VALUES (3, 34999.00, 2799.92, 0.00, 37798.92, 'CANCELED', 'card');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(3, 12, 1, 34999.00);  -- Canon EOS 1500D

INSERT INTO invoices (invoice_number, order_id, issue_date, due_date, status, notes)
VALUES ('INV-2024-0003', 3, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'UNPAID',
        'Order canceled by customer.');

-- Order 4: Sneha buys iPhone + accessories
INSERT INTO orders (customer_id, subtotal, tax, discount, total_amount, status, payment_method)
VALUES (4, 90993.00, 7279.44, 2000.00, 96272.44, 'DELIVERED', 'netbanking');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(4, 17, 1, 79900.00),  -- iPhone 15
(4, 8,  1, 8295.00),   -- MX Master 3S
(4, 11, 1, 1999.00),   -- USB-C Hub
(4, 10, 1, 799.00);    -- Mouse Pad

INSERT INTO invoices (invoice_number, order_id, issue_date, due_date, status, notes)
VALUES ('INV-2024-0004', 4, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'PAID',
        'Enterprise client — ₹2000 discount applied.');

-- Order 5: Vikram buys keyboard + books
INSERT INTO orders (customer_id, subtotal, tax, discount, total_amount, status, payment_method)
VALUES (5, 10547.00, 843.76, 0.00, 11390.76, 'PROCESSING', 'upi');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(5, 9,  1, 7999.00),   -- Keychron K2
(5, 22, 2, 699.00),    -- Clean Code ×2
(5, 23, 1, 849.00);    -- System Design Interview

INSERT INTO invoices (invoice_number, order_id, issue_date, due_date, status, notes)
VALUES ('INV-2024-0005', 5, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'UNPAID',
        'Payment pending via UPI.');

-- Order 6: Anjali buys fitness products
INSERT INTO orders (customer_id, subtotal, tax, discount, total_amount, status, payment_method)
VALUES (6, 4498.00, 359.84, 0.00, 4857.84, 'DELIVERED', 'cash');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(6, 20, 1, 3499.00),   -- Boldfit Dumbbell Set
(6, 21, 1, 999.00);    -- Yoga Mat

INSERT INTO invoices (invoice_number, order_id, issue_date, due_date, status, notes)
VALUES ('INV-2024-0006', 6, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'PAID',
        'Cash payment received at store.');

-- ─────────────────────────────────────────────────────────────
-- Verification queries (run manually to confirm)
-- ─────────────────────────────────────────────────────────────
-- SELECT COUNT(*) FROM users;       -- 3
-- SELECT COUNT(*) FROM categories;  -- 10
-- SELECT COUNT(*) FROM products;    -- 23
-- SELECT COUNT(*) FROM customers;   -- 8
-- SELECT COUNT(*) FROM orders;      -- 6
-- SELECT COUNT(*) FROM invoices;    -- 6

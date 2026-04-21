-- ============================================================
--  Ledger Retail — Useful Admin & Reporting Queries
-- ============================================================

USE ledger_retail;

-- ─── Dashboard KPIs ─────────────────────────────────────────

-- Total revenue (excluding canceled orders)
SELECT CONCAT('₹', FORMAT(SUM(total_amount), 2)) AS total_revenue
FROM orders WHERE status != 'CANCELED';

-- Revenue this month
SELECT CONCAT('₹', FORMAT(SUM(total_amount), 2)) AS this_month_revenue
FROM orders
WHERE MONTH(created_at) = MONTH(CURDATE())
  AND YEAR(created_at)  = YEAR(CURDATE())
  AND status != 'CANCELED';

-- Orders by status
SELECT status, COUNT(*) AS count,
       CONCAT('₹', FORMAT(SUM(total_amount), 2)) AS total
FROM orders
GROUP BY status;

-- ─── Product Queries ────────────────────────────────────────

-- All low stock products (< 10 units)
SELECT p.name, p.sku, p.stock_quantity,
       c.name AS category,
       CONCAT('₹', FORMAT(p.price, 2)) AS price
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.stock_quantity < 10
ORDER BY p.stock_quantity;

-- Top 5 best-selling products by revenue
SELECT
    p.name,
    p.sku,
    SUM(oi.quantity)  AS units_sold,
    CONCAT('₹', FORMAT(SUM(oi.quantity * oi.unit_price), 2)) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o   ON oi.order_id   = o.id
WHERE o.status != 'CANCELED'
GROUP BY p.id, p.name, p.sku
ORDER BY SUM(oi.quantity * oi.unit_price) DESC
LIMIT 5;

-- Products never ordered
SELECT p.name, p.sku, p.stock_quantity
FROM products p
WHERE p.id NOT IN (SELECT DISTINCT product_id FROM order_items);

-- ─── Customer Queries ───────────────────────────────────────

-- Top customers by total spend
SELECT
    c.name,
    c.email,
    COUNT(o.id) AS total_orders,
    CONCAT('₹', FORMAT(SUM(o.total_amount), 2)) AS lifetime_value
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status != 'CANCELED'
GROUP BY c.id, c.name, c.email
ORDER BY SUM(o.total_amount) DESC
LIMIT 10;

-- Customers with no orders
SELECT c.name, c.email, c.phone, c.status
FROM customers c
WHERE c.id NOT IN (SELECT DISTINCT customer_id FROM orders WHERE customer_id IS NOT NULL);

-- ─── Order & Invoice Queries ────────────────────────────────

-- Full order details with customer + items
SELECT
    CONCAT('ORD-', LPAD(o.id, 4, '0'))      AS order_ref,
    c.name                                   AS customer,
    p.name                                   AS product,
    oi.quantity,
    CONCAT('₹', FORMAT(oi.unit_price, 2))   AS unit_price,
    CONCAT('₹', FORMAT(oi.quantity * oi.unit_price, 2)) AS line_total,
    CONCAT('₹', FORMAT(o.total_amount, 2))  AS order_total,
    o.status,
    o.payment_method,
    DATE_FORMAT(o.created_at, '%d %b %Y %H:%i') AS ordered_at
FROM orders o
LEFT JOIN customers   c  ON o.customer_id  = c.id
JOIN      order_items oi ON oi.order_id    = o.id
JOIN      products    p  ON oi.product_id  = p.id
ORDER BY o.created_at DESC;

-- Unpaid invoices
SELECT
    i.invoice_number,
    c.name        AS customer,
    CONCAT('₹', FORMAT(o.total_amount, 2)) AS amount,
    i.issue_date,
    i.due_date,
    DATEDIFF(CURDATE(), i.due_date) AS days_overdue
FROM invoices i
JOIN orders   o ON i.order_id   = o.id
LEFT JOIN customers c ON o.customer_id = c.id
WHERE i.status IN ('UNPAID', 'OVERDUE')
ORDER BY i.due_date;

-- ─── Monthly Revenue Report ─────────────────────────────────
SELECT
    DATE_FORMAT(o.created_at, '%M %Y')       AS month,
    COUNT(o.id)                               AS orders,
    CONCAT('₹', FORMAT(SUM(o.total_amount), 2)) AS revenue,
    CONCAT('₹', FORMAT(AVG(o.total_amount), 2)) AS avg_order_value
FROM orders o
WHERE o.status != 'CANCELED'
GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
ORDER BY MIN(o.created_at) DESC;

-- ─── Reset / Maintenance ────────────────────────────────────
-- (Use carefully — for dev/testing only)

-- Clear all orders and invoices (keep products + customers)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE invoices;
-- TRUNCATE TABLE order_items;
-- TRUNCATE TABLE orders;
-- SET FOREIGN_KEY_CHECKS = 1;

-- Full reset (wipe everything except structure)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE invoices;
-- TRUNCATE TABLE order_items;
-- TRUNCATE TABLE orders;
-- TRUNCATE TABLE customers;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

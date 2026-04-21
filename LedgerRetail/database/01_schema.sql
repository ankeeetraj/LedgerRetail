-- ============================================================
--  Ledger Retail — MySQL Schema
--  Run this ONCE to create the full database structure.
--  Database: ledger_retail
-- ============================================================

CREATE DATABASE IF NOT EXISTS ledger_retail
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ledger_retail;

-- ─────────────────────────────────────────────────────────────
-- 1. USERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL UNIQUE,
    password   VARCHAR(255)  NOT NULL,
    role       ENUM('ADMIN','USER','CASHIER') NOT NULL DEFAULT 'CASHIER',
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- 2. CATEGORIES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- 3. PRODUCTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    name             VARCHAR(200)   NOT NULL,
    description      TEXT,
    price            DECIMAL(12,2)  NOT NULL,
    stock_quantity   INT            NOT NULL DEFAULT 0,
    sku              VARCHAR(100)   UNIQUE,
    category_id      BIGINT,
    created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id)
        REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_products_sku          (sku),
    INDEX idx_products_category     (category_id),
    INDEX idx_products_stock        (stock_quantity),
    FULLTEXT INDEX ft_products_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- 4. CUSTOMERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE,
    phone      VARCHAR(20),
    address    VARCHAR(300),
    company    VARCHAR(150),
    status     ENUM('ACTIVE','ENTERPRISE','DELINQUENT','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_customers_email  (email),
    INDEX idx_customers_phone  (phone),
    INDEX idx_customers_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- 5. ORDERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    customer_id    BIGINT,
    subtotal       DECIMAL(12,2) NOT NULL,
    tax            DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount   DECIMAL(12,2) NOT NULL,
    status         ENUM('PROCESSING','DELIVERED','CANCELED','PENDING') NOT NULL DEFAULT 'PROCESSING',
    payment_method VARCHAR(20),
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id)
        REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_orders_customer   (customer_id),
    INDEX idx_orders_status     (status),
    INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- 6. ORDER ITEMS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    order_id    BIGINT        NOT NULL,
    product_id  BIGINT        NOT NULL,
    quantity    INT           NOT NULL,
    unit_price  DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order   (order_id),
    INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- 7. INVOICES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    invoice_number VARCHAR(50)  NOT NULL UNIQUE,
    order_id       BIGINT       NOT NULL UNIQUE,
    issue_date     DATE         NOT NULL,
    due_date       DATE,
    status         ENUM('PAID','UNPAID','OVERDUE','DRAFT') NOT NULL DEFAULT 'PAID',
    notes          TEXT,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_invoice_order FOREIGN KEY (order_id)
        REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_invoices_number   (invoice_number),
    INDEX idx_invoices_status   (status),
    INDEX idx_invoices_order    (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- USEFUL VIEWS
-- ─────────────────────────────────────────────────────────────

-- Order summary view (joins customer + order)
CREATE OR REPLACE VIEW v_order_summary AS
SELECT
    o.id                                    AS order_id,
    CONCAT('ORD-', LPAD(o.id,4,'0'))        AS order_ref,
    c.name                                  AS customer_name,
    c.email                                 AS customer_email,
    o.total_amount,
    o.status,
    o.payment_method,
    o.created_at
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;

-- Low stock view
CREATE OR REPLACE VIEW v_low_stock AS
SELECT
    p.id, p.name, p.sku,
    p.stock_quantity,
    cat.name AS category,
    p.price
FROM products p
LEFT JOIN categories cat ON p.category_id = cat.id
WHERE p.stock_quantity < 10
ORDER BY p.stock_quantity ASC;

-- Revenue by month view
CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*)                          AS total_orders,
    SUM(total_amount)                 AS revenue,
    SUM(discount)                     AS total_discounts
FROM orders
WHERE status != 'CANCELED'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

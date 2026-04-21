-- ============================================================
--  Ledger Retail — Drop All Tables (Full Reset)
--  Run this if you want to start fresh.
--  Then re-run 01_schema.sql + 02_seed_data.sql
-- ============================================================

USE ledger_retail;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

DROP VIEW IF EXISTS v_order_summary;
DROP VIEW IF EXISTS v_low_stock;
DROP VIEW IF EXISTS v_monthly_revenue;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'All tables dropped. Re-run 01_schema.sql and 02_seed_data.sql' AS status;

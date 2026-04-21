# Ledger Retail — Complete Full Stack Project

## 📁 EXACT FOLDER STRUCTURE FOR YOUR IDE

```
LedgerRetail/                          ← Root project folder
│
├── docker-compose.yml                 ← Start entire stack with 1 command
│
├── frontend/                          ← React + Vite project
│   ├── .env                           ← VITE_API_URL=http://localhost:8080/api
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── main.jsx                   ← Entry point
│       ├── App.jsx                    ← All routes
│       ├── index.css                  ← Tailwind + global styles
│       ├── components/
│       │   ├── Layout.jsx             ← Sidebar + Navbar wrapper
│       │   ├── Sidebar.jsx            ← Left nav (role-aware)
│       │   ├── Navbar.jsx             ← Top bar
│       │   └── PrivateRoute.jsx       ← Auth + role guard
│       ├── context/
│       │   └── AuthContext.jsx        ← JWT + user state
│       ├── pages/
│       │   ├── Login.jsx              ← /login
│       │   ├── Dashboard.jsx          ← /dashboard  ← KPIs from API
│       │   ├── Products.jsx           ← /products   ← CRUD + pagination
│       │   ├── Customers.jsx          ← /customers  ← CRUD + pagination
│       │   ├── NewBill.jsx            ← /new-bill   ← real cart + order API
│       │   ├── OrderHistory.jsx       ← /order-history ← paginated + filters
│       │   ├── Invoice.jsx            ← /invoices   ← CGST+SGST breakdown
│       │   ├── Settings.jsx           ← /settings
│       │   └── UserManagement.jsx     ← /users (Admin only)
│       └── services/
│           ├── api.js                 ← Axios instance + JWT interceptor
│           ├── authService.js         ← Login/logout
│           ├── productService.js      ← Products CRUD
│           ├── customerService.js     ← Customers CRUD
│           ├── orderService.js        ← Orders + invoice + dashboard stats
│           └── userService.js         ← User management
│
├── backend/                           ← Spring Boot project
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/
│       │   ├── resources/
│       │   │   └── application.properties
│       │   └── java/com/ledgerretail/
│       │       ├── RetailBackendApplication.java
│       │       ├── config/
│       │       │   ├── SecurityConfig.java
│       │       │   ├── OpenApiConfig.java
│       │       │   └── DataInitializer.java
│       │       ├── controller/
│       │       │   ├── AuthController.java
│       │       │   ├── ProductController.java
│       │       │   ├── CustomerController.java
│       │       │   ├── OrderController.java
│       │       │   ├── InvoiceController.java
│       │       │   ├── CategoryController.java
│       │       │   └── UserController.java        ← NEW
│       │       ├── dto/
│       │       │   ├── request/
│       │       │   │   ├── LoginRequest.java
│       │       │   │   ├── RegisterRequest.java
│       │       │   │   ├── ProductRequest.java
│       │       │   │   ├── CustomerRequest.java
│       │       │   │   └── OrderRequest.java
│       │       │   └── response/
│       │       │       ├── ApiResponse.java
│       │       │       ├── AuthResponse.java
│       │       │       ├── ProductResponse.java
│       │       │       ├── CustomerResponse.java
│       │       │       ├── OrderResponse.java
│       │       │       ├── InvoiceResponse.java   ← CGST+SGST added
│       │       │       └── DashboardStatsResponse.java
│       │       ├── entity/
│       │       │   ├── User.java
│       │       │   ├── Product.java
│       │       │   ├── Category.java
│       │       │   ├── Customer.java
│       │       │   ├── Order.java
│       │       │   ├── OrderItem.java
│       │       │   └── Invoice.java
│       │       ├── exception/
│       │       │   ├── GlobalExceptionHandler.java
│       │       │   ├── ResourceNotFoundException.java
│       │       │   ├── DuplicateResourceException.java
│       │       │   └── InsufficientStockException.java
│       │       ├── repository/
│       │       │   ├── UserRepository.java
│       │       │   ├── ProductRepository.java
│       │       │   ├── CategoryRepository.java
│       │       │   ├── CustomerRepository.java
│       │       │   ├── OrderRepository.java
│       │       │   └── InvoiceRepository.java
│       │       ├── security/
│       │       │   ├── JwtUtil.java
│       │       │   ├── JwtAuthFilter.java
│       │       │   └── UserDetailsServiceImpl.java
│       │       └── service/impl/
│       │           ├── AuthService.java
│       │           ├── ProductService.java
│       │           ├── CustomerService.java
│       │           ├── OrderService.java          ← 18% GST, stock deduction
│       │           ├── InvoiceService.java
│       │           └── UserService.java           ← NEW
│       └── test/
│           ├── resources/
│           │   └── application-test.properties    ← H2 in-memory
│           └── java/com/ledgerretail/
│               ├── service/ProductServiceTest.java
│               └── controller/AuthControllerTest.java
│
└── database/                          ← MySQL SQL files
    ├── 01_schema.sql                  ← Tables, indexes, views
    ├── 02_seed_data.sql               ← Indian products (₹ INR), customers
    ├── 03_queries.sql                 ← Admin/reporting queries
    └── 04_reset.sql                   ← Drop all (dev use)
```

---

## 🚀 HOW TO RUN

### Option A — Docker (Easiest, 1 command)
```bash
cd LedgerRetail
docker-compose up --build
```
- Frontend → http://localhost
- Backend  → http://localhost:8080
- Swagger  → http://localhost:8080/swagger-ui.html

### Option B — Manual (Dev mode)

**Step 1 — Database**
```bash
mysql -u root -p < database/01_schema.sql
mysql -u root -p < database/02_seed_data.sql
```

**Step 2 — Backend**
```bash
cd backend
# Edit src/main/resources/application.properties → set your MySQL password
mvn spring-boot:run
# Starts on http://localhost:8080
```

**Step 3 — Frontend**
```bash
cd frontend
npm install
npm run dev
# Starts on http://localhost:5173
```

---

## 🔐 Login Credentials

| Role    | Email                 | Password  |
|---------|-----------------------|-----------|
| ADMIN   | admin@ledger.com      | admin123  |
| CASHIER | cashier@ledger.com    | cash123   |

---

## ✅ EVERYTHING THAT IS BUILT

| Feature                    | Status |
|----------------------------|--------|
| Login with JWT             | ✅ Done |
| Role-based access (Admin/Cashier) | ✅ Done |
| Dashboard with live KPIs   | ✅ Done |
| Products CRUD + pagination | ✅ Done |
| Customers CRUD + pagination| ✅ Done |
| New Bill with real cart    | ✅ Done |
| Stock deduction on order   | ✅ Done |
| GST 18% (CGST 9% + SGST 9%) | ✅ Done |
| Auto invoice generation    | ✅ Done |
| Order History with filters + pagination | ✅ Done |
| Invoice with CGST+SGST breakdown | ✅ Done |
| Print invoice              | ✅ Done |
| Settings page              | ✅ Done |
| User Management (Admin)    | ✅ Done |
| All prices in ₹ INR        | ✅ Done |
| Indian customers/products seeded | ✅ Done |
| Docker deployment          | ✅ Done |
| Swagger API docs           | ✅ Done |
| Spring Security + JWT      | ✅ Done |
| Global exception handling  | ✅ Done |
| Unit tests (Mockito + MockMvc) | ✅ Done |

---

## 📦 API Quick Reference

| Method | URL | Access |
|--------|-----|--------|
| POST | /api/auth/login | Public |
| GET | /api/auth/me | JWT |
| GET/POST | /api/products | JWT |
| PUT/DELETE | /api/products/{id} | ADMIN |
| GET/POST | /api/customers | JWT |
| GET/POST | /api/orders | JWT |
| GET | /api/orders/stats/dashboard | JWT |
| GET | /api/orders/{id}/invoice | JWT |
| GET | /api/invoices | JWT |
| GET | /api/categories | JWT |
| GET/POST | /api/users | ADMIN |
| DELETE | /api/users/{id} | ADMIN |

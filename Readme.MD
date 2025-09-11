# Multi-Tenant Shopify Analytics Dashboard

## 📌 Introduction

The **Multi-Tenant Shopify Analytics Dashboard** is a full-stack application designed to provide **actionable insights** for Shopify merchants.
It enables tenants (store owners) to sign up, connect their Shopify stores, and view dashboards with metrics like revenue trends, top customers, and top-selling products.

---

## 🏗️ Architecture

The system is built using:

* **Backend:** Node.js, Express, Prisma ORM, MySQL
* **Frontend:** React (Vite), TailwindCSS, Recharts
* **Authentication:** JWT-based multi-tenant support
* **Integration:** Shopify REST API for Customers, Products, Orders, and Line Items

```mermaid
graph TD
  A[Shopify Store] -->|REST API| B["Backend (Express + Prisma)"]
  B --> C[(MySQL Database)]
  B --> D[Frontend React Dashboard]
  D -->|JWT Auth| B
```

---

## ✨ Features

* 🔑 **Multi-tenant authentication** (each tenant has isolated data)
* 🔄 **Shopify data sync**: customers, products, orders, and order items
* 📊 **Analytics dashboard** with:

  * Overview stats (customers, products, orders, revenue)
  * Revenue over time chart
  * Top 5 customers by spend
  * Top 5 products by sales
* 🎨 **Responsive UI** with TailwindCSS
* 📂 **Prisma ORM schema** with proper relations (Tenant, Store, Customer, Order, Product, OrderItem)

🖼️ *\[Insert dashboard screenshot here]*

---

## 🔑 Demo Credentials

For demo/testing, you can use:

```json
{
  "email": "ayush@example.com",
  "password": "123456"
}
```

---

## 🗄️ Data Models (Prisma Schema Snippet)

```prisma
model Tenant {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  stores    Store[]
  createdAt DateTime @default(now())
}

model Customer {
  id        Int      @id @default(autoincrement())
  shopifyId String   @unique
  name      String
  email     String?
  tenantId  Int
  orders    Order[]
  createdAt DateTime @default(now())
}

model Order {
  id         Int        @id @default(autoincrement())
  shopifyId  String     @unique
  totalPrice Float
  customerId Int?
  orderItems OrderItem[]
  createdAt  DateTime   @default(now())
}
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-repo/shopify-analytics-dashboard.git
cd shopify-analytics-dashboard
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Set up `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/shopifydb"
JWT_SECRET="your_jwt_secret"
SHOPIFY_API_KEY="your_api_key"
SHOPIFY_API_SECRET="your_api_secret"
SHOPIFY_STORE_DOMAIN="yourstore.myshopify.com"
```

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Start backend:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Usage

### Signup

```http
POST /auth/signup
{
  "name": "Tenant 1",
  "email": "ayush@example.com",
  "password": "123456"
}
```

### Login

```http
POST /auth/login
{
  "email": "ayush@example.com",
  "password": "123456"
}
```

👉 Copy the returned JWT token into **localStorage** for frontend access.

### Sync Shopify Data

```http
POST /shopify/sync
Authorization: Bearer <token>
```

### Get Insights

* **Overview:** `/insights/overview`
* **Revenue Over Time:** `/insights/revenue?start=2025-01-01&end=2025-09-01`
* **Top Customers:** `/insights/top-customers`
* **Top Products:** `/insights/top-products`

---

## ⚠️ Limitations

* Shopify API pagination partially handled (may need batching for large stores).
* Guest checkouts (orders without a customer) are not yet attributed in analytics.
* No webhook-based real-time sync (currently manual sync only).

---

## 🚀 Future Enhancements

* ⏱️ Automatic daily sync with Shopify webhooks
* 📦 Additional insights like abandoned carts, checkout funnels
* 🔒 Role-based access control for tenants
* 🌙 Dark mode for dashboard

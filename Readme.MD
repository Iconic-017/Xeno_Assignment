# 🛍️ Multi-Tenant Shopify Analytics Dashboard

## 📌 Introduction

The **Multi-Tenant Shopify Analytics Dashboard** is a **full-stack analytics solution** for Shopify merchants.
It ingests **customers, products, orders, and order items** from Shopify into a relational database, supports **multi-tenancy**, and displays insights such as:

* 📊 Revenue trends
* 🏆 Top customers
* 🛒 Top-selling products
* 👥 Customer base growth

Merchants can sign up, connect their Shopify store, and access insights in a **modern React dashboard**.

---

## 🏗️ Architecture

**Tech Stack**:

* **Backend**: Node.js, Express, Prisma ORM, MySQL
* **Frontend**: React (Vite), TailwindCSS, Recharts
* **Authentication**: JWT-based multi-tenant system
* **Integration**: Shopify REST APIs

```mermaid
flowchart LR
  %% Shopify API
  subgraph Shopify
    A[Shopify Store]
  end

  %% Backend Services
  subgraph Backend["Express + Prisma API"]
    B1[Auth Service]
    B2[Shopify Sync Service]
    B3[Insights API]
  end

  %% Database Schema
  subgraph Database["MySQL (Prisma Models)"]
    D1[(Tenant)]
    D2[(Store)]
    D3[(Customer)]
    D4[(Order)]
    D5[(Product)]
    D6[(OrderItem)]
  end

  %% Frontend
  subgraph Frontend["React + Tailwind Dashboard"]
    C[Analytics Dashboard]
  end

  %% External Flow
  A -- REST API --> B2
  B1 & B2 & B3 --> Database
  C <--> Backend

  %% Internal DB Relations
  D1 --> D2  
  D2 --> D3  
  D2 --> D4  
  D2 --> D5  
  D3 --> D4  
  D4 --> D6  
  D5 --> D6   

```

🖼️ *\[Insert dashboard screenshot here]*

---

## ✨ Features

✅ **Multi-tenant support** → Each store’s data is isolated by tenant ID
✅ **Shopify Data Sync** → Customers, Products, Orders, Order Items
✅ **Analytics Dashboard** →

* Overview metrics (revenue, products, customers, orders)
* Revenue over time chart
* Top 5 customers by spend
* Top 5 products by sales
  ✅ **Responsive UI** → TailwindCSS + Recharts
  ✅ **Prisma Schema** → Proper relational models

---

## 🔑 Demo Credentials

For testing/demo use:

```json
{
  "email": "ayush@example.com",
  "password": "123456"
}
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Iconic-017/Xeno_Assignment.git
cd shopify-analytics-dashboard
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Configure `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/shopifydb"
JWT_SECRET="your_jwt_secret"
SHOPIFY_ACCESS_TOKEN="your_access_token"
SHOPIFY_STORE_URL="yourstore.myshopify.com"
```

Run Prisma migration:

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

## 📊 API Endpoints

### Auth

* `POST /auth/signup` → Create tenant account
* `POST /auth/login` → Login, returns JWT

### Shopify Sync

* `POST /shopify/sync` → Sync store data (customers, products, orders)

### Insights

* `GET /insights/overview` → Overview stats
* `GET /insights/revenue?start=YYYY-MM-DD&end=YYYY-MM-DD` → Revenue chart
* `GET /insights/top-customers` → Top 5 customers
* `GET /insights/top-products` → Top 5 products

---

## 🗄️ Database Schema

```prisma
model Tenant {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  stores    Store[]
  createdAt DateTime @default(now())
}

model Store {
  id        Int      @id @default(autoincrement())
  name      String
  tenantId  Int
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  customers Customer[]
  products  Product[]
  orders    Order[]
}

model Customer {
  id        Int      @id @default(autoincrement())
  shopifyId String   @unique
  email     String?
  name      String?
  orders    Order[]
  storeId   Int
  tenantId  Int
}

model Order {
  id         Int        @id @default(autoincrement())
  shopifyId  String     @unique
  amount     Float
  createdAt  DateTime   @default(now())
  customerId Int?
  customer   Customer?  @relation(fields: [customerId], references: [id])
  storeId    Int
  tenantId   Int
  items      OrderItem[]
}

model Product {
  id        Int        @id @default(autoincrement())
  shopifyId String     @unique
  title     String
  price     Float
  storeId   Int
  tenantId  Int
  orderItems OrderItem[]
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Float
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
```

---

## ⚠️ Known Limitations

* Guest checkouts (orders without customers) are not shown in top customers.
* Sync is **manual**; no real-time Shopify webhooks.
* Pagination is minimal → large stores may need cursor-based sync.
* Passwords stored in plain text for demo (⚠️ use bcrypt/argon2 in prod).
* Deployment assumes managed MySQL (Railway/PlanetScale).

---

## 🚀 Next Steps (Future Enhancements)

* ⏱️ Real-time sync with Shopify webhooks
* 📦 Extra insights (abandoned carts, checkout funnels)
* 🔒 Role-based tenant access
* 🌙 Dark mode UI

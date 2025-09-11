// routes/shopify.routes.js
import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/sync", authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;

    // Shopify API client
    const shopifyClient = axios.create({
      baseURL: `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-01`,
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    // ✅ Ensure Store exists for this tenant
    let store = await prisma.store.findFirst({ where: { tenantId } });
    if (!store) {
      store = await prisma.store.create({
        data: {
          name: process.env.SHOPIFY_STORE_URL,
          tenantId,
        },
      });
    }

    // ✅ Sync Customers
    const customersRes = await shopifyClient.get("/customers.json");
    for (const c of customersRes.data.customers) {
      await prisma.customer.upsert({
        where: { shopifyId: String(c.id) },
        update: {
          name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
          email: c.email,
          phone: c.phone,
          city: c.default_address?.city || null,
          state: c.default_address?.province || null,
          country: c.default_address?.country || null,
          zip: c.default_address?.zip || null,
          storeId: store.id,
          tenantId,
        },
        create: {
          shopifyId: String(c.id),
          name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
          email: c.email,
          phone: c.phone,
          city: c.default_address?.city || null,
          state: c.default_address?.province || null,
          country: c.default_address?.country || null,
          zip: c.default_address?.zip || null,
          storeId: store.id,
          tenantId,
        },
      });
    }

    // ✅ Sync Products
    const productsRes = await shopifyClient.get("/products.json");
    for (const p of productsRes.data.products) {
      await prisma.product.upsert({
        where: { shopifyId: String(p.id) },
        update: {
          title: p.title,
          price: parseFloat(p.variants[0]?.price || 0),
          storeId: store.id,
          tenantId,
        },
        create: {
          shopifyId: String(p.id),
          title: p.title,
          price: parseFloat(p.variants[0]?.price || 0),
          storeId: store.id,
          tenantId,
        },
      });
    }

    // ✅ Sync Orders + Line Items 
const ordersRes = await shopifyClient.get("/orders.json?status=any");
for (const o of ordersRes.data.orders) {
  // find related customer (if exists)
  const customer = o.customer
    ? await prisma.customer.findUnique({
        where: { shopifyId: String(o.customer.id) },
      })
    : null;

  const savedOrder = await prisma.order.upsert({
    where: { shopifyId: String(o.id) },
    update: {
      amount: o.total_price ? parseFloat(o.total_price) : 0,
      createdAt: new Date(o.created_at),
      customerId: customer ? customer.id : null,  // ✅ link to customer
      storeId: store.id,
      tenantId,
    },
    create: {
      shopifyId: String(o.id),
      amount: o.total_price ? parseFloat(o.total_price) : 0,
      createdAt: new Date(o.created_at),
      tenantId,
      storeId: store.id,
      customerId: customer ? customer.id : null,  // ✅ link to customer
    },
  });

  // ✅ Sync line items
  for (const item of o.line_items) {
    const product = await prisma.product.findUnique({
      where: { shopifyId: String(item.product_id) },
    });

    if (product) {
      await prisma.orderItem.upsert({
        where: {
          orderId_productId: {
            orderId: savedOrder.id,  // ✅ use savedOrder.id
            productId: product.id,
          },
        },
        update: {
          quantity: item.quantity,
          price: parseFloat(item.price),
        },
        create: {
          orderId: savedOrder.id,   // ✅ use savedOrder.id
          productId: product.id,
          quantity: item.quantity,
          price: parseFloat(item.price),
        },
      });
    }
  }
}


    res.json({
      message:
        "✅ Synced customers, products, orders, and order items successfully",
    });
  } catch (err) {
    console.error("❌ Sync error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to sync data" });
  }
});

export default router;

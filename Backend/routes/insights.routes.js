import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

const isDev = process.env.NODE_ENV !== "production";

//1. Overview API
router.get("/overview", authMiddleware, async (req, res) => {
    try {
      const tenantId = req.tenantId;

      const [totalCustomers, totalProducts, totalOrders, revenueAgg] =
        await Promise.all([
          prisma.customer.count({ where: { tenantId } }),
          prisma.product.count({ where: { tenantId } }),
          prisma.order.count({ where: { tenantId } }),
          prisma.order.aggregate({
            where: { tenantId },
            _sum: { amount: true }
          })
        ]);

      const totalRevenue = revenueAgg._sum?.amount ?? 0;

      res.json({
        totalCustomers,
        totalOrders,
        totalRevenue,
        totalProducts
      });
    } catch (err) {
      console.error("Insights > overview error:", err);
      res
        .status(500)
        .json({ error: isDev ? err.message : "Failed to load overview" });
    }
});

//2. Revenue Over Time
router.get("/revenue", authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { start, end } = req.query;

    const whereClause = { tenantId };
    if (start || end) {
      whereClause.createdAt = {};
      if (start) whereClause.createdAt.gte = new Date(start);
      if (end) whereClause.createdAt.lte = new Date(end);
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      select: { createdAt: true, amount: true }
    });

    const revenueByDate = {};
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split("T")[0];
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + order.amount;
    }

    const result = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue
    }));

    res.json(result);
  } catch (err) {
    console.error("Insights > revenue error:", err);
    res
      .status(500)
      .json({ error: isDev ? err.message : "Failed to load revenue data" });
  }
});

//3. Top Customers
router.get("/top-customers", authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const customers = await prisma.customer.findMany({
      where: { tenantId },
      include: { orders: true }
    });

    const result = customers
      .map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        totalSpent: c.orders.reduce((sum, o) => sum + o.amount, 0)
      }))
      .filter((c) => c.totalSpent > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    res.json(result);
  } catch (err) {
    console.error("Insights > top-customers error:", err);
    res
      .status(500)
      .json({ error: isDev ? err.message : "Failed to load top customers" });
  }
});

//4. Top Products
router.get("/top-products", authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const products = await prisma.product.findMany({
      where: { tenantId },
      include: { orderItems: true }
    });

    const result = products
      .map((p) => {
        const totalSold = p.orderItems.reduce((sum, oi) => sum + oi.quantity, 0);
        const totalRevenue = p.orderItems.reduce(
          (sum, oi) => sum + oi.quantity * oi.price,
          0
        );
        return {
          id: p.id,
          title: p.title,
          price: p.price,
          sold: totalSold,
          revenue: totalRevenue
        };
      })
      .filter((p) => p.sold > 0)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    res.json(result);
  } catch (err) {
    console.error("Insights > top-products error:", err);
    res
      .status(500)
      .json({ error: isDev ? err.message : "Failed to load top products" });
  }
});

export default router;


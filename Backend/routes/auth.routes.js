import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Tenant Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const tenant = await prisma.tenant.create({
      data: {
        name,
        email, // just storing email here for now
        password: hashedPassword
      }
    });

    res.status(201).json({ message: "Tenant registered", tenant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tenant Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const tenant = await prisma.tenant.findUnique({
      where: { email }
    });

    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { tenantId: tenant.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

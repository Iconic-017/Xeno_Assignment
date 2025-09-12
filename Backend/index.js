import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes.js"
import shopifyRoutes from "./routes/shopify.routes.js";
import insightsRoutes from "./routes/insights.routes.js";

const FrontedURL = "https://xeno-assignment-two.vercel.app";


const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: FrontedURL,
  credentials:true,
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/shopify", shopifyRoutes);
app.use("/insights", insightsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

app.get("/tenants", async (req, res) => {
  const tenants = await prisma.tenant.findMany();
  res.json(tenants);
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

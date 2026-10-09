import "dotenv/config";
import "./config/env.js";
import { startAutoSync } from "./services/autoSync.js";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import BlogPost from "./models/BlogPost.js";
import Product from "./models/Product.js";
import CustomBraceletProduct from "./models/CustomBraceletProduct.js";
import { syncAllPosts } from "./services/blogSync.js";
import { syncAllProducts } from "./services/productSync.js";
import { syncAllCustomProducts } from "./services/customProductSync.js";
import blogRoutes from "./routes/blogRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import customBraceletRoutes from "./routes/customBraceletRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
// import { razorpayWebhook } from "./controllers/paymentWebhookController.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/health", (_req, res) => { res.json({ ok: true, message: "API is running", }); });

app.use(
  "/api/webhooks/sanity",
  express.raw({
    type: "*/*",
    limit: "2mb",
  }),
  webhookRoutes
);

app.use(express.json());
// Browser hamesha revalidate kare (ETag se 304 milta hai, to fast bhi rehta hai)
app.use("/api", (req, res, next) => {
  if (req.method === "GET") res.set("Cache-Control", "no-cache");
  next();
});

// app.post("/api/webhooks/razorpay", express.raw({ type: "application/json", limit: "1mb" }), razorpayWebhook);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/blog", blogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/custom-bracelet", customBraceletRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, _next) => {
  console.error("❌ Express error:", err);

  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

async function initialSync(label, Model, syncFn) {
  const count = await Model.estimatedDocumentCount();

  if (count === 0) {
    try {
      console.log(`🔄 ${label} initial sync started...`);

      const result = await syncFn();

      console.log(`✅ ${label} initial sync:`, result);
    } catch (error) {
      console.error(
        `❌ ${label} initial sync failed:`,
        error.message
      );
    }
  } else {
    console.log(
      `ℹ️ ${label}: ${count} documents already exist. Initial sync skipped.`
    );
  }
}

(async () => {
  try {
    await connectDB();

    await initialSync("Blog", BlogPost, syncAllPosts);
    await initialSync("Product", Product, syncAllProducts);
    await initialSync(
      "Custom bracelet",
      CustomBraceletProduct,
      syncAllCustomProducts
    );

    app.listen(PORT, () => {
        console.log(`🚀 API running on http://localhost:${PORT}`);
        startAutoSync();

      console.log(
        `🔗 Sanity webhook endpoint: http://localhost:${PORT}/api/webhooks/sanity`
      );
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
})();

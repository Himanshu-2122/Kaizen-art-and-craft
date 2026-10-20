import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import mongoose from "mongoose";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import contactRoutes from "./routes/contact.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import otpRoutes from "./routes/otp.routes";
import { apiLimiter } from "./middleware/rateLimiter";

const app = express();

// Trust first proxy (Render, Railway, Nginx, Cloudflare) for accurate rate-limit IPs & secure cookies
app.set("trust proxy", 1);
app.disable("x-powered-by");

/* ---------- Security Headers ---------- */
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  next();
});

/* ---------- Middlewares ---------- */
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://www.kaizenartandcraft.in",
  "https://kaizenartandcraft.in",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api/", apiLimiter);

/* ---------- Static Files (with Cache Headers) ---------- */
app.use(
  "/api/v1/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: "7d",
    etag: true,
  })
);
app.use(
  "/images",
  express.static(path.join(__dirname, "../../frontend/public/images"), {
    maxAge: "7d",
    etag: true,
  })
);

/* ---------- Health Check ---------- */
app.get("/api/v1/health", (_req: Request, res: Response) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
  });
});

/* ---------- API Routes ---------- */
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1", contactRoutes);

/* ---------- 404 Handler ---------- */
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

/* ---------- Global Error Handler ---------- */
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  console.error("❌ Error:", err.message);
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";
  res.status(500).json({ message });
});

export default app;
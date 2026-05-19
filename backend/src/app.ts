// import express, { Request, Response, NextFunction } from "express";
// import cors from "cors";
// import path from "path";
// import dotenv from "dotenv";
// import productRoutes from "./routes/product.routes";
// import categoryRoutes from "./routes/category.routes";
// import authRoutes from "./routes/auth.routes";
// import orderRoutes from "./routes/order.routes";
// import contactRoutes from "./routes/contact.routes";
// import wishlistRoutes from "./routes/wishlist.routes";
// import otpRoutes from "./routes/otp.routes";
// import multer from "multer"; // Import multer

// dotenv.config();

// const app = express();

// /* ---------- Middlewares ---------- */
// app.use(cors({
//   origin: "*"
// }));
// app.use(express.json());

// /* ---------- Static Files ---------- */
// app.use("/api/v1/uploads", express.static(path.join(__dirname, "../uploads")));

// /* ---------- API Routes ---------- */
// app.use("/api/v1/products", productRoutes);
// app.use("/api/v1/categories", categoryRoutes);
// app.use("/api/v1/user", authRoutes);
// app.use("/api/v1/orders", orderRoutes);
// app.use("/api/v1/wishlist", wishlistRoutes);
// app.use("/api/v1/otp", otpRoutes);
// app.use("/api/v1", contactRoutes);

// // Multer Error Handling Middleware
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof multer.MulterError) {
//     // A Multer error occurred when uploading.
//     res.status(400).json({ message: err.message });
//   } else if (err) {
//     // An unknown error occurred when uploading.
//     res.status(500).json({ message: err.message });
//   } else {
//     next();
//   }
// });

// console.log("🔥 All routes registered");

// export default app;


import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import contactRoutes from "./routes/contact.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import otpRoutes from "./routes/otp.routes";

// ❌ dotenv yahan mat karo — server.ts mein already hai
const app = express();

/* ---------- Middlewares ---------- */
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (origin === allowedOrigin || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ form data ke liye

/* ---------- Static Files ---------- */
app.use(
  "/api/v1/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

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
// ✅ Yeh SABSE LAST mein hona chahiye
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

console.log("🔥 All routes registered");
export default app;
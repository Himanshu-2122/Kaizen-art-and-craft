import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import contactRoutes from "./routes/contact.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import otpRoutes from "./routes/otp.routes";
import multer from "multer"; // Import multer

dotenv.config();

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors({
  origin: "*"
}));
app.use(express.json());

/* ---------- Static Files ---------- */
app.use("/api/v1/uploads", express.static(path.join(__dirname, "../uploads")));

/* ---------- API Routes ---------- */
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1", contactRoutes);

// Multer Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    res.status(400).json({ message: err.message });
  } else if (err) {
    // An unknown error occurred when uploading.
    res.status(500).json({ message: err.message });
  } else {
    next();
  }
});

console.log("🔥 All routes registered");

export default app;



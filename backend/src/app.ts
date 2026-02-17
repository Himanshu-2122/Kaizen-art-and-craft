import express from "express";
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

dotenv.config();

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


/* ---------- CORS ---------- */
app.use(cors({
  origin: "*"
}));


/* ---------- Routes ---------- */
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);

/* ---------- auth ---------- */
app.use("/api/v1/user", authRoutes);

/*-----------------orders-----------------*/
 app.use("/api/v1/orders", orderRoutes);

/* ---------- contact ---------- */ 
app.use("/api/v1", contactRoutes);

/* ----------- wishlist ----------- */

app.use("/api/v1/wishlist", wishlistRoutes);

/* ---------- OTP auth ---------- */
app.use("/api/v1/otp", otpRoutes);
console.log("🔥 OTP ROUTE REGISTERED");



 




export default app;



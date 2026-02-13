import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import { protect } from "./middleware/auth.middleware";
import { checkout } from "./controllers/order.controller";
import contactRoutes from "./routes/contact.routes";

dotenv.config();

const app = express();

app.use(express.json());
// app.use("/images", express.static("public/images"));


/* ---------- CORS ---------- */
app.use(cors({
  origin: "*"
}));


/* ---------- Routes ---------- */
app.use("/api/v1/products", productRoutes);
app.use("/api/categories", categoryRoutes);

/* ---------- auth ---------- */
app.use("/api/v1/user", authRoutes);

/*-----------------orders-----------------*/
 app.use("/api/v1/orders", orderRoutes);

/* ---------- contact ---------- */ 
app.use("/api/v1", contactRoutes);


 




export default app;

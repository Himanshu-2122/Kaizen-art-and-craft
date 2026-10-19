import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import dbConnect from "./db";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await dbConnect();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
}

startServer();
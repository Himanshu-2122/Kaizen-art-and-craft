import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const dbConnect = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !uri) {
    throw new Error("CRITICAL: MONGODB_URI environment variable is required in production.");
  }

  if (uri) {
    try {
      console.log("🔌 Connecting to remote MongoDB Atlas...");
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: isProd ? 10000 : 5000,
        maxPoolSize: 20,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        family: 4,
      });
      console.log(`✅ MongoDB Connected — DB: ${conn.connection.name}`);
      return;
    } catch (err: any) {
      if (isProd) {
        console.error(`❌ Production MongoDB connection failed: ${err.message}`);
        throw err;
      }
      console.warn(`⚠️ Could not connect to remote MongoDB Atlas (${err.message}).`);
    }
  }

  console.log("🚀 Starting local MongoMemoryServer fallback...");
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri, { dbName: "kaizen" });
    console.log(`✅ MongoMemoryServer Connected — DB: ${conn.connection.name}`);

    // Automatically seed memory DB with sample data
    console.log("🌱 Seeding initial data into memory database...");
    const { seedData } = await import("../seed/seed");
    await seedData();
  } catch (memErr: any) {
    console.error("❌ Failed to start in-memory database:", memErr.message);
    throw memErr;
  }
};

export default dbConnect;
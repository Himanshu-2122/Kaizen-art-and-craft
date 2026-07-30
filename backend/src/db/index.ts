// import mongoose from "mongoose";

// const dbConnect = async (): Promise<void> => {
//   const uri = process.env.MONGODB_URI;

//   if (!uri) {
//     throw new Error("❌ MONGODB_URI is not defined in .env file");
//   }

//   const conn = await mongoose.connect(uri);
//   console.log(`✅ MongoDB Connected — DB: ${conn.connection.name}`);
// };

// export default dbConnect;

// db.ts
// import dotenv from "dotenv";
// dotenv.config(); // safety net

// import mongoose from "mongoose";

// const dbConnect = async (): Promise<void> => {
//   const uri = process.env.MONGODB_URI;
//   console.log("URI being used:", uri); // debug ke liye
  
//   if (!uri) {
//     throw new Error("MONGODB_URI is not defined in .env file");
//   }

//   const conn = await mongoose.connect(uri);
//   console.log(`✅ MongoDB Connected — DB: ${conn.connection.name}`);
// };

// export default dbConnect;


import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const dbConnect = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log("🔌 Connecting to remote MongoDB Atlas...");
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        family: 4,
      });
      console.log(`✅ MongoDB Connected — DB: ${conn.connection.name}`);
      return;
    } catch (err: any) {
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
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

dns.setDefaultResultOrder("ipv4first"); // ← yeh add karo

const dbConnect = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI!;

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    family: 4, // ← force IPv4
  });

  console.log(`✅ MongoDB Connected — DB: ${conn.connection.name}`);
};

export default dbConnect;
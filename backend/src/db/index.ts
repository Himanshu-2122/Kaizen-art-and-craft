import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI!
    );

    console.log(
      "✅ Connected to MongoDB --- Database:",
      connectionInstance.connection.name
    );
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

export default dbConnect;

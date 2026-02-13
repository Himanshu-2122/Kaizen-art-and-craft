import app from "./app";
import dotenv from "dotenv";
dotenv.config(

  {
    path: "./env",
  }
);
import dbConnect from "./db";

console.log("JWT_SECRET:", process.env.JWT_SECRET);




/* ---------- Connect to MongoDB ---------- */
dbConnect();



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// import app from "./app";
// import dotenv from "dotenv";
// import dbConnect from "./db";

// dotenv.config(); // ✅ correct

// dbConnect();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


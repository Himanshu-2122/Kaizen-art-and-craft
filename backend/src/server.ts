// // import app from "./app";
// // import dotenv from "dotenv";
// // dotenv.config(

// //   {
// //     path: "./env",
// //   }
// // );
// // import dbConnect from "./db";

// // console.log("JWT_SECRET:", process.env.JWT_SECRET);




// // /* ---------- Connect to MongoDB ---------- */
// // dbConnect();



// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on http://localhost:${PORT}`);
// // });

// // // import app from "./app";
// // // import dotenv from "dotenv";
// // // import dbConnect from "./db";

// // // dotenv.config(); // ✅ correct

// // // dbConnect();

// // // const PORT = process.env.PORT || 5000;

// // // app.listen(PORT, () => {
// // //   console.log(`🚀 Server running on port ${PORT}`);
// // // });

// // import dotenv from "dotenv";
// // import app from "./app";
// // import dbConnect from "./db";

// // dotenv.config();

// // dbConnect();

// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on http://localhost:${PORT}`);
// // });



// // import dotenv from "dotenv";
// // import app from "./app";
// // import dbConnect from "./db";

// // // ✅ Pehle dotenv config karo, tab kuch bhi import/use karo
// // dotenv.config({
// //   path: ".env", // ← tumhari file ".env" hai, "./env" nahi (yahi bug tha)
// // });

// // const PORT = process.env.PORT || 5000;

// // // ✅ DB connect karo, phir server start karo (async properly handle kiya)
// // dbConnect()
// //   .then(() => {
// //     app.listen(PORT, () => {
// //       console.log(`🚀 Server running on http://localhost:${PORT}`);
// //     });
// //   })
// //   .catch((error) => {
// //     console.error("❌ DB connection failed:", error.message);
// //     process.exit(1);
// //   });


// import dotenv from "dotenv";
// dotenv.config(); // ✅ SABSE PEHLE — koi bhi import se pehle

// import app from "./app";
// import dbConnect from "./db";

// const PORT = process.env.PORT || 5000;

// dbConnect()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Startup failed:", err.message);
//     process.exit(1);
//   });


// server.ts
import dotenv from "dotenv";
dotenv.config();

// Ab dynamic import use karo taaki dotenv pehle chale
async function main() {
  const { default: app } = await import("./app");
  const { default: dbConnect } = await import("./db");

  const PORT = process.env.PORT || 5000;

  await dbConnect();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("❌ Startup failed:", err.message);
  process.exit(1);
});
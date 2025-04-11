import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import userRoute from "./routes/userRoute.js";
import mailRouter from "./routes/mailRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import cors from "cors";
import paymentModel from "./models/paymentModel.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use("/user/", userRoute);
app.use("/mail/", mailRouter);
app.use("/order/", orderRouter);
app.use("/admin/", adminRouter);
app.use("/product/", productRouter);
app.use("/payment/", paymentRouter);

app.get("/", (req, res) => {
  res.send("Server is Running.... " + process.env.CLIENT_ORIGIN);
});

// Migration function
async function runMigration() {
  try {
    await paymentModel.updateMany(
      {},
      { $set: { owner: "Unknown", establishedYear: 2000 } }
    );
    console.log("✅ Migration 1 complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

const port = process.env.PORT || 8000;
app.listen(port, async () => {
  console.log(`Server is Running in http://localhost:${port}`);
  try {
    const conn = await mongoose.connect(process.env.MONGODBCONNECTIONSTRING);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await runMigration();
  } catch (error) {
    console.log(`Error: ${error.message}`);
    // process.exit();
  }
});

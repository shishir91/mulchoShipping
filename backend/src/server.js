import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import mailRouter from "./routes/mailRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import cors from "cors";
import serverless from "serverless-http";

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

// ✅ MongoDB Lazy Connection (Avoid Memory Leaks)
const mongoURI = process.env.MONGO_URI;
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) return cachedDb; // Use existing connection
  const db = await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedDb = db;
  console.log("MongoDB Connected!");
  return db;
};

// ✅ AWS Lambda Handler (Serverless)
const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // Keep DB connection open
  await connectDB(); // Ensure DB is connected before handling requests
  return serverless(app)(event, context);
};

export { handler };


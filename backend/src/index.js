import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import mailRouter from "./routes/mailRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import session from "express-session";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a strong secret
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production when using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
    },
  })
);

app.use("/user/", userRoute);
app.use("/mail/", mailRouter);
app.use("/order/", orderRouter);
app.use("/admin/", adminRouter);
app.use("/product/", productRouter);

app.get("/", (req, res) => {
  res.send("Server is Running...." + process.env.CLIENT_ORIGIN);
});

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log(`Server is Running in http://localhost:${port}`);
  try {
    const conn = await mongoose.connect(process.env.MONGODBCONNECTIONSTRING);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    // process.exit();
  }
});

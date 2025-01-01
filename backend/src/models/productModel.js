import mongoose from "mongoose";
import { type } from "os";

const productModel = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    commission: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "out-of-stock"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productModel);

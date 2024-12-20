import mongoose from "mongoose";

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
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
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

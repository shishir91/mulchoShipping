import mongoose from "mongoose";

const orderModel = mongoose.Schema(
  {
    productName: { type: String, required: true },
    qty: { type: String, required: true },
    price: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerLocation: { type: String, required: true },
    status: { type: String, required: true, default: "confirmed" },
    orderFrom: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderModel);

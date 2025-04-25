import mongoose from "mongoose";

const orderModel = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    commission: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerLocation: { type: String, required: true },
    status: { type: String, required: true, default: "confirmed" },
    deliveredDate: { type: Date },
    paymentStatus: {
      type: String,
      enum: ["pending", "done"],
    },
    orderFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderModel);

import mongoose from "mongoose";

const paymentModel = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    amount: { type: Number },
    status: {
      type: String,
      enum: ["request", "done"],
      default: "request",
    },
    proof: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentModel);

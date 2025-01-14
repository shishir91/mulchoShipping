import mongoose from "mongoose";

const transactionModel = mongoose.Schema(
  {
    to: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    source: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        unique: true,
      },
    ],
    status: { type: String, default: "pending" },
    proof: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionModel);

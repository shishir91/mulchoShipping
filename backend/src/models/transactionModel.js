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
      },
    ],
    status: { type: String, default: "pending" },
    proof: { type: String },
  },
  {
    timeStamp: true,
  }
);

export default mongoose.model("Transaction", transactionModel);

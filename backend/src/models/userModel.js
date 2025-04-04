import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    payment: { type: String },
    dob: { type: Date },
    gender: { type: String },
    fb: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    referedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: { type: String, required: true, default: "active" },
    pendingPayment: { type: Number, default: "0" },
    receivedPayment: { type: Number, default: "0" },
    lifetimeIncome: { type: Number, default: "0" },
    isEmailVerified: { type: Boolean, required: true, default: false },
    isUserVerified: { type: Boolean, required: true, default: false },
    otp: { type: String },
    myProducts: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Product model
        ref: "Product",
      },
    ],
    totalSales: { type: Number, default: 0 },
    tier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
      default: "Bronze",
    },
    commissionRate: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Function to determine user tier and commission rate
const getTierAndCommission = (totalSales) => {
  if (totalSales >= 100000) return { tier: "Diamond", commissionRate: 5 };
  if (totalSales >= 50000) return { tier: "Platinum", commissionRate: 3 };
  if (totalSales >= 25000) return { tier: "Gold", commissionRate: 2 };
  if (totalSales >= 10000) return { tier: "Silver", commissionRate: 1 };
  return { tier: "Bronze", commissionRate: 0 };
};

// Middleware to update tier and commission before saving
userModel.pre("save", function (next) {
  const { tier, commissionRate } = getTierAndCommission(this.totalSales);
  this.tier = tier;
  this.commissionRate = commissionRate;
  next();
});

export default mongoose.model("User", userModel);

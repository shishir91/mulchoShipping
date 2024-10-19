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
    role: { type: String, require: true, default: "user" },
    referedby: { type: String },
    status: { type: String, required: true, default: "active" },
    pendingPayment: { type: Number, default: "0" },
    receivedPayment: { type: Number, default: "0" },
    lifetimeIncome: { type: Number, default: "0" },
    isEmailVerified: { type: Boolean, required: true, default: false },
    isUserVerified: { type: Boolean, required: true, default: false },
    otp: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userModel);

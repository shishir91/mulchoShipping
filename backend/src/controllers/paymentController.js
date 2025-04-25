import orderModel from "../models/orderModel.js";
import paymentModel from "../models/paymentModel.js";
import transactionModel from "../models/transactionModel.js";

export default class PaymentController {
  // async requestPayment(req, res) {
  //   try {
  //     const { selectedIds } = req.body;
  //     const userId = req.user._id;

  //     if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
  //       return res.status(400).json({ message: "No orders selected." });
  //     }

  //     const pendingIncomes = await transactionModel
  //       .find({
  //         to: userId,
  //         status: "pending",
  //         createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  //       })
  //       .populate("source");

  //     const validIncomes = pendingIncomes.filter((income) =>
  //       selectedIds.includes(income._id.toString())
  //     );

  //     if (validIncomes.length === 0) {
  //       return res.status(400).json({ message: "No valid incomes selected." });
  //     }

  //     // Optional: Check for duplicate payment requests
  //     const existing = await paymentModel.find({
  //       orders: { $in: validIncomes.map((i) => i._id) },
  //       status: "request",
  //     });

  //     if (existing.length > 0) {
  //       return res
  //         .status(400)
  //         .json({ message: "Some orders already requested." });
  //     }

  //     const totalCommission = validIncomes.reduce((sum, income) => {
  //       return sum + income.source.commission; // Add commission from each income's source
  //     }, 0);

  //     const paymentRequest = await paymentModel.create({
  //       user: userId,
  //       orders: validIncomes.map((income) => income._id),
  //       amount: parseFloat(totalCommission).toFixed(2), // Set the total commission as the amount
  //     });

  //     res.status(200).json(paymentRequest);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // }
  async requestPayment(req, res) {
    try {
      const { selectedIds } = req.body;
      const userId = req.user._id;

      if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
        return res.status(400).json({ message: "No orders selected." });
      }

      const pendingIncomes = await orderModel.find({
        orderFrom: userId,
        status: { $in: ["delivered", "exchanged"] },
        deliveredDate: {
          $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      });

      const validIncomes = pendingIncomes.filter((income) =>
        selectedIds.includes(income._id.toString())
      );

      if (validIncomes.length === 0) {
        return res.status(400).json({ message: "No valid order selected." });
      }

      //  Check for duplicate payment requests
      const existing = await paymentModel.find({
        orders: { $in: validIncomes.map((i) => i._id) },
      });

      if (existing.length > 0) {
        return res.status(400).json({
          message: "Some orders payment is already done or requested.",
        });
      }

      const totalCommission = validIncomes.reduce((sum, income) => {
        return sum + income.commission; // Add commission from each income's source
      }, 0);

      const paymentRequest = await paymentModel.create({
        user: userId,
        orders: validIncomes.map((income) => income._id),
        amount: parseFloat(totalCommission).toFixed(2), // Set the total commission as the amount
      });

      // Update each order's paymentStatus to "pending"
      await Promise.all(
        validIncomes.map((income) =>
          orderModel.findByIdAndUpdate(income._id, { paymentStatus: "pending" })
        )
      );

      res.status(200).json(paymentRequest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getPaymentList(req, res) {
    try {
      const userId = req.user._id;
      const payments = await paymentModel.find({ user: userId });

      if (!payments) {
        return res.status(404).json({ message: "No payments found." });
      }

      res.status(200).json(payments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

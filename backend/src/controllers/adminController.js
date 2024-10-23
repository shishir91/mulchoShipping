import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import MailController from "./mailController.js";
import transactionModel from "../models/transactionModel.js";

const mailController = new MailController();

export default class AdminController {
  async fetchSingleOrder(req, res) {
    try {
      // Find all users where role is 'user'
      const { orderId } = req.params;

      const order = await orderModel
        .findById(orderId)
        .populate("orderFrom", "name");

      // Respond with the list of orders
      res.status(200).json({ success: true, order });
    } catch (error) {
      res.status(400).json({ message: "Error fetching order", error });
    }
  }

  async fetchSingleUser(req, res) {
    try {
      // Find all users where role is 'user'
      const { userId } = req.params;

      const user = await userModel.findById(userId).select("-password -otp");

      // Respond with the list of users
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(400).json({ message: "Error fetching user", error });
    }
  }

  async fetchUsers(req, res) {
    try {
      // Find all users where role is 'user'
      const users = await userModel.find({ role: "user" });

      // Respond with the list of users
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(400).json({ message: "Error fetching users", error });
    }
  }

  async fetchOrders(req, res) {
    try {
      const orders = await orderModel.find().populate("orderFrom", "name");

      res.status(200).json({ success: true, orders });
    } catch (error) {
      res.status(400).json({ message: "Error fetching orders", error });
    }
  }

  async changeOrderStatus(req, res) {
    try {
      const { orderId, status } = req.body;

      let updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
        status,
      });
      console.log(updatedOrder);
      updatedOrder = await orderModel
        .findById(orderId)
        .populate("orderFrom", "-password -otp");
      console.log(updatedOrder);
      console.log(updatedOrder.orderFrom[0].email);
      const response = await mailController.notifyUserAboutOrders(
        updatedOrder.orderFrom[0].email,
        `Your order for ${updatedOrder.productName} is ${updatedOrder.status}`
      );
      console.log(response);

      let transaction;
      if (updatedOrder.status === "delivered") {
        transaction = await transactionModel.create({
          to: updatedOrder.orderFrom,
          source: updatedOrder,
        });
      }

      if (response) {
        if (transaction) {
          return res.json({
            success: true,
            message: `Order status changed to ${status}`,
            message2: "And email also sent",
            message3: "Transaction Created",
            updatedOrder,
            transaction,
          });
        }
        return res.json({
          success: true,
          message: `Order status changed to ${status}`,
          message2: "And email also sent",
          updatedOrder,
        });
      } else {
        return res.json({
          success: false,
          message: `Order status changed to ${status}`,
          message2: "But failed to send email",
          updatedOrder,
        });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error changing order's status", error });
    }
  }

  async changeUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { userStatus } = req.query;
      const { reason } = req.body;
      console.log(userStatus);

      switch (userStatus) {
        case "verify":
          const verifyUser = await userModel.findByIdAndUpdate(
            userId,
            { isUserVerified: true, status: "active" },
            { new: true }
          );

          if (verifyUser) {
            // Notify the user via email
            const response = await mailController.notifyUserStatus(
              verifyUser.email,
              "Your account has been successfully verified! You can now access all of our services without any restrictions."
            );
            console.log(response);

            if (response) {
              return res.json({
                success: true,
                message: "User Verified. And email also sent",
                verifyUser,
              });
            } else {
              return res.json({
                success: false,
                message: "User Verified. But failed to send email",
              });
            }
          } else {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }
          break;

        case "unVerify":
          const unVerifyUser = await userModel.findByIdAndUpdate(
            userId,
            { isUserVerified: false, status: "active" },
            { new: true }
          );

          if (unVerifyUser) {
            // Notify the user via email
            const response = await mailController.notifyUserStatus(
              unVerifyUser.email,
              `Your account is not verified. ${reason}`
            );
            console.log(response);

            if (response) {
              return res.json({
                success: true,
                message: "User Not Verified. And email also sent",
                unVerifyUser,
              });
            } else {
              return res.json({
                success: false,
                message: "User Not Verified. But failed to send email",
              });
            }
          } else {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }
          break;

        case "block":
          const blockUser = await userModel.findByIdAndUpdate(
            userId,
            { status: "blocked" },
            { new: true }
          );

          if (blockUser) {
            // Notify the user via email
            const response = await mailController.notifyUserStatus(
              blockUser.email,
              `Your account has been blocked. ${reason}`
            );
            console.log(response);

            if (response) {
              return res.json({
                success: true,
                message: "User Blocked. And email also sent",
                blockUser,
              });
            } else {
              return res.json({
                success: false,
                message: "User Blocked. But failed to send email",
              });
            }
          } else {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }
          break;

        case "unBlock":
          const user = await userModel.findById(userId);
          const unBlockUser = await userModel.findByIdAndUpdate(
            userId,
            {
              status:
                user.isEmailVerified && !user.isUserVerified
                  ? "underReview"
                  : "active",
            },
            { new: true }
          );

          if (unBlockUser) {
            // Notify the user via email
            const response = await mailController.notifyUserStatus(
              unBlockUser.email,
              "Your account has been UnBlocked! You can now access all of our services without any restrictions."
            );
            console.log(response);

            if (response) {
              return res.json({
                success: true,
                message: "User Unblocked. And email also sent",
                unBlockUser,
              });
            } else {
              return res.json({
                success: false,
                message: "User Unblocked. But failed to send email",
              });
            }
          } else {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

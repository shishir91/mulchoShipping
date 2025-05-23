import path from "path";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export default class OrderController {
  async getOrderDetail(req, res) {
    try {
      const { orderId } = req.params;
      const order = await orderModel
        .findById(orderId)
        .populate("orderFrom", "name commissionRate")
        .populate("product");
      if (order) {
        res.json({ success: true, order });
      } else {
        res.json({ success: false, message: "Order Not Found" });
      }
    } catch (error) {
      res.status(401).send(error);
    }
  }

  async addOrder(req, res) {
    if (req.body.product == "") {
      return res.json({ success: false, message: "Product not selected" });
    }

    if (!req.user.isUserVerified) {
      return res.json({
        success: false,
        message: "Your account is not verified yet.",
      });
    } else if (req.user.status === "blocked") {
      return res.json({
        success: false,
        message: "Your account is Blocked.",
      });
    }
    try {
      const product = await productModel.findById(req.body.product);
      let pPrice = Number(product.price);
      let oPrice = Number(req.body.price);
      if (oPrice < pPrice - Number(product.commission)) {
        return res.json({
          success: false,
          message:
            "You cannot set order price less than (Product Price - Commission)",
        });
      }
      // let x = oPrice - pPrice;

      // let commission = Number(product.commission) + x;

      let newOrder = await orderModel.create({
        ...req.body,
        orderFrom: req.user,
        // commission,
      });
      newOrder = await orderModel.populate(newOrder, {
        path: "orderFrom product",
        select: "-password -otp",
      });
      res.json({ success: true, newOrder, message: "New Order Added" });
    } catch (error) {
      console.log(error);

      res.json({ success: false, error });
    }
  }

  async getMyOrders(req, res) {
    // if (!req.user.isUserVerified) {
    //   return res.json({
    //     success: false,
    //     message: "Your account is not verified yet.",
    //   });
    // }
    try {
      let myOrders = await orderModel
        .find({ orderFrom: req.user })
        .populate("product", "productName");
      console.log(myOrders);
      if (myOrders.length < 1) {
        res.json({
          success: false,
          message: "You don't have any orders yet!!",
        });
      } else {
        res.json({ success: true, myOrders });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async cancelOrder(req, res) {
    try {
      console.log(req.params);

      const { orderId } = req.params;

      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { status: "cancelled" },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).send({ message: "Order not found" });
      }

      res.status(200).json({
        success: true,
        message: "Order Cancelled",
        updatedOrder,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async editOrder(req, res) {
    try {
      console.log(req.params);
      console.log(req.body);

      const { orderId } = req.params;

      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        req.body,
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).send({ message: "Order not found" });
      }

      res.status(200).json({
        success: true,
        message: "Order Updated Successfully",
        updatedOrder,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

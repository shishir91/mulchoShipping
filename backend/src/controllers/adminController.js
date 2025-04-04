import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import MailController from "./mailController.js";
import transactionModel from "../models/transactionModel.js";
import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

const mailController = new MailController();

export default class AdminController {
  //USERS APISSSS
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

  // ORDERS APISSS
  async fetchOrders(req, res) {
    try {
      const orders = await orderModel
        .find()
        .populate("orderFrom", "name")
        .populate("product", "productName");

      res.status(200).json({ success: true, orders });
    } catch (error) {
      res.status(400).json({ message: "Error fetching orders", error });
    }
  }

  async fetchSingleOrder(req, res) {
    try {
      // Find all users where role is 'user'
      const { orderId } = req.params;

      const order = await orderModel
        .findById(orderId)
        .populate("orderFrom", "name")
        .populate("product", "productName");

      // Respond with the list of orders
      res.status(200).json({ success: true, order });
    } catch (error) {
      res.status(400).json({ message: "Error fetching order", error });
    }
  }

  async changeOrderStatus(req, res) {
    try {
      const { orderId, status, amount } = req.body;

      let updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
        status,
      });
      updatedOrder = await orderModel
        .findById(orderId)
        .populate("orderFrom", "-password -otp");
      const response = await mailController.notifyUserAboutOrders(
        updatedOrder.orderFrom.email,
        `Your order for ${updatedOrder.productName} is ${updatedOrder.status}`
      );

      let transaction;
      if (updatedOrder.status === "returned") {
        const user = await userModel.findById(updatedOrder.orderFrom);
        if (user) {
          user.totalSales -= updatedOrder.price;
          await user.save();
        }
        // Delete the associated transaction if it exists
        await transactionModel.findOneAndDelete({
          to: updatedOrder.orderFrom,
          source: updatedOrder._id,
        });
      }
      if (
        updatedOrder.status === "delivered" ||
        updatedOrder.status === "exchanged"
      ) {
        const user = await userModel.findById(updatedOrder.orderFrom);
        if (user) {
          user.totalSales += updatedOrder.price;
          await user.save();
        }
        // Check if transaction already exists before creating a new one
        const existingTransaction = await transactionModel.findOne({
          to: updatedOrder.orderFrom,
          source: updatedOrder._id,
        });

        if (!existingTransaction) {
          transaction = await transactionModel.create({
            to: updatedOrder.orderFrom,
            source: updatedOrder._id,
            amount,
          });
        }
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

  //PAYMENT APISSS
  async getAllPayments(req, res) {
    try {
      const payments = await transactionModel.find().populate([
        { path: "to" },
        {
          path: "source",
          populate: { path: "product" },
        },
      ]);

      console.log(payments);

      return res.json({ success: true, payments });
    } catch (error) {
      console.log(error);

      return res.status(400).send(error);
    }
  }
  async paymentDone(req, res) {
    try {
      const { transactionID } = req.params;
      const transaction = await transactionModel.findByIdAndUpdate(
        transactionID,
        {}
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  // PRODUCTSSSSS APISSS
  async addProduct(req, res) {
    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded Files:", req.files);

      // Configure Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      // Upload all images to Cloudinary
      const imageUploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "products", // Optional: specify a folder in Cloudinary
        })
      );

      const uploadResults = await Promise.all(imageUploadPromises);

      // Extract URLs from Cloudinary upload results
      const imageUrls = uploadResults.map((result) => result.secure_url);

      // Save product data to the database
      const newProduct = await productModel.create({
        ...req.body,
        images: imageUrls, // Store image URLs
      });

      return res.json({
        success: true,
        message: "New Product Added",
        product: newProduct,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to add product",
        error: error.message,
      });
    }
  }

  async editProduct(req, res) {
    try {
      const { id } = req.query;

      // Find the product to edit
      const existingProduct = await productModel.findById(id);

      if (!existingProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Configure Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      // Handle new image uploads
      let imageUrls = existingProduct.images; // Start with existing images
      if (req.files && req.files.length > 0) {
        // Upload new images to Cloudinary
        const imageUploadPromises = req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "products", // Optional folder name
          })
        );

        const uploadResults = await Promise.all(imageUploadPromises);

        // Extract URLs from Cloudinary responses
        const newImageUrls = uploadResults.map((result) => result.secure_url);

        // Optionally delete old images (if needed)
        const imageDeletionPromises = existingProduct.images.map((imageUrl) => {
          const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
          return cloudinary.uploader.destroy(`products/${publicId}`);
        });

        await Promise.all(imageDeletionPromises);

        // Update image URLs with new ones
        imageUrls = newImageUrls;
      }

      // Update product in the database
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        { ...req.body, images: imageUrls }, // Include updated images
        { new: true } // Return the updated document
      );

      res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
        updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.query;

      // Find the product to get image URLs
      const product = await productModel.findById(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Configure Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      // Delete images from Cloudinary
      if (product.images && product.images.length > 0) {
        const imageDeletionPromises = product.images.map((imageUrl) => {
          const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0]; // Extract public ID
          return cloudinary.uploader.destroy(`products/${publicId}`); // Adjust folder name if needed
        });

        await Promise.all(imageDeletionPromises);
      }

      // Delete the product from the database
      await productModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async changeProductStatus(req, res) {
    try {
      const { id } = req.query;
      const { status } = req.body;

      // Validate the status
      if (!["available", "out-of-stock"].includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Status must be 'available' or 'out-of-stock'.",
        });
      }

      // Find and update the product status
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        { status },
        { new: true } // Return the updated document
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product status updated successfully.",
        updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update product status.",
        error: error.message,
      });
    }
  }
}

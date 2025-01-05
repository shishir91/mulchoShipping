import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

export default class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productModel.find();
      return res.json({ success: true, products });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error });
    }
  }

  async getProduct(req, res) {
    try {
      const { id } = req.query;
      const product = await productModel.findById(id);
      if (product) {
        return res.json({ success: true, product });
      } else {
        return res.json({ success: false, message: "Product Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  }

  async getMyProduct(req, res) {
    try {
      const user = await userModel.findById(req.user).populate("myProducts");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, myProducts: user.myProducts });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  }

  async addMyProduct(req, res) {
    const { id } = req.body;
    try {
      const product = await productModel.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const user = await userModel
        .findByIdAndUpdate(
          req.user,
          { $addToSet: { myProducts: productId } },
          { new: true }
        )
        .populate("myProducts");
      res
        .status(200)
        .json({ success: true, message: "Product added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  }

  async removeMyProduct(req, res) {
    const { id } = req.body;

    try {
      const user = await userModel.findByIdAndUpdate(
        req.user,
        { $pull: { myProducts: id } },
        { new: true }
      );

      res
        .status(200)
        .json({ success: true, message: "Product removed successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  }
}

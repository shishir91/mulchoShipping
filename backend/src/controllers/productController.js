import productModel from "../models/productModel.js";

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
      return res.status(400).json({ success: false, error });
    }
  }
}

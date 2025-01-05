import { Router } from "express";
import ProductController from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const productController = new ProductController();

router.get("/product", authMiddleware, productController.getProduct);
router.get("/", authMiddleware, productController.getAllProducts);
router.get("/getMyProduct", authMiddleware, productController.getMyProduct);
router.put("/addMyProduct", authMiddleware, productController.addMyProduct);
router.put(
  "/removeMyProduct",
  authMiddleware,
  productController.removeMyProduct
);

export default router;

import { Router } from "express";
import ProductController from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const productController = new ProductController();

router.get("/product", authMiddleware, productController.getProduct);
router.get("/", authMiddleware, productController.getAllProducts);

export default router;

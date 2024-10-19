import { Router } from "express";
import OrderController from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const orderController = new OrderController();

router.post("/addOrder", authMiddleware, orderController.addOrder);
router.get("/getMyOrders", authMiddleware, orderController.getMyOrders);
router.get("/getOrderDetail/:orderId", authMiddleware, orderController.getOrderDetail);
router.put("/cancelOrder/:orderId", authMiddleware, orderController.cancelOrder);
router.put("/editOrder/:orderId", authMiddleware, orderController.editOrder);

export default router;

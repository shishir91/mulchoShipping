import { Router } from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import AdminController from "../controllers/adminController.js";

const router = Router();

const adminController = new AdminController();

router.get("/user/:userId", adminMiddleware, adminController.fetchSingleUser);
router.get("/order/:orderId", adminMiddleware, adminController.fetchSingleOrder);
router.get("/users", adminMiddleware, adminController.fetchUsers);
router.get("/orders", adminMiddleware, adminController.fetchOrders);
router.put(
  "/userStatus/:userId",
  adminMiddleware,
  adminController.changeUserStatus
);
router.put(
  "/changeOrderStatus",
  adminMiddleware,
  adminController.changeOrderStatus
);

export default router;

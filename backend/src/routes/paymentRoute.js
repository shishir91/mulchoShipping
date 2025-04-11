import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import PaymentController from "../controllers/paymentController.js";

const router = Router();

const paymentController = new PaymentController();

router.post(
  "/requestPayment",
  authMiddleware,
  paymentController.requestPayment
);
router.get("/getPaymentList", authMiddleware, paymentController.getPaymentList);

export default router;

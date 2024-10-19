import { Router } from "express";
import MailController from "../controllers/mailController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const mailRouter = Router();
const mailController = new MailController();

mailRouter.post(
  "/sendCode",
  authMiddleware,
  mailController.sendVerificationCode
);
mailRouter.post("/verifyCode", authMiddleware, mailController.verifyCode);

export default mailRouter;

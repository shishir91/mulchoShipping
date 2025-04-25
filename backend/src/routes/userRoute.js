import { Router } from "express";
import multer from "multer";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const userController = new UserController();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", authMiddleware, userController.getMyData);
router.put(
  "/kyc",
  authMiddleware,
  upload.single("payment"),
  userController.kyc
);

router.get("/getIncome", authMiddleware, userController.getIncome);

export default router;

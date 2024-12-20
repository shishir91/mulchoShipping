import { Router } from "express";
import multer from "multer";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

const userController = new UserController();

let imageName;
const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "public/uploads/");
  // },
  filename: function (req, file, cb) {
    imageName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname.trim();
    cb(null, imageName);
  },
});

const upload = multer({ storage: storage });

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", authMiddleware, userController.getMyData);
router.put("/kyc", authMiddleware, upload.single("payment"), (req, res) =>
  userController.kyc(req, res, imageName)
);

router.get("/getIncome", authMiddleware, userController.getIncome);

export default router;
